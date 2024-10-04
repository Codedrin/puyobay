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
    
    selectArea: {
      type: String,
      required: false,
      enum: ['San Isidro', 'Del Carmen'], // Only San Isidro and Del Carmen are allowed
    },
    
    
    roomArea: {
      type: Number,
      required: false,
    },
    
    // Enum to limit Type to either 'House' or 'Apartment'
    type: {
      type: String,
      required: false,
      enum: ['House', 'Apartment'], // Only 'House' and 'Apartment' allowed
    },

    price: {
      type: Number,
      required: false,
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
    
    rating: {
      type: Number,
      required: false,
      min: 1,
      max: 5, 
    },

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
