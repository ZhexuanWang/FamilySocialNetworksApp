import { useAuthStore } from '../stores';

export function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">个人中心</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {user?.email?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">账户信息</div>
            <div className="text-gray-600 text-sm">{user?.email}</div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-sm font-medium text-gray-500 mb-4">我的功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/families"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <div className="font-medium text-gray-900">我的家族</div>
              <div className="text-sm text-gray-500 mt-1">浏览和管理我的家族</div>
            </a>
            <a
              href="/families/new"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <div className="font-medium text-gray-900">创建家族</div>
              <div className="text-sm text-gray-500 mt-1">建立新的家族空间</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
