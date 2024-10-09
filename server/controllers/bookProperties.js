
import Property from '../models/addNewProperty.js';

// Get property by ID
export const getBookPropertyById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Submit a rating for a property
export const submitRating = async (req, res) => {
    const { rating, userId } = req.body; // Extract userId from request body
  
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
  
    try {
      const property = await Property.findById(req.params.id);
  
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
  
      // Check if the user has already rated this property
      const existingRatingIndex = property.ratings.findIndex(r => r.userId.toString() === userId.toString());
  
      if (existingRatingIndex !== -1) {
        // Update the existing rating
        property.ratings[existingRatingIndex].rating = rating;
      } else {
        // Add a new rating
        property.ratings.push({ userId, rating });
      }
  
      // Recalculate the average rating and total ratings
      property.totalRatings = property.ratings.length;
      property.averageRating = property.ratings.reduce((acc, r) => acc + r.rating, 0) / property.totalRatings;
  
      await property.save();
  
      res.json({ message: 'Rating submitted successfully', property });
    } catch (error) {
      console.error('Error submitting rating:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Get average ratings for all properties
export const getAverageRatings = async (req, res) => {
    try {
      const properties = await Property.find(); // Fetch all properties
  
      // Calculate average rating for each property
      const propertiesWithRatings = properties.map((property) => {
        const totalRatings = property.ratings.length;
        const averageRating = totalRatings > 0
          ? property.ratings.reduce((acc, r) => acc + r.rating, 0) / totalRatings
          : 0;
        
        return {
          _id: property._id,
          propertyName: property.propertyName,
          description: property.description,
          address: property.address,
          images: property.images,
          availableRooms: property.availableRooms,
          area: property.area,  
          price: property.price,
          averageRating: averageRating, // Add average rating
        };
      });
  
      res.status(200).json(propertiesWithRatings);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };