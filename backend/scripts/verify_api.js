const http = require('http');

const request = (method, path, body = null, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode >= 400) {
                        reject(new Error(`Request failed (${res.statusCode}): ${parsed.message || JSON.stringify(parsed)}`));
                    } else {
                        resolve(parsed);
                    }
                } catch (e) {
                    console.error('Failed to parse JSON response:', data.substring(0, 100));
                    reject(e);
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const verifyApi = async () => {
    try {
        const email = `test.verifier.${Date.now()}@example.com`;
        const password = 'password123';

        console.log(`Registering user: ${email}...`);
        const authResponse = await request('POST', '/api/auth/register', {
            firstName: 'Verification',
            lastName: 'Bot',
            email: email,
            password: password,
            role: 'learner'
        });

        const token = authResponse.token;
        if (!token) {
            throw new Error('No token received from registration');
        }
        console.log('Registration successful. Token received.');

        console.log('Fetching labs from /api/labs...');
        const labsResponse = await request('GET', '/api/labs', null, token);

        const labs = Array.isArray(labsResponse) ? labsResponse : (labsResponse.data || labsResponse.labs || []);

        console.log(`\nTotal Labs Fetched: ${labs.length}`);

        if (labs.length === 0) {
            console.error('No labs returned!');
            return;
        }

        const labToVerify = labs[0];
        console.log(`\nVerifying Lab: ${labToVerify.title} (ID: ${labToVerify._id})`);

        if (labToVerify.scenario && labToVerify.steps) {
            console.log('Detailed fields found in list view.');
            console.log('Scenario:', labToVerify.scenario.substring(0, 100) + '...');
            console.log('Steps:', labToVerify.steps);
        } else {
            console.log('Detailed fields NOT in list view. Fetching individual lab...');
            const detailedLab = await request('GET', `/api/labs/${labToVerify._id}`, null, token);
            console.log('Scenario:', detailedLab.scenario);
            console.log('Steps:', detailedLab.steps);

            // Verify malware lab specifically
            const malwareLab = labs.find(l => l.topic === 'malware_detection' && l.level === 'expert');
            if (malwareLab) {
                console.log(`\nVerifying Malware Expert Lab: ${malwareLab.title}`);
                const detailedMalware = await request('GET', `/api/labs/${malwareLab._id}`, null, token);
                console.log('Scenario:', detailedMalware.scenario);
                console.log('Steps:', detailedMalware.steps);
            }
        }

    } catch (error) {
        console.error('API Verification Failed:', error.message);
    }
};

verifyApi();
