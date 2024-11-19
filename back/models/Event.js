import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
