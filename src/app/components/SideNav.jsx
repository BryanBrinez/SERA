import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';


const panelStyles = {
    padding: '15px 20px',
    color: '#aaa',
    background: 'transparent',
};

const headerStyles = {
    padding: 20,
    fontSize: 16,
    background: 'transparent',
    color: ' #fff'
};
const styles = {
    backgroundColor: '#880909',
}

const menuStyles = { 
    background: 'transparent',
};

export default function SideNav({ modules, appearance, openKeys, expanded, onOpenChange, onExpand, ...navProps}) {
    return (
        <Sidenav
            appearance={appearance}
            expanded={expanded}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            className='max-w-60'
            style={styles}
        >
            <Sidenav.Header>
                <div className='w-full flex justify-center items-center py-16 bg-[#880909]'>
                <img src="./logo.png" alt="logo" className='w-1/3   ' />
                </div>
                
            </Sidenav.Header>
            <Sidenav.Body>
                <Nav {...navProps}>

                    {modules.map((module) => (
                        <Nav.Item style={menuStyles} key={module.key} eventKey={module.key} icon={<MagicIcon />}>
                            {module.routeName}
                        </Nav.Item>
                    ))
                    }
                </Nav>
            </Sidenav.Body>
            <Sidenav.Toggle style={menuStyles} onToggle={onExpand} />
        </Sidenav>

    );
}