"use client";
import "rsuite/dist/rsuite.min.css";
import { SessionProvider } from "next-auth/react";
import SideNav from "../components/SideNav.jsx";
import HeadSide from "../components/HeadSide.jsx";
import React, { useEffect } from "react";
import { MODULES } from "../lib/modules.jsx";

export default function RootLayout({ children }) {
  const [activeKey, setActiveKey] = React.useState('1');
  const [openKeys, setOpenKeys] = React.useState(['3', '4']);
  const [expanded, setExpand] = React.useState(true);
  const [selectedModule, setSelectedModule] = React.useState(null);

  const rol = "admin";

  useEffect(() => {
    const module = MODULES.find(module => module.Rol === rol);
    if (module) {
      const routes = module.Routes;
      setSelectedModule(routes);
    } else {
      console.log('No module found for role:', rol);
    }
  }, [rol]);

  return (
    <SessionProvider>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <SideNav
          activeKey={activeKey}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          onSelect={setActiveKey}
          expanded={expanded}
          onExpand={setExpand}
          appearance="subtle"
          modules={selectedModule || MODULES}
        />
        <div className="flex-col flex-grow px-24 md:overflow-y-auto ">
          <HeadSide />
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
