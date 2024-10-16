import User from '../models/userModel.js';
import Property from '../models/addNewProperty.js';
import BookedProperty from '../models/bookedProperty.js';
import sendEmail from '../utils/sendEmail.js';


// Controller to get bookings for landlord's properties// Controller to get bookings for landlord's properties
export const getBookingsByLandlord = async (req, res) => {
  const { landlordId } = req.params; // We get the landlordId from the URL params

  try {
    // Ensure that the landlord exists
    const landlord = await User.findById(landlordId);
    if (!landlord || landlord.accountType !== 'landlord') {
      return res.status(404).json({ message: 'Landlord not found' });
    }

    // Find all properties that belong to the landlord
    const properties = await Property.find({ userId: landlordId });
    if (properties.length === 0) {
      return res.status(404).json({ message: 'No properties found for this landlord' });
    }

    // Get all bookings for the landlord's properties
    const propertyIds = properties.map((property) => property._id);
    const bookedProperties = await BookedProperty.find({
      property: { $in: propertyIds },
    })
      .populate('property', 'propertyName') 
      .populate('bookings.user', 'firstName lastName email'); 

    if (!bookedProperties || bookedProperties.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this landlord\'s properties' });
    }

    // Prepare the bookings data, using checkInDate as the booking date
    const bookings = bookedProperties.flatMap((bookedProperty) =>
      bookedProperty.bookings
        .filter(booking => booking.user) // Filter out any bookings without a user
        .map((booking) => ({
          bookingId: booking._id,
          propertyName: bookedProperty.property.propertyName,
          tenantName: `${booking.user.firstName} ${booking.user.lastName}`,
          bookingDate: booking.checkInDate, 
          status: booking.status,
          userId: booking.user._id,
          tenantEmail: booking.user.email,
          paymentMethod: booking.paymentMethod,
          paymentDetails: booking.paymentDetails,
        }))
    );

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(`Server error while fetching bookings for landlordId: ${landlordId}`, error);
    res.status(500).json({ message: 'Server error', error });
  }
};


  

//Update the booking status
  export const updateBookingStatus = async (req, res) => {
    const { bookingId } = req.params; // Get the booking ID from params
    const { status, tenantEmail, tenantName } = req.body; // Status, tenant email, and name from request body
  
    try {
      // Find the booking by ID
      const booking = await BookedProperty.findOne({ 'bookings._id': bookingId });
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Update the booking status as a boolean
      const bookingIndex = booking.bookings.findIndex((b) => b._id.toString() === bookingId);
      if (bookingIndex > -1) {
        const isConfirmed = status === 'Confirmed';
        booking.bookings[bookingIndex].status = isConfirmed;
        await booking.save();
  
        // Prepare the email message
        let message = isConfirmed
          ? `Dear ${tenantName},\n\nYour booking has been confirmed. We look forward to welcoming you.\n\nBest regards,`
          : `Dear ${tenantName},\n\nWe regret to inform you that your booking has been rejected. Please contact the administrator for further details.\n\nBest regards,`;
  
        // Include payment details if the booking is confirmed
        if (isConfirmed) {
          const paymentMethod = booking.bookings[bookingIndex].paymentMethod;
          const paymentDetails = booking.bookings[bookingIndex].paymentDetails;
  
          message += `\n\nPayment Information:\nPayment Method: ${paymentMethod}\n`;
  
          // Add specific payment details based on the payment method
          if (paymentMethod === 'GCash') {
            message += `Reference Number: ${paymentDetails.referenceNumber}\n`;
            message += `Mobile Number Used: ${paymentDetails.mobileNumberUsed}\n`;
            message += `Sender Name: ${paymentDetails.senderName}\n`;
          }
  
          // Include booking status (Paid/Not Paid)
          const isPaid = booking.bookings[bookingIndex].status ? 'Paid' : 'Not Paid';
          message += `\nBooking Status: ${isPaid}\n`;
        }
  
        // Call the sendEmail function
        await sendEmail({
          email: tenantEmail,
          subject: isConfirmed ? 'Booking Confirmed' : 'Booking Rejected',
          message, // Pass the message prepared above
        });
  
        res.status(200).json({ message: 'Booking status updated and email sent to tenant' });
      } else {
        res.status(404).json({ message: 'Booking not found' });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

// getLandlordDashboardData
export const getLandlordDashboardData = async (req, res) => {
  const { landlordId } = req.params; 

  try {
      const landlord = await User.findById(landlordId);
      if (!landlord || landlord.accountType !== 'landlord') {
          return res.status(404).json({ message: 'Landlord not found' });
      }

      const properties = await Property.find({ userId: landlordId });
      if (properties.length === 0) {
          return res.status(404).json({ message: 'No properties found for this landlord' });
      }

      const propertyIds = properties.map((property) => property._id);
      const bookedProperties = await BookedProperty.find({
          property: { $in: propertyIds },
      })
      .populate('property', 'propertyName') 
      .populate('bookings.user', 'firstName lastName email address phoneNumber'); 

      if (!bookedProperties || bookedProperties.length === 0) {
          return res.status(404).json({ message: 'No bookings found for this landlord\'s properties' });
      }

      // Preparing tenants data
      const tenants = bookedProperties.flatMap((bookedProperty) =>
          bookedProperty.bookings.map((booking) => ({
              userId: booking.user._id, 
              name: `${booking.user.firstName} ${booking.user.lastName}`,
              address: booking.user.address,
              phoneNumber: booking.user.phoneNumber,
              email: booking.user.email,
              bookingDate: booking.checkInDate,
              status: booking.status ? 'Paid' : 'Pending',
          }))
      );

      // Aggregate check-ins and check-outs info
      const checkInOut = {
          checkIns: tenants.filter(t => new Date(t.bookingDate) <= new Date()).length, 
          checkOuts: tenants.filter(t => new Date(t.bookingDate) > new Date()).length, 
      };

      // Aggregate payment information
      const payments = {
          paid: tenants.filter(t => t.status === 'Paid').length,
          pending: tenants.filter(t => t.status === 'Pending').length,
      };

      res.status(200).json({
          tenants,
          checkInOut,
          payments,
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};



