import React from 'react';
import { Calendar, Clock, Tv, ExternalLink } from 'lucide-react';
import { Channel } from '../types/tv';

interface EpgGuideProps {
  channel: Channel;
}

export const EpgGuide: React.FC<EpgGuideProps> = ({ channel }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-semibold text-white">
            Lịch phát sóng & Khung giờ ({channel.name})
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Hôm nay</span>
          {channel.officialSite && (
            <a
              href={channel.officialSite}
              target="_blank"
              rel="noreferrer noopener"
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors ml-2"
            >
              <span>Xem chi tiết</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Program Timeline */}
      <div className="divide-y divide-slate-800/60">
        {channel.schedule && channel.schedule.length > 0 ? (
          channel.schedule.map((prog, index) => (
            <div
              key={index}
              className={`py-2.5 flex items-center justify-between transition-colors ${
                prog.isLive ? 'text-rose-400 font-medium' : 'text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs w-14 text-slate-500 font-semibold">
                  {prog.time}
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  {prog.title}
                </span>
              </div>

              {prog.isLive ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-rose-600 px-2 py-0.5 rounded">
                  Đang diễn ra
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">Dự kiến</span>
              )}
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">
            Kênh trực tiếp liên tục 24/7 theo tín hiệu vệ tinh của đài.
          </div>
        )}
      </div>
    </div>
  );
};
