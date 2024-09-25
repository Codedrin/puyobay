import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import '../index.css';


//Users Account
import Signin from './views/pages/Signin.jsx';
import Signup from './views/pages/Signup.jsx';
import ForgotPassword from './views/pages/ForgotPassword.jsx';
import AdminLogin from './views/pages/admin/AdminLogin.jsx';
import Admin from './views/pages/admin/Admin.jsx';
//Tenant
import TenantPage from './views/pages/tenant/TenantPage.jsx';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        {/* AdminLoginPage */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-page" element={<Admin />} />
        {/* Tenant Page */}
        <Route path="/tenant" element={<TenantPage />} />
        </Routes>
    </Router>
  );
}

export default App;
