import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import '../index.css';



import Signin from './views/pages/Signin.jsx';
// import Signup from './views/pages/Signup.jsx';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        </Routes>
    </Router>
  );
}

export default App;
