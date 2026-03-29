'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useState, useRef, useEffect } from 'react';
import Card from '../ui/Card';
import { FaCloudUploadAlt, FaFile, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function SellReceiptUpload() {
  const { nextStep, prevStep, updateExchangeData, exchangeData } = useExchange();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Load saved receipt from context on mount
  useEffect(() => {
    try {
      if (exchangeData?.sellReceipt && typeof exchangeData.sellReceipt === 'object') {
        setUploadedFile(exchangeData.sellReceipt);
        
        // Create preview only if it's an image file
        if (exchangeData.sellReceipt.type && exchangeData.sellReceipt.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrl(reader.result);
          };
          reader.onerror = () => {
            console.error('Error reading file');
          };
          reader.readAsDataURL(exchangeData.sellReceipt);
        }
      }
    } catch (error) {
      console.error('Error loading receipt:', error);
    }
  }, [exchangeData?.sellReceipt]);

  const handleFileUpload = (file) => {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPG, PNG, GIF, or PDF files are allowed');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setUploadedFile(file);
      
      // Create preview for images only
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.onerror = () => {
          console.error('Error reading file for preview');
          setPreviewUrl(null);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
      
      toast.success('Receipt uploaded successfully!');
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Error uploading file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('File removed');
  };

  const handleNext = () => {
    if (!uploadedFile) {
      toast.error('Please upload your receipt first');
      return;
    }

    try {
      setIsLoading(true);
      
      // Save receipt to context
      updateExchangeData({
        sellReceipt: uploadedFile
      });

      // Give a moment for context to update, then proceed
      setTimeout(() => {
        nextStep();
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error saving receipt:', error);
      toast.error('Error saving receipt. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Upload Receipt
          </h1>
          <p className="text-base text-gray-600 mb-4">
            Please upload a clear image or PDF of your transaction receipt
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            {/* Instructions Box */}
            <div className="mb-8 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <div className="flex gap-3">
                <FaExclamationTriangle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Upload Requirements:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• File format: JPG, PNG, GIF, or PDF</li>
                    <li>• Maximum file size: 5MB</li>
                    <li>• Receipt must be clear and legible</li>
                    <li>• All details should be visible</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="mb-8">
              {!uploadedFile ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300 ${
                    isDragOver
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-green-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCloudUploadAlt
                    size={48}
                    className={`mx-auto mb-4 ${
                      isDragOver ? 'text-green-500' : 'text-gray-400'
                    }`}
                  />
                  <p className="text-lg font-bold text-gray-800 mb-2">
                    {isDragOver ? 'Drop your file here' : 'Drag and drop your receipt'}
                  </p>
                  <p className="text-gray-600 mb-4">or</p>
                  <button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Browse Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/jpg,image/png,image/gif,application/pdf"
                    className="hidden"
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border-2 border-green-400 bg-green-50 rounded-lg p-6"
                >
                  {/* Image Preview */}
                  {previewUrl && (
                    <div className="mb-6">
                      <p className="text-sm font-bold text-gray-700 mb-3">Preview:</p>
                      <div className="bg-white border-2 border-green-300 rounded-lg overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Receipt preview"
                          className="w-full h-auto max-h-64 object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* File Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <FaCheckCircle size={32} className="text-green-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-green-800">File Uploaded Successfully</p>
                      <div className="flex items-center gap-2 mt-2">
                        <FaFile className="text-gray-600" size={16} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-600">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={removeFile}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold py-2 px-4 rounded-lg transition-colors border-2 border-red-200 flex items-center justify-center gap-2"
                  >
                    <FaTimes size={16} />
                    Remove and Upload Different File
                  </button>
                </motion.div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <button
                onClick={prevStep}
                disabled={isLoading}
                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!uploadedFile || isLoading}
                className={`flex-1 font-bold py-3 rounded-lg transition-colors ${
                  !uploadedFile || isLoading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isLoading ? 'Processing...' : 'Next'}
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
