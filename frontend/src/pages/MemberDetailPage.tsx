import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { membersApi, achievementsApi } from '../services';
import type { FamilyMember, Achievement } from '../types';

export function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    Promise.all([
      membersApi.getOne(id),
      achievementsApi.getByMember(id),
    ])
      .then(([memRes, achRes]) => {
        setMember(memRes.data);
        setAchievements(achRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">加载中...</div>;
  }

  if (!member) {
    return (
      <div className="text-center py-10 text-red-600">
        成员不存在
        <Link to="/families" className="block mt-4 text-blue-600">返回家族列表</Link>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-600 hover:text-gray-900"
      >
        ← 返回
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 flex-shrink-0">
            {member.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
              <span>辈分：第 {member.generation} 代</span>
              <span>性别：{member.gender === 'male' ? '男' : member.gender === 'female' ? '女' : '其他'}</span>
              {member.birthDate && (
                <span>出生：{new Date(member.birthDate).toLocaleDateString('zh-CN')}</span>
              )}
            </div>
            {member.bio && (
              <p className="mt-3 text-gray-700">{member.bio}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          成就记录（{achievements.length}）
        </h2>
        {achievements.length === 0 ? (
          <p className="text-gray-500 text-center py-6">暂无成就记录</p>
        ) : (
          <div className="space-y-4">
            {achievements.map((ach) => (
              <div key={ach.id} className="border-l-4 border-blue-500 pl-4">
                <div className="font-medium text-gray-900">{ach.title}</div>
                {ach.description && (
                  <p className="text-gray-600 text-sm mt-1">{ach.description}</p>
                )}
                <div className="flex gap-4 mt-1 text-xs text-gray-400">
                  {ach.category && <span>{ach.category}</span>}
                  {ach.date && <span>{new Date(ach.date).toLocaleDateString('zh-CN')}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
