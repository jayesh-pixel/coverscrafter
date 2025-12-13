"use client";

import { useMemo, useState } from "react";
import India from "@svg-maps/india";

type StateData = {
  name: string;
  code: string;
  value: number;
  count: number;
};

type IndiaHeatMapProps = {
  data: StateData[];
  metric: "revenue" | "count";
  valueFormatter: (value: number) => string;
};

// State name normalization mapping
const stateNameMap: Record<string, string> = {
  "andaman and nicobar": "Andaman and Nicobar Islands",
  "andhra pradesh": "Andhra Pradesh",
  "arunachal pradesh": "Arunachal Pradesh",
  "assam": "Assam",
  "bihar": "Bihar",
  "chandigarh": "Chandigarh",
  "chhattisgarh": "Chhattisgarh",
  "dadra and nagar haveli": "Dadra and Nagar Haveli and Daman and Diu",
  "daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
  "delhi": "Delhi",
  "goa": "Goa",
  "gujarat": "Gujarat",
  "haryana": "Haryana",
  "himachal pradesh": "Himachal Pradesh",
  "jammu and kashmir": "Jammu and Kashmir",
  "jharkhand": "Jharkhand",
  "karnataka": "Karnataka",
  "kerala": "Kerala",
  "ladakh": "Ladakh",
  "lakshadweep": "Lakshadweep",
  "madhya pradesh": "Madhya Pradesh",
  "maharashtra": "Maharashtra",
  "manipur": "Manipur",
  "meghalaya": "Meghalaya",
  "mizoram": "Mizoram",
  "nagaland": "Nagaland",
  "odisha": "Odisha",
  "puducherry": "Puducherry",
  "punjab": "Punjab",
  "rajasthan": "Rajasthan",
  "sikkim": "Sikkim",
  "tamil nadu": "Tamil Nadu",
  "telangana": "Telangana",
  "tripura": "Tripura",
  "uttar pradesh": "Uttar Pradesh",
  "uttarakhand": "Uttarakhand",
  "west bengal": "West Bengal",
};

export function IndiaHeatMap({ data, metric, valueFormatter }: IndiaHeatMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const maxValue = useMemo(() => {
    return Math.max(...data.map(d => d.value), 1);
  }, [data]);

  const normalizeStateName = (name: string): string => {
    const lowerName = name.toLowerCase().trim();
    return stateNameMap[lowerName] || name;
  };

  const getStateColor = (stateName: string) => {
    const normalized = normalizeStateName(stateName);
    const stateData = data.find(d => {
      const dataName = normalizeStateName(d.name);
      return dataName === normalized || 
             dataName.includes(normalized) || 
             normalized.includes(dataName);
    });
    
    if (!stateData || stateData.value === 0) {
      return "#e2e8f0"; // slate-200
    }
    
    const intensity = stateData.value / maxValue;
    
    // Color gradient from light blue to dark blue
    if (intensity < 0.2) return "#dbeafe"; // blue-100
    if (intensity < 0.4) return "#93c5fd"; // blue-300
    if (intensity < 0.6) return "#60a5fa"; // blue-400
    if (intensity < 0.8) return "#3b82f6"; // blue-500
    return "#1d4ed8"; // blue-700
  };

  const getStateData = (stateName: string) => {
    const normalized = normalizeStateName(stateName);
    return data.find(d => {
      const dataName = normalizeStateName(d.name);
      return dataName === normalized || 
             dataName.includes(normalized) || 
             normalized.includes(dataName);
    });
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.value - a.value).slice(0, 10);
  }, [data]);

  const valueLabel = metric === "count" ? "Count" : "Net Premium";

  return (
    <div className="space-y-4">
      <div className="relative w-full bg-white rounded-lg p-4 border border-slate-200">
        <svg viewBox={India.viewBox} className="w-full h-auto max-h-[400px]">
          {India.locations.map((location: any) => {
            const stateName = location.name;
            const stateData = getStateData(stateName);
            const fillColor = getStateColor(stateName);
            const isHovered = hoveredState === location.id;
            
            return (
              <g key={location.id}>
                <path
                  d={location.path}
                  fill={fillColor}
                  stroke="#64748b"
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  className="transition-all duration-200 cursor-pointer hover:opacity-80"
                  onMouseEnter={() => setHoveredState(location.id)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <title>
                    {stateName}
                      {stateData 
                        ? `\nPolicies: ${stateData.count}\n${valueLabel}: ${valueFormatter(stateData.value)}` 
                        : '\nNo data'}
                  </title>
                </path>
              </g>
            );
          })}
        </svg>

        {/* Tooltip on hover */}
        {hoveredState && (
          <div className="absolute top-4 right-4 bg-white border border-slate-300 rounded-lg shadow-lg p-3 text-sm z-10">
            <p className="font-semibold text-slate-900 mb-1">
              {India.locations.find((l: any) => l.id === hoveredState)?.name}
            </p>
                  {(() => {
              const locationName = India.locations.find((l: any) => l.id === hoveredState)?.name;
              const stateData = locationName ? getStateData(locationName) : null;
              return stateData ? (
                  <div className="space-y-0.5 text-xs text-slate-600">
                  <p>Policies: <span className="font-semibold text-slate-900">{stateData.count}</span></p>
                  <p>{valueLabel}: <span className="font-semibold text-slate-900">{valueFormatter(stateData.value)}</span></p>
                  <p>Share: <span className="font-semibold text-slate-900">
                    {((stateData.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                  </span></p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No data</p>
              );
            })()}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-600">Low</span>
        <div className="flex gap-1">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#dbeafe" }} />
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#93c5fd" }} />
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#60a5fa" }} />
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#3b82f6" }} />
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "#1d4ed8" }} />
        </div>
        <span className="text-slate-600">High</span>
      </div>

      {/* Top States */}
      <div>
        <h4 className="text-xs font-semibold text-slate-700 mb-2">Top 10 States</h4>
        <div className="space-y-1.5">
          {sortedData.length === 0 && (
            <p className="text-xs text-slate-500">No state data available</p>
          )}
          {sortedData.map((state, index) => (
            <div
              key={state.name}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
                  {index + 1}
                </span>
                <span className="font-medium text-slate-900">{state.name}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{valueFormatter(state.value)}</p>
                <p className="text-[10px] text-slate-500">{state.count} policies</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
