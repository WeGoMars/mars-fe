import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatStr = 'yyyy년 MM월 dd일') => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatStr, { locale: ko });
};

export const formatDateTime = (date: string | Date) => {
  return formatDate(date, 'yyyy년 MM월 dd일 HH:mm:ss');
};

export const formatRelativeTime = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;

  return formatDate(date);
};
