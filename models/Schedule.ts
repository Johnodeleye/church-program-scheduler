import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
  date: Date;
  dayType: string;
  leadMinister: string;
  praiseWorship: string;
  closingPrayer: string;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    date: {
      type: Date,
      required: true,
    },
    dayType: {
      type: String,
      enum: ['Monday', 'Friday'],
      required: true,
    },
    leadMinister: {
      type: String,
      default: '',
    },
    praiseWorship: {
      type: String,
      default: '',
    },
    closingPrayer: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure date is unique to prevent duplicates
ScheduleSchema.index({ date: 1 }, { unique: true });

export default mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', ScheduleSchema);