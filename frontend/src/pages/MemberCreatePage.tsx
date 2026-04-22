import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { membersApi } from '../services';
import type { Gender } from '../types';

export function MemberCreatePage() {
  const { familyId } = useParams<{ familyId: string }>();
  const [name, setName] = useState('');
  const [generation, setGeneration] = useState(1);
  const [gender, setGender] = useState<Gender>('other');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('成员姓名不能为空');
      return;
    }
    setLoading(true);
    try {
      await membersApi.create({
        familyId: familyId!,
        name: name.trim(),
        generation,
        gender,
        birthDate: birthDate || undefined,
        bio: bio.trim() || undefined,
      });
      navigate(`/families/${familyId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '添加失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">添加家族成员</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
          <input
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            placeholder="成员姓名"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">辈分代数</label>
            <input
              type="number"
              min={1}
              value={generation}
              onChange={(e) => setGeneration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            >
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">出生日期</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            placeholder="简要介绍一下这位成员..."
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '添加中...' : '添加成员'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/families/${familyId}`)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
