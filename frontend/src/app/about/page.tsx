import { Layout } from '@/components/layout';

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            About Us
          </h1>
          
          <div className="prose prose-lg">
            <p className="text-xl text-gray-600 mb-6">
              Chào mừng bạn đến với ứng dụng Next.js của chúng tôi!
            </p>
            
            <p className="text-gray-700 mb-4">
              Đây là một ứng dụng web hiện đại được xây dựng với:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Next.js 15</strong> - React framework mạnh mẽ</li>
              <li><strong>TypeScript</strong> - Type safety cho JavaScript</li>
              <li><strong>Tailwind CSS v4</strong> - Utility-first CSS framework</li>
              <li><strong>Axios</strong> - HTTP client để call API</li>
              <li><strong>Custom Hooks</strong> - Tái sử dụng logic</li>
            </ul>
            
            <p className="text-gray-700 mt-6">
              Cấu trúc thư mục được tổ chức một cách khoa học để dễ dàng phát triển 
              và bảo trì ứng dụng frontend.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
