import React from 'react';

export default function NavItem({ icon: Icon, label, active, onClick, expanded }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center ${expanded ? 'gap-3 px-4' : 'justify-center px-0'} py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
        active
          ? 'bg-[#0d5d3a] text-white shadow-sm border-r-4 border-[#d97706]'
          : 'text-[#0d5d3a] hover:bg-[#e6f4ea]'
      }`}
      title={!expanded ? label : undefined}
    >
      <Icon size={16} className="shrink-0" />
      {expanded && <span className="whitespace-nowrap overflow-hidden">{label}</span>}
    </button>
  );
}
