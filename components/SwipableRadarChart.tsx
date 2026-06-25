// TEAM_001: Swipable radar chart component for TIU/TWK/TKP subtopic readiness
// Uses inline SVG — Recharts RadarChart had rendering issues with this dataset
import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type RadarPoint = {
  themeId: number;
  themeName: string;
  topicCode: string | null;
  value: number;
  attempts: number;
};

interface SwipableRadarChartProps {
  radar: RadarPoint[];
  syncWarning: boolean;
  minAttemptsSolid?: number;
}

const SUBTOPICS: Array<'TIU' | 'TWK' | 'TKP'> = ['TIU', 'TWK', 'TKP'];
const SUBTOPIC_LABELS: Record<string, string> = {
  TIU: 'Tes Intelegensia Umum',
  TWK: 'Tes Wawasan Kebangsaan',
  TKP: 'Tes Karakteristik Pribadi',
};
const SUBTOPIC_COLORS: Record<string, string> = {
  TIU: '#D4F938',
  TWK: '#38BDF8',
  TKP: '#FB923C',
};

const MIN_SWIPE_DIST = 40;

// Inline SVG radar chart: no external deps, works w/ many axes
const RadarSvg: React.FC<{
  data: { name: string; value: number; attempts: number }[];
  color: string;
  minAttemptsSolid: number;
}> = ({ data, color, minAttemptsSolid }) => {
  const cx = 150, cy = 150, r = 120;
  const n = data.length;
  if (n === 0) return null;

  const polar = (i: number, radius: number) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  };

  const ringPoints = (radius: number) =>
    Array.from({ length: n }, (_, i) => {
      const p = polar(i, radius);
      return `${p.x},${p.y}`;
    }).join(' ');

  const dataPoints = data.map((d, i) => polar(i, (Math.min(Math.max(d.value, 0), 100) / 100) * r));

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" style={{ maxHeight: '288px' }}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((frac) => (
        <polygon
          key={frac}
          points={ringPoints(r * frac)}
          fill="none"
          stroke="#ccc"
          strokeWidth={frac === 1 ? 1.5 : 0.5}
        />
      ))}
      {/* Grid lines */}
      {Array.from({ length: n }).map((_, i) => {
        const p = polar(i, r);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#ccc" strokeWidth={0.5} />;
      })}
      {/* Data polygon */}
      <polygon
        points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')}
        fill={color}
        fillOpacity={0.7}
        stroke="#000"
        strokeWidth={2}
      />
      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#000" />
      ))}
      {/* Labels */}
      {data.map((d, i) => {
        const labelR = r + 18;
        const p = polar(i, labelR);
        // Angle in degrees for text anchor logic
        const deg = (360 * i) / n;
        const isLeft = deg > 90 && deg < 270;
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor={isLeft ? 'end' : 'start'}
            fontSize={9}
            fontWeight={700}
            fill="#000"
            transform={isLeft ? `translate(-4, 3)` : `translate(4, 3)`}
          >
            {d.name}
          </text>
        );
      })}
      {/* Value markers on 0, 50, 100 radius */}
      <text x={cx + 4} y={cy - r + 12} fontSize={8} fill="#999">100</text>
      <text x={cx + 4} y={cy - r * 0.5 + 4} fontSize={8} fill="#999">50</text>
      <text x={cx + 4} y={cy + 4} fontSize={8} fill="#999">0</text>
    </svg>
  );
};

const SwipableRadarChart: React.FC<SwipableRadarChartProps> = ({
  radar,
  syncWarning,
  minAttemptsSolid = 5,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const currentSub = SUBTOPICS[currentIdx];
  const filteredRadar = radar.filter((r) => r.topicCode === currentSub);
  const color = SUBTOPIC_COLORS[currentSub];

  const goPrev = useCallback(() => {
    setCurrentIdx((i) => (i - 1 + SUBTOPICS.length) % SUBTOPICS.length);
  }, []);
  const goNext = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % SUBTOPICS.length);
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(dx) < MIN_SWIPE_DIST) return;
      if (dx < 0) goNext();
      else goPrev();
    },
    [goNext, goPrev]
  );
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    },
    [goPrev, goNext]
  );

  const chartData = filteredRadar.map((r) => ({
    name: r.themeName,
    value: r.value,
    attempts: r.attempts,
  }));

  return (
    <div
      className="flex flex-col"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Spider chart ${currentSub}`}
      aria-live="polite"
    >
      {/* Nav header */}
      <div className="flex items-center justify-between mb-sm">
        <button onClick={goPrev} className="p-1 border border-black rounded-full bg-white hover:bg-gray-100" aria-label="Sebelumnya">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-bold text-sm uppercase tracking-widest border border-black px-3 py-1 rounded-full bg-white">{currentSub}</span>
          <span className="text-[10px] text-black/50 mt-0.5">{SUBTOPIC_LABELS[currentSub]}</span>
        </div>
        <button onClick={goNext} className="p-1 border border-black rounded-full bg-white hover:bg-gray-100" aria-label="Selanjutnya">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Chart */}
      <div className="border border-black bg-white rounded-xl p-lg">
        {syncWarning && <div className="mb-2 text-xs font-bold text-black/80">Data belum tersinkron—coba lagi.</div>}
        <div className="h-72">
          {chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-black/40">
              <span className="text-3xl">📊</span>
              <p className="text-xs font-bold">
                Selesaikan tryout atau kuis harian<br />untuk melihat profil kemampuan {currentSub}.
              </p>
            </div>
          ) : (
            <RadarSvg data={chartData} color={color} minAttemptsSolid={minAttemptsSolid} />
          )}
        </div>
        {/* Score chips */}
        {chartData.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {chartData.filter(d => d.attempts > 0).map(d => (
              <span key={d.name} className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-black" style={{ backgroundColor: color + '40' }}>
                {d.name.substring(0, 8)}: {Math.round(d.value)}%
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {SUBTOPICS.map((sub, i) => (
          <button
            key={sub}
            onClick={() => setCurrentIdx(i)}
            className={`w-2 h-2 rounded-full border border-black transition-all ${i === currentIdx ? 'bg-black scale-125' : 'bg-white'}`}
            aria-label={`Lihat ${sub}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipableRadarChart;
