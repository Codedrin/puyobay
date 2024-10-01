import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
    enum: ['tenant', 'landlord'],
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
      publicId: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      }
    },
    additionalInfo: {
      type: String,
      required: function() { return this.accountType === 'landlord'; }
    },
  },
  profilePicture: {
    publicId: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    }
  },
  address: {
    type: String,
    required: false,
  },
  accessToken: {
    type: String,
    required: false,
  },
  approved: {
    type: Boolean,
    default: function() {
      return this.accountType === 'tenant'; // Automatically approved for tenants, not for landlords
    }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
