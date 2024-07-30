import { Sidenav, Nav } from 'rsuite';
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { IoHomeSharp, IoPeopleSharp, IoLayersSharp, IoExtensionPuzzle, IoSchool, IoShapesSharp, IoSettings, IoLogOutSharp, IoHelpCircleSharp, IoSad } from "react-icons/io5";
import { MODULES } from "../lib/modules.jsx";
import { useEffect, useState } from "react";

const iconMap = {
  home: IoHomeSharp,
  user: IoPeopleSharp,
  program: IoLayersSharp,
  curso: IoSchool,
  result: IoShapesSharp,
  help: IoSad,
  settings: IoSettings,
};

export default function SideNav({ modules, appearance, openKeys, expanded, onOpenChange, onExpand }) {
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.rol) {
      // Encuentra los módulos que coincidan con cualquiera de los roles
      const modul = MODULES.filter(module => session.user.rol.includes(module.Rol));
      if (modul.length > 0) {
        // Combina las rutas de todos los módulos encontrados
        const routes = modul.reduce((acc, curr) => acc.concat(curr.Routes), []);
        setSelectedModule(routes);
      } else {
        console.log('No module found for roles:', session.user.rol);
      }
    }
  }, [session, status]);

  return (
    <Sidenav
      appearance={appearance}
      expanded={expanded}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      className='max-w-64 shadow-lg relative'
      style={styles}
    >
      <Sidenav.Header>
        <div className='w-full flex justify-center items-center pt-14 pb-14' style={{ backgroundColor: '#880909' }}>
          <img src="/logo.png" alt="logo" className='w-28' />
        </div>
      </Sidenav.Header>
      <Sidenav.Body>
        <Nav>
          {selectedModule.map((module, index) => {
            const Icon = iconMap[module.icon];
            return (
              <Nav.Item
                key={index}
                eventKey={index.toString()}
                style={itemStyle}
                onClick={() => router.push(module.routePath)}
              >
                {Icon && <Icon />}
                <span>{module.routeName}</span>
              </Nav.Item>
            );
          })}
        </Nav>
      </Sidenav.Body>
      <Nav className='flex flex-grow items-end '>
        <Nav.Item
          key="logout"
          eventKey="logout"
          style={itemStyle}
          onClick={signOut}
        >
          <IoLogOutSharp />
          <span>Cerrar sesión</span>
        </Nav.Item>
      </Nav>
    </Sidenav>
  );
}

const styles = {
  backgroundColor: '#880909',
  color: 'white',
  transition: 'width 0.5s ease-in-out',
};

const itemStyle = {
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
};
