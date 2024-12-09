import Property from "../models/addNewProperty.js";


// export const addProperty = async (req, res) => {
//   const {
//     propertyName,
//     description,
//     address,
//     price,
//     availableRooms,
//     area,
//     latitude,
//     longitude,
//     propertyType,
//     propertyArea,
//     images,
//     gcashQr, // GCash QR Code
//     userId,
//   } = req.body;

//   // Check if userId is present
//   if (!userId) {
//     return res.status(400).json({ message: 'User ID is required' });
//   }

//   // Backend validation for numeric fields
//   const priceAsNumber = parseFloat(price);
//   const availableRoomsAsNumber = parseInt(availableRooms, 10);
//   const areaAsNumber = parseFloat(area);

//   // Validate if the values are valid numbers
//   if (isNaN(priceAsNumber) || isNaN(availableRoomsAsNumber) || isNaN(areaAsNumber)) {
//     return res.status(400).json({ message: 'Price, Available Rooms, and Area must be valid numbers' });
//   }

//   try {
//     // Ensure that images is an array of objects with url and publicId
//     if (!Array.isArray(images) || images.length === 0 || !images[0].url) {
//       return res.status(400).json({ message: 'Invalid images data. Expecting an array of objects with "url" and "publicId".' });
//     }

//     // Ensure gcashQr is an object with url and publicId
//     if (!gcashQr || !gcashQr.url || !gcashQr.publicId) {
//       return res.status(400).json({ message: 'Invalid GCash QR code data. Expecting an object with "url" and "publicId".' });
//     }

//     // Create new property
//     const newProperty = new Property({
//       propertyName,
//       description,
//       address,
//       price: priceAsNumber, // Store validated price as number
//       availableRooms: availableRoomsAsNumber, // Store validated availableRooms as number
//       area: areaAsNumber, // Store validated area as number
//       lat: latitude,
//       lang: longitude,
//       type: propertyType,
//       selectArea: propertyArea,
//       images,
//       gcashQrCode: [gcashQr],
//       userId,
//     });
    
//     const savedProperty = await newProperty.save();

//     // Respond with the saved property
//     res.status(201).json(savedProperty);
//   } catch (error) {
//     console.error('Error adding property:', error);
//     res.status(500).json({ message: 'Error adding property', error });
//   }
// };
  export const addProperty = async (req, res) => {
    const {
      propertyName,
      description,
      address,
      price,
      area, // Enum field with allowed values
      latitude,
      longitude,
      propertyType,
      propertyArea,
      images,
      gcashQr,
      rooms,
      userId,
    } = req.body;

    console.log('Request received at addProperty endpoint.');
    console.log('Payload received:', req.body);

    // Check if userId is present
    if (!userId) {
      console.error('Validation failed: User ID is required.');
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Validate price
    const priceAsNumber = parseFloat(price);
    if (isNaN(priceAsNumber)) {
      console.error('Validation failed: Price must be a valid number.');
      return res.status(400).json({ message: 'Price must be a valid number.' });
    }

    // Validate area
    if (!['San Isidro', 'Del Carmen'].includes(area)) {
      console.error('Validation failed: Area must be either "San Isidro" or "Del Carmen".');
      return res.status(400).json({ message: 'Area must be either "San Isidro" or "Del Carmen".' });
    }

    try {
      // Validate images
      if (!Array.isArray(images) || images.length === 0 || !images[0].url) {
        console.error('Validation failed: Invalid images data.');
        return res.status(400).json({
          message: 'Invalid images data. Expecting an array of objects with "url" and "publicId".',
        });
      }

      console.log('Images validation passed.');

      // Validate GCash QR code
      if (!gcashQr || !gcashQr.url || !gcashQr.publicId) {
        console.error('Validation failed: Invalid GCash QR code data.');
        return res.status(400).json({
          message: 'Invalid GCash QR code data. Expecting an object with "url" and "publicId".',
        });
      }

      console.log('GCash QR Code validation passed.');

      // Validate rooms
      if (!Array.isArray(rooms) || rooms.length === 0) {
        console.error('Validation failed: Rooms data is required and must be an array of room objects.');
        return res.status(400).json({
          message: 'Rooms data is required and must be an array of room objects.',
        });
      }
      const validatedRooms = rooms.map((room, index) => {
        if (!room.roomName || typeof room.roomName !== 'string') {
          throw new Error(`Room ${index} must have a valid name.`);
        }
        if (isNaN(parseInt(room.availablePersons, 10))) {
          throw new Error(`Room ${index} must have a valid "availablePersons".`);
        }
        if (isNaN(parseFloat(room.price))) {
          throw new Error(`Room ${index} must have a valid "price".`);
        }
        if (!room.description || typeof room.description !== 'string') {
          throw new Error(`Room ${index} must have a valid "description".`);
        }
        if (!Array.isArray(room.images) || room.images.length === 0) {
          throw new Error(`Room ${index} must have at least one valid image.`);
        }
        room.images.forEach((image, imgIndex) => {
          if (!image.url || !image.publicId) {
            throw new Error(`Room ${index}, Image ${imgIndex} must have "url" and "publicId".`);
          }
        });
      
        return {
          roomName: room.roomName,
          availablePersons: parseInt(room.availablePersons, 10),
          price: parseFloat(room.price),
          description: room.description,
          roomArea: room.roomArea,
          images: room.images,
        };
      });
      
      

      console.log('Rooms validation passed.');

      // Create property
      const newProperty = new Property({
        propertyName,
        description,
        address,
        price: priceAsNumber,
        area, // String that matches the enum
        latitude,
        longitude,
        type: propertyType,
        roomArea: propertyArea, // Matches the schema field
        images,
        gcashQrCode: [gcashQr],
        rooms: validatedRooms,
        userId,
      });

      const savedProperty = await newProperty.save();
      console.log('Property saved successfully:', savedProperty);

      res.status(201).json(savedProperty);
    } catch (error) {
      console.error('Error adding property:', error);
      res.status(500).json({ message: 'Error adding property', error: error.message });
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
  export const getRoomsByPropertyId = async (req, res) => {
    const { propertyId } = req.params;
  
    try {
      const property = await Property.findById(propertyId, 'rooms');
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      res.status(200).json(property.rooms);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching rooms', error });
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
