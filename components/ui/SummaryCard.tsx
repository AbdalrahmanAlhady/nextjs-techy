import React from 'react';

interface SummaryCardProps {
  label: string;
  value: number;
  classNameValue?: string;
}

export default function SummaryCard({ label, value, classNameValue }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
      <span className={`text-2xl font-bold ${classNameValue ?? 'text-gray-900'}`}>{value}</span>
    </div>
  );
}
