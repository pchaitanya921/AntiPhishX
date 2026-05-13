const express = require('express');
const {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/scim.controller');

const router = express.Router();

const { protectScim } = require('../middleware/scim.middleware');

// All SCIM routes are protected by SCIM Bearer Token
router.use(protectScim);

router.route('/Users')
    .get(getUsers)
    .post(createUser);

router.route('/Users/:id')
    .get(getUser)
    .put(updateUser)
    .patch(updateUser) // Simplified PATCH to use PUT logic for MVP
    .delete(deleteUser);

module.exports = router;
