import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  persons: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['GCash', 'CreditCard', 'PayPal'],
  },
  paymentDetails: {
    referenceNumber: {
      type: String,
      required: function() {
        return this.paymentMethod === 'GCash'; 
      },
    },
    mobileNumberUsed: {
      type: String,
      required: function() {
        return this.paymentMethod === 'GCash';
      },
    },
    senderName: {
      type: String,
      required: function() {
        return this.paymentMethod === 'GCash';
      },
    },
    receipt: {
      publicId: {
        type: String,
        required: function() {
          return this.paymentMethod === 'GCash';
        },
      },
      url: {
        type: String,
        required: function() {
          return this.paymentMethod === 'GCash'; 
        },
      }
    }
  },
}, {
  timestamps: true, 
});

// Define the schema for a property with multiple bookings
const bookedPropertySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property',
    required: true,
  },
  bookings: [bookingSchema], 
}, {
  timestamps: true,
});

const BookedProperty = mongoose.model('BookedProperty', bookedPropertySchema);

export default BookedProperty;
