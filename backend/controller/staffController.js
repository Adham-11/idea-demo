const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
// Import models
const Staff = require('../modules/staff'); 
const Meeting = require('../modules/meeting');
const Project = require('../modules/project');
const User = require('../modules/signup');



require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Create Staff
const createStaff = async (req, res) => {
  const { fullName, email, username, phone, password, role, permissions } = req.body;
  const image = req.files?.image ? req.files.image[0].path : null; // Use req.files for consistency

  try {
      // Check if staff member already exists
      const existingUser = await Staff.findOne({ $or: [{ email }, { username }, { phone }] });
      if (existingUser) {
          return res.status(400).json({ success: false, message: 'Staff member with this email, username, or phone already exists!' });
      }

      // Validate role
      const validRoles = ['Admin', 'Auditor', 'Cs'];
      if (!validRoles.includes(role)) {
          return res.status(400).json({ success: false, message: 'Invalid role provided' });
      }

      // Validate email format
      if (!/^[\w\.-]+@[\w-]+(\.[\w-]+)*\.[\w-]{2,}$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

      // Validate phone number
      if (!/^[0-9]{10,15}$/.test(phone)) {
          return res.status(400).json({ success: false, message: 'Invalid phone number format' });
      }

      // Validate permissions
      const validPermissions = [
          'Manage Staff',
          'Manage Projects',
          'Schedule Meetings',
          'Manage Contracts',
          'Manage Support Requests',
          'Manage Users',
          'Manage Web & App',
          'Manage Advertisements'
      ];
      if (permissions && (!Array.isArray(permissions) || permissions.some(p => !validPermissions.includes(p)))) {
          return res.status(400).json({ success: false, message: 'Invalid permissions provided' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new staff member
      const newStaff = new Staff({
          fullName,
          email,
          username,
          phone,
          password: hashedPassword,
          role,
          image, // Full path (e.g., uploads/staff_images/1742593172716.jpeg)
          permissions: permissions || []
      });

      await newStaff.save();
      res.status(201).json({ success: true, message: 'Staff member created successfully', data: newStaff });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server error!', error: error.message });
  }
};

// Login staff
const loginStaff = async (req, res) => {
    const { username, password } = req.body;
  
    try {
        const staff = await Staff.findOne({ username });
        if (!staff) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        if (staff.status !== 'Active') {
          return res.status(403).json({ message: 'Access denied. User is inactive.' });
        }

        const token = jwt.sign({ 
          id: staff._id,
          fullName: staff.fullName,
          username: staff.username,
          email: staff.email,
          role: staff.role, 
          permissions: staff.permissions,
          image: staff.image,
          status: staff.status,
        }, JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error!' });
    }
};

// Get all staff members
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find(); // Fetch all staff members from the database
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching staff members', error: error.message });
  }
};

// Get a single staff member by ID
const getStaffById = async (req, res) => {
  try {
    const { staffId } = req.params;
    const staff = await Staff.findById(staffId);

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching staff member', error: error.message });
  }
};


// Update Staff 
const updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    let { fullName, email, username, phone, password, role, permissions, status } = req.body;

    // Validate staffId
    if (!mongoose.isValidObjectId(staffId)) {
      return res.status(400).json({ success: false, message: 'Invalid staff ID' });
    }

    // Find staff member
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    // Check for email uniqueness if email is being updated
    if (email && email !== staff.email) {
      const existingEmail = await Staff.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      // Validate email format
      if (!/^[\w\.-]+@[\w-]+(\.[\w-]+)*\.[\w-]{2,}$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
    }

    // Handle image upload
    const image = req.files?.image ? req.files.image[0].path : staff.image;

    // Validate role
    const validRoles = ['Admin', 'Auditor', 'Cs', 'Employee'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role provided' });
    }

    // Validate phone number
    if (phone && !/^[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format' });
    }

    // Parse permissions if it's a string
    if (typeof permissions === 'string') {
      try {
        permissions = JSON.parse(permissions);
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid permissions format: must be a valid JSON array' });
      }
    }

    // Validate permissions
    const validPermissions = [
      'Manage Staff',
      'Manage Projects',
      'Schedule Meetings',
      'Manage Contracts',
      'Manage Support Requests',
      'Manage Users',
      'Manage Web & App',
      'Manage Advertisements',
    ];
    if (permissions && (!Array.isArray(permissions) || permissions.some((p) => !validPermissions.includes(p)))) {
      return res.status(400).json({ success: false, message: 'Invalid permissions provided' });
    }

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    // Create update object
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email && email !== staff.email) updateData.email = email; // Only update if changed
    if (username) updateData.username = username;
    if (phone) updateData.phone = phone;
    if (password) updateData.password = password;
    if (role) updateData.role = role;
    if (permissions) updateData.permissions = permissions;
    if (status) updateData.status = status;
    if (image !== staff.image) updateData.image = image;

    // Update staff member
    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Staff data updated successfully', data: updatedStaff });
  } catch (error) {
    console.error('Update Staff Error:', error); // Log full error
    res.status(500).json({ success: false, message: 'Error updating staff data', error: error.message });
  }
};


// Step 1: Investor requests a meeting
const createMeeting = async (req, res) => {
  try {
    const { project_id, investor_id, entrepreneur_id } = req.body;

    // Validate required fields
    if (!project_id || !investor_id || !entrepreneur_id) {
      return res.status(400).json({ success: false, message: 'Project ID, Investor ID, and Entrepreneur ID are required' });
    }

    // Validate project_id
    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Validate investor_id
    const investor = await User.findById(investor_id);
    if (!investor || investor.role !== 'investor') {
      return res.status(404).json({ success: false, message: 'Valid investor not found' });
    }

    // Validate entrepreneur_id
    const entrepreneur = await User.findById(entrepreneur_id);
    if (!entrepreneur || entrepreneur.role !== 'entrepreneur') {
      return res.status(404).json({ success: false, message: 'Valid entrepreneur not found' });
    }

    // Check for existing meeting
    const existingMeeting = await Meeting.findOne({
      project_id,
      investor_id,
      entrepreneur_id,
      status: { $nin: ['Cancelled', 'Completed'] }
    });
    if (existingMeeting) {
      return res.status(400).json({ success: false, message: 'Meeting request already exists' });
    }

    // Create meeting
    const meeting = new Meeting({
      project_id,
      investor_id,
      entrepreneur_id,
      status: 'Requested',
      investor_selected_slots: [],
      available_slots: [],
    });

    await meeting.save();
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    console.error('Error creating meeting:', error.message);
    res.status(500).json({ success: false, message: 'Error creating meeting', error: error.message });
  }
};

// New endpoint: Get meetings for the logged-in investor
const getInvestorMeetings = async (req, res) => {
  try {
    const investor_id = req.user.id;

    const meetings = await Meeting.find({ investor_id })
      .populate('project_id')
      .populate('entrepreneur_id', 'fullName email');

    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching investor meetings', error: error.message });
  }
};

const cancelMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const investor_id = req.user.id;

    // Find the meeting
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    // Check if the investor is authorized to cancel this meeting
    if (meeting.investor_id.toString() !== investor_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this meeting' });
    }

    // Delete the meeting
    await Meeting.findByIdAndDelete(meetingId);
    res.status(200).json({ success: true, message: 'Meeting canceled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error canceling meeting', error: err.message });
  }
};

