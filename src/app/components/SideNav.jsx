import { Sidenav, Nav } from 'rsuite';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import { useRouter } from "next/navigation";

const styles = {
    backgroundColor: '#880909',
    color: 'white',
    transition: 'width 0.5s ease-in-out', // Smooth and linear transition for expanding/collapsing
};

export default function SideNav({ modules, appearance, openKeys, expanded, onOpenChange, onExpand}) {
    const router = useRouter();
    return (
        <Sidenav
            appearance={appearance}
            expanded={expanded}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            className='max-w-60 shadow-2xl'
            style={styles}
        >
            <Sidenav.Header>
                <div className='w-full flex justify-center items-center pt-10 pb-10' style={{ backgroundColor: '#880909' }}>
                    <img src="./logo.png" alt="logo" className='w-14' />
                </div>
            </Sidenav.Header>
            <Sidenav.Body >
                <Nav >
                    {modules.map((module, index) => (
                        <Nav.Item 
                            className='nav-item' 
                            key={index} 
                            eventKey={index.toString()} 
                            icon={<MagicIcon />}
                            style={styles}
                            onClick={() => router.push(module.routePath)}
                        >
                            {module.routeName}
                        </Nav.Item>
                    ))}
                </Nav>
            </Sidenav.Body>
            <Sidenav.Toggle style={{ background: 'transparent', color: 'white' }} onToggle={onExpand} />
        </Sidenav>
    );
}
