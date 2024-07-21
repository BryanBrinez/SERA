'use client';
import React from 'react';
import { Modal, Button, Form, TagPicker, InputPicker } from 'rsuite';
import { Input } from 'rsuite';

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
const rolData = ['Admin', 'Coordinador', 'Auxiliar', 'Profesor'].map(item => ({
    label: item,
    value: item
}));
const estado = ['Activo', 'Inactivo'].map(item => ({
    label: item,
    value: item
}));
const style = {

};
export const UserModal = ({ open, handleClose }) => {
    const [formValue, setFormValue] = React.useState({
        name: '',
        email: '',
        password: '',
        textarea: ''
    });

    return (
        <Modal open={open} onClose={handleClose} style={style}>
            <Modal.Header>
                <Modal.Title>Añadir usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex-grow'>
                <Form fluid onChange={setFormValue} formValue={formValue}>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="name-1">
                            <Form.ControlLabel>Codigo *</Form.ControlLabel>
                            <Form.Control name="codigo" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="cedula-1">
                            <Form.ControlLabel>Cedula *</Form.ControlLabel>
                            <Form.Control name="cedula" />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="name-1">
                            <Form.ControlLabel>Primer nombre *</Form.ControlLabel>
                            <Form.Control name="primerNombre" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="name-1">
                            <Form.ControlLabel>Segundo nombre</Form.ControlLabel>
                            <Form.Control name="segundoNombre" />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="name-1">
                            <Form.ControlLabel>Primer apellido *</Form.ControlLabel>
                            <Form.Control name="primerApellido" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="name-1">
                            <Form.ControlLabel>Segundo apellido</Form.ControlLabel>
                            <Form.Control name="segundoApellido" />
                        </Form.Group>
                    </div>

                    <Form.Group controlId="email-9">
                        <Form.ControlLabel>Celular *</Form.ControlLabel>
                        <Form.Control name="celular" />
                    </Form.Group>

                    <Form.Group controlId="email-9">
                        <Form.ControlLabel>Correo *</Form.ControlLabel>
                        <Form.Control name="correo" type="email" />
                    </Form.Group>
                   
                        <Form.Group className='min-w-full' controlId="tagPicker">
                            <Form.ControlLabel>Rol:</Form.ControlLabel>
                            <Form.Control placeholder='Seleccionar'  className='min-w-full' name="tagPicker" accepter={TagPicker} data={rolData} />
                        </Form.Group>
                        <Form.Group className='min-w-full' controlId="inputPicker">
                            <Form.ControlLabel>Estado:</Form.ControlLabel>
                            <Form.Control placeholder='Seleccionar' className='min-w-full 'name="inputPicker" accepter={InputPicker} data={estado} />
                        </Form.Group>
                    
                </Form>

                <Button className='w-full mt-5' onClick={handleClose} appearance="primary">
                    Confirmar
                </Button>

            </Modal.Body>

        </Modal>
    );
};
