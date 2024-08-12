import React, { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';

const acceptedFileTypes: Accept = {
  'image/*': [], // Allow all image types
};

type ImageUploadProps = {
  onImageUpload: (file: File) => void;
  currentImage?: string | null; // Allow null as well
};

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, currentImage }) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setLoading(true);
    setError(null);

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageUpload(file);
        setLoading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Invalid file type. Please upload an image.');
      setLoading(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: false,
  });

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload(new File([], "")); // Reset file
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex items-center justify-center w-full h-56 cursor-pointer ${preview ? '' : 'flex-col border border-dashed border-tractian-blue-200 rounded-lg bg-tractian-blue-50 bg-opacity-30'} mb-4`}
      >
        <input {...getInputProps()} aria-label="Image upload input" />
        {loading ? (
          <p className="text-center text-tractian-blue-200 text-sm">Loading...</p>
        ) : preview ? (
          <div className="relative w-full h-full">
            <img onClick={handleRemoveImage} src={preview} alt="Uploaded" className="w-full h-full object-cover" />
          </div>
        ) : (
          <>
            <img src="/src/assets/icons/image-box.svg" alt="Add" className="w-8 h-8 mb-2" />
            <p className="text-center text-tractian-blue-200 text-sm">Adicionar imagem do Ativo</p>
          </>
        )}
      </div>
      {error && <p className="text-tractian-red text-sm">{error}</p>}
    </div>
  );
};

export default ImageUpload;
