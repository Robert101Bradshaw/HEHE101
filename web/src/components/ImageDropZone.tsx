"use client";

import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageDropZoneProps {
  onImageUpload: (file: File) => void;
  className?: string;
}

export default function ImageDropZone({ onImageUpload, className = "" }: ImageDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image file size must be less than 10MB');
        return;
      }

      setUploadedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Call parent callback
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadedFile(null);
  };

  return (
    <div className={`w-full ${className}`}>
      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
            ${isDragActive 
              ? 'border-red-500 bg-red-50' 
              : isDragReject 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
            }
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-3">
            <div className="text-4xl">📸</div>
            
            {isDragActive ? (
              <div className="text-red-600 font-medium">
                Drop your image here...
              </div>
            ) : isDragReject ? (
              <div className="text-red-600 font-medium">
                Invalid file type. Please upload an image.
              </div>
            ) : (
              <>
                <div className="text-gray-700 font-medium">
                  Drag & drop an image here
                </div>
                <div className="text-gray-500 text-sm">
                  or click to browse files
                </div>
                <div className="text-gray-400 text-xs">
                  Supports: JPEG, PNG, GIF, WebP (max 10MB)
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Uploaded reference"
            className="w-full h-auto rounded-lg border border-gray-200 max-h-64 object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
            title="Remove image"
          >
            ×
          </button>
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-600">
              Reference image uploaded: {uploadedFile?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
