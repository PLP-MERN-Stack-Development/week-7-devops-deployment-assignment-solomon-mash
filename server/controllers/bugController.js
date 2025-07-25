const Bug = require('../models/Bug');

// Create a new bug
const createBug = async (req, res, next) => {
  try {
    const { title, description, reportedBy} = req.body;
    const bug = new Bug({ title, description, reportedBy });
    await bug.save();
    res.status(201).json(bug);
  } catch (error) {
    next(error);
  }
};

// Get all bugs
const getBugs = async (req, res, next) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.status(200).json(bugs);
  } catch (error) {
    next(error);
  }
};

// Update a bug's status
const updateBug = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bug = await Bug.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!bug) return res.status(404).json({ error: 'Bug not found' });
    res.json(bug);
  } catch (error) {
    next(error);
  }
};

// Delete a bug
const deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) return res.status(404).json({ error: 'Bug not found' });
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBug,
  getBugs,
  updateBug,
  deleteBug
};
