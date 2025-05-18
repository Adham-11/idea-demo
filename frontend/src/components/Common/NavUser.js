import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFunctions } from '../../useFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas);

function NavUser({ isAuthenticated, role, clientRole }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  const { signOutDistroySession, API_BASE_URL } = useFunctions();
  const clientData = useSelector((state) => state.clientAuth.clientData); 
  const userImage = clientData?.image ? `${API_BASE_URL}/Uploads/user_images/${clientData.image}` : null; 
  const userName = clientData?.fullName;

  useEffect(() => {
    const handleScroll = () => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    signOutDistroySession(setLoading, setError);
    toggleDropdown();
  };

  const renderUserIcon = () => {
    if (isAuthenticated && role === 'client') {
      const icon = clientRole === 'Investor' ? 'briefcase' : 'lightbulb';
      if (userImage && !imageError) {
        return (
          <img
            src={userImage}
            alt="User"
            className="userProfileImage"
            onError={() => setImageError(true)}
          />
        );
      } else {
        return <FontAwesomeIcon icon={icon} className="userIconSVG" />;
      }
    }
    return <FontAwesomeIcon icon="user" className="userIconSVG" />;
  };

  return (
    <div className="navUser" onClick={toggleDropdown}>
      <div className="userIconContainer">
        {isAuthenticated && userName && <span className="userName">{userName}</span>}
        <div className="userIconSvgContainer">
          {renderUserIcon()}
        </div>
      </div>
      {isDropdownOpen && (
        <div className="dropdownMenu">
          {!isAuthenticated ? (
            <>
              <Link
                to="/client-portal/clientSignForm"
                className="dropdownItem clientButton"
                onClick={toggleDropdown}
              >
                <span>Client</span>
              </Link>
              <Link
                to="/employee-portal"
                className="dropdownItem staffButton"
                onClick={toggleDropdown}
              >
                <span>Staff</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/client-portal/profile"
                className="dropdownItem primaryButton"
                onClick={toggleDropdown}
              >
                <span>Profile</span>
              </Link>
              <Link
                to="#"
                className="dropdownItem secondaryButton"
                onClick={handleSignOut}
              >
                <span>Log Out</span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default NavUser;
