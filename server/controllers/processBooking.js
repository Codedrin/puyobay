import BookedProperty from "../models/BookedProperty.js";
import Property from "../models/addNewProperty.js";
import User from "../models/userModel.js";

// Controller to process a booking
export const processBooking = async (req, res) => {
  const { 
    userId,
    propertyId,
    name,
    age,
    gender,
    phoneNumber,
    checkInDate,
    checkOutDate,
    persons,
    paymentMethod,
    referenceNumber,
    mobileNumberUsed,
    senderName
  } = req.body;

  let receiptFile = req.file;

  try {
    // Log the received data
    console.log("Request body:", req.body);
    console.log("Received file:", receiptFile);

    const user = await User.findById(userId);
    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`User found: ${user.name}`);

    const property = await Property.findById(propertyId);
    if (!property) {
      console.log(`Property with ID ${propertyId} not found`);
      return res.status(404).json({ message: 'Property not found' });
    }
    console.log(`Property found: ${property.propertyName}`);

    let receipt = {
      publicId: '',
      url: ''
    };

    // If payment method is GCash, process the receipt
    if (paymentMethod === 'GCash' && receiptFile) {
      receipt.publicId = receiptFile.public_id;
      receipt.url = receiptFile.path; // Cloudinary sets the URL in req.file.path
      console.log("Receipt file uploaded to Cloudinary:", receipt);
    } else {
      console.log("No receipt file to process");
    }

    // Create the booking object
    const newBooking = {
      user: userId,
      name,
      age,
      gender,
      phoneNumber,
      checkInDate,
      checkOutDate,
      persons,
      paymentMethod,
      paymentDetails: {
        referenceNumber: paymentMethod === 'GCash' ? referenceNumber : null,
        mobileNumberUsed: paymentMethod === 'GCash' ? mobileNumberUsed : null,
        senderName: paymentMethod === 'GCash' ? senderName : null,
        receipt: paymentMethod === 'GCash' ? receipt : {}
      }
    };

    console.log("New booking data:", newBooking);

    // Check if the property already has bookings
    let bookedProperty = await BookedProperty.findOne({ property: propertyId });

    if (!bookedProperty) {
      // If no bookings for the property, create a new BookedProperty entry
      bookedProperty = new BookedProperty({
        property: propertyId,
        bookings: [newBooking]
      });
      console.log("Created new BookedProperty for the property:", bookedProperty);
    } else {
      // If the property already has bookings, add the new booking
      bookedProperty.bookings.push(newBooking);
      console.log("Added new booking to existing BookedProperty:", bookedProperty);
    }

    // Save the booked property
    await bookedProperty.save();
    console.log("BookedProperty saved successfully.");

    res.status(201).json({ message: 'Booking processed successfully', booking: newBooking });
  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
