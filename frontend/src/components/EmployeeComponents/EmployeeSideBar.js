import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../Common/Logo";
import LogoImage from "../../assets/idea.png";
import {
  UsersRound,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  FileStack,
  Presentation,
  BookUser,
  Inbox,
  MonitorSmartphoneIcon,
  Megaphone,
  Menu,
} from "lucide-react";
import { useFunctions } from '../../useFunctions';
import { Tooltip } from 'flowbite-react';

function EmployeeSideBar() {
  const [isExpanded, setExpanded] = useState(false);
  const toggleSidebar = () => setExpanded(!isExpanded);
  const { signOutDistroySession } = useFunctions();
  const location = useLocation();
    const [loading, setLoading] = useState(false); // Add this
  const [error, setError] = useState(null);      // Add this

  const menuItems = [
    { path: "/employee-portal/", label: "Dashboard", icon: <LayoutGrid className="w-6 h-6" /> },
    { path: "/employee-portal/manageStaff", label: "Manage Staff", icon: <UsersRound className="w-6 h-6" /> },
    { path: "/employee-portal/manageProject", label: "Projects", icon: <FileStack className="w-6 h-6" /> },
    { path: "/employee-portal/manageMeetingRequest", label: "Meeting Requests", icon: <Presentation className="w-6 h-6" /> },
    { path: "/employee-portal/manageContractRequest", label: "Contract Requests", icon: <BookUser className="w-6 h-6" /> },
    { path: "/employee-portal/manageMessages", label: "Messages", icon: <Inbox className="w-6 h-6" /> },
    { path: "/employee-portal/manageUsers", label: "Users", icon: <UsersRound className="w-6 h-6" /> },
  ];

  const moreItems = [
    { path: "/employee-portal/manageMobileWeb", label: "Mobile App & Website", icon: <MonitorSmartphoneIcon className="w-6 h-6" /> },
    { path: "/employee-portal/manageAd", label: "Manage Advertisements", icon: <Megaphone className="w-6 h-6" /> },
  ];

  return (
    <motion.div
      className={`bg-white flex flex-col fixed top-0 left-0 h-[96vh] z-20 sm:static sm:z-auto ${
        isExpanded ? "w-64" : "w-20"
      } transition-all duration-300 sm:${isExpanded ? "w-64" : "w-20"} `}
      initial={{ width: isExpanded ? 256 : 80 }}
      animate={{ width: isExpanded ? 256 : 80 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {isExpanded ? <Logo /> : <img src={LogoImage} alt="logo" className="w-10 h-10" />}
        <button onClick={toggleSidebar} className="text-[#024059] sm:hidden">
          {isExpanded ? <ChevronsLeft className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <button onClick={toggleSidebar} className="text-[#024059] hidden sm:block">
          {isExpanded ? <ChevronsLeft className="w-6 h-6" /> : <ChevronsRight className="w-6 h-6" />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {menuItems.map((item) => (
          <Tooltip key={item.path} content={isExpanded ? "" : item.label} placement="right">
            <Link
              to={item.path}
              className={`flex items-center p-3 my-1 transition-colors duration-200 rounded-md ${
                location.pathname === item.path
                  ? "bg-[#377E9A] text-white border-l-4 border-[#024059]"
                  : "text-[#024059] hover:bg-[#377E9A] hover:text-white border-l-4 border-transparent"
              }`}
            >
              {item.icon}
              {isExpanded && <span className="ml-4">{item.label}</span>}
            </Link>
          </Tooltip>
        ))}
        <hr className="my-4 border-gray-200" />
        <span className={`px-4 text-sm text-[#024059] ${isExpanded ? "block" : "hidden"}`}>More</span>
        {moreItems.map((item) => (
          <Tooltip key={item.path} content={isExpanded ? "" : item.label} placement="right">
            <Link
              to={item.path}
              className={`flex items-center p-3 my-1 transition-colors duration-200 rounded-md ${
                location.pathname === item.path
                  ? "bg-[#377E9A] text-white border-l-4 border-[#024059]"
                  : "text-[#024059] hover:bg-[#377E9A] hover:text-white border-l-4 border-transparent"
              }`}
            >
              {item.icon}
              {isExpanded && <span className="ml-4">{item.label}</span>}
            </Link>
          </Tooltip>
        ))}
        <Tooltip content={isExpanded ? "" : "Logout"} placement="right">
          <Link
            onClick={() => signOutDistroySession(setLoading, setError)}
            className={`flex items-center p-3 my-1 transition-colors duration-200 rounded-md ${
              location.pathname === "/logout"
                ? "bg-[#377E9A] text-white border-l-4 border-[#024059]"
                : "text-red-500 hover:bg-[#377E9A] hover:text-white border-l-4 border-transparent"
            }`}
          >
            <LogOut className="w-6 h-6" />
            {isExpanded && <span className="ml-4">Logout</span>}
          </Link>
        </Tooltip>
      </nav>
    </motion.div>
  );
}

export default EmployeeSideBar;