import React from 'react';
import { Tv, HardDrive, Layout, ShieldCheck, Download, PlusCircle } from 'lucide-react';

interface HeaderProps {
  onOpenLocalModal: () => void;
  onOpenBloggerModal: () => void;
  onOpenLicenseModal: () => void;
  onScrollToEpg: () => void;
  onScrollToChannels: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLocalModal,
  onOpenBloggerModal,
  onOpenLicenseModal,
  onScrollToEpg,
  onScrollToChannels,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="p-1.5 bg-rose-600 rounded-lg text-white shadow-md shadow-rose-900/30">
            <Tv className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            OpenTV <span className="text-rose-500 font-medium text-sm">· Toàn Cầu (World)</span>
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={onScrollToChannels}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Danh sách kênh
          </button>
          <button
            onClick={onScrollToEpg}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Lịch phát sóng
          </button>
          <button
            onClick={onOpenLocalModal}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <HardDrive className="w-3.5 h-3.5 text-rose-400" />
            <span>Đóng gói Local</span>
          </button>
          <button
            onClick={onOpenBloggerModal}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Layout className="w-3.5 h-3.5 text-orange-400" />
            <span>Blogger CSS</span>
          </button>
          <button
            onClick={onOpenLicenseModal}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bản quyền mở</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenLocalModal}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất M3U / HTML</span>
            <span className="sm:hidden">Xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};
