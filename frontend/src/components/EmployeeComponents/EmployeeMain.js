import React from 'react';
import { useDispatch } from 'react-redux';
import { openPopup } from '../../redux/checkpopupSlice';
import { openYesNoPopup } from '../../redux/yesNoPopupSlice';
import { openStaffData } from '../../redux/staffDataSlice';
import { openProjectData } from '../../redux/projectDataSlice';

function EmployeeMain() {
  const dispatch = useDispatch();

  const handleTestPopup = (type) => {
    dispatch(openPopup({
      message: `The user is added ${type}`,
      buttonText: 'Done',
      type: type,
    }));
  };

  const handleYesNoPopup = () => {
    dispatch(openYesNoPopup({
      message: 'Are you sure?',
      buttonYes: 'Yes',
      buttonNo: 'No',
      type: 'confirmation',
    }));  
  };

  const handleOpenStaffPopup = () => {
    dispatch(openStaffData({
      header: 'Add New Staff',
      buttonText: 'Add',
      type: 'Add',
    }));
  };

  const handleOpenProjectPopup = () => {
    dispatch(openProjectData({
      header: 'Add New Project',
      buttonText: 'Add',
      type: 'Add',
    }));
  }

  return (
    <>
      <h1>EmployeeMain</h1>
      <button onClick={() => handleTestPopup('success')} className="test-popup-button">
        Test Success Popup
      </button>
      <button onClick={() => handleTestPopup('error')} className="test-popup-button">
        Test Error Popup
      </button>
      <button onClick={() => handleTestPopup('warning')} className="test-popup-button">
        Test Warning Popup
      </button>
      <button onClick={handleYesNoPopup} className="test-popup-button">
        Test Yes/No Popup
      </button>
      <button onClick={handleOpenStaffPopup} className="test-popup-button">
        Add New Staff
      </button>
      <button onClick={handleOpenProjectPopup} className="test-popup-button">
        Add New Project
      </button>
    </>
  );
}

export default EmployeeMain;