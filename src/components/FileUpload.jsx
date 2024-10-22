import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Check } from 'lucide-react';

const FileUpload = ({ onFileUpload }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== acceptedFiles.length) {
      setError('Solo se permiten archivos PDF. Algunos archivos fueron ignorados.');
    } else {
      setError(null);
    }
    setFiles(prevFiles => [...prevFiles, ...pdfFiles.map(file => ({ file, status: 'pending' }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {'application/pdf': ['.pdf']},
    multiple: true
  });

  const removeFile = (fileToRemove) => {
    setFiles(files => files.filter(f => f.file !== fileToRemove));
  };

  const uploadFiles = async () => {
    for (let fileObj of files) {
      if (fileObj.status === 'pending') {
        try {
          await onFileUpload([fileObj.file]);
          setFiles(prevFiles => 
            prevFiles.map(f => 
              f.file === fileObj.file ? { ...f, status: 'uploaded' } : f
            )
          );
          setUploadedFiles(prev => [...prev, fileObj.file.name]);
        } catch (error) {
          setFiles(prevFiles => 
            prevFiles.map(f => 
              f.file === fileObj.file ? { ...f, status: 'error' } : f
            )
          );
          setError(`Error al subir ${fileObj.file.name}. Por favor, intente de nuevo.`);
        }
      }
    }
    setTimeout(() => {
      setFiles(prevFiles => prevFiles.filter(f => f.status !== 'uploaded'));
    }, 2000);
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300 hover:border-cyan-500'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Suelta los archivos PDF aquí...'
            : 'Arrastra y suelta archivos PDF aquí, o haz clic para seleccionar'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          (Solo se aceptan archivos PDF)
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {files.map((fileObj) => (
              <li key={fileObj.file.name} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-cyan-500 mr-2" />
                  <span className="text-sm truncate">{fileObj.file.name}</span>
                </div>
                {fileObj.status === 'uploaded' ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <button onClick={() => removeFile(fileObj.file)} className="text-red-500 hover:text-red-700">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button 
            onClick={uploadFiles}
            className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition-colors"
          >
            Subir Archivos
          </button>
        </div>
      )}
      
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-green-600">Archivos subidos exitosamente:</h3>
          <ul className="list-disc list-inside">
            {uploadedFiles.map((fileName, index) => (
              <li key={index} className="text-sm text-gray-600">{fileName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;