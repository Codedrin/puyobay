import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import '../index.css';

//AuthGuard
import PropertyAuth from './PageAuth/PropertyAuth.jsx';
import ProtectedRoute from './PageAuth/ProtectedRoute.jsx';
import AdminAuth from './PageAuth/AdminAuth.jsx';
//Users Account
import Signin from './views/pages/Signin.jsx';
import Signup from './views/pages/Signup.jsx';
import ForgotPassword from './views/pages/ForgotPassword.jsx';
import ResetPassword from './views/pages/ResetPassword.jsx';
//Admin
import AdminLogin from './views/pages/admin/AdminLogin.jsx';
import Admin from './views/pages/admin/Admin.jsx';
import ManageUser from './views/pages/admin/ManageUser.jsx';
import Settings from './views/pages/admin/Settings.jsx';
import LandlordAdmin from './views/pages/admin/LandlordAdmin.jsx';
import TenantAdmin from './views/pages/admin/TenantAdmin.jsx';
import HousesAdmin from './views/pages/admin/HousesAdmin.jsx';
import Reports from './views/pages/admin/Reports.jsx';
//Landlord
import LandlordPage from './views/pages/landlord/LandlordPage.jsx';
import LandlordViewProfile from './views/pages/landlord/LandlordViewProfile.jsx';
import LandlordManagedProperty from './views/pages/landlord/LandlordManagedProperty.jsx';
import UpdateLandlordProperty from './views/components/landlord/UpdateLandlordProperty.jsx';
import LandlordViewBooking from './views/pages/landlord/LandlordViewBooking.jsx';
import LandlordAddProperty from './views/pages/landlord/LandlordAddProperty.jsx';
//Tenant
import TenantPage from './views/pages/tenant/TenantPage.jsx';
import Properties from './views/pages/tenant/Properties.jsx';
import TenantViewProfile from './views/pages/tenant/TenantViewProfile.jsx';
import BookProperty from './views/pages/tenant/BookProperty.jsx';
import BookingForm from './views/components/tenant/BookingForm.jsx';

//import OTP
import OTP from './views/pages/OTP.jsx';
import ResetPassOTP from './views/pages/ResetPassOTP.jsx';


const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<TenantPage /> }/>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId" element={<ResetPassword />} />
        {/* AdminLoginPage */}
        <Route path="/admin" element={ <AdminLogin />} />
        <Route path="/admin-page" element= {<Admin />} />
        <Route path="/admin/manage-users" element={<ManageUser />} />
        <Route path="/admin/settings" element={ <Settings />} />
        <Route path="/admin/landlord" element={<LandlordAdmin /> }/>
        <Route path="/admin/tenant" element={<TenantAdmin /> }/>
        <Route path="/admin/house" element={<HousesAdmin /> }/>
        <Route path="/admin/reports" element={<Reports /> }/>
      {/* Landlord Page */}
      <Route path="/landlord" element={<ProtectedRoute> <LandlordPage /> </ProtectedRoute>} />
      <Route path="/landlord-profile" element={<ProtectedRoute> <LandlordViewProfile /> </ProtectedRoute>} />
      <Route path="/manage-properties" element={<ProtectedRoute> <LandlordManagedProperty /> </ProtectedRoute>} />
      <Route path="/update-properties/:id" element={<ProtectedRoute><UpdateLandlordProperty /></ProtectedRoute>} />
      <Route path="/view-bookings/:userId" element={<ProtectedRoute><LandlordViewBooking /></ProtectedRoute>} />
      <Route path="/add-property" element={<ProtectedRoute><LandlordAddProperty /></ProtectedRoute>} />



        {/* Tenant Page */}
        <Route path="/tenant" element={<ProtectedRoute><TenantPage /></ProtectedRoute>} />
        <Route
          path="/properties"
          element={
            <PropertyAuth>
              <Properties />
            </PropertyAuth>
          } />
           <Route
          path="/tenant-profile"
          element={
            <PropertyAuth>
              <TenantViewProfile />
            </PropertyAuth>
          } />
            <Route
              path="/book-property/:propertyId" 
              element={
                <PropertyAuth>
                  <BookProperty />
                </PropertyAuth>
              }
            />
                        <Route
              path="/book-house/:propertyId" 
              element={
                <PropertyAuth>
                  <BookingForm />
                </PropertyAuth>
              }
            />

              {/* OTP */}
        <Route path="/otp/:userId" element={<OTP />} />
        <Route path="/reset-otp/:userId" element={<ResetPassOTP />} />




        </Routes>
        
    </Router>
  );
}

export default App;
