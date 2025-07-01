import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

function ResetPasswordContent() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

export const metadata = {
  title: 'Reset mật khẩu | Hotel Management',
  description: 'Reset mật khẩu tài khoản Hotel Management System',
};
