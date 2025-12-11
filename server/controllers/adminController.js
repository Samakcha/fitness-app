import User from '../models/User.js'
import Plan from '../models/Plan.js'

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new plan
// @route   POST /api/admin/plans
// @access  Private/Admin
export const createPlan = async (req, res) => {
  const { name, price, durationInMonths, features, description } = req.body;

  try {
    const plan = await Plan.create({
      name,
      price,
      durationInMonths,
      features,
      description,
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all plans
// @route   GET /api/plans (Public usually, but can be managed by admin)
// @access  Public
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a plan
// @route   DELETE /api/admin/plans/:id
// @access  Private/Admin
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (plan) {
      await plan.deleteOne();
      res.json({ message: 'Plan removed' });
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
