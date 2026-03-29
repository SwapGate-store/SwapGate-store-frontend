'use client'

import { useExchange } from '@/context/ExchangeContext';
import WelcomePage from './steps/WelcomePage';
import BuyOrSellPage from './steps/BuyOrSellPage';
import ExchangeSelection from './steps/ExchangeSelection';
import AmountCalculator from './steps/AmountCalculator';
import BankSelection from './steps/BankSelection';
import UserInfoForm from './steps/UserInfoForm';
import OrderSummary from './steps/OrderSummary';
import ThankYouPage from './steps/ThankYouPage';
import SellFlowPage from './steps/SellFlowPage';
import SellReceiptUpload from './steps/SellReceiptUpload';

export default function ExchangeFlow() {
  const { exchangeData } = useExchange();

  const renderStep = () => {
    switch (exchangeData.step) {
      case 0:
        return <WelcomePage />;
      case 1:
        return <BuyOrSellPage />;
      case 2:
        return exchangeData.mode === 'sell' ? <SellFlowPage /> : <ExchangeSelection />;
      case 3:
        return exchangeData.mode === 'sell' ? <SellReceiptUpload /> : <AmountCalculator />;
      case 4:
        return <BankSelection />;
      case 5:
        return <UserInfoForm />;
      case 6:
        return <OrderSummary />;
      case 7:
        return <ThankYouPage />;
      default:
        return <WelcomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderStep()}
    </div>
  );
}