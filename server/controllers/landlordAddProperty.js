import Property from "../models/addNewProperty.js";

// Add New Property
export const addProperty = async (req, res) => {
    const { propertyName, description, address, price, availableRooms, area, images, userId } = req.body; 
    
    // Log to check the incoming data
    console.log('Received property data:', { propertyName, description, address, price, availableRooms, area, images, userId });
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    try {
      // Ensure that images is an array of objects with url and publicId
      if (!Array.isArray(images) || images.length === 0 || !images[0].url) {
        return res.status(400).json({ message: 'Invalid images data. Expecting an array of objects with "url" and "publicId".' });
      }
  
      // Create new property
      const newProperty = new Property({
        propertyName,
        description,
        address,
        price,
        availableRooms,
        area,
        images, // Already uploaded Cloudinary URLs
        userId, // Use the userId from the body
      });
  
      const savedProperty = await newProperty.save();
      res.status(201).json(savedProperty);
    } catch (error) {
      console.error('Error adding property:', error);
      res.status(500).json({ message: 'Error adding property', error });
    }
  };
  
  
  
  
  

// Get Properties by User ID
export const getPropertiesByUser = async (req, res) => {
    const userId = req.query.userId; // Fetch userId from query parameters
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    try {
      const properties = await Property.find({ userId });
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching properties', error });
    }
  };
  



  
  // Get Single Property by ID
  export const getPropertyById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const property = await Property.findById(id);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      res.status(200).json(property);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching property', error });
    }
  };
  
  // Update Property
  export const updateProperty = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
  
    try {
      const updatedData = req.body;
      const updatedProperty = await Property.findOneAndUpdate({ _id: id, userId }, updatedData, { new: true });
      if (!updatedProperty) {
        return res.status(404).json({ message: 'Property not found or you are not authorized to update' });
      }
      res.status(200).json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: 'Error updating property', error });
    }
  };
  
      // Delete Property

      export const deleteProperty = async (req, res) => {
        const { id } = req.params;

        try {
          // Delete the property based on its ID
          const deletedProperty = await Property.findByIdAndDelete(id);

          if (!deletedProperty) {
            return res.status(404).json({ message: 'Property not found' });
          }

          res.status(200).json({ message: 'Property deleted successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Error deleting property', error });
        }
      };
