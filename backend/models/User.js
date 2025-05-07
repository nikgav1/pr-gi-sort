import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  sortedTrash: {
    'papp- ja paberpakend': { type: Number, default: 0 },
    'plast- ja metallpakend': { type: Number, default: 0 },
    klaaspakend: { type: Number, default: 0 },
    biojäätmed: { type: Number, default: 0 },
    olmejäätmed: { type: Number, default: 0 },
  },
});

const User = mongoose.model('User', userSchema);

export default User;
