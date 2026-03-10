/**
 * AntiPhishX — Curriculum Engine: Full Lab Seeder
 * Run: node src/scripts/seed_labs/seed_all_labs.js
 *
 * Reads all_titles.txt, generates enterprise-grade lab content
 * using the template engine in labTemplates.js, and upserts into MongoDB.
 *
 * ─── Precise Seed Scripts (run individually for full content) ───────────────
 *  Email Phishing:
 *    node src/scripts/seed_labs/seed_email_precise.js          (Beginner 1-5)
 *    node src/scripts/seed_labs/seed_email_labs_1_6.js         (Beginner 1-6)
 *    node src/scripts/seed_labs/seed_email_labs_7_11.js        (Beginner 7-11)
 *    node src/scripts/seed_labs/seed_email_intermediate_1_6.js (Intermediate 1-6)
 *    node src/scripts/seed_labs/seed_email_intermediate_7_10.js(Intermediate 7-10)
 *
 *  Vishing (Voice Phishing):
 *    node src/scripts/seed_labs/seed_vishing_beginner.js       (Beginner 10 labs)
 *    node src/scripts/seed_labs/seed_vishing_intermediate.js   (Intermediate 10 labs)
 *    node src/scripts/seed_labs/seed_vishing_advanced.js       (Advanced 10 labs)
 *    node src/scripts/seed_labs/seed_vishing_expert.js         (Expert 10 labs)
 *
 *  Smishing (SMS Phishing):
 *    node src/scripts/seed_labs/seed_smishing_beginner.js      (Beginner 10 labs)
 *    node src/scripts/seed_labs/seed_smishing_intermediate.js  (Intermediate 10 labs)
 *    node src/scripts/seed_labs/seed_smishing_advanced.js      (Advanced 10 labs)
 *    node src/scripts/seed_labs/seed_smishing_expert.js        (Expert 10 labs)
 *
 *  QR Code Attacks (Quishing):
 *    node src/scripts/seed_labs/seed_qr_beginner.js            (Beginner 10 labs)
 *    node src/scripts/seed_labs/seed_qr_intermediate.js        (Intermediate 10 labs)
 *    node src/scripts/seed_labs/seed_qr_advanced.js            (Advanced 10 labs)
 *    node src/scripts/seed_labs/seed_qr_expert.js              (Expert 10 labs)
 *
 *  Social Engineering:
 *    node src/scripts/seed_labs/seed_social_engineering_beginner.js       (Beginner     10 labs)
 *    node src/scripts/seed_labs/seed_social_engineering_intermediate.js   (Intermediate 10 labs)
 *    node src/scripts/seed_labs/seed_social_engineering_advanced.js       (Advanced     10 labs)
 *    node src/scripts/seed_labs/seed_social_engineering_expert.js         (Expert       10 labs)
 * ────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });

const Lab = require('../../models/Lab');
const { buildLab } = require('./labTemplates');

// ─── Read raw titles ──────────────────────────────────────────────────────────
const titlesFile = path.join(__dirname, '../../../all_titles.txt');
const rawLines = fs.readFileSync(titlesFile, 'utf-8')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

// ─── Group by topic (to determine index-within-topic for level assignment) ───
function getTopicLabel(raw) {
    const dash = raw.indexOf(' - ');
    return dash === -1 ? null : raw.slice(0, dash).trim();
}

const grouped = {}; // { topicLabel: [line, line, ...] }
for (const line of rawLines) {
    const topic = getTopicLabel(line);
    if (!topic) continue;
    if (!grouped[topic]) grouped[topic] = [];
    grouped[topic].push(line);
}

// ─── Build all lab documents ──────────────────────────────────────────────────
const allLabs = [];
for (const [topic, lines] of Object.entries(grouped)) {
    lines.forEach((line, idx) => {
        try {
            allLabs.push(buildLab(line, idx));
        } catch (e) {
            console.warn(`⚠️  Skipped "${line}": ${e.message}`);
        }
    });
}

console.log(`🔬 Generated ${allLabs.length} lab documents.`);

// ─── Upsert into MongoDB ──────────────────────────────────────────────────────
async function seedAll() {
    const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/antiphishx';
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB');

    let inserted = 0;
    let updated = 0;
    let failed = 0;

    for (const lab of allLabs) {
        try {
            const result = await Lab.findOneAndUpdate(
                { title: lab.title },
                lab,
                { upsert: true, new: true, runValidators: false }
            );
            if (result.isNew === undefined) {
                // findOneAndUpdate doesn't set isNew; check via wasNew workaround
                updated++;
            } else {
                inserted++;
            }
        } catch (err) {
            console.error(`❌ Failed [${lab.title}]: ${err.message}`);
            failed++;
        }
    }

    // Simpler count: just track upserts
    const totalProcessed = allLabs.length - failed;
    console.log(`\n✅ Seed complete.`);
    console.log(`   📦 Upserted : ${totalProcessed}`);
    console.log(`   ❌ Failed   : ${failed}`);

    const totalInDB = await Lab.countDocuments();
    console.log(`   🗄️  Total labs in DB: ${totalInDB}`);

    process.exit(0);
}

seedAll().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
