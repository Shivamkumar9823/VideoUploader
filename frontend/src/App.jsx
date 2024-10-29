import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './component/Header/Header';
import Signup from './component/Signup/Signup';
import Home from './component/Home/Home'; // Assuming there's a Home component

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
