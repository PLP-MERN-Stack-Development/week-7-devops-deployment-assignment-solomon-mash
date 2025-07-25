const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');

const {
  createBug,
  getBugs,
  updateBug,
  deleteBug
} = require('../controllers/bugController');

// CRUD routes
router.post('/', createBug);
router.get('/',auth, getBugs);
router.put('/:id', updateBug);
router.delete('/:id',auth,adminOnly,deleteBug,);

module.exports = router;
