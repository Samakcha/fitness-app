import Class from '../models/Class.js'

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find({}).sort({ startTime: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private/Admin|Trainer
export const createClass = async (req, res) => {
  const { title, trainer, startTime, durationInMinutes, capacity } = req.body;

  try {
    const newClass = await Class.create({
      title,
      trainer, // In a real app, this might be req.user.id if trainer creates it
      startTime,
      durationInMinutes,
      capacity,
    });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Book a class
// @route   POST /api/classes/:id/book
// @access  Private
export const bookClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (classItem.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already booked' });
    }

    if (classItem.attendees.length >= classItem.capacity) {
      return res.status(400).json({ message: 'Class is full' });
    }

    classItem.attendees.push(req.user.id);
    await classItem.save();

    res.json({ message: 'Class booked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/classes/:id/book
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Remove user from attendees
    classItem.attendees = classItem.attendees.filter(
      (userId) => userId.toString() !== req.user.id
    );

    await classItem.save();

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get my booked classes
// @route   GET /api/classes/myclasses
// @access  Private
export const getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ attendees: req.user.id });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
