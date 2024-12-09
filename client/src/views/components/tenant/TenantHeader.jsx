import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logo, image1, display_img1, display_img2, display_img3, display_img4 } from '../../../assets';

const TenantHeader = () => {
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    navigate('/properties');
  };

  return (
    <header className="relative">
      {/* Background Image with Dark Overlay */}
      <div
        className="relative bg-cover bg-center h-96 flex items-center justify-center"
        style={{ backgroundImage: `url(${image1})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative text-center text-white z-10">
          <h1 className="text-4xl font-bold">Welcome to Puyobay,</h1>
          <p className="text-xl mt-2">Where Comfort Meets Convenience!</p>
          <button
            onClick={handleBookNowClick}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            BOOK NOW
          </button>
        </div>
      </div>

      <br /><br />
      {/* Image Display Section with Animation and Hover Text */}
      <section className="py-10">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="relative group">
            <img
              src={display_img1}
              alt="Image 1"
              className="w-full h-64 object-cover rounded-lg transform transition duration-500 ease-in-out hover:scale-105"
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg">
              <span className="text-white text-lg">Gina’s Homestay</span>
            </div>
          </div>
          <div className="relative group">
            <img
              src={display_img2}
              alt="Image 2"
              className="w-full h-64 object-cover rounded-lg transform transition duration-500 ease-in-out hover:scale-105 delay-200"
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg">
              <span className="text-white text-lg">La Freyah’s Homestay 
              </span>
            </div>
          </div>
          <div className="relative group">
            <img
              src={display_img3}
              alt="Image 3"
              className="w-full h-64 object-cover rounded-lg transform transition duration-500 ease-in-out hover:scale-105 delay-400"
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg">
              <span className="text-white text-lg">Liacel Boarding House</span>
            </div>
          </div>
          <div className="relative group">
            <img
              src={display_img4}
              alt="Image 4"
              className="w-full h-64 object-cover rounded-lg transform transition duration-500 ease-in-out hover:scale-105 delay-600"
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg">
              <span className="text-white text-lg">Condevera Boarding House</span>
            </div>
          </div>
        </div>
      </section>

      {/* Subheader with Logo and About Us */}
      <section className="bg-white py-10" id="About">
  <div className="container mx-auto flex flex-col lg:flex-row items-center text-center lg:text-left">
    {/* Logo Section */}
    <div className="lg:w-1/2 flex justify-center mb-8 lg:mb-0">
      <img src={logo} alt="Puyobay Logo" className="w-full h-full" />
    </div>

    {/* About Us Text Section */}
    <div className="lg:w-1/3 lg:pl-21">
      <h2 className="text-3xl font-bold mb-4">About Us</h2>
      <p className="text-lg mb-4">
        Puyobay is a cutting-edge house rental web application designed to simplify the property rental process for both tenants and landlords. Our platform offers a user-friendly interface where tenants can easily find and apply for rental properties, while landlords can efficiently manage their listings and tenant applications.
      </p>
      <div className="bg-blue-100 text-blue-700 p-4 rounded-lg mb-4">
        <p>
          Our mission is to bridge the gap between tenants and landlords by providing a seamless experience that prioritizes comfort and convenience. With Puyobay, you can ensure that your property is well-managed and that your rental experience is hassle-free.
        </p>
      </div>
      <p className="text-lg">
        Whether you are looking for a new home or managing rental properties, Puyobay is your go-to solution for all your rental needs.
      </p>
    </div>
  </div>
</section>

    </header>
  );
};

export default TenantHeader;
