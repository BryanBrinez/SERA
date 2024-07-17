import React from 'react';
import { Input, InputGroup } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { useState } from 'react';

const styles = {

};

export default function PasswordInput({ value, onChange }) {
  const [visible, setVisible] = useState(false);

  const handleChange = () => {
    setVisible(!visible);
  };

  return (
    <InputGroup inside style={styles}>
      <Input type={visible ? 'text' : 'password'} value={value} onChange={onChange} />
      <InputGroup.Button onClick={handleChange}>
        {visible ? <EyeIcon /> : <EyeSlashIcon />}
      </InputGroup.Button>
    </InputGroup>
  );
}
