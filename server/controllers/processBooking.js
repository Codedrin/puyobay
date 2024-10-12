import Property from "../models/addNewProperty.js";
import User from "../models/userModel.js";
import BookedProperty from "../models/bookedProperty.js";


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
    paymentDetails // Payment details, including receipt data, will come from req.body
  } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the property by ID
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Initialize receipt object for GCash payments
    let receipt = {
      publicId: '',
      url: ''
    };

    // If payment method is GCash, retrieve receipt information from paymentDetails
    if (paymentMethod === 'GCash') {
      if (paymentDetails.receipt) {
        receipt.publicId = paymentDetails.receipt.publicId;
        receipt.url = paymentDetails.receipt.url;
      } else {
        // Handle the case when the receipt data is missing
        return res.status(400).json({ message: 'Receipt is required for GCash payments' });
      }
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
        referenceNumber: paymentMethod === 'GCash' ? paymentDetails.referenceNumber : null,
        mobileNumberUsed: paymentMethod === 'GCash' ? paymentDetails.mobileNumberUsed : null,
        senderName: paymentMethod === 'GCash' ? paymentDetails.senderName : null,
        receipt: paymentMethod === 'GCash' ? receipt : {}
      }
    };

    // Check if the property already has bookings
    let bookedProperty = await BookedProperty.findOne({ property: propertyId });

    if (!bookedProperty) {
      // If no bookings for the property, create a new BookedProperty entry
      bookedProperty = new BookedProperty({
        property: propertyId,
        bookings: [newBooking]
      });
    } else {
      // If the property already has bookings, add the new booking
      bookedProperty.bookings.push(newBooking);
    }

    // Save the booked property
    await bookedProperty.save();

    res.status(201).json({ message: 'Booking processed successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

//Cancel or Remove Booking
export const deleteBooking = async (req, res) => {
  const { userId, bookingId } = req.params;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the booking within the booked property
    const bookedProperty = await BookedProperty.findOne({ "bookings._id": bookingId });

    if (!bookedProperty) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Filter out the booking that matches the bookingId
    bookedProperty.bookings = bookedProperty.bookings.filter(
      booking => booking._id.toString() !== bookingId
    );

    // If the bookings array is now empty, you might want to delete the whole property booking
    if (bookedProperty.bookings.length === 0) {
      await BookedProperty.findByIdAndDelete(bookedProperty._id); // Optionally delete the whole entry if no bookings left
    } else {
      await bookedProperty.save(); // Save the updated property if bookings remain
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Controller to get all bookings by user ID
export const getBookingsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all properties that have bookings made by the user
    const bookedProperties = await BookedProperty.find({ "bookings.user": userId }).populate({
      path: 'property',
      select: 'propertyName price' 
    });

    if (!bookedProperties || bookedProperties.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    // Collect all the bookings made by the user with populated property details
    const userBookings = bookedProperties.flatMap(property =>
      property.bookings.filter(booking => booking.user.toString() === userId).map(booking => ({
        ...booking.toObject(),
        propertyName: property.property.propertyName, // Adding property name
        price: property.property.price // Adding property price
      }))
    );

    res.status(200).json({ bookings: userBookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
