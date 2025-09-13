'use client'

import { ExchangeProvider } from '@/context/ExchangeContext';
import ExchangeFlow from '@/components/ExchangeFlow';

export default function Home() {
  return (
    <ExchangeProvider>
      <ExchangeFlow />
    </ExchangeProvider>
  );
}
