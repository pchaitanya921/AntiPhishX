const Note = require('../models/Note');

// @desc    Get notes for a specific video in a course
// @route   GET /api/notes/:courseId
// @access  Private
exports.getNotes = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { videoTitle } = req.query;

        if (!videoTitle) {
            return res.status(400).json({
                success: false,
                message: 'Video title is required to fetch notes'
            });
        }

        const notes = await Note.find({
            user: req.user.id,
            course: courseId,
            videoTitle: videoTitle
        }).sort({ timestamp: 1 });

        res.status(200).json({
            success: true,
            results: notes.length,
            data: {
                notes
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching notes'
        });
    }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
exports.createNote = async (req, res, next) => {
    try {
        const { courseId, videoTitle, timestamp, content } = req.body;

        if (!courseId || !videoTitle || timestamp === undefined || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (courseId, videoTitle, timestamp, content)'
            });
        }

        const newNote = await Note.create({
            user: req.user.id,
            course: courseId,
            videoTitle,
            timestamp,
            content
        });

        res.status(201).json({
            success: true,
            data: {
                note: newNote
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error while creating note'
        });
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'No note found with that ID'
            });
        }

        // Check if the note belongs to the user
        if (note.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this note'
            });
        }

        await Note.findByIdAndDelete(req.params.id);

        res.status(204).json({
            success: true,
            data: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting note'
        });
    }
};
