'use client'

import { useExchange } from '@/context/ExchangeContext';
import WelcomePage from './steps/WelcomePage';
import ExchangeSelection from './steps/ExchangeSelection';
import AmountCalculator from './steps/AmountCalculator';
import BankSelection from './steps/BankSelection';
import UserInfoForm from './steps/UserInfoForm';
import OrderSummary from './steps/OrderSummary';
import ThankYouPage from './steps/ThankYouPage';

export default function ExchangeFlow() {
  const { exchangeData } = useExchange();

  const renderStep = () => {
    switch (exchangeData.step) {
      case 0:
        return <WelcomePage />;
      case 1:
        return <ExchangeSelection />;
      case 2:
        return <AmountCalculator />;
      case 3:
        return <BankSelection />;
      case 4:
        return <UserInfoForm />;
      case 5:
        return <OrderSummary />;
      case 6:
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