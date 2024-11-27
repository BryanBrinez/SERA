'use client';
import React, { useState } from 'react';
import { Modal, Button, Notification, Uploader, useToaster } from 'rsuite';
import { storage } from '../../api/firebase/config'; // Asegúrate de la ruta correcta
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const CertificateModal = ({ open, handleClose, onConfirm, cedula }) => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const toaster = useToaster();

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

    const handleSubmit = async () => {
        if (fileList.length === 0) {
            toaster.push(
                <Notification type="error" header="Error" closable>
                    Por favor, seleccione un archivo para subir.
                </Notification>,
                { placement: 'topEnd' }
            );
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const uploadPromises = fileList.map(async (file) => {
                // Verifica el tamaño del archivo antes de subirlo
                if (file.blobFile.size > MAX_FILE_SIZE) {
                    toaster.push(
                        <Notification type="error" header="Error" closable>
                            El archivo es demasiado grande. Máximo permitido: 50 MB.
                        </Notification>,
                        { placement: 'topEnd' }
                    );
                    return;
                }

                // Crear referencia en Firebase Storage
                 // Formato YYYY-MM-DDTHH-MM-SS
                const storageRef = ref(storage, `certificados/${cedula}/${file.name}`);

                // Subir el archivo
                await uploadBytes(storageRef, file.blobFile); // Usar file.blobFile para el archivo real
                const url = await getDownloadURL(storageRef); // Obtener la URL de descarga del archivo

                return { url, archivo_nombre: file.name }; // Devolver un objeto con la URL y nombre del archivo
            });

            const archivos = await Promise.all(uploadPromises);

            // Llamar a onConfirm con la lista de archivos subidos
            await onConfirm(archivos);

            setLoading(false);
            setFileList([]);
            handleClose();

            toaster.push(
                <Notification type="success" header="Certificado subido" closable>
                    El certificado ha sido subido con éxito.
                </Notification>,
                { placement: 'topEnd' }
            );
        } catch (err) {
            console.error('Error:', err);
            setLoading(false);
            setError('Error al subir el archivo');
            toaster.push(
                <Notification type="error" header="Error" closable>
                    Hubo un problema al subir el archivo. Inténtelo de nuevo.
                </Notification>,
                { placement: 'topEnd' }
            );
        }
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'flex', flexDirection: 'center', alignItems: 'center' }}>
            <Modal.Header>
                <Modal.Title>Subir Certificado</Modal.Title>
            </Modal.Header>
            <Modal.Body className="flex-grow w-[600px]">
                <Uploader
                    listType="picture-text"
                    fileList={fileList}
                    action="" // Sin URL de acción, porque manejamos el archivo localmente
                    onChange={setFileList} // Actualiza fileList con los archivos seleccionados
                    accept="application/pdf" // Solo permitir archivos PDF
                >
                    <Button>Seleccionar archivo</Button>
                </Uploader>

                {fileList.length > 0 && (
                    <div>
                        <p>Archivo seleccionado: {fileList[0].name}</p>
                    </div>
                )}

                {error && <div style={{ color: 'red' }}>{error}</div>}

                <Button style={styles} className="w-full" onClick={handleSubmit} appearance="primary" loading={loading}>
                    Subir
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

export default CertificateModal;
