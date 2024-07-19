import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';

import NavBar from './component/Navbar';
import Footer from './component/Footer';
import CopyRight from './component/CopyRight';
import Home from './component/Home'; 



function Invest() {
  return <h2>Invest Page</h2>;
}

function Fundraise() {
  return <h2>Fundraise Page</h2>;
}

function Stories(){
  return <h2>Stories page</h2>
}

function AboutUs() {
  return <h2>About Us Page</h2>;
}

function ContactUs() {
  return <h2>Contact Us Page</h2>;
}
function SignUp() {
  return <h2>SignUp Page</h2>;
}
function SignIn() {
  return <h2>SignIn Page</h2>;
}
  


function AppContent() {
    const location = useLocation();
    const hideNavAndFooter = location.pathname === '/signup' || location.pathname === '/signin';
  
    return (
   <>
        {!hideNavAndFooter && <NavBar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/fundraise" element={<Fundraise />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
        {!hideNavAndFooter && <Footer />}
        {<CopyRight />}

   </>
  );
}

export default AppContent;