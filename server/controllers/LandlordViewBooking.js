import User from '../models/userModel.js';
import Property from '../models/addNewProperty.js';
import BookedProperty from '../models/bookedProperty.js';
import sendEmail from '../utils/sendEmail.js';
// Controller to get bookings for landlord's properties
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
        bookedProperty.bookings.map((booking) => ({
          bookingId: booking._id,
          propertyName: bookedProperty.property.propertyName,
          tenantName: `${booking.user.firstName} ${booking.user.lastName}`,
          bookingDate: booking.checkInDate, 
          status: booking.status,
          userId: booking.user._id,
          tenantEmail: booking.user.email,
        }))
      );
  
      res.status(200).json({ bookings });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  


// Controller to update booking status and notify tenant
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
        const message = isConfirmed
          ? `Dear ${tenantName},\n\nYour booking has been confirmed. We look forward to welcoming you.\n\nBest regards,`
          : `Dear ${tenantName},\n\nWe regret to inform you that your booking has been rejected. Please contact the administrator for further details.\n\nBest regards,`;
  
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
  
