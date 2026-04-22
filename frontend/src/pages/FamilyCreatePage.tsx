import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { familiesApi } from '../services';

export function FamilyCreatePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('家族名称不能为空');
      return;
    }
    setLoading(true);
    try {
      const { data } = await familiesApi.create({ name: name.trim(), description: description.trim() });
      navigate(`/families/${data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">创建新家族</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            家族名称 *
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="例如：王氏家族"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            家族描述
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="简要介绍这个家族..."
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '创建中...' : '创建家族'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/families')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
