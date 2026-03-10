const express = require('express');
const noteController = require('../controllers/note.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router
    .route('/:courseId')
    .get(noteController.getNotes);

router
    .route('/')
    .post(noteController.createNote);

router
    .route('/:id')
    .delete(noteController.deleteNote);

module.exports = router;
