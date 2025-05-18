// Initialize packages
const express = require('express');
const router = express.Router();
const {upload, handleMulterErrors} = require('../middleWare/projectMiddleware'); // Import multer middleware

// functions
const { createContact,
   signUp,
   signIn,
   signOut,
   verifyOtp,
   forgotPassword,
   verifyOtpForReset,
   resetPassword,
   getAllUsers,
   getAllContacts,
   updateContactStatus,
  //  createProject,
  initProject,
  updateDescription,
  updateDocuments,
  updateTeam,
   getAllProjects,
   getProjectById,
   getProjectByUserId,
   updateProject,
   deleteProject,
   updateUserById,
   createBlog,
   updateBlog,
   getAllBlogs,
   createReview,
   getAllReviews,
   createNotification,
   getNotifications,
   updateNotification,
  } = require('../controller/clientController'); 

const { createStaff,
   loginStaff,
   getAllStaff,
   getStaffById,
   updateStaff,
   createMeeting,
   assignAuditor,
   investorSelectSlots,
   entrepreneurConfirmSlot,
   getAllMeetings,
   getMeetingById,
   cancelMeeting,
   getMeetingStatus,
   getInvestorMeetings,
   getUserByID,
   getAllAuditors,
   pythonService,
   pythonServiceFraudDetection,
  } = require('../controller/staffController');
const { authenticateToken, isAdmin } = require('../middleWare/middleWare');
const userImageUploads = require('../middleWare/userImageUploads');
const staffImageUploads = require('../middleWare/staffImageUploads'); // Import multer middleware
const blogUpload = require('../middleWare/blogImageUploads');
const { body } = require('express-validator');
const { validateMeetingSlots } = require('../middleWare/slotValidation');

// const { session } = require('passport');

// -----------------------------------------------------------------------------------> staff portal <-----------------------------------------------------------------------------------


// Staff portal: Create a new staff member (Admin only)
router.post('/staff', authenticateToken, isAdmin, staffImageUploads, createStaff);

// Staff login
router.post('/staff/login', loginStaff);

// Get all staff members (Admin only)
router.get('/staff', authenticateToken, isAdmin, getAllStaff);

// Get all auditors (Admin only)
router.get('/staff/auditors', authenticateToken, getAllAuditors);

// Get a single staff member by ID (Admin only)
router.get('/staff/:staffId', authenticateToken, isAdmin, getStaffById);

// Update staff details (Admin only)
router.put('/staff/:staffId', authenticateToken, isAdmin, staffImageUploads, updateStaff);

// Get all Users (Clients) (Admin only)
router.get('/users', authenticateToken, isAdmin, getAllUsers);

// Get all contact messages (Admin only)
router.get('/contacts', authenticateToken, isAdmin, getAllContacts);

// Update contact message status (Admin only)
router.put('/contacts/:contactId/status', authenticateToken, isAdmin, updateContactStatus);

// Get all projects (Admin only)
router.get('/projects', authenticateToken, getAllProjects);

// get all projects before login 
router.get('/projectBeforLogin', getAllProjects);

// Get a single project by ID (Admin only)
router.get('/projects/:projectId', authenticateToken, getProjectById);

// Get a singel user by ID (Admin only)
router.get('/users/:userID', authenticateToken, getUserByID);

// Step 1: Investor requests a meeting
router.post('/meetings', authenticateToken, createMeeting);

// step 1.5: Entrepreneur cancels a meeting
router.delete('/cancel-meeting/:meetingId', authenticateToken, cancelMeeting);

// Step 2: Admin assigns an auditor and generates 3 slots
router.put('/assign-auditor/:meetingId', authenticateToken, assignAuditor);

// Step 3: Investor selects 2 slots
router.put('/investor-select/:meetingId', authenticateToken, validateMeetingSlots, investorSelectSlots);

// Step 4: Entrepreneur confirms final slot
router.put('/entrepreneur-confirm/:meetingId', authenticateToken, validateMeetingSlots, entrepreneurConfirmSlot);

// Route to get all meetings
router.get('/meetings', authenticateToken, getAllMeetings);

// Route to get a meeting by ID
router.get('/meetings/:id', authenticateToken, getMeetingById);

// Route to get meeting status
router.get('/meeting/status/:project_id/:investor_id/:entrepreneur_id', authenticateToken, getMeetingStatus);

// Route to get investor's meetings
router.get('/investor-meetings', authenticateToken, getInvestorMeetings);

// python API route
router.post('/analyze', authenticateToken, isAdmin, pythonService);

// python API route
router.get('/detect_fraud', authenticateToken, isAdmin, pythonServiceFraudDetection);


// -----------------------------------------------------------------------------------> client portal <-----------------------------------------------------------------------------------

// Handle contact form submission
router.post('/contact', createContact);

// Initial signup route to send OTP
router.post('/signup', signUp);

// Update user data
router.patch('/users/:id', authenticateToken, userImageUploads.single('image'), updateUserById);

// Verify OTP and complete signup route
router.post('/verify-otp', verifyOtp);

// Sign-in route
router.post('/signin',
  [
    body('email').isEmail().withMessage('Please enter a valid email.'),
    body('password').notEmpty().withMessage('Password is required.')
  ], signIn
);

// Sign-out route
router.post('/signout', signOut);

// Request OTP for password reset
router.post('/forgot-password', forgotPassword);

// Verify OTP and reset password
router.post('/verify-otp-for-reset', verifyOtpForReset);

// Reset password
router.post('/reset-password', resetPassword);

// Create a new project (Authenticated users only)
// router.post('/projects', authenticateToken, upload, createProject);
router.post('/projects/init', authenticateToken, initProject);
// router.patch('/projects/:id/general', authenticateToken, updateGeneralInfo);
router.patch('/projects/:id/description', authenticateToken, updateDescription);
router.patch('/projects/:id/documents', authenticateToken, upload, updateDocuments);
router.patch('/projects/:id/team', authenticateToken, upload, updateTeam);


// Update project (Authenticated users only)
router.put('/projects/:projectId', authenticateToken, upload, updateProject);

// Get project by user_id
router.get('/projects/user/:userId', getProjectByUserId);

// Delete project (Authenticated users only)
router.delete('/projects/:projectId', authenticateToken, deleteProject);

// Create Blog
router.post('/blog', blogUpload.single('blog_image'), authenticateToken, createBlog);

// Update Blog
router.put('/blog/:id', blogUpload.single('blog_image'), authenticateToken, updateBlog);

// Get All blogs
router.get('/blog', getAllBlogs);

// Create Review
router.post('/review/:userId', authenticateToken, createReview);

// Get All Reviews
router.get('/review', getAllReviews); 

// notification routes
router.post('/save-notifications', authenticateToken, createNotification);

// Get notifications for a specific user
router.get('/get-notifications', authenticateToken, getNotifications);

// update notification status
router.put('/notifications/mark-read/:id', authenticateToken, updateNotification);

module.exports = router;