const getMeetingStatus = async (req, res) => {
  try {
    const { project_id, investor_id, entrepreneur_id } = req.params;

    if (!project_id || !investor_id || !entrepreneur_id) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    const meeting = await Meeting.findOne({
      project_id,
      investor_id,
      entrepreneur_id,
    });

    if (!meeting) {
      return res.status(200).json({ 
        exists: false,
        status: null,
        meetingId: null
      });
    }

    res.status(200).json({
      exists: true,
      status: meeting.status,
      meetingId: meeting._id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error checking meeting status' });
  }
};

// Step 2: Assign auditor and generate 3 random slots
const assignAuditor = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { auditor_id, slots } = req.body;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

    meeting.auditor_id = auditor_id;
    meeting.available_slots = slots;
    meeting.status = 'SlotsSentToInvestor';

    await meeting.save();
    res.status(200).json({ success: true, data: meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error assigning auditor', error: err.message });
  }
};

// Step 3: Investor selects 2 preferred slots
const investorSelectSlots = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { slots } = req.body; // slots contain day, time, and _id of the available slots

    // Ensure the slots array contains exactly two slots
    if (slots.length !== 2) {
      return res.status(400).json({ success: false, message: 'You must select exactly two slots' });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    // Ensure the slots sent in the request are part of the available slots
    const isValidSlots = slots.every(slot =>
      meeting.available_slots.some(
        availableSlot =>
          availableSlot._id.toString() === slot._id.toString() &&  // Ensure _id matches
          availableSlot.day === slot.day &&  // Ensure day matches
          availableSlot.time === slot.time // Ensure time matches
      )
    );

    // if (!isValidSlots) {
    //   return res.status(400).json({ success: false, message: 'One or more slots are invalid' });
    // }

    // Update the investor_selected_slots with the selected slots
    meeting.investor_selected_slots = slots;
    meeting.status = 'SlotsSelectedByInvestor';

    await meeting.save();
    res.status(200).json({ success: true, data: meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving investor slots', error: err.message });
  }
};

// Step 4: Entrepreneur confirms final slot
const entrepreneurConfirmSlot = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { slot } = req.body; // slot contains day, _id, and time of the selected slot

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

    // Validate that the selected slot is part of the investor's selected slots
    const isValidSlot = meeting.investor_selected_slots.some(
      s =>
        s._id.toString() === slot._id.toString() &&
        s.day === slot.day &&          // Validate day
        s.time === slot.time // Validate time
    );

    if (!isValidSlot) {
      return res.status(400).json({ success: false, message: 'Selected slot is not valid' });
    }

    // Set the final slot
    meeting.entrepreneur_final_slot = slot;

    // Calculate the scheduled_at date based on the selected day and time
    const dayMap = {
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3
    };
    const timeMap = {
      '09:00-11:00': '09:00',
      '12:00-14:00': '12:00'
    };

    const date = new Date();
    date.setDate(date.getDate() + (dayMap[slot.day] - date.getDay() + 7) % 7); // Get the correct upcoming day (Monday, Tuesday, or Wednesday)
    date.setHours(parseInt(timeMap[slot.time].split(':')[0]));
    date.setMinutes(parseInt(timeMap[slot.time].split(':')[1]));

    meeting.scheduled_at = date;
    meeting.status = 'Scheduled';

    await meeting.save();
    res.status(200).json({ success: true, data: meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving final slot', error: err.message });
  }
};

// Get all meetings
const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate('project_id', 'project_name')
      .populate('investor_id', 'fullName email')
      .populate('entrepreneur_id', 'fullName')
      .populate('auditor_id', 'fullName')
      .lean();

    // Transform data to handle missing references
    const transformedMeetings = meetings.map((meeting) => ({
      ...meeting,
      project_id: meeting.project_id?._id || meeting.project_id,
      project_name: meeting.project_id?.project_name || `Unknown Project-${String(meeting.project_id).slice(-6)}`,
      investor_id: meeting.investor_id?._id || meeting.investor_id,
      investor_name: meeting.investor_id?.fullName || `Unknown Investor-${String(meeting.investor_id).slice(-6)}`,
      investor_email: meeting.investor_id?.email || `unknown-${String(meeting.investor_id).slice(-6)}@example.com`,
      entrepreneur_id: meeting.entrepreneur_id?._id || meeting.entrepreneur_id,
      entrepreneur_name: meeting.entrepreneur_id?.fullName || `Unknown Entrepreneur-${String(meeting.entrepreneur_id).slice(-6)}`,
      auditor_id: meeting.auditor_id?._id || null,
      auditor_name: meeting.auditor_id?.fullName || 'No Auditor',
    }));

    res.status(200).json({ success: true, data: transformedMeetings });
  } catch (error) {
    console.error('Error fetching meetings:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching meetings', error: error.message });
  }
};

// Get a single meeting by ID
const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching meeting', error: error.message });
  }
};


const getUserByID = async (req, res) =>{
  try {
    const {id} = req.params;
    const user = await User.findById(id);

    if(!user){
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({success: true, data: user});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
  }
}


// Get all auditors
const getAllAuditors = async (req, res) => {
  try {
    const auditors = await Staff.find({ role: 'Auditor' }); // Fetch only staff with role 'Auditor'
    res.status(200).json({ success: true, data: auditors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching auditors', error: error.message });
  }
};

const { analyzeWithPython } = require('../python-API/pythonService');

const pythonService = async (req, res) => {
  try {
        const inputData = req.body;
        const result = await analyzeWithPython(inputData);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to analyze data' });
    }
};

module.exports = 
{ 
    createStaff,
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
};
