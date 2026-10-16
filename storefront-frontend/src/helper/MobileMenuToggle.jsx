"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";

const MobileMenuToggle = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button
        type='button'
        className='sidebar-mobile-toggle'
        onClick={toggleSidebar}
      >
        <Icon icon='heroicons:bars-3-solid' className='icon'></Icon>
      </button>

      <div className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        
      </div>

      <div className={isSidebarOpen ? "overlay-active" : ""}>
       
      </div>
    </>
  );
};

export default MobileMenuToggle;
