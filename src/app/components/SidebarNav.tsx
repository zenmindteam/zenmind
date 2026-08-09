import React, { useState } from 'react';
import {
  MessageCircle,
  Stethoscope,
  Calendar,
  BarChart2,
  BookHeart,
  Users2,
  Target,
  Globe2,
  Dumbbell,
  Library,
  BookMarked,
  ShoppingBag,
  Settings,
  ChevronDown,
  ChevronRight,
  HeartPulse,
  Sparkles,
  FolderHeart,
  Plus,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'Care & Support',
    icon: <HeartPulse className="w-4 h-4 flex-shrink-0" />,
    items: [
      { key: 'aichat', label: 'AI Chat', icon: <MessageCircle className="w-4 h-4 flex-shrink-0" /> },
      { key: 'therapy', label: 'Therapy Hub', icon: <Stethoscope className="w-4 h-4 flex-shrink-0" /> },
      { key: 'sessions', label: 'My Sessions', icon: <Calendar className="w-4 h-4 flex-shrink-0" /> },
    ],
  },
  {
    title: 'My Journey',
    icon: <Sparkles className="w-4 h-4 flex-shrink-0" />,
    items: [
      { key: 'progress', label: 'My Progress', icon: <BarChart2 className="w-4 h-4 flex-shrink-0" /> },
      { key: 'journal', label: 'Mood Journal', icon: <BookHeart className="w-4 h-4 flex-shrink-0" /> },
      { key: 'goals', label: 'My Goals', icon: <Target className="w-4 h-4 flex-shrink-0" /> },
    ],
  },
  {
    title: 'Wellness Hub',
    icon: <FolderHeart className="w-4 h-4 flex-shrink-0" />,
    items: [
      { key: 'resources', label: 'Resources', icon: <Library className="w-4 h-4 flex-shrink-0" /> },
      { key: 'reading', label: 'Reading Lists', icon: <BookMarked className="w-4 h-4 flex-shrink-0" /> },
      { key: 'programs', label: 'Wellness Programs', icon: <Dumbbell className="w-4 h-4 flex-shrink-0" /> },
      { key: 'store', label: 'Store', icon: <ShoppingBag className="w-4 h-4 flex-shrink-0" /> },
    ],
  },
  {
    title: 'Community',
    icon: <Globe2 className="w-4 h-4 flex-shrink-0" />,
    items: [
      { key: 'community', label: 'Community', icon: <Globe2 className="w-4 h-4 flex-shrink-0" /> },
      { key: 'circles', label: 'Peer Circles', icon: <Users2 className="w-4 h-4 flex-shrink-0" /> },
    ],
  },
  { key: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 flex-shrink-0" /> },
];

export default function SidebarNav({ tab, navigateToTab, collapsed, setCollapsed }: any) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const handleGroupClick = (groupTitle: string, hasItems: boolean) => {
    if (!hasItems && setCollapsed) {
      return;
    }
    if (collapsed && setCollapsed) setCollapsed(false);
    setExpandedGroup(prev => (prev === groupTitle ? null : groupTitle));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Google Drive / Workspace Floating "+ New" Action Button */}
      <div className="relative mb-2 px-1">
        <button
          type="button"
          onClick={() => {
            if (collapsed && setCollapsed) setCollapsed(false);
            setShowQuickMenu(prev => !prev);
          }}
          className={`flex items-center gap-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/80 shadow-md hover:shadow-lg border border-gray-200/80 dark:border-gray-700/60 rounded-2xl transition-all duration-200 ${
            collapsed ? 'w-12 h-12 justify-center p-0 mx-auto' : 'px-5 py-3.5 w-full'
          }`}
          title="New Quick Action"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm tracking-wide text-gray-700 dark:text-gray-200">
              New Check-in
            </span>
          )}
        </button>

        {/* Quick Create Dropdown Menu */}
        {showQuickMenu && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1.5">
              Quick Actions
            </div>
            <button
              onClick={() => { navigateToTab('aichat'); setShowQuickMenu(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 rounded-xl transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>Start AI Chat</span>
            </button>
            <button
              onClick={() => { navigateToTab('journal'); setShowQuickMenu(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 rounded-xl transition"
            >
              <BookHeart className="w-4 h-4 text-emerald-500" />
              <span>Record Mood Journal</span>
            </button>
            <button
              onClick={() => { navigateToTab('therapy'); setShowQuickMenu(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 rounded-xl transition"
            >
              <Stethoscope className="w-4 h-4 text-emerald-500" />
              <span>Book Therapy Session</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex flex-col gap-1.5">
        {NAV_GROUPS.map((group: any) => {
          if (!group.items) {
            const active = tab === group.key;
            return (
              <button
                key={group.key}
                type="button"
                onClick={() => navigateToTab(group.key)}
                title={collapsed ? group.label : undefined}
                className={`w-full flex items-center ${collapsed ? 'justify-center px-0 h-10' : 'gap-3 px-4 py-2.5'} rounded-full transition-all duration-200 text-sm font-medium ${
                  active
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`}
              >
                {group.icon}
                {!collapsed && <span className="whitespace-nowrap overflow-hidden">{group.label}</span>}
              </button>
            );
          }

          const isGroupActive = group.items.some((i: any) => i.key === tab);
          const isExpanded = expandedGroup === group.title || isGroupActive;

          return (
            <div key={group.title} className="flex flex-col gap-0.5">
              {/* Group header */}
              <button
                type="button"
                onClick={() => handleGroupClick(group.title, true)}
                title={collapsed ? group.title : undefined}
                className={`w-full flex items-center justify-between ${collapsed ? 'px-0 justify-center h-10' : 'px-4 py-2'} rounded-full transition-all text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/40`}
              >
                <div className="flex items-center gap-3">
                  {group.icon}
                  {!collapsed && (
                    <span className="whitespace-nowrap overflow-hidden text-xs font-semibold uppercase tracking-wider opacity-70">
                      {group.title}
                    </span>
                  )}
                </div>
                {collapsed ? null : isExpanded ? (
                  <ChevronDown size={14} className="opacity-60" />
                ) : (
                  <ChevronRight size={14} className="opacity-60" />
                )}
              </button>

              {/* Group items */}
              {isExpanded && !collapsed && (
                <div className="flex flex-col gap-1 pl-3 my-0.5">
                  {group.items.map((item: any) => {
                    const active = tab === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => navigateToTab(item.key)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-full transition-all text-xs font-medium ${
                          active
                            ? 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                        }`}
                      >
                        <div className={active ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-500 dark:text-gray-400'}>
                          {item.icon}
                        </div>
                        <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Google Drive style Storage/Status Widget at bottom of sidebar */}
      {!collapsed && (
        <div className="mt-4 mx-1 p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/60 dark:border-gray-700/50 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700 dark:text-gray-200">ZenMind Status</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
              Unlimited
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-full rounded-full animate-pulse" />
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            All features 100% unlocked & free
          </span>
        </div>
      )}
    </div>
  );
}
