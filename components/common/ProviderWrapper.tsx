// components/ProviderWrapper.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
// 컴포넌트에 전달될 props 타입 정의
interface Props {
  children: React.ReactNode;
}
// ProviderWrapper는 앱 전체를 Redux Provider로 감싸주는 래퍼 컴포넌트
export default function ProviderWrapper({ children }: Props) {
   // Redux의 Provider를 통해 store를 하위 컴포넌트에 주입
  return <Provider store={store}>{children}</Provider>;
}