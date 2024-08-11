import React, { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';

const acceptedFileTypes: Accept = {
  'image/*': [], // Allow all image types
};

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  currentImage?: string;
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
    accept: acceptedFileTypes, // Updated to use the correct type
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50 w-full h-56 cursor-pointer"
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Preview" className="object-contain max-h-full" />
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
