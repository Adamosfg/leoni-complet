/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function CustomTooltip({ active, payload, label, unit }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xl">
        <p className="text-[9px] text-slate-400 uppercase tracking-[2px] mb-2 font-black">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: item.color || item.fill }} 
            />
            <p className="text-[14px] font-black tracking-tight text-[#1B4299]">
              {item.value.toLocaleString()} <span className="text-[10px] text-slate-400">{unit || item.unit || ''}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
