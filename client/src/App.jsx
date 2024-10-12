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

//Admin
import AdminLogin from './views/pages/admin/AdminLogin.jsx';
import Admin from './views/pages/admin/Admin.jsx';
import ManageUser from './views/pages/admin/ManageUser.jsx';
import Settings from './views/pages/admin/Settings.jsx';

//Landlord
import LandlordPage from './views/pages/landlord/LandlordPage.jsx';
import LandlordViewProfile from './views/pages/landlord/LandlordViewProfile.jsx';
import LandlordManagedProperty from './views/pages/landlord/LandlordManagedProperty.jsx';
import UpdateLandlordProperty from './views/components/landlord/UpdateLandlordProperty.jsx';
//Tenant
import TenantPage from './views/pages/tenant/TenantPage.jsx';
import Properties from './views/pages/tenant/Properties.jsx';
import TenantViewProfile from './views/pages/tenant/TenantViewProfile.jsx';
import BookProperty from './views/pages/tenant/BookProperty.jsx';
import BookingForm from './views/components/tenant/BookingForm.jsx';

//import OTP
import OTP from './views/pages/OTP.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        {/* AdminLoginPage */}
        <Route path="/admin" element={ <AdminLogin />} />
        <Route path="/admin-page" element= {<Admin />} />
        <Route path="/admin/manage-users" element={<AdminAuth><ManageUser /> </AdminAuth>} />
        <Route path="/admin/settings" element={<AdminAuth> <Settings /> </AdminAuth>} />
        
      {/* Landlord Page */}
      <Route path="/landlord" element={<ProtectedRoute> <LandlordPage /> </ProtectedRoute>} />
      <Route path="/landlord-profile" element={<ProtectedRoute> <LandlordViewProfile /> </ProtectedRoute>} />
      <Route path="/manage-properties" element={<ProtectedRoute> <LandlordManagedProperty /> </ProtectedRoute>} />
      <Route path="/update-properties/:id" element={<ProtectedRoute><UpdateLandlordProperty /></ProtectedRoute>} />


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





        </Routes>
        
    </Router>
  );
}

export default App;
