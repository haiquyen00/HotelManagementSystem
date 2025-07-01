'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth/authService';
import { VerifyEmailRequest } from '@/types';

export default function VerifyEmailForm() {
  const [formData, setFormData] = useState<VerifyEmailRequest>({
    email: '',
    token: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isVerified, setIsVerified] = useState(false);
  const [autoVerifying, setAutoVerifying] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lấy email và token từ URL params
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    
    if (email && token) {
      setFormData({
        email: email,
        token: token,
      });
      // Tự động verify khi có đủ thông tin
      handleAutoVerify(email, token);
    } else {
      setAutoVerifying(false);
      setError('Liên kết xác thực email không hợp lệ');
    }
  }, [searchParams]);

  const handleAutoVerify = async (email: string, token: string) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.verifyEmail({ email, token });
      
      if (response.success) {
        setIsVerified(true);
        setMessage('Email đã được xác thực thành công! Đang chuyển hướng đến trang đăng nhập...');
        setTimeout(() => {
          router.push('/auth/login?verified=true');
        }, 3000);
      } else {
        setError(response.message || 'Có lỗi xảy ra khi xác thực email');
      }
    } catch (err: any) {
      console.error('Verify email error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xác thực email');
    } finally {
      setLoading(false);
      setAutoVerifying(false);
    }
  };

  const handleManualVerify = async () => {
    if (!formData.email || !formData.token) {
      setError('Vui lòng nhập đầy đủ email và mã xác thực');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.verifyEmail(formData);
      
      if (response.success) {
        setIsVerified(true);
        setMessage('Email đã được xác thực thành công! Đang chuyển hướng đến trang đăng nhập...');
        setTimeout(() => {
          router.push('/auth/login?verified=true');
        }, 3000);
      } else {
        setError(response.message || 'Có lỗi xảy ra khi xác thực email');
      }
    } catch (err: any) {
      console.error('Verify email error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xác thực email');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (message) setMessage('');
  };

  if (autoVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Đang xác thực email...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Vui lòng chờ trong giây lát
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Xác thực thành công!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Email của bạn đã được xác thực thành công
            </p>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Đến trang đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Xác thực Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập thông tin để xác thực email của bạn
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                Mã xác thực
              </label>
              <input
                id="token"
                name="token"
                type="text"
                required
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mã xác thực từ email"
                value={formData.token}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {message && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{message}</div>
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={handleManualVerify}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xác thực...' : 'Xác thực Email'}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 block"
            >
              Quay lại đăng nhập
            </Link>
            <Link
              href="/auth/register"
              className="font-medium text-gray-600 hover:text-gray-500 text-sm"
            >
              Chưa có tài khoản? Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
