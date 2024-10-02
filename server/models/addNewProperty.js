import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableRooms: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    images: [
      {
        publicId: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }, {
    timestamps: true, // Adds createdAt and updatedAt fields
  });
  
  const Property = mongoose.model('Property', propertySchema);
  
  export default Property;
  
