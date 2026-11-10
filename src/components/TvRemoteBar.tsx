import React from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Tv, 
  Layers, 
  HardDrive, 
  Ratio,
  Info
} from 'lucide-react';
import { Channel, AspectRatioMode } from '../types/tv';

interface TvRemoteBarProps {
  activeChannel: Channel;
  channelIndex: number;
  totalChannels: number;
  onNextChannel: () => void;
  onPrevChannel: () => void;
  aspectRatio: AspectRatioMode;
  onChangeAspectRatio: (mode: AspectRatioMode) => void;
  isTheater: boolean;
  onToggleTheater: () => void;
  onOpenLocalModal: () => void;
  onOpenBloggerModal: () => void;
}

export const TvRemoteBar: React.FC<TvRemoteBarProps> = ({
  activeChannel,
  channelIndex,
  totalChannels,
  onNextChannel,
  onPrevChannel,
  aspectRatio,
  onChangeAspectRatio,
  isTheater,
  onToggleTheater,
  onOpenLocalModal,
  onOpenBloggerModal,
}) => {
  const nextAspect = () => {
    if (aspectRatio === '16:9') onChangeAspectRatio('fill');
    else if (aspectRatio === 'fill') onChangeAspectRatio('4:3');
    else onChangeAspectRatio('16:9');
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Channel info and zapping */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-0.5">
          <button
            onClick={onPrevChannel}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors"
            title="Kênh trước (Mũi tên Trái)"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono font-bold text-rose-400 text-xs">
            CH {channelIndex + 1}/{totalChannels}
          </span>
          <button
            onClick={onNextChannel}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors"
            title="Kênh tiếp theo (Mũi tên Phải)"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden sm:block text-slate-300 font-medium truncate max-w-[200px]">
          {activeChannel.name}
        </div>
      </div>

      {/* Quick Action Tools */}
      <div className="flex items-center gap-2">
        {/* Aspect Ratio Cycler */}
        <button
          onClick={nextAspect}
          className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 font-mono text-[11px] transition-colors"
          title="Đổi tỉ lệ màn hình (16:9 / Toàn màn / 4:3)"
        >
          <Ratio className="w-3.5 h-3.5 text-slate-400" />
          <span>{aspectRatio.toUpperCase()}</span>
        </button>

        {/* Theater Mode */}
        <button
          onClick={onToggleTheater}
          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
            isTheater
              ? 'bg-rose-950/50 border-rose-600 text-rose-300'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Chế độ rạp chiếu phim"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Rạp chiếu</span>
        </button>

        {/* Local Package */}
        <button
          onClick={onOpenLocalModal}
          className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 text-[11px] transition-colors"
          title="Đóng gói và tải về xem local"
        >
          <HardDrive className="w-3.5 h-3.5 text-rose-400" />
          <span>Gói Local</span>
        </button>

        {/* Blogger Widget */}
        <button
          onClick={onOpenBloggerModal}
          className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 text-[11px] transition-colors"
          title="Tạo mã nhúng Blogger CSS"
        >
          <Layers className="w-3.5 h-3.5 text-orange-400" />
          <span>Blogger CSS</span>
        </button>
      </div>
    </div>
  );
};
