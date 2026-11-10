import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  HardDrive, 
  Layout, 
  ShieldCheck, 
  Radio, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  Calendar,
  Info,
  Maximize2
} from 'lucide-react';
import { Channel, CountryCode, ChannelCategory, AspectRatioMode } from './types/tv';
import { INITIAL_CHANNELS } from './data/channels';
import { HlsPlayer } from './components/HlsPlayer';
import { ChannelGrid, getCountryFlag, getCountryName } from './components/ChannelGrid';
import { EpgGuide } from './components/EpgGuide';
import { Header } from './components/Header';
import { LocalPackagingModal } from './components/LocalPackagingModal';
import { BloggerExportModal } from './components/BloggerExportModal';
import { LicenseModal } from './components/LicenseModal';
import { TvRemoteBar } from './components/TvRemoteBar';

const STORAGE_KEY_FAVORITES = 'opentv_favorites_v4';
const STORAGE_KEY_CUSTOM_CHANNELS = 'opentv_custom_channels_v4';
const STORAGE_KEY_LAST_CHANNEL = 'opentv_last_channel_id_v4';

export default function App() {
  const [channels, setChannels] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_CHANNELS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...INITIAL_CHANNELS, ...parsed];
        }
      }
    } catch {
      // localStorage error fallback
    }
    return INITIAL_CHANNELS;
  });

  const [activeChannelId, setActiveChannelId] = useState<string>(() => {
    try {
      const last = localStorage.getItem(STORAGE_KEY_LAST_CHANNEL);
      if (last && INITIAL_CHANNELS.some((c) => c.id === last)) {
        return last;
      }
    } catch {
      // fallback
    }
    return INITIAL_CHANNELS[0].id;
  });

  const [selectedCountry, setSelectedCountry] = useState<'ALL' | CountryCode>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ChannelCategory>('all');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('16:9');
  const [isTheater, setIsTheater] = useState<boolean>(false);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const favs = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return favs ? JSON.parse(favs) : ['vn-vtv1', 'us-nasa-public'];
    } catch {
      return ['vn-vtv1', 'us-nasa-public'];
    }
  });

  // Modals
  const [isLocalModalOpen, setIsLocalModalOpen] = useState<boolean>(false);
  const [isBloggerModalOpen, setIsBloggerModalOpen] = useState<boolean>(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState<boolean>(false);

  const channelsSectionRef = useRef<HTMLDivElement | null>(null);
  const epgSectionRef = useRef<HTMLDivElement | null>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const activeChannelIndex = channels.findIndex((c) => c.id === activeChannel.id);

  // Save last channel & favorites
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LAST_CHANNEL, activeChannel.id);
    } catch {}
  }, [activeChannel]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectChannel = (ch: Channel) => {
    setActiveChannelId(ch.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextChannel = () => {
    const nextIdx = (activeChannelIndex + 1) % channels.length;
    setActiveChannelId(channels[nextIdx].id);
  };

  const handlePrevChannel = () => {
    const prevIdx = (activeChannelIndex - 1 + channels.length) % channels.length;
    setActiveChannelId(channels[prevIdx].id);
  };

  const handleAddChannel = (newCh: Channel) => {
    setChannels((prev) => {
      const updated = [...prev, newCh];
      try {
        const customs = updated.filter((c) => c.isCustom);
        localStorage.setItem(STORAGE_KEY_CUSTOM_CHANNELS, JSON.stringify(customs));
      } catch {}
      return updated;
    });
    setActiveChannelId(newCh.id);
  };

  const handleImportChannels = (imported: Partial<Channel>[]) => {
    const validChannels: Channel[] = imported.map((p, idx) => ({
      id: p.id || `custom-m3u-${Date.now()}-${idx}`,
      channelNumber: channels.length + idx + 1,
      name: p.name || `Kênh ${idx + 1}`,
      country: (p.country as CountryCode) || 'VN',
      category: (p.category as ChannelCategory) || 'news',
      streamUrl: p.streamUrl || '',
      resolution: p.resolution || 'Auto',
      license: 'Kênh nhập M3U cá nhân',
      description: p.description || 'Kênh truyền hình nhập từ danh sách M3U người dùng.',
      schedule: [{ time: '00:00', title: 'Phát trực tiếp theo luồng' }],
      isCustom: true,
    }));

    setChannels((prev) => {
      const merged = [...prev, ...validChannels];
      try {
        const customs = merged.filter((c) => c.isCustom);
        localStorage.setItem(STORAGE_KEY_CUSTOM_CHANNELS, JSON.stringify(customs));
      } catch {}
      return merged;
    });

    if (validChannels.length > 0) {
      setActiveChannelId(validChannels[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-zone Header Contract */}
      <Header
        onOpenLocalModal={() => setIsLocalModalOpen(true)}
        onOpenBloggerModal={() => setIsBloggerModalOpen(true)}
        onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
        onScrollToChannels={() => channelsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onScrollToEpg={() => epgSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
        {/* Top Hero / Player Section */}
        <div className={`flex flex-col gap-4 ${isTheater ? 'max-w-6xl mx-auto w-full' : ''}`}>
          {/* Main Stage Grid: Player & Side EPG */}
          <div className={`grid gap-5 ${isTheater ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
            {/* TV Screen Player Area (8 cols on desktop or 12 in theater) */}
            <div className={`flex flex-col gap-3 ${isTheater ? 'lg:col-span-12' : 'lg:col-span-8'}`}>
              <HlsPlayer
                channel={activeChannel}
                aspectRatio={aspectRatio}
                isTheater={isTheater}
                onToggleTheater={() => setIsTheater((prev) => !prev)}
                onNextChannel={handleNextChannel}
                onPrevChannel={handlePrevChannel}
              />

              {/* TV Remote Zapping & Quick Controls Toolbar */}
              <TvRemoteBar
                activeChannel={activeChannel}
                channelIndex={activeChannelIndex}
                totalChannels={channels.length}
                onNextChannel={handleNextChannel}
                onPrevChannel={handlePrevChannel}
                aspectRatio={aspectRatio}
                onChangeAspectRatio={setAspectRatio}
                isTheater={isTheater}
                onToggleTheater={() => setIsTheater((prev) => !prev)}
                onOpenLocalModal={() => setIsLocalModalOpen(true)}
                onOpenBloggerModal={() => setIsBloggerModalOpen(true)}
              />

              {/* Active Channel Details Card */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{getCountryFlag(activeChannel.country)}</span>
                    <h1 className="text-lg font-bold text-white tracking-tight">
                      {activeChannel.name}
                    </h1>
                  </div>

                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>{getCountryName(activeChannel.country)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-mono text-[11px]">{activeChannel.resolution}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-rose-400 font-medium">{activeChannel.license}</span>
                    {activeChannel.officialSite && (
                      <>
                        <span aria-hidden="true">·</span>
                        <a
                          href={activeChannel.officialSite}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="hover:text-slate-200 transition-colors flex items-center gap-1"
                        >
                          <span>Trang nhà đài</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
                    {activeChannel.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleFavorite(activeChannel.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      favorites.includes(activeChannel.id)
                        ? 'bg-rose-950/40 border-rose-600 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{favorites.includes(activeChannel.id) ? 'Đã yêu thích' : 'Lưu yêu thích'}</span>
                  </button>
                  <button
                    onClick={() => setIsBloggerModalOpen(true)}
                    className="px-3 py-1.5 bg-orange-950/30 border border-orange-500/30 text-orange-300 hover:bg-orange-900/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Lấy mã Blogger</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Side Column: Electronic Program Guide (EPG) (4 cols on desktop) */}
            <div ref={epgSectionRef} className={`flex flex-col gap-4 ${isTheater ? 'lg:col-span-12' : 'lg:col-span-4'}`}>
              <EpgGuide channel={activeChannel} />

              {/* Quick Info Box */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Tuân thủ bản quyền & Tự do truy cập</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Tất cả các kênh trên hệ thống được phân phối công khai qua internet theo diện Kênh thiết yếu quốc gia (VN) hoặc Public Domain / FTA hợp pháp (US). Không mã hóa, không thu phí.
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Phím tắt: Space (Phát), F (Toàn màn hình)</span>
                  <button
                    onClick={() => setIsLicenseModalOpen(true)}
                    className="text-rose-400 hover:text-rose-300 underline font-medium"
                  >
                    Xem chính sách
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Channels Directory Section */}
        <div ref={channelsSectionRef} className="flex flex-col gap-4 pt-4 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Hệ Thống Kênh Truyền Hình Mở Toàn Cầu (World TV)</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  ({channels.length} kênh khả dụng)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Lựa chọn kênh phát thanh, thời sự quốc tế, khoa học vũ trụ và đại dương miễn phí
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLocalModalOpen(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span>Xuất M3U</span>
              </button>
              <button
                onClick={() => setIsBloggerModalOpen(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Layout className="w-3.5 h-3.5 text-orange-400" />
                <span>Nhúng Blogger</span>
              </button>
            </div>
          </div>

          <ChannelGrid
            channels={channels}
            activeChannel={activeChannel}
            onSelectChannel={handleSelectChannel}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* 3 Core Capability Highlights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
          <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
                <HardDrive className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">
                Chạy Localhost & Đóng Gói Offline
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tải file HTML độc lập chứa toàn bộ mã nguồn để xem trực tiếp trên máy không cần kết nối server, hoặc xuất file M3U phát trên VLC, PotPlayer và Smart TV.
              </p>
            </div>
            <div className="pt-3">
              <button
                onClick={() => setIsLocalModalOpen(true)}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <span>Mở công cụ đóng gói</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3">
                <Layout className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">
                Tương Thích Template CSS Google Blogger
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Được viết tối ưu để tích hợp vào Blogspot thông qua tiện ích HTML/JavaScript Gadget hoặc nhúng trực tiếp trong bài viết với CSS chuẩn responsive 16:9.
              </p>
            </div>
            <div className="pt-3">
              <button
                onClick={() => setIsBloggerModalOpen(true)}
                className="text-xs font-medium text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
              >
                <span>Lấy mã nhúng & CSS</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">
                Bản Quyền Mở & Kênh Công Cộng
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chỉ cung cấp luồng phát Free-to-Air, Kênh thiết yếu quốc gia Việt Nam (VTV, VTC, Quốc Hội, VOV) và Public Domain Hoa Kỳ (NASA, Bloomberg Free, WeatherNation).
              </p>
            </div>
            <div className="pt-3">
              <button
                onClick={() => setIsLicenseModalOpen(true)}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <span>Xem tuyên bố pháp lý</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-rose-500" />
            <span className="font-semibold text-slate-300">OpenTV VN & US</span>
            <span>· Ứng dụng xem truyền hình mở cho Localhost & Google Blogger</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsLocalModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Gói Offline
            </button>
            <button
              onClick={() => setIsBloggerModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Mã Blogger
            </button>
            <button
              onClick={() => setIsLicenseModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Chính sách bản quyền
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LocalPackagingModal
        isOpen={isLocalModalOpen}
        onClose={() => setIsLocalModalOpen(false)}
        channels={channels}
        onAddChannel={handleAddChannel}
        onImportChannels={handleImportChannels}
      />

      <BloggerExportModal
        isOpen={isBloggerModalOpen}
        onClose={() => setIsBloggerModalOpen(false)}
        activeChannel={activeChannel}
      />

      <LicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      />
    </div>
  );
}
