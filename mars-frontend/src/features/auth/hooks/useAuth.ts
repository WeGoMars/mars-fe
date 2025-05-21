import { useState } from 'react';
import { authGateway, LoginRequest, LoginResponse } from '../gateways/auth.gateway';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authGateway.login(data);
      // TODO: 토큰 저장 및 상태 관리
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('로그인 중 오류가 발생했습니다.'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authGateway.logout();
      // TODO: 토큰 제거 및 상태 초기화
    } catch (err) {
      setError(err instanceof Error ? err : new Error('로그아웃 중 오류가 발생했습니다.'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    logout,
    isLoading,
    error,
  };
};
