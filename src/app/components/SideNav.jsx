import { Sidenav, Nav } from 'rsuite';
import { useRouter } from "next/navigation";
//import { GoHome } from "react-icons/go";

const styles = {
    backgroundColor: '#880909',
    color: 'white',
    transition: 'width 0.5s ease-in-out',
};

/*const iconMap = {
    home: GoHome,
    settings: GoSettings,
    user: GoPerson,
    project: GoProject,
    list: GoListOrdered,
    faUser: FaUser,
    faList: FaClipboardList,
};*/

export default function SideNav({ modules, appearance, openKeys, expanded, onOpenChange, onExpand }) {
    const router = useRouter();

    return (
        <Sidenav
            appearance={appearance}
            expanded={expanded}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            className='max-w-60 shadow-lg relative'
            style={styles}
        >
            <div onClick={onExpand} className="flex justify-center items-center cursor-pointer text-black w-8 h-8 rounded-full bg-white absolute right-[-15px] top-40 shadow z-10">
                X
            </div>
            <Sidenav.Header>
                <div className='w-full flex justify-center items-center pt-14 pb-14' style={{ backgroundColor: '#880909' }}>
                    <img src="./logo.png" alt="logo" className='w-28' />
                </div>
            </Sidenav.Header>
            <Sidenav.Body>
                <Nav>
                    {modules.map((module, index) => {
                       // const Icon = iconMap[module.icon]; // Dynamic icon assignment
                        return (
                            <Nav.Item
                                className='nav-item'
                                key={index}
                                eventKey={index.toString()}
                                //icon={Icon ? <Icon /> : <MagicIcon />} // Use the dynamically assigned icon or fallback to MagicIcon
                                style={{ backgroundColor: expanded ? '#880909' : 'inherit' }}
                                onClick={() => router.push(module.routePath)}
                            >
                                {module.routeName}
                            </Nav.Item>
                        );
                    })}
                </Nav>
            </Sidenav.Body>
        </Sidenav>
    );
}
