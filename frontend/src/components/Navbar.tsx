import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              FSNA 家族网络
            </Link>
            {isAuthenticated && (
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/families" className="text-gray-600 hover:text-gray-900">
                  家族
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                  个人中心
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  退出登录
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  登录
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
