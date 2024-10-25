import Property from "../models/addNewProperty.js";


// Get all properties or search properties based on filters
export const getAllProperties = async (req, res) => {
  const { searchQuery, minPrice, maxPrice, rooms, rating, selectArea, userId } = req.query;

  try {
    // Build the query object dynamically
    let query = {};

    // Search for properties by property name (partial match)
    if (searchQuery) {
      query.propertyName = { $regex: searchQuery, $options: "i" }; // Case-insensitive search
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
      if (maxPrice) query.price.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
    }

    // Filter by available rooms (greater than or equal to provided number of rooms)
    if (rooms) {
      query.availableRooms = { $gte: parseInt(rooms, 10) };
    }

    // Filter by rating (greater than or equal to the provided rating)
    if (rating) {
      query.averageRating = { $gte: parseFloat(rating) };
    }

    // Filter by selected area
    if (selectArea) {
      query.selectArea = selectArea; // Filtering by selected area
    }

    // Filter by userId
    if (userId) {
      query.userId = userId; // Match the exact userId
    }

    // Find properties based on query object
    const properties = await Property.find(query);

    // Send the filtered properties to the client
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Error fetching properties", error });
  }
};



export const getPropertyCount = async (req, res) => {
  const { searchQuery, minPrice, maxPrice, rooms, rating, municipality, userId } = req.query;

  try {
    // Build the query object dynamically
    let query = {};

    // Search for properties by property name (partial match)
    if (searchQuery) {
      query.propertyName = { $regex: searchQuery, $options: "i" }; // Case-insensitive search
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
      if (maxPrice) query.price.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
    }

    // Filter by available rooms
    if (rooms) {
      query.availableRooms = parseInt(rooms, 10);
    }

    // Filter by rating (greater than or equal to the provided rating)
    if (rating) {
      query.averageRating = { $gte: parseFloat(rating) };
    }

    // Filter by municipality
    if (municipality) {
      query.municipality = municipality; // Exact match (can adjust to case-insensitive if needed)
    }

    // Filter by userId
    if (userId) {
      query.userId = userId; // Match the exact userId
    }

    // Find properties based on query object
    const properties = await Property.find(query);

    // Get the total number of properties
    const totalProperties = await Property.countDocuments(query);

    // Return filtered properties and total count
    res.status(200).json({ properties, totalProperties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Error fetching properties", error });
  }
};
