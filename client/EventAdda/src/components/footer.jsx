import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const Footer = () => {

    return (
        <footer className="mt-auto pt-16 pb-8 border-t border-gray-200 text-center bg-blue-950">
                      <div className="flex justify-center items-center gap-2 mb-4">
                          <FaTicketAlt className="text-gray-500 text-2xl" />
                          <span className="text-xl font-bold text-gray-50">EventAdda</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                          The simplest, most dynamic way to manage, discover, and host world-class events in your local city. Let's make memories together.
                      </p>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                          &copy; {new Date().getFullYear()} EventAdda Platform. All rights reserved.
                      </div>
                  </footer>
    );
};

export default Footer;