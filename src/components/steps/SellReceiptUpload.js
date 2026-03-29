'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useState, useRef, useEffect } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { FaCloudUploadAlt, FaFile, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function SellReceiptUpload() {
  const { nextStep, prevStep, updateExchangeData, exchangeData } = useExchange();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Load saved receipt from context on mount
  useEffect(() => {
    if (exchangeData?.sellReceipt) {
      setUploadedFile(exchangeData.sellReceipt);
      // Create preview if it's an image
      if (exchangeData.sellReceipt.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(exchangeData.sellReceipt);
      }
    }
  }, []);

  const handleFileUpload = (file) => {
    // Validate file type (images and PDF only)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload an image file (JPG, PNG, GIF) or PDF');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
    
    toast.success('Receipt uploaded successfully!');
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
      toast.error('Please upload your receipt');
      return;
    }

    // Save receipt and move to summary
    updateExchangeData({
      sellReceipt: uploadedFile
    });
    nextStep();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Upload Receipt
          </h1>
          <p className="text-base text-gray-600 mb-4">
            Please upload your transaction receipt or proof of payment
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            {/* Instructions */}
            <div className="mb-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start">
                <FaExclamationTriangle className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={18} />
                <div>
                  <p className="text-sm text-blue-700 font-semibold">Upload Instructions:</p>
                  <ul className="text-sm text-blue-600 mt-2 space-y-1">
                    <li>• Upload a clear image or PDF of your transaction receipt</li>
                    <li>• File must be JPG, PNG, GIF, or PDF format</li>
                    <li>• Maximum file size is 5MB</li>
                    <li>• Ensure all details are clearly visible</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="mb-10">
              <label className="text-lg font-semibold text-gray-800 mb-4 block">
                Receipt/Proof Document
              </label>

              {!uploadedFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                    isDragOver
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCloudUploadAlt
                    size={48}
                    className={`mx-auto mb-4 ${isDragOver ? 'text-green-500' : 'text-gray-400'}`}
                  />
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    {isDragOver ? 'Drop your file here' : 'Drag and drop your receipt here'}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">or</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
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
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border-2 border-green-400 bg-green-50 rounded-lg p-6"
                >
                  {/* Image Preview */}
                  {previewUrl && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Preview:</p>
                      <div className="relative rounded-lg overflow-hidden border-2 border-green-300 bg-white">
                        <img
                          src={previewUrl}
                          alt="Receipt preview"
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <FaCheckCircle size={32} className="text-green-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-green-800 mb-2">File uploaded successfully</p>
                      <div className="flex items-center gap-2 mb-3">
                        <FaFile className="text-gray-600" size={18} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-600">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm transition-colors duration-300"
                      >
                        <FaTimes size={16} />
                        Remove file
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <button
                onClick={prevStep}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 transition-all duration-300 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!uploadedFile}
                className={`flex-1 font-semibold py-3 transition-all duration-300 rounded-lg ${
                  !uploadedFile
                    ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Next
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
