import Property from "../models/addNewProperty.js";


export const addProperty = async (req, res) => {
  const {
    propertyName,
    description,
    address,
    price,
    availableRooms,
    area,
    latitude,
    longitude,
    propertyType,
    propertyArea,
    images,
    gcashQr, // GCash QR Code
    userId,
  } = req.body;

  // Check if userId is present
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Backend validation for numeric fields
  const priceAsNumber = parseFloat(price);
  const availableRoomsAsNumber = parseInt(availableRooms, 10);
  const areaAsNumber = parseFloat(area);

  // Validate if the values are valid numbers
  if (isNaN(priceAsNumber) || isNaN(availableRoomsAsNumber) || isNaN(areaAsNumber)) {
    return res.status(400).json({ message: 'Price, Available Rooms, and Area must be valid numbers' });
  }

  try {
    // Ensure that images is an array of objects with url and publicId
    if (!Array.isArray(images) || images.length === 0 || !images[0].url) {
      return res.status(400).json({ message: 'Invalid images data. Expecting an array of objects with "url" and "publicId".' });
    }

    // Ensure gcashQr is an object with url and publicId
    if (!gcashQr || !gcashQr.url || !gcashQr.publicId) {
      return res.status(400).json({ message: 'Invalid GCash QR code data. Expecting an object with "url" and "publicId".' });
    }

    // Create new property
    const newProperty = new Property({
      propertyName,
      description,
      address,
      price: priceAsNumber, // Store validated price as number
      availableRooms: availableRoomsAsNumber, // Store validated availableRooms as number
      area: areaAsNumber, // Store validated area as number
      lat: latitude,
      lang: longitude,
      type: propertyType,
      selectArea: propertyArea,
      images,
      gcashQrCode: [gcashQr],
      userId,
    });
    
    const savedProperty = await newProperty.save();

    // Respond with the saved property
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
  const { id } = req.params; // Property ID passed as a parameter

  try {
    const updatedData = req.body; // The updated property data from the client
    const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json(updatedProperty); // Return the updated property
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
