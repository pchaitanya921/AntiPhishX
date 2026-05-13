const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['phishing', 'vishing', 'smishing', 'qr_code', 'social_engineering', 'advanced_threats', 'malware_detection', 'executive_intelligence', 'tactical_defense', 'cognitive_security', 'advanced_ai_adaptive']
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    thumbnail: {
        type: String,
        default: 'no-photo.jpg'
    },
    duration: {
        type: String,
        default: '1 hour'
    },
    price: {
        type: Number,
        default: 0
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    published: {
        type: Boolean,
        default: false
    },
    modules: [{
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced']
        },
        title: String,
        description: String,
        labs: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Lab'
        }],
        videos: [{
            title: String,
            source: String,
            url: String,
            duration: Number,
            summary: String,
            transcripts: [{
                language: String,
                summary: String,
                content: String,
                segments: [{
                    start: Number,
                    end: Number,
                    text: String
                }]
            }],
            materials: [{
                title: String,
                url: String,
                type: {
                    type: String,
                    enum: ['link', 'pdf', 'document', 'other'],
                    default: 'link'
                }
            }]
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);
