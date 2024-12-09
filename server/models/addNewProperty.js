import mongoose from 'mongoose';

// const propertySchema = new mongoose.Schema(
//   {
//     propertyName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     area: {
//       type: Number,
//       required: true,
//     },
//     selectArea: {
//       type: String,
//       required: false,
//       enum: ['San Isidro', 'Del Carmen'], // Only San Isidro and Del Carmen are allowed
//     },
//     roomArea: {
//       type: String,
//       required: false,
//     },
//     type: {
//       type: String,
//       required: false,
//       enum: ['House', 'Apartment'], // Only 'House' and 'Apartment' allowed
//     },
//     latitude: {
//       type: String,
//       required: true,
//     },
//     longitude: {
//       type: String,
//       required: true,
//     },
//     images: [
//       {
//         publicId: {
//           type: String,
//           required: true,
//         },
//         url: {
//           type: String,
//           required: true,
//         },
//       },
//     ],
//     gcashQrCode: [
//       {
//         publicId: {
//           type: String,
//           required: true,
//         },
//         url: {
//           type: String,
//           required: true,
//         },
//       },
//     ],
//     rooms: [
//       {
//         roomName: {
//           type: String,
//           required: true,
//         },
//         availablePersons: {
//           type: Number,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//         description: {
//           type: String,
//           required: true,
//         },
//         image: {
//           url: {
//             type: String,
//             required: true,
//           },
//           publicId: {
//             type: String,
//             required: true,
//           },
//         },
//       },
//     ],
//     ratings: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'User',
//           required: true,
//         },
//         rating: {
//           type: Number,
//           required: true,
//           min: 1,
//           max: 5,
//         },
//       },
//     ],
//     averageRating: {
//       type: Number,
//       default: 0,
//     },
//     totalRatings: {
//       type: Number,
//       default: 0,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt fields
//   }
// );


const propertySchema = new mongoose.Schema(
  {
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
    area: {
      type: String, // Changed to String to match "San Isidro" or "Del Carmen"
      required: true,
      enum: ['San Isidro', 'Del Carmen'], // Only allow these values
    },
  
    roomArea: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
      enum: ['House', 'Apartment'],
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
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
    gcashQrCode: [
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
    rooms: [
      {
        roomName: {
          type: String,
          required: true,
        },
        availablePersons: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        roomArea: {
          type: String,
          required: false,
        },
        images: [
          {
            url: {
              type: String,
              required: true,
            },
            publicId: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
    
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);
const Property = mongoose.model('Property', propertySchema);

export default Property;