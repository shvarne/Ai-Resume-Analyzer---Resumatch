import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    // 1. Add local state to track the file for UI rendering
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        setSelectedFile(file); // Update local UI
        if (onFileSelect) onFileSelect(file); // Notify parent
    }, [onFileSelect]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: 20 * 1024 * 1024,
    });

    // 2. Updated remove handler
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation(); // Stop getRootProps from opening file dialog
        setSelectedFile(null);
        if (onFileSelect) onFileSelect(null);
    };

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 transition">
                <input {...getInputProps()} />

                <div className="space-y-4">
                    {selectedFile ? (
                        <div className="uploader-selected-file flex items-center justify-between bg-gray-50 p-3 rounded" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center space-x-3">
                                <img src="/images/pdf.png" alt="pdf" className="size-10" />
                                <div className="text-left">
                                    <p className="text-sm text-gray-700 font-medium truncate max-w-[150px]">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatSize(selectedFile.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="p-2 hover:bg-gray-200 rounded-full transition"
                                onClick={handleRemove}
                            >
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img src="/icons/info.svg" alt="upload" className="size-20" />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-sm text-gray-400">
                                PDF (max 20MB)
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;