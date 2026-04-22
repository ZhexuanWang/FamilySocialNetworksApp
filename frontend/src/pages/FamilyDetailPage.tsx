import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { familiesApi, membersApi } from '../services';
import type { Family, FamilyMember } from '../types';

export function FamilyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    Promise.all([
      familiesApi.getOne(id),
      membersApi.getByFamily(id),
    ])
      .then(([famRes, memRes]) => {
        setFamily(famRes.data);
        setMembers(memRes.data);
      })
      .catch(() => setError('加载失败，请检查是否已登录'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">加载中...</div>;
  }

  if (error || !family) {
    return (
      <div className="text-center py-10 text-red-600">
        {error || '家族不存在'}
        <Link to="/families" className="block mt-4 text-blue-600">返回家族列表</Link>
      </div>
    );
  }

  const groupedMembers = members.reduce<Record<number, FamilyMember[]>>((acc, m) => {
    const gen = m.generation;
    if (!acc[gen]) acc[gen] = [];
    acc[gen].push(m);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{family.name}</h1>
          {family.description && (
            <p className="text-gray-600 mt-1">{family.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            创建于 {new Date(family.createdAt).toLocaleDateString('zh-CN')}
          </p>
        </div>
        <button
          onClick={() => navigate('/families')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          返回列表
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">家族成员（{members.length} 人）</h2>
          <button
            onClick={() => navigate(`/families/${id}/members/new`)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            添加成员
          </button>
        </div>

        {members.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            暂无成员，{' '}
            <button
              onClick={() => navigate(`/families/${id}/members/new`)}
              className="text-blue-600 hover:text-blue-800"
            >
              添加第一位成员
            </button>
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMembers)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([gen, mems]) => (
                <div key={gen}>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    第 {gen} 代（{mems.length} 人）
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mems.map((m) => (
                      <Link
                        key={m.id}
                        to={`/members/${m.id}`}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 mb-2">
                            {m.name.charAt(0)}
                          </div>
                          <div className="font-medium text-gray-900">{m.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {m.gender === 'male' ? '男' : m.gender === 'female' ? '女' : '其他'}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
