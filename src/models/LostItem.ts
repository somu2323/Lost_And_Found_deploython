import mongoose, { Document, Schema } from 'mongoose';

export interface ILostItem extends Document {
  title: string;
  description: string;
  category: string;
  location: string;
  dateLost: Date;
  images: string[];
  status: 'lost' | 'found' | 'claimed';
  reportedBy: mongoose.Types.ObjectId;
  claimedBy?: mongoose.Types.ObjectId;
  contactInfo: string;
  createdAt: Date;
  updatedAt: Date;
}

const LostItemSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Books', 'Accessories', 'Documents', 'Sports', 'Other'],
  },
  location: {
    type: String,
    required: true,
  },
  dateLost: {
    type: Date,
    required: true,
  },
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['lost', 'found', 'claimed'],
    default: 'lost',
  },
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  claimedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  contactInfo: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.LostItem || mongoose.model<ILostItem>('LostItem', LostItemSchema);