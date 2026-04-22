import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { familiesApi } from '../services';
import type { Family } from '../types';

export function FamilyListPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    familiesApi.getAll()
      .then(({ data }) => setFamilies(data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">加载中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的家族</h1>
        <Link
          to="/families/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          创建家族
        </Link>
      </div>

      {families.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-4">还没有加入任何家族</p>
          <Link to="/families/new" className="text-blue-600 hover:text-blue-800">
            创建第一个家族
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((family) => (
            <Link
              key={family.id}
              to={`/families/${family.id}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {family.name}
              </h3>
              {family.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {family.description}
                </p>
              )}
              <div className="text-xs text-gray-400">
                创建于 {new Date(family.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
