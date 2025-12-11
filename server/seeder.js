import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Class from './models/Class.js';
import Plan from './models/Plan.js';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

const seedClasses = [
  {
    title: 'Morning HIIT',
    trainer: 'Aditya Roy',
    startTime: new Date(new Date().setHours(new Date().getHours() + 24)), // Tomorrow
    durationInMinutes: 45,
    capacity: 20,
    attendees: []
  },
  {
    title: 'Power Yoga',
    trainer: 'Priya Sharma',
    startTime: new Date(new Date().setHours(new Date().getHours() + 26)),
    durationInMinutes: 60,
    capacity: 15,
    attendees: []
  },
  {
    title: 'CrossFit Mayhem',
    trainer: 'Vikram Singh',
    startTime: new Date(new Date().setHours(new Date().getHours() + 48)), // Day after tomorrow
    durationInMinutes: 60,
    capacity: 12,
    attendees: []
  },
  {
    title: 'Spin Class',
    trainer: 'Rohan Mehta',
    startTime: new Date(new Date().setHours(new Date().getHours() + 50)),
    durationInMinutes: 45,
    capacity: 25,
    attendees: []
  },
  {
    title: 'Late Night Lift',
    trainer: 'Arjun Kapoor',
    startTime: new Date(new Date().setHours(new Date().getHours() + 72)),
    durationInMinutes: 90,
    capacity: 10,
    attendees: []
  }
];

const seedPlans = [
  {
    name: 'Silver',
    price: 1500,
    durationInMonths: 1,
    features: ['Gym Access', 'Locker Room'],
    description: 'Basic access for starters.'
  },
  {
    name: 'Gold',
    price: 3000,
    durationInMonths: 1,
    features: ['Gym Access', 'Locker Room', 'Sauna', 'Group Classes'],
    description: 'Most popular choice.'
  },
  {
    name: 'Platinum',
    price: 5000,
    durationInMonths: 1,
    features: ['All Access', 'Personal Trainer', 'Nutrition Plan', 'VIP Lounge'],
    description: 'The ultimate fitness experience.'
  }
];

const seedDB = async () => {
  try {
    // Clear existing classes and plans
    await Class.deleteMany({});
    await Plan.deleteMany({});

    console.log('Cleared existing data...');

    await Class.insertMany(seedClasses);
    console.log('Classes seeded!');

    await Plan.insertMany(seedPlans);
    console.log('Plans seeded!');

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
