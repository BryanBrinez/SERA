'use client';
import React, { useState } from 'react';
import { Modal, Button, Form , InputPicker} from 'rsuite';
import SelectUser from '../../atoms/input/SelectUser.jsx'; 
import SelectProgram from '@/app/atoms/input/SelectProgram.jsx';
import SelectTagCourse from '@/app/atoms/input/SelectTagCourse.jsx';

const estado = ['Activo', 'Inactivo'].map(item => ({
    label: item,
    value: item
}));

const jornada = ['Diurna', 'Nocturna'].map(item => ({
    label: item,
    value: item
}));

const validable = ['Si', 'No'].map(item => ({
    label: item,
    value: item
}));
const habilitable = ['Si', 'No'].map(item => ({
    label: item,
    value: item
}));


export const CourseModal = ({ open, handleClose, onConfirm }) => {
    const [formValue, setFormValue] = useState({
        codigo: '',
        nombre_curso: '',
        estado: '',
        Profesor: '',
        codigo_programa: '',
        creditos: '',
        grupo: '',
        jornada: '',
        intensidad_horaria: '',
        habilitable: '',
        validable: '',
        prerrequisitos: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            // Convertir `creditos`, `grupo` y `intensidad_horaria` a números si no están vacíos
            const updatedFormValue = {
                ...formValue,
                creditos: formValue.creditos ? Number(formValue.creditos) : '',
                grupo: formValue.grupo ? Number(formValue.grupo) : '',
                intensidad_horaria: formValue.intensidad_horaria ? Number(formValue.intensidad_horaria) : ''
            };

            await onConfirm(updatedFormValue);
            setLoading(false);
            setFormValue({
                codigo: '',
                nombre_curso: '',
                estado: '',
                Profesor: '',
                codigo_programa: '',
                creditos: '',
                grupo: '',
                jornada: '',
                intensidad_horaria: '',
                habilitable: '',
                validable: '',
                prerrequisitos: []
            });
            handleClose();
        } catch (err) {
            setLoading(false);
            setError('Error al crear el curso');
        }
    };

    const handleProfesorChange = (value) => {
        setFormValue(prev => ({ ...prev, Profesor: value }));
    };
    const handleProgramChange = (value) => {
        setFormValue(prev => ({ ...prev, codigo_programa: value }));
    };
    const handleCourseChange = (value) => {
        setFormValue(prev => ({ ...prev, prerrequisitos: value }));
    };
    

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'flex', flexDirection: 'center', alignItems: 'center' }}>
            <Modal.Header>
                <Modal.Title>Añadir curso</Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex-grow w-[600px]'>
                <Form fluid onChange={setFormValue} formValue={formValue}>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="codigo">
                            <Form.ControlLabel>Código del Curso *</Form.ControlLabel>
                            <Form.Control name="codigo" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="nombre_curso">
                            <Form.ControlLabel>Nombre del Curso *</Form.ControlLabel>
                            <Form.Control name="nombre_curso" />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="estado">
                            <Form.ControlLabel>Estado *</Form.ControlLabel>
                            <Form.Control placeholder='Seleccionar' className='min-w-full' name="estado" accepter={InputPicker} data={estado} />

                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="jornada">
                            <Form.ControlLabel>Jornada *</Form.ControlLabel>
                            <Form.Control placeholder='Seleccionar' className='min-w-full' name="jornada" accepter={InputPicker} data={jornada} />

                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="codigo_programa">
                            <Form.ControlLabel>Programa *</Form.ControlLabel>
                            {/* <Form.Control name="codigo_programa" /> */}
                            <SelectProgram onChange={handleProgramChange}/>
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="grupo">
                            <Form.ControlLabel>Grupo *</Form.ControlLabel>
                            <Form.Control name="grupo" type='number' />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="creditos">
                            <Form.ControlLabel>Créditos *</Form.ControlLabel>
                            <Form.Control name="creditos" type='number' />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="intensidad_horaria">
                            <Form.ControlLabel>Intensidad Horaria (Horas) *</Form.ControlLabel>
                            <Form.Control name="intensidad_horaria" type='number' />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="habilitable">
                            <Form.ControlLabel>Habilitable *</Form.ControlLabel>
                            <Form.Control placeholder='Seleccionar' className='min-w-full' name="habilitable" accepter={InputPicker} data={habilitable} />

                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="validable">
                            <Form.ControlLabel>Validable *</Form.ControlLabel>
                            <Form.Control placeholder='Seleccionar' className='min-w-full' name="validable" accepter={InputPicker} data={validable} />

                        </Form.Group>
                    </div>
                    <Form.Group controlId="prerrequisitos">
                        <Form.ControlLabel>Prerrequisitos</Form.ControlLabel>
                        <SelectTagCourse onChange={handleCourseChange}/>
                    </Form.Group>

                    <Form.Group controlId="Profesor">
                        <Form.ControlLabel>Profesor *</Form.ControlLabel>
                        <SelectUser onChange={handleProfesorChange} rol='Profesor' />
                    </Form.Group>
                </Form>
                <br />
                <Button className='w-full' onClick={handleSubmit} appearance="primary" loading={loading}>
                    Confirmar
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default CourseModal;
