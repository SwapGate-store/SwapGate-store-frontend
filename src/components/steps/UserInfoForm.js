'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useState, useRef } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FaCloudUploadAlt, FaCheckCircle, FaTimes, FaFile } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function UserInfoForm() {
  const { nextStep, prevStep, updateExchangeData } = useExchange();
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (file) => {
    // Validate file type (images only)
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
    toast.success('Bank receipt uploaded successfully!');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('File removed');
  };

  const handleNext = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.mobileNumber.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }
    if (!uploadedFile) {
      toast.error('Please upload your bank receipt');
      return;
    }

    updateExchangeData({
      userInfo: formData,
      bankReceipt: uploadedFile
    });
    nextStep();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Your Information
          </h1>
          <p className="text-base text-gray-600">
            Please provide your details and upload the bank receipt
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Personal Information Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
              
              {/* Name Input */}
              <div className="mb-6">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="text-gray-800"
                />
              </div>

              {/* Mobile Number Input */}
              <div className="mb-6">
                <Input
                  label="Mobile Number (WhatsApp / Telegram)"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  placeholder="Enter your mobile number"
                  className="text-gray-800"
                />
                <p className="text-sm text-gray-500 mt-2">
                  We&apos;ll contact you via WhatsApp or Telegram on this number
                </p>
              </div>
            </Card>
          </motion.div>

          {/* File Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Bank Receipt Upload</h2>
              
              {!uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCloudUploadAlt 
                    className={`mx-auto mb-3 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} 
                    size={40} 
                  />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Upload Bank Receipt
                  </h3>
                  <p className="text-gray-500 mb-3 text-sm">
                    Drag and drop your receipt here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports: JPG, PNG, GIF, PDF (Max 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-3" size={20} />
                      <div>
                        <h3 className="font-medium text-green-800 text-sm">{uploadedFile.name}</h3>
                        <p className="text-xs text-green-600">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Rules Section */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-xs font-semibold text-yellow-800 mb-2">
                  📋 Important Rules / වැදගත් නීති
                </h3>
                <ul className="space-y-1 text-xs text-yellow-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-1">•</span>
                    <span>රිසිට් පත් එක වරක් පමණක් ඇතුලත් කරන්න</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-1">•</span>
                    <span>එක් වරකට වඩා එකම රිසිට් පත ඇතුලත් කිරිමෙන් ඔබව වෙබ් අඩවියෙන් Block වනු ඇත</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-1">•</span>
                    <span>රිසිට් පත් දෙකක් හෝ කිහිපයක් ඇත්නම එවා තනි රිසිට්පතක් ලෙස Upload කරන්න</span>
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={prevStep}>
            ← Back
          </Button>
          
          <Button 
            variant="secondary"
            onClick={handleNext}
            disabled={!formData.name.trim() || !formData.mobileNumber.trim() || !uploadedFile}
            className={`${
              !formData.name.trim() || !formData.mobileNumber.trim() || !uploadedFile
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}