'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useState, useRef } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FaExchangeAlt, FaUniversity, FaUser, FaFileImage, FaCheckCircle, FaIdCard, FaVenus, FaMars, FaCalendarAlt, FaShieldAlt, FaExclamationTriangle, FaCloudUploadAlt, FaTimes, FaFile } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function UserInfoForm() {
  const { nextStep, prevStep, updateExchangeData } = useExchange();
  const [formData, setFormData] = useState({
    name: '',
    nicNumber: '',
    gender: '',
    dateOfBirth: '',
    mobileNumber: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [nicValidationError, setNicValidationError] = useState('');
  const [isNicValidated, setIsNicValidated] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear NIC validation status when user changes any NIC-related field
    if (field === 'nicNumber' || field === 'gender' || field === 'dateOfBirth') {
      setNicValidationError('');
      setIsNicValidated(false);
    }
  };

  // Sri Lankan NIC validation functions
  const validateOldNIC = (nic) => {
    const regex = /^[0-9]{9}[vVxX]$/;
    return regex.test(nic);
  };

  const validateNewNIC = (nic) => {
    const regex = /^[0-9]{12}$/;
    return regex.test(nic);
  };

  const extractDataFromNIC = (nic) => {
    if (!nic) return null;

    const cleanNIC = nic.toString().toUpperCase();
    
    if (validateOldNIC(cleanNIC)) {
      // Old format: 123456789V
      const birthYear = parseInt(cleanNIC.substring(0, 2));
      const dayOfYear = parseInt(cleanNIC.substring(2, 5));
      
      // Determine gender (if day > 500, it's female)
      const actualDay = dayOfYear > 500 ? dayOfYear - 500 : dayOfYear;
      const gender = dayOfYear > 500 ? 'female' : 'male';
      
      // Calculate birth year (assuming births before 1950 are in 2000s, after 1950 are in 1900s)
      const fullYear = birthYear < 50 ? 2000 + birthYear : 1900 + birthYear;
      
      // Convert day of year to actual date
      // January 1st is day 1, so we use actualDay directly
      const date = new Date(fullYear, 0, actualDay);
      
      // Format date as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const birthDate = `${year}-${month}-${day}`;
      
      console.log('Old NIC Debug:', { 
        cleanNIC, 
        birthYear, 
        dayOfYear, 
        actualDay, 
        fullYear, 
        calculatedDate: date,
        birthDate,
        gender 
      });
      
      return { gender, dateOfBirth: birthDate, valid: true };
    } 
    else if (validateNewNIC(cleanNIC)) {
      // New format: 199012345678
      const birthYear = parseInt(cleanNIC.substring(0, 4));
      const dayOfYear = parseInt(cleanNIC.substring(4, 7));
      
      // Determine gender
      const actualDay = dayOfYear > 500 ? dayOfYear - 500 : dayOfYear;
      const gender = dayOfYear > 500 ? 'female' : 'male';
      
      // Convert day of year to actual date
      // January 1st is day 1, so we use actualDay directly
      const date = new Date(birthYear, 0, actualDay);
      
      // Format date as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const birthDate = `${year}-${month}-${day}`;
      
      console.log('New NIC Debug:', { 
        cleanNIC, 
        birthYear, 
        dayOfYear, 
        actualDay, 
        calculatedDate: date,
        birthDate,
        gender 
      });
      
      return { gender, dateOfBirth: birthDate, valid: true };
    }
    
    return { valid: false };
  };

  const validateNICData = () => {
    if (!formData.nicNumber || !formData.gender || !formData.dateOfBirth) {
      return true; // Don't validate if fields are empty
    }

    const extractedData = extractDataFromNIC(formData.nicNumber);
    
    if (!extractedData.valid) {
      setNicValidationError('Invalid NIC number format');
      return false;
    }

    // Check if entered data matches extracted data
    if (extractedData.gender !== formData.gender) {
      setNicValidationError('Gender does not match with NIC number');
      return false;
    }

    if (extractedData.dateOfBirth !== formData.dateOfBirth) {
      setNicValidationError('Date of birth does not match with NIC number');
      return false;
    }

    setNicValidationError('');
    return true;
  };

  const validateNICWithUserData = (formDataToCheck) => {
    const extractedData = extractDataFromNIC(formDataToCheck.nicNumber);
    
    console.log('Validation Debug:', {
      userInput: {
        nic: formDataToCheck.nicNumber,
        gender: formDataToCheck.gender,
        dateOfBirth: formDataToCheck.dateOfBirth
      },
      extractedData: extractedData
    });
    
    if (!extractedData.valid) {
      setNicValidationError('Invalid NIC number format');
      setIsNicValidated(false);
      return false;
    }

    // Check if entered data matches extracted data
    if (extractedData.gender !== formDataToCheck.gender) {
      setNicValidationError(`Gender does not match with NIC number. Expected: ${extractedData.gender}, Got: ${formDataToCheck.gender}`);
      setIsNicValidated(false);
      return false;
    }

    if (extractedData.dateOfBirth !== formDataToCheck.dateOfBirth) {
      setNicValidationError(`Date of birth does not match with NIC number. Expected: ${extractedData.dateOfBirth}, Got: ${formDataToCheck.dateOfBirth}`);
      setIsNicValidated(false);
      return false;
    }

    setNicValidationError('');
    setIsNicValidated(true);
    toast.success('Valid ID card number! ✅');
    return true;
  };

  const handleValidateNIC = () => {
    if (!formData.nicNumber.trim()) {
      toast.error('Please enter your NIC number');
      return;
    }
    if (!formData.gender) {
      toast.error('Please select your gender');
      return;
    }
    if (!formData.dateOfBirth) {
      toast.error('Please enter your date of birth');
      return;
    }

    validateNICWithUserData(formData);
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
    if (!formData.nicNumber.trim()) {
      toast.error('Please enter your NIC number');
      return;
    }
    if (!formData.gender) {
      toast.error('Please select your gender');
      return;
    }
    if (!formData.dateOfBirth) {
      toast.error('Please enter your date of birth');
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

    if (!isNicValidated) {
      toast.error('Please validate your NIC details first');
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
              <div className="flex items-center mb-6">
                <FaUser className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              </div>
              
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

              {/* ID Verification Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-blue-100">
                <div className="flex items-center mb-4">
                  <FaShieldAlt className="text-blue-600 mr-3" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">Identity Verification</h3>
                  {isNicValidated && (
                    <FaCheckCircle className="text-green-500 ml-auto" size={20} />
                  )}
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className={`w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-full flex items-center justify-center text-sm font-semibold ${
                      formData.nicNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      1
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">NIC Number</span>
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${formData.nicNumber && formData.gender ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className={`w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-full flex items-center justify-center text-sm font-semibold ${
                      formData.gender ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      2
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">Gender</span>
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${formData.dateOfBirth && formData.gender ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className={`w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-full flex items-center justify-center text-sm font-semibold ${
                      formData.dateOfBirth ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      3
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">Birth Date</span>
                  </div>
                  <div className={`h-1 flex-1 mx-2 ${isNicValidated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className={`w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-full flex items-center justify-center text-sm font-semibold ${
                      isNicValidated ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      ✓
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">Verified</span>
                  </div>
                </div>

                {/* NIC Number Input */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <FaIdCard className="text-blue-600 mr-2" size={16} />
                    <label className="text-sm font-medium text-gray-700">
                      National Identity Card Number
                    </label>
                  </div>
                  <Input
                    value={formData.nicNumber}
                    onChange={(e) => handleInputChange('nicNumber', e.target.value)}
                    placeholder="Enter your NIC number (e.g., 123456789V or 199012345678)"
                    className="text-gray-800"
                  />
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                      Old format: 9 digits + V
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                      New format: 12 digits
                    </div>
                  </div>
                </div>

                {/* Gender Selection */}
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <span className="text-blue-600 mr-2">👤</span>
                    <label className="text-sm font-medium text-gray-700">Gender</label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      formData.gender === 'male' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600'
                    }`}>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="sr-only"
                      />
                      <FaMars className={`mr-2 ${formData.gender === 'male' ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className="font-medium">Male</span>
                    </label>
                    <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      formData.gender === 'female' 
                        ? 'border-pink-500 bg-pink-50 text-pink-700' 
                        : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50 text-gray-600 hover:text-pink-600'
                    }`}>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="sr-only"
                      />
                      <FaVenus className={`mr-2 ${formData.gender === 'female' ? 'text-pink-600' : 'text-gray-500'}`} />
                      <span className="font-medium">Female</span>
                    </label>
                  </div>
                </div>

                {/* Date of Birth Input */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-blue-600 mr-2" size={16} />
                    <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  </div>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="text-gray-800"
                  />
                </div>

                {/* Validation Status */}
                {nicValidationError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <FaExclamationTriangle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-sm text-red-600">{nicValidationError}</p>
                  </div>
                )}

                {isNicValidated && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" size={16} />
                    <p className="text-sm text-green-600 font-medium">
                      ✅ Your identity card details have been verified successfully
                    </p>
                  </div>
                )}

                {/* Validate Button */}
                <button
                  onClick={handleValidateNIC}
                  disabled={!formData.nicNumber.trim() || !formData.gender || !formData.dateOfBirth}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 transform ${
                    isNicValidated
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                      : !formData.nicNumber.trim() || !formData.gender || !formData.dateOfBirth
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {isNicValidated ? (
                    <span className="flex items-center justify-center">
                      <FaCheckCircle className="mr-2" />
                      Identity Verified
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <FaShieldAlt className="mr-2" />
                      Validate Identity Card
                    </span>
                  )}
                </button>
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
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-1">•</span>
                    <span>USDT,CRYPTO,FOREX,BINANCE වැනි වචන REMARK තුල යෙදීමෙන් වලකින්න</span>
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
            disabled={!formData.name.trim() || !formData.nicNumber.trim() || !formData.gender || !formData.dateOfBirth || !formData.mobileNumber.trim() || !uploadedFile || !isNicValidated}
            className={`${
              !formData.name.trim() || !formData.nicNumber.trim() || !formData.gender || !formData.dateOfBirth || !formData.mobileNumber.trim() || !uploadedFile || !isNicValidated
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