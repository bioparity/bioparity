'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

export default function ProjectionChart({ historical, humanRecord, projection, metricType, comparisonDirection }) {
  if (!historical || historical.length === 0) return null;

  const sorted = historical.slice().sort((a, b) => a.year - b.year);
  const lastYear = sorted[sorted.length - 1].year;
  const projectedYear = projection && projection.projected_year ? projection.projected_year : null;
  const xMax = projectedYear ? Math.max(lastYear + 1, Math.ceil(projectedYear) + 1) : lastYear + 2;
  const xMin = Math.floor(sorted[0].year) - 1;

  const data = sorted.map(p => ({ year: p.year, robot: p.value, fit: null }));
  if (projection && projection.slope !== undefined && projection.intercept !== undefined && projectedYear) {
    const startFit = sorted[0].year;
    const endFit = projectedYear;
    const fitPoints = [];
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const x = startFit + ((endFit - startFit) * i) / steps;
      const y = projection.slope * x + projection.intercept;
      fitPoints.push({ year: x, robot: null, fit: y });
    }
    data.push(...fitPoints);
    data.sort((a, b) => a.year - b.year);
  }

  return (
    <div className="border border-rule rounded-lg p-4 bg-panel">
      <div className="text-xs uppercase tracking-wider text-dim mb-3">
        Trajectory toward parity
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              type="number"
              domain={[xMin, xMax]}
              tick={{ fill: '#a3a3a3', fontSize: 11 }}
              stroke="#262626"
              tickFormatter={v => Math.round(v)}
            />
            <YAxis
              tick={{ fill: '#a3a3a3', fontSize: 11 }}
              stroke="#262626"
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid #262626', fontSize: 12 }}
              labelFormatter={v => 'Year ' + Math.round(v)}
            />
            <ReferenceLine
              y={humanRecord}
              stroke="#22c55e"
              strokeDasharray="4 4"
              label={{ value: 'Human WR', fill: '#22c55e', fontSize: 10, position: 'insideTopRight' }}
            />
            <Line
              type="monotone"
              dataKey="robot"
              stroke="#f5f5f5"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f5f5f5' }}
              connectNulls
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="fit"
              stroke="#3b82f6"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {projection && projection.projected_year && (
        <div className="text-xs text-dim mt-2">
          Linear-trend projection · n={projection.n} · r²={projection.r_squared.toFixed(3)} · confidence:{' '}
          <span className="text-paper">{projection.confidence}</span>
        </div>
      )}
    </div>
  );
}
