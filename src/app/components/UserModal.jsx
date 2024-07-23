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


export const UserModal = ({ open, handleClose, onConfirm }) => {
    const [formValue, setFormValue] = React.useState({
        codigo: '',
        cedula: '',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        celular: '',
        correo: '',
        password: '',  // Añadir el campo password
        rol: [],
        estado: '',
        programa_asignado: '',  // Campo opcional
        sede: ''  // Campo opcional
    });

    const handleSubmit = () => {
        console.log("Form Values: ", formValue); // Registrar los datos del formulario
        onConfirm(formValue);
    };

    return (
        <Modal open={open} onClose={handleClose} >
            <Modal.Header >
                <Modal.Title>Añadir usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex-grow'>
                <Form fluid onChange={setFormValue} formValue={formValue}>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="codigo">
                            <Form.ControlLabel>Codigo *</Form.ControlLabel>
                            <Form.Control name="codigo" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="cedula">
                            <Form.ControlLabel>Cedula *</Form.ControlLabel>
                            <Form.Control name="cedula" />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="primerNombre">
                            <Form.ControlLabel>Primer nombre *</Form.ControlLabel>
                            <Form.Control name="primerNombre" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="segundoNombre">
                            <Form.ControlLabel>Segundo nombre</Form.ControlLabel>
                            <Form.Control name="segundoNombre" />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="primerApellido">
                            <Form.ControlLabel>Primer apellido *</Form.ControlLabel>
                            <Form.Control name="primerApellido" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="segundoApellido">
                            <Form.ControlLabel>Segundo apellido</Form.ControlLabel>
                            <Form.Control name="segundoApellido" />
                        </Form.Group>
                    </div>
                    <Form.Group controlId="celular">
                        <Form.ControlLabel>Celular *</Form.ControlLabel>
                        <Form.Control name="celular" />
                    </Form.Group>
                    <Form.Group controlId="correo">
                        <Form.ControlLabel>Correo *</Form.ControlLabel>
                        <Form.Control name="correo" type="email" />
                    </Form.Group>
                    <Form.Group controlId="password"> {/* Añadir el campo password */}
                        <Form.ControlLabel>Contraseña *</Form.ControlLabel>
                        <Form.Control name="password" type="password" />
                    </Form.Group>
                    <Form.Group className='min-w-full' controlId="rol">
                        <Form.ControlLabel>Rol:</Form.ControlLabel>
                        <Form.Control placeholder='Seleccionar' className='min-w-full' name="rol" accepter={TagPicker} data={rolData} />
                    </Form.Group>
                    <Form.Group className='min-w-full' controlId="estado">
                        <Form.ControlLabel>Estado:</Form.ControlLabel>
                        <Form.Control placeholder='Seleccionar' className='min-w-full' name="estado" accepter={InputPicker} data={estado} />
                    </Form.Group>
                    
                    <div className='flex gap-2'>
                    <Form.Group className='w-1/2' controlId="programa_asignado">
                        <Form.ControlLabel>Programa Asignado</Form.ControlLabel>
                        <Form.Control name="programa_asignado" />
                    </Form.Group>
                    <Form.Group className='w-1/2' controlId="sede">
                        <Form.ControlLabel>Sede</Form.ControlLabel>
                        <Form.Control name="sede" />
                    </Form.Group>
                    </div>
                </Form>
                <Button className='w-full' onClick={handleSubmit} appearance="primary">
                    Confirmar
                </Button>
            </Modal.Body>
        </Modal>
    );
};
