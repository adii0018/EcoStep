import mongoose from 'mongoose'

const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    category: {
      type: String,
      enum: {
        values: ['travel', 'food', 'energy', 'shopping'],
        message: 'Category must be one of: travel, food, energy, shopping',
      },
      required: [true, 'Category is required'],
    },
    type: {
      type: String,
      required: [true, 'Activity type is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity must be a positive number'],
    },
    co2: {
      type: Number,
      required: [true, 'CO₂ value is required'],
      min: [0, 'CO₂ must be a positive number'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
)

ActivitySchema.index({ userId: 1, date: -1 })
ActivitySchema.index({ userId: 1, category: 1 })
ActivitySchema.index({ userId: 1, date: -1, category: 1 })

export default mongoose.model('Activity', ActivitySchema)
