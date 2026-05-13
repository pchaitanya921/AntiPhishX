const { Queue, Worker, QueueEvents } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => {
        if (times > 3) {
            console.error('[QueueService] Redis connection failed multiple times. Queues will be disabled.');
            return null; // Stop retrying
        }
        return Math.min(times * 50, 2000);
    }
});

connection.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
        console.warn('[QueueService] Redis not available at localhost:6379. Queues will be disabled for this session.');
        connection.disconnect(); // Prevent further noise
    } else {
        console.error('[QueueService] Redis Error:', err.message);
    }
});

class QueueService {
    constructor() {
        this.queues = {};
        this.workers = {};
        
        // Define Queue Names
        this.QUEUE_NAMES = {
            CAMPAIGN_GEN: 'campaign-generation-queue',
            EMAIL_DELIVERY: 'email-delivery-queue',
            SIEM_DISPATCH: 'siem-dispatch-queue',
            RISK_UPDATE: 'risk-score-update-queue'
        };

        this.initializeQueues();
    }

    initializeQueues() {
        try {
            Object.values(this.QUEUE_NAMES).forEach(name => {
                if (connection.status === 'end' || connection.status === 'close') {
                    console.warn(`[QueueService] Skipping initialization of ${name} (Redis down)`);
                    return;
                }
                this.queues[name] = new Queue(name, { 
                    connection,
                    defaultJobOptions: {
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 1000,
                        },
                        removeOnComplete: true,
                        removeOnFail: 1000,
                    }
                });
                console.log(`[QueueService] Queue initialized: ${name}`);
            });
        } catch (err) {
            console.error('[QueueService] Failed to initialize queues:', err.message);
        }
    }

    /**
     * Add a job to a specific queue
     */
    async addJob(queueName, data, options = {}) {
        if (!this.queues[queueName]) {
            throw new Error(`Queue ${queueName} not found`);
        }
        return await this.queues[queueName].add(queueName, data, options);
    }

    /**
     * Initialize Workers (This would typically be in separate worker processes in production)
     */
    registerWorker(queueName, processor) {
        if (connection.status === 'end' || connection.status === 'close') {
            console.warn(`[QueueService] Skipping worker registration for ${queueName} (Redis down)`);
            return null;
        }
        this.workers[queueName] = new Worker(queueName, processor, { connection });
        
        this.workers[queueName].on('completed', (job) => {
            console.log(`[Worker] Job ${job.id} in ${queueName} completed`);
        });

        this.workers[queueName].on('failed', (job, err) => {
            console.error(`[Worker] Job ${job.id} in ${queueName} failed: ${err.message}`);
        });

        return this.workers[queueName];
    }
}

module.exports = new QueueService();
