import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ['tenant', 'landlord', 'admin'],
    required: true,
  },
  landlordDetails: {
    businessPermit: {
      type: String,
      required: function() { return this.accountType === 'landlord'; }
    },
    businessName: {
      type: String,
      required: function() { return this.accountType === 'landlord'; }
    },
    attachment: {
      type: String, // Assuming a URL or file path
      required: function() { return this.accountType === 'landlord'; }
    },
    additionalInfo: {
      type: String,
      required: function() { return this.accountType === 'landlord'; }
    },
  }
}, { timestamps: true });

// Export the user model
const User = mongoose.model('User', userSchema);
export default User;
