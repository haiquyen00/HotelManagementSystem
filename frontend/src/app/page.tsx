import Link from "next/link";
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Chào mừng đến với{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                NextJS App
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ứng dụng web hiện đại được xây dựng với Next.js 15, TypeScript, 
              Tailwind CSS v4 và tích hợp sẵn các tính năng call API.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-gray-600">
              Cấu trúc thư mục chuyên nghiệp cho dự án frontend
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Next.js 15 + TypeScript
              </h3>
              <p className="text-gray-600">
                Sử dụng framework React mạnh mẽ với type safety hoàn toàn
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-2xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tailwind CSS v4
              </h3>
              <p className="text-gray-600">
                Utility-first CSS framework với theme system mới
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-2xl mb-4">🔌</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                API Integration
              </h3>
              <p className="text-gray-600">
                Axios configuration với interceptors và error handling
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-2xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Custom Hooks
              </h3>
              <p className="text-gray-600">
                useAuth, useApi và các hooks tái sử dụng khác
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-2xl mb-4">🧩</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                UI Components
              </h3>
              <p className="text-gray-600">
                Button, Input, Loading và các component UI sẵn sàng sử dụng
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-2xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Organized Structure
              </h3>
              <p className="text-gray-600">
                Cấu trúc thư mục khoa học, dễ bảo trì và mở rộng
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Sẵn sàng bắt đầu?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Dự án đã được setup hoàn chỉnh và sẵn sàng để phát triển
              </p>
              <Link href="/login">
                <Button size="lg">
                  Bắt đầu ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
