"use client";
import "rsuite/dist/rsuite.min.css";
import { SessionProvider } from "next-auth/react";
import SideNav from "../components/SideNav.jsx";
import HeadSide from "../components/HeadSide.jsx";
import React, { useEffect, useState } from "react";


export default function RootLayout({ children }) {
  const [activeKey, setActiveKey] = useState('1');
  const [openKeys, setOpenKeys] = useState(['3', '4']);
  const [expanded, setExpand] = useState(true);
  

  const handleExpand = () => {
    setExpand(!expanded);
  };

  return (
    <SessionProvider>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <SideNav
          activeKey={activeKey}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          onSelect={setActiveKey}
          expanded={expanded}
          onExpand={handleExpand}
          appearance="subtle"        
        />
        <div className="flex-col flex-grow px-6 md:px-14 md:pt-5 md:overflow-y-auto">
          <HeadSide />
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
