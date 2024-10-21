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

        // Calculate Admin Share (10% deduction) and Net Income for the landlord
        const totalIncome = property.price;  // Assuming the property price is the booking price
        const adminShare = totalIncome * 0.1;
        const netIncome = totalIncome - adminShare;

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
      },
      status: false,
      adminShare,  // Store the admin's share of the income
      netIncome
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

//Cancel or Remove Booking// Cancel a booking and save it to the cancellation history
export const cancelBooking = async (req, res) => {
  const { userId, bookingId } = req.params;
  const { cancellationReason } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the property that has the booking
    const bookedProperty = await BookedProperty.findOne({ "bookings._id": bookingId });

    if (!bookedProperty) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Find the specific booking within the booked property
    const booking = bookedProperty.bookings.id(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Save cancellation details in the booking's cancellations array
    booking.cancellations.push({
      canceledAt: new Date(),
      cancellationReason: cancellationReason,
    });
      // Mark the booking as canceled and reset income fields
      booking.status = false;  // Mark as canceled
      booking.adminShare = 0;  // Reset admin share
      booking.netIncome = 0;   // Reset net income
  

    // Optionally: Change booking status (e.g., mark it as canceled)
    booking.status = false; // Mark as canceled

    // Save the updated booked property
    await bookedProperty.save();

    res.status(200).json({ message: 'Booking canceled and saved to history', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error });
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
        propertyName: property.property.propertyName, 
        adminShare: booking.adminShare,  // Include the admin share
        netIncome: booking.netIncome,    // Include the net income
        price: property.property.price,
        paymentStatus: booking.status ? 'Paid' : 'Not Paid'
      }))
    );

    res.status(200).json({ bookings: userBookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Controller to get landlord income by month
export const getLandlordIncomeByMonth = async (req, res) => {
  const { month } = req.query; // Extract month from query params

  try {
    // Find all landlords
    const landlords = await User.find({ accountType: 'landlord' });

    if (!landlords || landlords.length === 0) {
      return res.status(404).json({ message: 'No landlords found' });
    }

    // Initialize an array to store income data for each landlord
    const landlordIncomeData = [];

    // Loop through each landlord and calculate their income for the selected month
    for (let landlord of landlords) {
      // Find all bookings for this landlord's properties during the selected month
      const bookedProperties = await BookedProperty.find({
        'bookings.checkInDate': { $regex: month },
        'property.userId': landlord._id // Assuming the property is linked to the landlord via userId
      }).populate('property', 'price');

      // Calculate total income for the landlord
      let totalIncome = 0;

      bookedProperties.forEach((bookedProperty) => {
        bookedProperty.bookings.forEach((booking) => {
          if (booking.status === true) { // Only count bookings that are paid
            totalIncome += booking.netIncome; // Sum up the net income
          }
        });
      });

      // Store the calculated income data
      landlordIncomeData.push({
        landlordId: landlord._id,
        landlordName: `${landlord.firstName} ${landlord.lastName}`,
        totalIncome: totalIncome.toFixed(2) // Total income for this landlord
      });
    }

    // Return the collected income data
    res.status(200).json(landlordIncomeData);
  } catch (error) {
    console.error('Error fetching landlord income:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

