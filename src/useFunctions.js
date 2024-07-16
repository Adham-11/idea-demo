// File: useNavBarFunctions.js

import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFunctions = () => {
  const [isFixed, setIsFixed] = useState(false); // State for fixed header
  const [isVisible, setIsVisible] = useState(true); // State for header visibility
  const [sideBarVisible, setSideBarVisible] = useState(false); // State for sidebar visibility
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('En');
  const [searchTerm, setSearchTerm] = useState('');
  const [paragraphText, setParagraphText] = useState('');
  const [subText, setSubText] = useState('');

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false); // Hide header on scroll down
        } else {
          setIsVisible(true); // Show header on scroll up
        }
        setIsFixed(true); // Fix header after scrolling past 50px
      } else {
        setIsFixed(false); // Unfix header if scrolled to top
        setIsVisible(true); // Always show header when at the top
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Only run once on component mount

  const toggleSideBar = () => {
    setSideBarVisible(prevState => !prevState); // Toggle sidebar visibility
  };
  

  const toggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
  };

  const selectLanguage = (language) => {
    setCurrentLanguage(language);
    setDropdownVisible(false);
  };


  
    const handleInputChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleSearch = () => {
      console.log('Search term:', searchTerm);
      // Add your search logic here
    };


    

    useEffect(()=>{
        const fetchText = async () => {
            try{
                const response = await axios.get("http://127.0.0.1:2000/api/whoarewe");
                setParagraphText(response.data.mainText);
                setSubText(response.data.subText);
            }catch (error) {
                console.log("Error Fetching the Paragraph", error);
            }
        };
    }, []);


  return { 
    toggleSideBar,
    toggleDropdown,
    selectLanguage, 
    handleInputChange, 
    handleSearch,
    isFixed,
    isVisible,
    sideBarVisible,
    dropdownVisible, 
    currentLanguage,
    paragraphText,
    subText
   };
};
