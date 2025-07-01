import { Suspense } from 'react';
import VerifyEmailForm from '@/components/auth/VerifyEmailForm';

function VerifyEmailContent() {
  return <VerifyEmailForm />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

export const metadata = {
  title: 'Xác thực Email | Hotel Management',
  description: 'Xác thực email tài khoản Hotel Management System',
};
