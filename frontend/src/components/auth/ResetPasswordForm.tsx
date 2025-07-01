'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth/authService';
import { ResetPasswordRequest } from '@/types';

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState<ResetPasswordRequest>({
    email: '',
    token: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isValidToken, setIsValidToken] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lấy email và token từ URL params
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    
    if (!email || !token) {
      setIsValidToken(false);
      setError('Liên kết reset mật khẩu không hợp lệ hoặc đã hết hạn');
      return;
    }

    setFormData(prev => ({
      ...prev,
      email: email,
      token: token,
    }));
  }, [searchParams]);

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

  const validateForm = (): boolean => {
    if (!formData.newPassword || formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return false;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.resetPassword(formData);
      
      if (response.success) {
        setMessage('Mật khẩu đã được reset thành công. Đang chuyển hướng đến trang đăng nhập...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setError(response.message || 'Có lỗi xảy ra khi reset mật khẩu');
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi reset mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Liên kết không hợp lệ
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Liên kết reset mật khẩu không hợp lệ hoặc đã hết hạn
            </p>
            <div className="mt-6">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Yêu cầu liên kết mới
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
            Reset mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập mật khẩu mới cho tài khoản: <strong>{formData.email}</strong>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu mới
              </label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Xác nhận mật khẩu mới"
                value={formData.confirmNewPassword}
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
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang reset...' : 'Reset mật khẩu'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
