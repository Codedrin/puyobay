import Property from "../models/addNewProperty.js";
import User from "../models/userModel.js";
import BookedProperty from "../models/bookedProperty.js";
import sendEmail from "../utils/sendEmail.js";

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
    paymentDetails, // Payment details, including receipt data, will come from req.body
    selectedRoom,
  } = req.body;

  try {
    // Find the user and property by their IDs
    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    
    if (!user || !property) {
      return res.status(404).json({ message: 'User or Property not found' });
    }

    // Check if the selected room exists in the property
    const room = property.rooms.find((r) => r.roomName === selectedRoom);
    if (!room) {
      return res.status(400).json({ message: 'Selected room does not exist in the property' });
    }

     // Check for available persons
     if (room.availablePersons < persons) {
      return res.status(400).json({ 
        message: `Not enough space in the room. Available persons: ${room.availablePersons}` 
      });
    }


    // Payment-related logic
    let receipt = { publicId: '', url: '' };
    if (paymentMethod === 'GCash' && paymentDetails.receipt) {
      receipt.publicId = paymentDetails.receipt.publicId;
      receipt.url = paymentDetails.receipt.url;
    }

    // Admin share and net income calculations
    const totalIncome = room.price || property.price; 
    const adminShare = totalIncome * 0.03;
    const netIncome = totalIncome - adminShare;

    // Create the booking object, with status set to false initially
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
      selectedRoom,
      paymentDetails: {
        referenceNumber: paymentMethod === 'GCash' ? paymentDetails.referenceNumber : null,
        mobileNumberUsed: paymentMethod === 'GCash' ? paymentDetails.mobileNumberUsed : null,
        senderName: paymentMethod === 'GCash' ? paymentDetails.senderName :  null,
        receipt,
      },
      status: false,  // Booking is not approved initially
      adminShare,
      netIncome,
    };

    // Deduct persons from availablePersons in the room
    room.availablePersons -= persons;

        // Prevent negative values (edge case)
    if (room.availablePersons < 0) {
      room.availablePersons = 0;
    }
    
    await property.save();

    // Check if the property has existing bookings
    let bookedProperty = await BookedProperty.findOne({ property: propertyId });
    if (!bookedProperty) {
      bookedProperty = new BookedProperty({ property: propertyId, bookings: [newBooking] });
    } else {
      bookedProperty.bookings.push(newBooking);
    }

    await bookedProperty.save();

    res.status(201).json({ message: 'Booking processed successfully. Pending approval.', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
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

    // Check if the booking was marked as paid
    const wasPaid = booking.status === true;

    // Mark the booking as canceled and reset income fields
    booking.status = false;  // Mark as canceled
    booking.adminShare = 0;  // Reset admin share
    booking.netIncome = 0;   // Reset net income

    // Save the updated booked property
    await bookedProperty.save();

    if (wasPaid) {
      // Find the property to update available rooms
      const property = await Property.findById(bookedProperty.property);

      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      // Increase the available rooms when a paid booking is canceled
      property.availableRooms += 1;

      // Save the updated property
      await property.save();
    }

    // Prepare email to admin with cancellation details
    const adminEmail = process.env.ADMIN_EMAIL; // Email defined in environment variables
    const tenantName = `${user.firstName} ${user.lastName}`;
    const paymentDetails = booking.paymentDetails || {};

    let emailMessage = `Booking Cancellation Notification:\n\n`;
    emailMessage += `Tenant Name: ${tenantName}\n`;
    emailMessage += `Cancellation Reason: ${cancellationReason}\n`;
    emailMessage += `Payment Method: ${booking.paymentMethod}\n`;

    if (booking.paymentMethod === 'GCash') {
      emailMessage += `Reference Number: ${paymentDetails.referenceNumber}\n`;
      emailMessage += `Mobile Number Used: ${paymentDetails.mobileNumberUsed}\n`;
      emailMessage += `Sender Name: ${paymentDetails.senderName}\n`;
    }

    // Send email to the admin
    await sendEmail({
      email: adminEmail, // Send email to the admin
      subject: `Booking Cancellation - ${tenantName}`,
      message: emailMessage,
    });

    res.status(200).json({ message: 'Booking canceled and notification sent to admin', booking });
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
    const { month } = req.query; // Extract month from query params (e.g., '2024-10')
  
    try {
      // Parse the month into a Date range
      const startOfMonth = new Date(`${month}-01`); // Start of the selected month
      const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0); // End of the month
  
      console.log('Date range:', startOfMonth, 'to', endOfMonth); // Log for debugging
  
      // Find all landlords
      const landlords = await User.find({ accountType: 'landlord' });
      console.log(`Found ${landlords.length} landlords`);
  
      if (!landlords || landlords.length === 0) {
        console.log('No landlords found');
        return res.status(404).json({ message: 'No landlords found' });
      }
  
      // Initialize an array to store income data for each landlord
      const landlordIncomeData = [];
  
      // Loop through each landlord and calculate their income for the selected month
      for (let landlord of landlords) {
        console.log(`Processing landlord: ${landlord.firstName} ${landlord.lastName}`);
  
        // Find all properties belonging to this landlord
        const properties = await Property.find({ userId: landlord._id });
        console.log(`Found ${properties.length} properties for landlord ${landlord.firstName} ${landlord.lastName}`);
  
        if (properties.length === 0) {
          landlordIncomeData.push({
            landlordId: landlord._id,
            landlordName: `${landlord.firstName} ${landlord.lastName}`,
            totalIncome: "0.00",
            deduction: "0.00",
            netIncome: "0.00"
          });
          console.log(`No properties found for landlord ${landlord.firstName} ${landlord.lastName}, income data added with 0.00`);
          continue; // Move to the next landlord
        }
  
        // Fetch all booked properties for the landlord's properties during the selected month with paid bookings only
        const bookedProperties = await BookedProperty.find({
          property: { $in: properties.map(p => p._id) },
          'bookings.checkInDate': { $gte: startOfMonth, $lte: endOfMonth },
          'bookings.status': true  // Only retrieve bookings where status is true (paid)
        }).populate({
          path: 'property',
          select: 'propertyName price' // Populate propertyName and price fields
        });
  
        console.log(`Found ${bookedProperties.length} booked properties for landlord ${landlord.firstName} ${landlord.lastName}`);
  
        if (!bookedProperties || bookedProperties.length === 0) {
          landlordIncomeData.push({
            landlordId: landlord._id,
            landlordName: `${landlord.firstName} ${landlord.lastName}`,
            totalIncome: "0.00",
            deduction: "0.00",
            netIncome: "0.00"
          });
          console.log(`No paid bookings found for landlord ${landlord.firstName} ${landlord.lastName}, income data added with 0.00`);
          continue; // Move to the next landlord
        }
  
        // Collect all successful bookings for this month
        const landlordBookings = bookedProperties.flatMap(property =>
          property.bookings
            .filter(booking => booking.checkInDate >= startOfMonth && booking.checkInDate <= endOfMonth && booking.status === true)
            .map(booking => ({
              adminShare: booking.adminShare,
              netIncome: booking.netIncome,
              totalIncome: booking.adminShare + booking.netIncome
            }))
        );
  
        console.log(`Found ${landlordBookings.length} successful bookings for landlord ${landlord.firstName} ${landlord.lastName}`);
  
        // Initialize income calculation variables
        let totalIncome = 0;
        let deduction = 0;
        let netIncome = 0;
  
        // Calculate total income, deduction, and net income for the landlord
        landlordBookings.forEach(booking => {
          totalIncome += booking.totalIncome; // Total income = Admin share + Net income
          deduction += booking.adminShare; // Deduction (Admin share)
          netIncome += booking.netIncome; // Net income after deduction
        });
  
        console.log(`Total income for landlord ${landlord.firstName} ${landlord.lastName}: ${totalIncome.toFixed(2)}`);
        console.log(`Deduction (Admin share) for landlord ${landlord.firstName} ${landlord.lastName}: ${deduction.toFixed(2)}`);
        console.log(`Net income for landlord ${landlord.firstName} ${landlord.lastName}: ${netIncome.toFixed(2)}`);
  
        // Store the calculated income data for each landlord
        landlordIncomeData.push({
          landlordId: landlord._id,
          landlordName: `${landlord.firstName} ${landlord.lastName}`,
          totalIncome: totalIncome.toFixed(2),
          deduction: deduction.toFixed(2),
          netIncome: netIncome.toFixed(2)
        });
      }
  
      // Return the income data to the frontend
      console.log('Landlord income data:', landlordIncomeData);
      res.status(200).json(landlordIncomeData);
    } catch (error) {
      console.error('Error fetching landlord income:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  //Admin History

export const getAllBookings = async (req, res) => {
  try {
    // Fetch all properties with bookings, populate user (tenant) and property details
    const allBookings = await BookedProperty.find()
      .populate('property', 'propertyName') // Populate property details
      .populate('bookings.user', 'firstName lastName email') // Populate tenant details
      .lean(); // Convert to plain JS object for better handling

    // Flatten bookings and prepare the final response
    const bookings = allBookings.flatMap((bookedProperty) =>
      bookedProperty.bookings.map((booking) => ({
        propertyName: bookedProperty.property?.propertyName || 'N/A',
        tenantName: booking.user
          ? `${booking.user.firstName} ${booking.user.lastName}`
          : 'N/A',
        tenantEmail: booking.user?.email || 'N/A',
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        phoneNumber: booking.phoneNumber,
        paymentMethod: booking.paymentMethod,
        status: booking.status ? 'Confirmed' : 'Pending',
        cancellations: booking.cancellations, // Include cancellations if any
        createdAt: booking.createdAt,
      }))
    );

    // Return response
    res.status(200).json({
      success: true,
      totalBookings: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error. Could not fetch all bookings.',
      error: error.message,
    });
  }
};

  