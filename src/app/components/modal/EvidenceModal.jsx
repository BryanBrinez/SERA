'use client';
import React, { useState } from 'react';
import { Modal, Button, Form, Uploader } from 'rsuite';
import { storage } from '../../api/firebase/config'; // Asegúrate de la ruta correcta
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const EvidenceModal = ({ open, handleClose, onConfirm, profesorCode, group, course }) => {
    const [formValue, setFormValue] = useState({
        nombre_evidencia: '',
        descripcion: '',
        codigo_curso: course,
        grupo: group,
        codigo_profesor: profesorCode
    });

    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        console.log('File List:', fileList); // Log para verificar el contenido de fileList

        try {
            const uploadPromises = fileList.map(async (file) => {
                const storageRef = ref(storage, `evidencias/${course}/${group}/${file.name}`);
                
                // Subir el archivo y obtener la URL
                await uploadBytes(storageRef, file.blobFile); // Cambiar a file.blobFile para obtener el archivo real
                const url = await getDownloadURL(storageRef);
                
                // Devolver un objeto con el nombre del archivo y la URL
                return {
                    url: url,
                    archivo_nombre: file.name // Aquí guardamos el nombre del archivo
                };
            });

            // Esperar a que todas las cargas terminen
            const archivos = await Promise.all(uploadPromises);
            await onConfirm({ ...formValue, archivos });

            setLoading(false);
            setFormValue({
                nombre_evidencia: '',
                descripcion: '',
                codigo_curso: course,
                grupo: group,
                codigo_profesor: profesorCode,
            });
            setFileList([]);
            handleClose();
        } catch (err) {
            console.error('Error:', err); // Log para mostrar el error
            setLoading(false);
            setError('Error al registrar la evidencia');
        }
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'flex', flexDirection: 'center', alignItems: 'center' }}>
            <Modal.Header>
                <Modal.Title>Añadir Evidencia</Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex-grow w-[600px]'>
                <Form fluid onChange={setFormValue} formValue={formValue}>
                    <Form.Group controlId="nombre_evidencia">
                        <Form.ControlLabel>Nombre</Form.ControlLabel>
                        <Form.Control name="nombre_evidencia" />
                    </Form.Group>
                    <Form.Group controlId="descripcion">
                        <Form.ControlLabel>Descripción</Form.ControlLabel>
                        <Form.Control name="descripcion" />
                    </Form.Group>
                    <Form.Group controlId="archivos">
                        <Form.ControlLabel>Archivos Adjuntos</Form.ControlLabel>
                        <Uploader
                            listType="picture-text"
                            fileList={fileList} // Usa `fileList` en lugar de `defaultFileList`
                            action="" // Esto puede estar vacío ya que el manejo de carga está en `handleSubmit`
                            onChange={(newFileList) => setFileList(newFileList)} // Asegúrate de que esto esté correcto
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png,.jpeg,.gif,.csv" // Tipos de archivos permitidos
                        >
                            <Button>Select files...</Button>
                        </Uploader>
                    </Form.Group>
                </Form>
                <br />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <Button style={styles} className='w-full' onClick={handleSubmit} appearance="primary" loading={loading}>
                    Confirmar
                </Button>
            </Modal.Body>
        </Modal>
    );
};

const styles = {
    backgroundColor: '#c62120',
    color: 'white',
    transition: 'width 0.1s ease-in-out',
    fontWeight: 'bold',
};

export default EvidenceModal;
