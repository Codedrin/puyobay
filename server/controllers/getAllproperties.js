import Property from "../models/addNewProperty.js";

// Get all properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find(); // Fetch all properties
    res.status(200).json(properties); // Send properties back as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
};

//Get PropertyName and the UserId 