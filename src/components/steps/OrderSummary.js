'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { FaExchangeAlt, FaUniversity, FaUser, FaFileImage, FaCheckCircle, FaSpinner, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveUserSummary } from '@/utils/firebase';

export default function OrderSummary() {
  const { nextStep, prevStep, exchangeData } = useExchange();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const invoiceRef = useRef(null);

  // Helper function to wrap long text in PDF
  const wrapText = (pdf, text, x, y, maxWidth, lineHeight = 8) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const textWidth = pdf.getTextWidth(testLine);
      
      if (textWidth > maxWidth && line !== '') {
        pdf.text(line.trim(), x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    if (line.trim() !== '') {
      pdf.text(line.trim(), x, currentY);
      currentY += lineHeight;
    }
    
    return currentY;
  };

  // Helper function to split long addresses/IDs
  const splitLongText = (text, maxLength = 25) => {
    if (text.length <= maxLength) return [text];
    
    const chunks = [];
    for (let i = 0; i < text.length; i += maxLength) {
      chunks.push(text.substring(i, i + maxLength));
    }
    return chunks;
  };

  const generateSimplePDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('SwapGate Exchange Invoice', 20, 30);
      
      // Add content
      pdf.setFontSize(12);
      let yPosition = 50;
      
      pdf.text('Exchange Details:', 20, yPosition);
      yPosition += 10;
      pdf.text(`Platform: ${exchangeData.exchange || 'N/A'}`, 30, yPosition);
      yPosition += 8;
      
      // Make Exchange ID bigger, bold, and dark red with text wrapping
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(139, 0, 0); // Dark red color
      
      const exchangeId = exchangeData.exchangeId || 'N/A';
      pdf.text('Exchange ID:', 30, yPosition);
      yPosition += 10;
      
      // Split long exchange ID into multiple lines if needed
      const idChunks = splitLongText(exchangeId, 35);
      idChunks.forEach((chunk, index) => {
        pdf.text(chunk, 30, yPosition);
        if (index < idChunks.length - 1) yPosition += 8;
      });
      
      // Reset to normal formatting
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0); // Black color
      
      yPosition += 15;
      pdf.text('Transaction Details:', 20, yPosition);
      yPosition += 10;
      pdf.text(`LKR Amount: ${exchangeData.lkrAmount || '0'}`, 30, yPosition);
      yPosition += 8;
      
      // Make USDT Amount bigger, bold, and dark red
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(139, 0, 0); // Dark red color
      pdf.text(`USDT Amount: ${exchangeData.usdtAmount || '0'}`, 30, yPosition);
      
      // Reset to normal formatting
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0); // Black color
      
      if (exchangeData.bankDetails) {
        yPosition += 15;
        pdf.text('Bank Details:', 20, yPosition);
        yPosition += 10;
        pdf.text(`Bank: ${exchangeData.bankDetails.name}`, 30, yPosition);
        yPosition += 8;
        pdf.text(`Account: ${exchangeData.bankDetails.accountNumber}`, 30, yPosition);
      }
      
      if (exchangeData.userInfo) {
        yPosition += 15;
        pdf.text('Customer Details:', 20, yPosition);
        yPosition += 10;
        pdf.text(`Name: ${exchangeData.userInfo.name}`, 30, yPosition);
        yPosition += 8;
        pdf.text(`Mobile: ${exchangeData.userInfo.mobileNumber}`, 30, yPosition);
        if (exchangeData.userInfo.nicNumber) {
          yPosition += 8;
          pdf.text(`NIC Number: ${exchangeData.userInfo.nicNumber}`, 30, yPosition);
          yPosition += 8;
          pdf.text(`Gender: ${exchangeData.userInfo.gender ? exchangeData.userInfo.gender.charAt(0).toUpperCase() + exchangeData.userInfo.gender.slice(1) : 'N/A'}`, 30, yPosition);
          yPosition += 8;
          pdf.text(`Date of Birth: ${exchangeData.userInfo.dateOfBirth || 'N/A'}`, 30, yPosition);
        }
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `SwapGate-Invoice-${timestamp}.pdf`;
      
      pdf.save(filename);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating simple PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const generatePDF = async () => {
    console.log('Starting PDF generation...');
    
    if (!invoiceRef.current) {
      console.error('Invoice ref not found, using simple PDF generation');
      generateSimplePDF();
      return;
    }

    const loadingToast = toast.loading('Generating PDF...');

    try {
      console.log('Creating canvas...');
      // Create canvas from the invoice element
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure fonts are loaded in cloned document
          const clonedElement = clonedDoc.querySelector('[data-invoice]');
          if (clonedElement) {
            clonedElement.style.fontFamily = 'Arial, sans-serif';
          }
        }
      });

      console.log('Canvas created, converting to image...');
      const imgData = canvas.toDataURL('image/png');
      
      console.log('Creating PDF...');
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // If image is too tall, scale it down
      if (imgHeight > pdfHeight) {
        const scaleFactor = pdfHeight / imgHeight;
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = pdfHeight;
        pdf.addImage(imgData, 'PNG', (pdfWidth - scaledWidth) / 2, 0, scaledWidth, scaledHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `SwapGate-Invoice-${timestamp}.pdf`;
      
      console.log('Saving PDF as:', filename);
      // Download the PDF
      pdf.save(filename);
      
      toast.dismiss(loadingToast);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF with html2canvas, falling back to simple PDF:', error);
      toast.dismiss(loadingToast);
      generateSimplePDF();
    }
  };

  const generatePDFBlob = async () => {
    console.log('Starting PDF blob generation...');
    
    if (!invoiceRef.current) {
      console.error('Invoice ref not found, using simple PDF generation');
      return generateSimplePDFBlob();
    }

    try {
      console.log('Creating canvas...');
      // Create canvas from the invoice element
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure fonts are loaded in cloned document
          const clonedElement = clonedDoc.querySelector('[data-invoice]');
          if (clonedElement) {
            clonedElement.style.fontFamily = 'Arial, sans-serif';
          }
        }
      });

      console.log('Canvas created, converting to image...');
      const imgData = canvas.toDataURL('image/png');
      
      console.log('Creating PDF...');
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // If image is too tall, scale it down
      if (imgHeight > pdfHeight) {
        const scaleFactor = pdfHeight / imgHeight;
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = pdfHeight;
        pdf.addImage(imgData, 'PNG', (pdfWidth - scaledWidth) / 2, 0, scaledWidth, scaledHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      // Return PDF as blob instead of downloading
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF with html2canvas, falling back to simple PDF:', error);
      return generateSimplePDFBlob();
    }
  };

  const generateSimplePDFBlob = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('SwapGate Exchange Invoice', 20, 30);
      
      // Add content
      pdf.setFontSize(12);
      let yPosition = 50;
      
      pdf.text('Exchange Details:', 20, yPosition);
      yPosition += 10;
      pdf.text(`Platform: ${exchangeData.exchange || 'N/A'}`, 30, yPosition);
      yPosition += 8;
      
      // Make Exchange ID bigger, bold, and dark red with text wrapping
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(139, 0, 0); // Dark red color
      
      const exchangeId = exchangeData.exchangeId || 'N/A';
      pdf.text('Exchange ID:', 30, yPosition);
      yPosition += 10;
      
      // Split long exchange ID into multiple lines if needed
      const idChunks = splitLongText(exchangeId, 35);
      idChunks.forEach((chunk, index) => {
        pdf.text(chunk, 30, yPosition);
        if (index < idChunks.length - 1) yPosition += 8;
      });
      
      // Reset to normal formatting
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0); // Black color
      
      yPosition += 15;
      pdf.text('Transaction Details:', 20, yPosition);
      yPosition += 10;
      pdf.text(`LKR Amount: ${exchangeData.lkrAmount || '0'}`, 30, yPosition);
      yPosition += 8;
      
      // Make USDT Amount bigger, bold, and dark red
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(139, 0, 0); // Dark red color
      pdf.text(`USDT Amount: ${exchangeData.usdtAmount || '0'}`, 30, yPosition);
      
      // Reset to normal formatting
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0); // Black color
      
      if (exchangeData.bankDetails) {
        yPosition += 15;
        pdf.text('Bank Details:', 20, yPosition);
        yPosition += 10;
        pdf.text(`Bank: ${exchangeData.bankDetails.name}`, 30, yPosition);
        yPosition += 8;
        pdf.text(`Account: ${exchangeData.bankDetails.accountNumber}`, 30, yPosition);
      }
      
      if (exchangeData.userInfo) {
        yPosition += 15;
        pdf.text('Customer Details:', 20, yPosition);
        yPosition += 10;
        pdf.text(`Name: ${exchangeData.userInfo.name}`, 30, yPosition);
        yPosition += 8;
        pdf.text(`Mobile: ${exchangeData.userInfo.mobileNumber}`, 30, yPosition);
        if (exchangeData.userInfo.nicNumber) {
          yPosition += 8;
          pdf.text(`NIC Number: ${exchangeData.userInfo.nicNumber}`, 30, yPosition);
          yPosition += 8;
          pdf.text(`Gender: ${exchangeData.userInfo.gender ? exchangeData.userInfo.gender.charAt(0).toUpperCase() + exchangeData.userInfo.gender.slice(1) : 'N/A'}`, 30, yPosition);
          yPosition += 8;
          pdf.text(`Date of Birth: ${exchangeData.userInfo.dateOfBirth || 'N/A'}`, 30, yPosition);
        }
      }
      
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating simple PDF blob:', error);
      throw error;
    }
  };

  const sendFilesToAPI = async (bankSlipFile, summaryPDFBlob) => {
    try {
      const formData = new FormData();
      
      // Add bank slip file
      formData.append('bank_slip', bankSlipFile, bankSlipFile.name);
      
      // Add summary PDF blob with a proper filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const pdfFilename = `SwapGate-Invoice-${timestamp}.pdf`;
      formData.append('user_summary_pdf', summaryPDFBlob, pdfFilename);
      
      // Add exchange ID and amount as separate fields
      formData.append('exchange_id', exchangeData.exchangeId || '');
      formData.append('amount', exchangeData.usdtAmount || '');
      
      console.log('Sending files and data to API...');
      console.log('Exchange ID:', exchangeData.exchangeId);
      console.log('Amount:', exchangeData.usdtAmount);
      
      const response = await fetch('https://swapgate-store-backend.onrender.com/api/send-msg', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`API call failed with status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API response:', result);
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Error sending files to API:', error);
      
      // Handle specific error types
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Network connection issue. Please check your internet connection and try again.',
          isNetworkError: true
        };
      }
      
      return { success: false, error: error.message, isNetworkError: false };
    }
  };

  const handleCheckout = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm that all details are correct');
      return;
    }

    setIsProcessing(true);
    
    // Show processing toast notification
    const processingToast = toast.loading(
      <div className="flex items-center">
        <FaSpinner className="animate-spin mr-2" />
        Processing your order... Please wait
      </div>,
      {
        duration: 0, // Keep it visible until manually dismissed
        style: {
          background: '#3B82F6',
          color: 'white',
          fontWeight: '500',
        },
      }
    );
    
    let apiCallSuccess = false;
    
    try {
      // Check if bank receipt exists
      if (!exchangeData.bankReceipt) {
        toast.error('Bank receipt is required to complete the order');
        return;
      }

      // Save user summary to Firebase (without receipt)
      const userSummary = {
        name: exchangeData.userInfo?.name || '',
        exchangeName: exchangeData.exchange || '',
        exchangeId: exchangeData.exchangeId || '',
        usdtAmount: exchangeData.usdtAmount || '',
        selectedBank: exchangeData.selectedBank || ''
      };
      
      const summaryId = await saveUserSummary(userSummary);
      console.log('User summary saved with ID:', summaryId);
      
      // Generate PDF blob for API
      toast.loading('Generating invoice PDF...');
      const summaryPDFBlob = await generatePDFBlob();
      
      if (!summaryPDFBlob) {
        throw new Error('Failed to generate PDF summary');
      }
      
      // Try to send files to API
      toast.loading('Sending files to server...');
      const apiResult = await sendFilesToAPI(exchangeData.bankReceipt, summaryPDFBlob);
      
      if (apiResult.success) {
        apiCallSuccess = true;
        console.log('Files successfully sent to API');
      } else {
        
      }
      
      // Always generate and download PDF for user
      await generatePDF();
      
      // Show appropriate success message
      if (apiCallSuccess) {
        toast.success('Order submitted successfully! Files sent to server.');
      } else {
        toast.success('Order submitted successfully! PDF downloaded. Please contact support to complete the process.');
      }
      
      // Wake up Render server before going to next step
      try {
        await fetch('https://swapgate-store-backend.onrender.com/api/health');
        console.log('Render server wakeup API called');
      } catch (err) {
        console.warn('Render server wakeup API failed:', err);
      }
      nextStep(); // Always go to thank you page
    } catch (error) {
      console.error('Error in checkout process:', error);
      
      // More specific error handling
      if (error.message.includes('Failed to generate PDF')) {
        toast.error('Failed to generate invoice PDF. Please try again.');
      } else if (error.message.includes('Bank receipt is required')) {
        // Already handled above
        return;
      } else {
        toast.error(`Order processing error: ${error.message}. Please try again or contact support.`);
      }
    } finally {
      // Dismiss the processing toast
      toast.dismiss(processingToast);
      setIsProcessing(false);
    }
  };

  // Helper function to get exchange logo
  const getExchangeLogo = (exchangeId) => {
    const logoMap = {
      'binance': '/assets/Binance-Logo.png',
      'mexc': '/assets/mexclogo.png',
      'bybit': '/assets/bybitlogo.png'
    };
    return logoMap[exchangeId] || '';
  };

  // Helper function to get bank logo
  const getBankLogo = (bankId) => {
    const logoMap = {
      'hnb': '/assets/HNB.png',
      'commercial': '/assets/commercial.png',
      'sampath': '/assets/sampath.png',
      'dfcc': '/assets/DFCC.jpeg'
    };
    return logoMap[bankId] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Order Summary
          </h1>
          <p className="text-base text-gray-600">
            Please review all details before confirming your order
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 mb-8" ref={invoiceRef} data-invoice="true">
            {/* Invoice Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Invoice</h2>
                  <p className="text-gray-600">Order Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800">SwapGate Exchange</p>
                  <p className="text-sm text-gray-600">USDT/LKR Trading</p>
                </div>
              </div>
            </div>

            {/* Exchange Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaExchangeAlt className="text-blue-500 mr-2" size={20} />
                Exchange Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Platform:</span>
                  <div className="flex items-center">
                    <Image 
                      src={getExchangeLogo(exchangeData.exchange)} 
                      alt={`${exchangeData.exchange} logo`}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain mr-2"
                    />
                    <span className="font-semibold text-gray-800 capitalize">{exchangeData.exchange}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Exchange ID:</span>
                  <span className="font-mono text-gray-800">{exchangeData.exchangeId}</span>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaExchangeAlt className="text-green-500 mr-2" size={20} />
                Transaction Details
              </h3>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-700 mb-1">LKR Amount</p>
                    <p className="text-2xl font-bold text-green-800">
                      LKR {exchangeData.lkrAmount ? parseFloat(exchangeData.lkrAmount).toLocaleString() : '0'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 mb-1">USDT Amount</p>
                    <p className="text-2xl font-bold text-green-800">
                      {exchangeData.usdtAmount || '0'} USDT
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUniversity className="text-purple-500 mr-2" size={20} />
                Payment Bank Details
              </h3>
              {exchangeData.bankDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center col-span-1 md:col-span-3 mb-2">
                      <Image 
                        src={getBankLogo(exchangeData.selectedBank)} 
                        alt={`${exchangeData.bankDetails.name} logo`}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain mr-3"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{exchangeData.bankDetails.name}</p>
                        <p className="text-sm text-gray-600">Branch: {exchangeData.bankDetails.branch}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Account Number</p>
                      <p className="font-mono font-semibold text-gray-800">{exchangeData.bankDetails.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Account Name</p>
                      <p className="font-semibold text-gray-800">{exchangeData.bankDetails.accountName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Branch</p>
                      <p className="font-semibold text-gray-800">{exchangeData.bankDetails.branch}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="text-orange-500 mr-2" size={20} />
                Customer Information
              </h3>
              {exchangeData.userInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Full Name</p>
                      <p className="font-semibold text-gray-800">{exchangeData.userInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Mobile Number</p>
                      <p className="font-semibold text-gray-800">{exchangeData.userInfo.mobileNumber}</p>
                      <p className="text-xs text-gray-500">WhatsApp / Telegram contact</p>
                    </div>
                    {exchangeData.userInfo.nicNumber && (
                      <>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">NIC Number</p>
                          <p className="font-semibold text-gray-800 font-mono">{exchangeData.userInfo.nicNumber}</p>
                          <p className="text-xs text-green-600 flex items-center mt-1">
                            <FaCheckCircle className="mr-1" size={12} />
                            Verified Identity
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Personal Details</p>
                          <p className="font-semibold text-gray-800">
                            {exchangeData.userInfo.gender ? exchangeData.userInfo.gender.charAt(0).toUpperCase() + exchangeData.userInfo.gender.slice(1) : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            DOB: {exchangeData.userInfo.dateOfBirth || 'N/A'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {exchangeData.bankReceipt && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p className="text-sm text-gray-600 mb-2">Bank Receipt Uploaded</p>
                      <div className="flex items-center bg-white p-3 rounded border">
                        <FaFileImage className="text-gray-500 mr-3" size={20} />
                        <div>
                          <p className="font-semibold text-gray-800">{exchangeData.bankReceipt.name}</p>
                          <p className="text-xs text-gray-500">
                            {(exchangeData.bankReceipt.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Invoice Total Section */}
            <div className="border-t-2 border-gray-300 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-gray-800">Total Transaction:</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {exchangeData.usdtAmount || '0'} USDT
                  </p>
                  <p className="text-lg text-gray-600">
                    = LKR {exchangeData.lkrAmount ? parseFloat(exchangeData.lkrAmount).toLocaleString() : '0'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Confirmation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-center mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 border-2 rounded mr-4 flex items-center justify-center transition-all duration-200 ${
                  isConfirmed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300 hover:border-green-400'
                }`}>
                  {isConfirmed && <FaCheckCircle className="text-white" size={16} />}
                </div>
                <span className="text-gray-700 font-medium text-lg">
                  I confirm that all the details I entered are correct
                </span>
              </label>
            </div>
          </Card>
        </motion.div>

        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={prevStep}>
            ← Back
          </Button>
          
          <Button 
            variant="secondary"
            onClick={handleCheckout}
            disabled={!isConfirmed || isProcessing}
            className={`transition-all duration-200 ${
              isProcessing
                ? 'bg-blue-600 text-white cursor-wait animate-pulse' 
                : !isConfirmed
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" size={16} />
                <span>Processing Order...</span>
                <FaClock className="ml-2 opacity-70" size={14} />
              </div>
            ) : (
              'Complete Order →'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}