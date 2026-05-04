/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useDashboard, SatisfactionMetrics } from '../context/DashboardContext';
import { useSatisfactionData } from '../hooks/useSatisfactionData';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useMemo, useState, useRef } from 'react';
import { motion } from 'motion/react';

const METRIC_CONFIG = [
  { key: 'awardElement', label: 'Award Element', max: 60, shortcut: 'AWARD' },
  { key: 'semat', label: 'SEMAT', max: 60, shortcut: 'SEMAT' },
  { key: 'mmogle', label: 'MMOG / LE', max: 30, shortcut: 'MMOG' },
  { key: 'ppm', label: 'PPM / Target', max: 60, shortcut: 'PPM' },
  { key: 'qrIncidents', label: 'QR Incidents', max: 10, shortcut: 'QR' },
  { key: 'vcpa', label: 'VCPA', max: 10, shortcut: 'VCPA' },
  { key: 'launchIssues', label: 'Launch', max: 10, shortcut: 'LAUNCH' },
  { key: 'logistics1', label: 'Logistics 1', max: 10, shortcut: 'LOG 1' },
  { key: 'logistics2', label: 'Logistics 2', max: 10, shortcut: 'LOG 2' },
  { key: 'escalation', label: 'Escalation', max: 10, shortcut: 'ESC' },
];

interface Props {
  size: 'small' | 'large';
  showLabels?: boolean;
}

export default function SatisfactionGraphic({ size, showLabels = true }: Props) {
  const { productionData } = useDashboard();
  const metrics = useSatisfactionData();
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePan = (_: any, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const prevAngle = Math.atan2(info.point.y - info.delta.y - centerY, info.point.x - info.delta.x - centerX) * (180 / Math.PI);
    const currentAngle = Math.atan2(info.point.y - centerY, info.point.x - centerX) * (180 / Math.PI);

    let delta = currentAngle - prevAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    setRotation(prev => prev + delta);
  };

  const getSegmentColor = (key: string, score: number) => {
    switch (key) {
      case 'awardElement':
        return score >= 60 ? '#22c55e' : '#ef4444';
      case 'semat':
        if (score >= 60) return '#22c55e';
        if (score >= 30) return '#f59e0b';
        return '#ef4444';
      case 'mmogle':
        return score >= 30 ? '#22c55e' : '#ef4444';
      case 'ppm':
        if (score >= 20) return '#22c55e';
        if (score >= 10) return '#f59e0b';
        return '#ef4444';
      case 'qrIncidents':
      case 'vcpa':
      case 'launchIssues':
      case 'logistics1':
      case 'logistics2':
        if (score >= 10) return '#22c55e';
        if (score >= 5) return '#f59e0b';
        return '#ef4444';
      case 'escalation':
        if (score >= 10) return '#22c55e';
        if (score >= 5) return '#f59e0b';
        return '#ef4444';
      default:
        return '#4b5563';
    }
  };

  const totalScore = useMemo(() => {
    const values = [
      metrics.awardElement || 0,
      metrics.semat || 0,
      metrics.mmogle || 0,
      metrics.ppm || 0,
      metrics.qrIncidents || 0,
      metrics.vcpa || 0,
      metrics.launchIssues || 0,
      metrics.logistics1 || 0,
      metrics.logistics2 || 0,
      metrics.escalation || 0
    ];
    return values.reduce((acc, curr) => acc + curr, 0);
  }, [metrics]);

  const innerRadius = size === 'small' ? 55 : 130;
  const outerRadius = size === 'small' ? 85 : 240;
  const viewBoxSize = size === 'small' ? 200 : 520;
  const center = viewBoxSize / 2;

  // Function to create SVG Arc Path
  const getArc = (startAng: number, endAng: number, innerR: number, outerR: number) => {
    const toRad = (d: number) => (d - 90) * (Math.PI / 180);
    const s = toRad(startAng);
    const e = toRad(endAng);

    const x1 = center + outerR * Math.cos(s);
    const y1 = center + outerR * Math.sin(s);
    const x2 = center + outerR * Math.cos(e);
    const y2 = center + outerR * Math.sin(e);
    const x3 = center + innerR * Math.cos(e);
    const y3 = center + innerR * Math.sin(e);
    const x4 = center + innerR * Math.cos(s);
    const y4 = center + innerR * Math.sin(s);

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center justify-center select-none w-full h-full ${size === 'large' ? 'cursor-grab active:cursor-grabbing max-w-full max-h-full' : ''}`} 
    >
      <motion.div 
        className="w-full h-full relative flex items-center justify-center"
        style={{ rotate: rotation }}
        onPan={size === 'large' ? handlePan : undefined}
      >
        <svg 
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} 
          className="w-full h-full max-w-full max-h-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          {METRIC_CONFIG.map((config, i) => {
            // First slice is centered at 12 o'clock (0 degrees)
            const midAngle = i * 36;
            const startAngle = midAngle - 18;
            const endAngle = midAngle + 18;
            const score = metrics[config.key as keyof SatisfactionMetrics] || 0;
            const color = getSegmentColor(config.key, score);
            const labelRadius = (innerRadius + outerRadius) / 2;

            return (
              <g key={config.key}>
                <path 
                  d={getArc(startAngle, endAngle, innerRadius, outerRadius)}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                {showLabels && (
                  <g transform={`rotate(${midAngle} ${center} ${center})`}>
                    <g transform={`translate(${center} ${center - labelRadius})`}>
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-black uppercase tracking-widest"
                        fill="#ffffff"
                        style={{ 
                          fontSize: size === 'small' ? '8px' : '22px', 
                          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                      >
                        {config.shortcut || config.label}
                      </text>
                      {size === 'large' && (
                        <text
                          textAnchor="middle"
                          y="30"
                          className="font-black"
                          fill="rgba(255,255,255,0.8)"
                          style={{ fontSize: '14px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                        >
                          {score} / {config.max}
                        </text>
                      )}
                    </g>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>
      
      {/* Central Score Info Badge - Stays Upright */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-white rounded-full w-[40%] h-[40%] m-auto border-[12px] border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <span className={`font-black text-[#1B4299] tracking-[0.4em] leading-none ${size === 'small' ? 'text-[6px]' : 'text-[11px]'}`}>INDEX</span>
        <span className={`font-black tracking-tighter text-slate-900 leading-none ${size === 'small' ? 'text-2xl' : 'text-[82px]'}`}>{totalScore}</span>
        <span className={`font-black text-slate-300 leading-none ${size === 'small' ? 'text-[7px]' : 'text-[18px]'}`}>PTS</span>
      </div>

      {size === 'large' && (
        <div className="absolute -bottom-16 flex items-center gap-3 px-6 py-2 bg-slate-100 rounded-full border border-slate-200 opacity-60 group-hover:opacity-100 transition-all duration-500">
          <div className="w-2 h-2 rounded-full bg-[#1B4299] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[5px] text-[#1B4299]">Interactive Wheel • Drag to Rotate</span>
        </div>
      )}
    </div>
  );
}
