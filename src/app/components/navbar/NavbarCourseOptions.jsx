import { Nav } from 'rsuite';
import React, { useState } from 'react';

const Navbar = ({ active, onSelect, ...props }) => {
  return (
    <Nav {...props} activeKey={active} onSelect={onSelect} style={{ marginBottom: 50 }}>
      <Nav.Item eventKey="notas">Notas</Nav.Item>
      <Nav.Item eventKey="evidencias">Evidencias</Nav.Item>
      <Nav.Item eventKey="informes">Informes</Nav.Item>
    </Nav>
  );
};

export default function NavbarUserOptions({ active, setActive }) {
  return (
    <div className='pt-10'>
      <Navbar appearance="subtle" reversed active={active} onSelect={setActive} />
    </div>
  );
}
