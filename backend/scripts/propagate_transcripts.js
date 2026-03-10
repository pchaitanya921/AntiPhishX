const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../src/models/Course');
const path = require('path');

dotenv.config({ path: 'c:/Users/USER/Desktop/AntiPhishX/backend/.env' });

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'te', name: 'Telugu' },
    { code: 'bn', name: 'Bengali' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ur', name: 'Urdu' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'or', name: 'Odia' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'as', name: 'Assamese' },
    { code: 'mai', name: 'Maithili' },
    { code: 'sat', name: 'Santali' },
    { code: 'ks', name: 'Kashmiri' },
    { code: 'ne', name: 'Nepali' },
    { code: 'sd', name: 'Sindhi' },
    { code: 'kok', name: 'Konkani' },
    { code: 'doi', name: 'Dogri' },
    { code: 'mni', name: 'Manipuri' },
    { code: 'brx', name: 'Bodo' },
    { code: 'sa', name: 'Sanskrit' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' }
];

const propagateTranscripts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses`);

        for (const course of courses) {
            let updated = false;

            if (course.modules) {
                for (const module of course.modules) {
                    if (module.videos) {
                        for (const video of module.videos) {
                            if (!video.transcripts) {
                                video.transcripts = [];
                            }

                            // Find English transcript
                            const englishTranscript = video.transcripts.find(t => t.language === 'en');

                            if (englishTranscript && englishTranscript.content) {
                                const sourceContent = englishTranscript.content;
                                console.log(`Processing video: ${video.title} - English content found (${sourceContent.length} chars)`);

                                // Create or update transcripts for all other languages
                                languages.forEach(lang => {
                                    if (lang.code === 'en') return;

                                    const existingTranscriptIndex = video.transcripts.findIndex(t => t.language === lang.code);

                                    if (existingTranscriptIndex > -1) {
                                        // Update existing if content is empty or different? 
                                        // For now, let's update if empty OR just overwrite to ensure "all languages" are filled
                                        if (!video.transcripts[existingTranscriptIndex].content) {
                                            video.transcripts[existingTranscriptIndex].content = sourceContent;
                                            updated = true;
                                        }
                                    } else {
                                        // Create new transcript entry
                                        video.transcripts.push({
                                            language: lang.code,
                                            content: sourceContent,
                                            segments: []
                                        });
                                        updated = true;
                                    }
                                });
                            }
                        }
                    }
                }
            }

            if (updated) {
                await course.save({ validateBeforeSave: false });
                console.log(`Updated transcripts for course: ${course.title}`);
            } else {
                console.log(`No changes needed for course: ${course.title}`);
            }
        }

        console.log('Transcript propagation complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
        process.exit(1);
    }
};

propagateTranscripts();
