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
    const [rating, setRating] = useState(0); // Store the rating input from the user
    const navigate = useNavigate(); 
    // Get user data from local storage
    const getUserFromLocalStorage = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    };

    const user = getUserFromLocalStorage();

    useEffect(() => {
        // Fetch property details
        const fetchPropertyDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/get-propertiesId/${propertyId}`);
            const data = await response.json();
            setProperty(data);
        } catch (error) {
            console.error('Error fetching property details:', error);
        }
        };

        // Fetch other properties for the carousel
        const fetchOtherProperties = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/get-properties');
            const data = await response.json();
            // Select only 5 properties to display in the carousel
            setOtherProperties(data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching other properties:', error);
        }
        };

        // Fetch other properties along with their average ratings
        const fetchOtherPropertiesWithRatings = async () => {
            try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/get-average-ratings`); // Use the correct endpoint
            const data = await response.json();
            setOtherProperties(data.slice(0, 5)); // Store properties with ratings
            } catch (error) {
            console.error('Error fetching properties with ratings:', error);
            }
        };

  
        fetchPropertyDetails();
        fetchOtherProperties();
        fetchOtherPropertiesWithRatings();
    }, [propertyId]);

    // Submit Rating Function
    const submitRating = async () => {
        if (!user) {
        toast.error('You must be logged in to submit a rating');
        return;
        }

        try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/submitrating/${propertyId}/rate`, {
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
        navigate(`/book-property/${propertyId}`); // Navigate using useNavigate
    };

    const handleBookingForm = () => {
        navigate(`/book-house/${propertyId}`); // Navigate to the booking form route
      };
      
    // Settings for react-slick carousel with responsive breakpoints
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Show 3 slides at once on desktop
        slidesToScroll: 2, // Scroll one slide at a time
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
        {
            breakpoint: 1024, // For screens less than 1024px
            settings: {
            slidesToShow: 2, // Show 2 slides on tablet
            slidesToScroll: 1,
            },
        },
        {
            breakpoint: 768, // For screens less than 768px (mobile)
            settings: {
            slidesToShow: 1, // Show 1 slide on mobile
            slidesToScroll: 1,
            },
        },
        ],
    };

 
    return (
        <>
        <TenantNavbar /> {/* Render the Tenant Navbar */}
        <div className="container mx-auto py-10">
            <ToastContainer position="top-right" autoClose={5000} /> {/* This will render the toasts */}

            <h2 className="text-3xl font-bold text-blue-600">{property.propertyName}</h2>
            <div className="flex flex-col md:flex-row gap-6 mt-6">
            <img
                src={property.images[0]?.url}
                alt={property.propertyName}
                className="w-full md:w-1/2 h-auto object-cover"
            />
           <div className="md:w-1/2">
                <p><strong>Available Rooms:</strong> {property.availableRooms}</p>
                <p><strong>Price:</strong> ₱{property.price}</p>
                <p><strong>Details:</strong> {property.description}</p>
                <p><strong>Area:</strong> {property.area} sq ft</p>
                <p><strong>Address:</strong> {property.address}</p>
                <div className="flex items-center space-x-4 mt-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => navigate('/properties')}
                    >
                        Back
                    </button>

                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleBookingForm}>
                        Book Now
                    </button>
                </div>
            </div>
            </div>

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


                        <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">Other Properties You May Like</h3>
            <Slider {...settings}>
                {otherProperties.map((prop) => (
                <div key={prop._id} className="p-2">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col justify-between">
                    <img src={prop.images[0]?.url} alt={prop.propertyName} className="w-full h-40 object-cover" />
                    <div className="p-4 flex flex-col justify-between h-full">
                        <h3 className="text-xl font-bold">{prop.propertyName}</h3>
                        <p className="text-gray-600 mb-2">{prop.description}</p>
                        <div className="flex mb-2">{renderStars(prop.averageRating || 0)}</div> {/* Use averageRating */}
                        <p><strong>Price:</strong> ₱{property.price}</p>
                      <p><strong>Rooms Available:</strong> {property.availableRooms}</p>
                      <p><strong>Area:</strong> {property.area} sq ft</p>
                        <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                        onClick={() => handleBook(prop._id)}> 
                        View
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </Slider>
            </div>

            
                <br />
               {/* Footer Section */}
        <div className="text-center mt-10">
          <p className="text-gray-600">&copy; 2024 PUYOBAY. All rights reserved.</p>
        </div>
        </div>
        </>
    );
    };

    export default BookProperty;
