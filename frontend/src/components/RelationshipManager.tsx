import { useState } from 'react';
import type { FamilyMember, Relationship, RelationType } from '../types';

const RELATION_OPTIONS: { value: RelationType; label: string }[] = [
  { value: 'parent', label: '父母' },
  { value: 'child', label: '子女' },
  { value: 'spouse', label: '配偶' },
  { value: 'sibling', label: '兄弟姐妹' },
  { value: 'grandparent', label: '祖父母' },
  { value: 'grandchild', label: '孙辈' },
  { value: 'uncle_aunt', label: '叔伯姑姨' },
  { value: 'nephew_niece', label: '侄甥' },
  { value: 'other', label: '其他' },
];

interface RelationshipManagerProps {
  familyId: string;
  members: FamilyMember[];
  relationships: Relationship[];
  onRefresh: () => void;
  onCreate: (data: { familyId: string; fromMemberId: string; toMemberId: string; relationType: RelationType }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function RelationshipManager({
  familyId,
  members,
  relationships,
  onRefresh,
  onCreate,
  onDelete,
}: RelationshipManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [relType, setRelType] = useState<RelationType>('parent');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fromId || !toId || fromId === toId) {
      setError('请选择两个不同的成员');
      return;
    }
    setLoading(true);
    try {
      await onCreate({ familyId, fromMemberId: fromId, toMemberId: toId, relationType: relType });
      setFromId('');
      setToId('');
      setShowForm(false);
      onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || '添加失败');
    } finally {
      setLoading(false);
    }
  };

  const getMemberName = (id: string) => members.find((m) => m.id === id)?.name ?? id;
  const getRelationLabel = (type: string) =>
    RELATION_OPTIONS.find((o) => o.value === type)?.label ?? type;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          家族关系（{relationships.length} 条）
        </h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          {showForm ? '取消' : '添加关系'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3"
        >
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">成员 A</label>
              <select
                required
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500"
              >
                <option value="">选择成员</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">关系</label>
              <select
                value={relType}
                onChange={(e) => setRelType(e.target.value as RelationType)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500"
              >
                {RELATION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">成员 B</label>
              <select
                required
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500"
              >
                <option value="">选择成员</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '添加中...' : '确认添加'}
          </button>
        </form>
      )}

      {relationships.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">暂无关系记录</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {relationships.map((rel) => (
            <div
              key={rel.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{getMemberName(rel.fromMemberId)}</span>
                <span className="text-blue-600">{getRelationLabel(rel.relationType)}</span>
                <span className="font-medium">{getMemberName(rel.toMemberId)}</span>
              </div>
              <button
                onClick={async () => {
                  await onDelete(rel.id);
                  onRefresh();
                }}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
