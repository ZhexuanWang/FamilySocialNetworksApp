import { useCallback, useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router-dom';
import type { FamilyMember, Relationship } from '../types';

interface TreeNode {
  id: string;
  name: string;
  generation: number;
  gender: string;
  avatarUrl?: string;
  bio?: string;
  val: number;
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}

interface TreeLink {
  source: string;
  target: string;
  relationType: string;
}

interface FamilyTreeProps {
  members: FamilyMember[];
  relationships: Relationship[];
}

const GENDER_COLORS: Record<string, string> = {
  male: '#3B82F6',
  female: '#EC4899',
  other: '#9CA3AF',
};

const RELATION_LABELS: Record<string, string> = {
  parent: '父母',
  child: '子女',
  spouse: '配偶',
  sibling: '兄弟姐妹',
  grandparent: '祖父母',
  grandchild: '孙辈',
  uncle_aunt: '叔伯姑姨',
  nephew_niece: '侄甥',
  other: '其他',
};

export function FamilyTree({ members, relationships }: FamilyTreeProps) {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: Math.max(400, members.length * 60),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [members.length]);

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge')?.strength(-200);
      fgRef.current.d3Force('link')?.distance(120);
    }
  }, []);

  const nodes: TreeNode[] = members.map((m) => ({
    id: m.id,
    name: m.name,
    generation: m.generation,
    gender: m.gender,
    avatarUrl: m.avatarUrl ?? undefined,
    bio: m.bio ?? undefined,
    val: Math.max(8, 20 - m.generation * 2),
    color: GENDER_COLORS[m.gender] ?? GENDER_COLORS.other,
  }));

  const links: TreeLink[] = relationships.map((r) => ({
    source: r.fromMemberId,
    target: r.toMemberId,
    relationType: r.relationType,
  }));

  const handleNodeClick = useCallback(
    (node: TreeNode) => {
      navigate(`/members/${node.id}`);
    },
    [navigate],
  );

  const nodeCanvasObject = useCallback(
    (node: TreeNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.name;
      const fontSize = Math.max(12 / globalScale, 4);
      const radius = node.val;

      ctx.beginPath();
      ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = hoveredNode === node.id ? '#1D4ED8' : 'white';
      ctx.lineWidth = hoveredNode === node.id ? 3 / globalScale : 1.5 / globalScale;
      ctx.stroke();

      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#1F2937';
      ctx.fillText(label, node.x!, node.y! + radius + 2 / globalScale);
    },
    [hoveredNode],
  );

  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        暂无成员数据，无法生成族谱图
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">
          族谱关系图（共 {nodes.length} 人，{links.length} 条关系）
        </h3>
        <button
          onClick={() => setShowLegend((v) => !v)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {showLegend ? '隐藏图例' : '显示图例'}
        </button>
      </div>

      {showLegend && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg text-xs grid grid-cols-2 gap-2">
          <div className="font-medium text-gray-700 col-span-2">节点颜色</div>
          {Object.entries(GENDER_COLORS).map(([gender, color]) => (
            <div key={gender} className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>
                {gender === 'male' ? '男' : gender === 'female' ? '女' : '其他'}
              </span>
            </div>
          ))}
          <div className="font-medium text-gray-700 col-span-2 mt-1">关系类型</div>
          {Object.entries(RELATION_LABELS).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1">
              <span className="text-gray-400">—</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}

      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes, links }}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={nodeCanvasObject}
        nodePointerAreaPaint={(node, color, ctx) => {
          const n = node as TreeNode;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(n.x!, n.y!, n.val + 4, 0, 2 * Math.PI);
          ctx.fill();
        }}
        onNodeClick={handleNodeClick}
        onNodeHover={(node) => setHoveredNode((node as TreeNode)?.id ?? null)}
        linkColor={() => '#D1D5DB'}
        linkWidth={1.5}
        linkCanvasObject={(link, ctx, globalScale) => {
          const l = link as any;
          const src = l.source as TreeNode;
          const tgt = l.target as TreeNode;
          if (!src?.x || !tgt?.x) return;
          const text = RELATION_LABELS[l.relationType] ?? l.relationType;
          const fontSize = Math.max(8 / globalScale, 3);
          const midX = (src.x! + tgt.x!) / 2;
          const midY = (src.y! + tgt.y!) / 2;
          ctx.font = `${fontSize}px sans-serif`;
          ctx.fillStyle = '#9CA3AF';
          ctx.textAlign = 'center';
          ctx.fillText(text, midX, midY - 2 / globalScale);
        }}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current?.zoomToFit(400, 40)}
      />

      <p className="text-xs text-gray-400 mt-2 text-center">
        点击节点查看成员详情 · 拖拽可调整布局
      </p>
    </div>
  );
}
