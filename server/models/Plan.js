import mongoose from 'mongoose'

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  durationInMonths: {
    type: Number,
    required: true,
  },
  features: [{
    type: String,
  }],
  description: {
    type: String,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Plan', planSchema);
