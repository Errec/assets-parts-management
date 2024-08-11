import React, { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';

const acceptedFileTypes: Accept = {
  'image/*': [], // Allow all image types
};

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  currentImage?: string | null; // Allow null as well
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, currentImage }) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setPreview(URL.createObjectURL(file));
    onImageUpload(file);
  }, [onImageUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes, 
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex items-center justify-center w-full h-56 cursor-pointer ${preview ? '' : 'flex-col'}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Uploaded" className="w-full h-full object-cover" />
      ) : (
        <>
          <img src="/src/assets/icons/image-box.svg" alt="Add" className="w-8 h-8 mb-2" />
          <p className="text-center text-blue-600 text-sm">Adicionar imagem do Ativo</p>
        </>
      )}
    </div>
  );
};

export default ImageUpload;
