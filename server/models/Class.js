import mongoose from 'mongoose'

const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  trainer: {
    type: String, // Or reference to User (trainer)
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  durationInMinutes: {
    type: Number,
    required: true,
    default: 60,
  },
  capacity: {
    type: Number,
    required: true,
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

export default mongoose.model('Class', classSchema);
