// components/ProviderWrapper.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';

interface Props {
  children: React.ReactNode;
}

export default function ProviderWrapper({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}