const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = 'mongodb://localhost:27017/antiphishx';

const UserBadgeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: true },
    unlockedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({ role: String });
const BadgeSchema = new mongoose.Schema({ name: String });

const UserBadge = mongoose.model('UserBadge', UserBadgeSchema);
const User = mongoose.model('User', UserSchema);
const Badge = mongoose.model('Badge', BadgeSchema);

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const learners = await User.find({ role: 'learner' }).limit(3);
        const badges = await Badge.find();

        if (learners.length === 0 || badges.length === 0) {
            console.log('No learners or badges found. Seed aborted.');
            process.exit(0);
        }

        const userBadges = [];
        
        // Give each learner 1-2 badges
        for (const learner of learners) {
            const badgeCount = Math.floor(Math.random() * 2) + 1;
            const shuffled = [...badges].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, badgeCount);
            
            for (const b of selected) {
                userBadges.push({
                    user: learner._id,
                    badge: b._id,
                    unlockedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
                });
            }
        }

        // Clear existing just in case (optional, but here we add)
        // await UserBadge.deleteMany({});
        
        // Filter out duplicates if already exists
        const actualToInsert = [];
        for(const ub of userBadges) {
            const exists = await UserBadge.findOne({ user: ub.user, badge: ub.badge });
            if(!exists) {
                actualToInsert.push(ub);
            }
        }

        if (actualToInsert.length > 0) {
            await UserBadge.insertMany(actualToInsert);
            console.log(`Successfully seeded ${actualToInsert.length} user badges.`);
        } else {
            console.log('No new badges to seed.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
