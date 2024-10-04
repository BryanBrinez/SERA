import { Sidenav, Nav } from 'rsuite';
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { IoHomeSharp, IoPeopleSharp, IoLayersSharp, IoSchool, IoShapesSharp, IoSettings, IoLogOutSharp, IoSad } from "react-icons/io5";
import { MODULES } from "../../lib/modules.jsx";
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
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Obtén la ruta actual
  const currentPath = router.asPath;

  useEffect(() => {
    if (status === "authenticated" && session?.user?.rol) {
      // Encuentra los módulos que coincidan con cualquiera de los roles
      const modul = MODULES.filter(module => session.user.rol.includes(module.Rol));
      
      if (modul.length > 0) {
        // Combina las rutas de todos los módulos encontrados
        const routes = modul.reduce((acc, curr) => acc.concat(curr.Routes), []);
  
        // Elimina rutas duplicadas basadas en el routePath usando un Set
        const uniqueRoutes = routes.filter((route, index, self) => 
          index === self.findIndex(r => r.routePath === route.routePath)
        );
  
        setSelectedModule(uniqueRoutes);
        console.log(uniqueRoutes);
      } else {
        console.log('No module found for roles:', session.user.rol);
      }
    }
  }, [session, status]);

  // Verifica si la ruta actual coincide con la ruta del módulo
  const isActive = (routePath) => currentPath === routePath;

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
            const isActiveItem = isActive(module.routePath); // Verifica si el ítem es el activo
            const isHovered = hoveredIndex === index; // Verifica si el ítem está en hover
            return (
              <Nav.Item
                key={index}
                eventKey={index.toString()}
                style={itemStyle(isHovered, isActiveItem)} // Aplica estilo de hover o activo
                onClick={() => router.push(module.routePath)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {Icon && <Icon />}
                <span>{module.routeName}</span>
              </Nav.Item>
            );
          })}
        </Nav>
      </Sidenav.Body>
      <Nav className='flex flex-grow items-end'>
        <Nav.Item
          key="logout"
          eventKey="logout"
          style={itemStyle(hoveredIndex === 'logout', currentPath === '/logout')} // Aplica estilo de hover o activo
          onClick={signOut}
          onMouseEnter={() => setHoveredIndex('logout')}
          onMouseLeave={() => setHoveredIndex(null)}
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
  transition: 'width 0.1s ease-in-out',
};

const itemStyle = (isHovered, isActive) => ({
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  backgroundColor: isActive ? '#a00a0a' : (isHovered ? '#750a0a' : 'transparent'), // Cambia el color de fondo en hover o activo
  transition: 'background-color 0.1s ease'
});
