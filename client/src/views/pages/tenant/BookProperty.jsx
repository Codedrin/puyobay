import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TenantNavbar from '../../../constants/TenantNabar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BookProperty = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [otherProperties, setOtherProperties] = useState([]);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  const user = getUserFromLocalStorage();

  useEffect(() => {
    // Fetch property details
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/get-propertiesId/${propertyId}`);
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    // Fetch other properties for the carousel
    const fetchOtherProperties = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/get-properties`);
        const data = await response.json();
        setOtherProperties(data.slice(0, 5)); // Limit to 5 properties
      } catch (error) {
        console.error('Error fetching other properties:', error);
      }
    };

    fetchPropertyDetails();
    fetchOtherProperties();
  }, [propertyId]);



  const submitRating = async () => {
    if (!user) {
      toast.error('You must be logged in to submit a rating');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/submitrating/${propertyId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, userId: user.id }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error('Failed to submit rating. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('An error occurred while submitting the rating.');
    }
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  // Function to render star rating based on averageRating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleBook = (propertyId) => {
    navigate(`/book-property/${propertyId}`);
  };

      // Check if all rooms are fully booked
      const allRoomsFullyBooked =
      property.rooms?.length > 0 &&
      property.rooms.every((room) => room.availablePersons <= 0);

      
  const handleBookingForm = () => {
    navigate(`/book-house/${propertyId}`);
  };

  // Settings for react-slick carousel for room images
  const roomImageSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Settings for react-slick carousel for other properties
  const otherPropertySettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <TenantNavbar />
      <div className="container mx-auto py-10">
        <ToastContainer position="top-right" autoClose={5000} />

        <h2 className="text-3xl font-bold text-blue-600">{property.propertyName}</h2>

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="w-full md:w-1/2">
            {property.images.length > 1 ? (
              <Slider {...roomImageSettings}>
                {property.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image.url}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src={property.images[0]?.url}
                alt={`Property image`}
                className="w-full h-80 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="md:w-1/2">
          <p>
              <strong>Available Rooms:</strong>{' '}
              {allRoomsFullyBooked || property.rooms?.length === 0
                ? 'No available rooms'
                : `${property.rooms.length} room(s) available`}
            </p>
            <p><strong>Price:</strong> ₱{property.price}</p>
            <p><strong>Details:</strong> {property.description}</p>
            <p><strong>Area:</strong> {property.roomArea} sq ft</p>
            <p><strong>Address:</strong> {property.address}</p>

            <div className="flex items-center space-x-4 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => navigate('/properties')}
              >
                Back
              </button>

              <button
                className={`px-4 py-2 rounded text-white ${
                  allRoomsFullyBooked
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={handleBookingForm}
                disabled={allRoomsFullyBooked}
              >
                {allRoomsFullyBooked ? 'All Rooms Fully Booked' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>


        {/* Rooms Section */}
        {property.rooms && property.rooms.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Rooms in this Property</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {property.rooms.map((room, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  {room.images?.length > 1 ? (
                    <Slider {...roomImageSettings}>
                      {room.images.map((image, imageIndex) => (
                        <div key={imageIndex}>
                          <img
                            src={image.url}
                            alt={`Room image ${imageIndex + 1}`}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <img
                      src={room.images[0]?.url}
                      alt={`Room image`}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="text-xl font-bold">{room.roomName}</h4>
                    <p><strong>Available Persons:</strong> {room.availablePersons || 'N/A'}</p>
                    <p><strong>Price:</strong> ₱{room.price}</p>
                    <p><strong>Area:</strong> {room.roomArea || 'N/A'}</p>
                    <p><strong>Description:</strong> {room.description || 'No description available'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Rating Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold">Rate this property:</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                ★
              </button>
            ))}
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={submitRating}
          >
            Submit Rating
          </button>
        </div>

        {/* Other Properties Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4">Other Properties You May Like</h3>
          <Slider {...otherPropertySettings}>
            {otherProperties.map((prop) => (
              <div key={prop._id} className="p-2">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col justify-between">
                  <img src={prop.images[0]?.url} alt={prop.propertyName} className="w-full h-40 object-cover rounded-lg" />
                  <div className="p-4 flex flex-col justify-between h-full">
                    <h3 className="text-xl font-bold">{prop.propertyName}</h3>
                    <p className="text-gray-600 mb-2">{prop.description}</p>
                    <div className="flex mb-2">{renderStars(prop.averageRating || 0)}</div>
                    <p><strong>Price:</strong> ₱{prop.price}</p>
                    <p><strong>Rooms Available:</strong> {prop.rooms?.length || 'N/A'}</p>
                    <p><strong>Area:</strong> {prop.area} sq ft</p>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                      onClick={() => handleBook(prop._id)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="py-6 text-center">
          <p className="text-gray-600">All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default BookProperty;
