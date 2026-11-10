import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Heart, 
  Play, 
  Grid, 
  List, 
  CheckCircle2, 
  Radio,
  Globe2,
  Sparkles
} from 'lucide-react';
import { Channel, CountryCode, ChannelCategory } from '../types/tv';

interface ChannelGridProps {
  channels: Channel[];
  activeChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
  selectedCountry: 'ALL' | CountryCode;
  onSelectCountry: (country: 'ALL' | CountryCode) => void;
  selectedCategory: 'all' | ChannelCategory;
  onSelectCategory: (category: 'all' | ChannelCategory) => void;
}

export const getCountryFlag = (code: CountryCode): string => {
  switch (code) {
    case 'VN': return '🇻🇳';
    case 'US': return '🇺🇸';
    case 'JP': return '🇯🇵';
    case 'KR': return '🇰🇷';
    case 'UK': return '🇬🇧';
    case 'EU': return '🇪🇺';
    case 'AU': return '🇦🇺';
    case 'GL': return '🌌';
    default: return '🌐';
  }
};

export const getCountryName = (code: CountryCode): string => {
  switch (code) {
    case 'VN': return 'Việt Nam';
    case 'US': return 'Hoa Kỳ';
    case 'JP': return 'Nhật Bản';
    case 'KR': return 'Hàn Quốc';
    case 'UK': return 'Vương quốc Anh';
    case 'EU': return 'Châu Âu';
    case 'AU': return 'Úc';
    case 'GL': return 'Không gian & Thiên nhiên';
    default: return 'Quốc tế';
  }
};

const COUNTRY_TABS: { code: 'ALL' | CountryCode; label: string; icon: string }[] = [
  { code: 'ALL', label: 'Toàn Cầu', icon: '🌐' },
  { code: 'VN', label: 'Việt Nam', icon: '🇻🇳' },
  { code: 'US', label: 'Hoa Kỳ', icon: '🇺🇸' },
  { code: 'JP', label: 'Nhật Bản', icon: '🇯🇵' },
  { code: 'KR', label: 'Hàn Quốc', icon: '🇰🇷' },
  { code: 'UK', label: 'Anh Quốc', icon: '🇬🇧' },
  { code: 'EU', label: 'Châu Âu', icon: '🇪🇺' },
  { code: 'AU', label: 'Úc', icon: '🇦🇺' },
  { code: 'GL', label: 'Vũ Trụ & Sinh Thái', icon: '🌌' },
];

const CATEGORY_LABELS: Record<'all' | ChannelCategory, string> = {
  all: 'Tất cả thể loại',
  national: 'Kênh Quốc gia',
  news: 'Thời sự & Quốc tế',
  music: 'Âm nhạc & Thư giãn 🎵',
  comedy: 'Hài kịch & Cải lương 🎭',
  wildlife: 'Cuộc sống hoang dã 🦁',
  diy: 'Xây dựng & Sửa chữa 🔨',
  education: 'Khoa học & Giáo dục',
  nature: 'Thiên nhiên & Không gian',
  local: 'Đài Địa phương',
  entertainment: 'Văn hóa & Nghệ thuật',
  sports: 'Thể thao & Hoạt động',
  weather: 'Khí tượng & Môi trường',
};

export const ChannelGrid: React.FC<ChannelGridProps> = ({
  channels,
  activeChannel,
  onSelectChannel,
  favorites,
  onToggleFavorite,
  selectedCountry,
  onSelectCountry,
  selectedCategory,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      // Country filter
      if (selectedCountry !== 'ALL' && ch.country !== selectedCountry) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && ch.category !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (onlyFavorites && !favorites.includes(ch.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = ch.name.toLowerCase().includes(q);
        const matchNumber = ch.channelNumber.toString() === q;
        const matchDesc = ch.description.toLowerCase().includes(q);
        const matchLicense = ch.license.toLowerCase().includes(q);
        const matchCountry = getCountryName(ch.country).toLowerCase().includes(q);
        if (!matchName && !matchNumber && !matchDesc && !matchLicense && !matchCountry) {
          return false;
        }
      }
      return true;
    });
  }, [channels, selectedCountry, selectedCategory, onlyFavorites, favorites, searchQuery]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search, Country & Category Controls Bar */}
      <div className="flex flex-col gap-3 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
        {/* Country Tabs Scrollable Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {COUNTRY_TABS.map((tab) => {
            const count = tab.code === 'ALL' 
              ? channels.length 
              : channels.filter((c) => c.country === tab.code).length;

            return (
              <button
                key={tab.code}
                onClick={() => onSelectCountry(tab.code)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  selectedCountry === tab.code
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Box, Favorites, and View Mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
          {/* Category Horizontal Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {(Object.keys(CATEGORY_LABELS) as ('all' | ChannelCategory)[]).map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-rose-400 border border-rose-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm kênh, quốc gia, thể loại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setOnlyFavorites((prev) => !prev)}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                onlyFavorites
                  ? 'bg-rose-950/50 border-rose-600 text-rose-300'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Chỉ hiện kênh yêu thích"
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current text-rose-500' : ''}`} />
              <span className="hidden md:inline font-mono text-[11px]">{favorites.length}</span>
            </button>

            <div className="hidden sm:flex items-center p-0.5 bg-slate-950/80 border border-slate-800 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Dạng lưới"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Dạng danh sách"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Cards Grid or List */}
      {filteredChannels.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-xl p-8">
          <p className="text-sm text-slate-400 mb-2">Không tìm thấy kênh phù hợp với bộ lọc tìm kiếm</p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCountry('ALL');
              onSelectCategory('all');
              setOnlyFavorites(false);
            }}
            className="px-3.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredChannels.map((ch) => {
            const isActive = activeChannel.id === ch.id;
            const isFav = favorites.includes(ch.id);

            return (
              <div
                key={ch.id}
                onClick={() => onSelectChannel(ch)}
                className={`group relative flex flex-col justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 border-rose-500/80 shadow-lg shadow-rose-950/20 ring-1 ring-rose-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                {/* Header: Channel Number, Title, Favorite */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-rose-400 transition-colors">
                        #{ch.channelNumber.toString().padStart(2, '0')}
                      </span>
                      <span className="text-base">{getCountryFlag(ch.country)}</span>
                      <h4 className="text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-rose-300 transition-colors">
                        {ch.name}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(ch.id);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-500 transition-colors"
                      title={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Metadata line: No pill boxes, clean typographic separators */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                    <span>{getCountryName(ch.country)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-mono text-[11px]">{ch.resolution}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-sky-400 text-[11px] font-medium">{ch.defaultMode === 'embed' ? 'Luồng 24/7' : 'HLS Trực tiếp'}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {ch.description}
                  </p>
                </div>

                {/* Footer: Current show / EPG preview & Play Status */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[70%]">
                    <Radio className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate text-[11px]">
                      {ch.schedule && ch.schedule[0] ? ch.schedule[0].title : 'Đang phát sóng trực tiếp'}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    {isActive ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đang phát
                      </span>
                    ) : (
                      <span className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] font-medium text-slate-300 transition-opacity">
                        <Play className="w-3 h-3 fill-current text-rose-500" />
                        Xem ngay
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div className="flex flex-col divide-y divide-slate-800/80 bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          {filteredChannels.map((ch) => {
            const isActive = activeChannel.id === ch.id;
            const isFav = favorites.includes(ch.id);

            return (
              <div
                key={ch.id}
                onClick={() => onSelectChannel(ch)}
                className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-rose-950/20 text-white'
                    : 'hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-500 w-7">
                    #{ch.channelNumber.toString().padStart(2, '0')}
                  </span>
                  <span className="text-lg">{getCountryFlag(ch.country)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{ch.name}</span>
                      {isActive && (
                        <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                          ĐANG XEM
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{getCountryName(ch.country)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-emerald-400 text-[11px]">{ch.resolution}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-sky-400 text-[11px]">{ch.defaultMode === 'embed' ? 'Luồng 24/7' : 'HLS'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="hidden sm:inline truncate max-w-xs">{ch.description}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(ch.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-rose-500' : ''}`} />
                  </button>
                  <button
                    className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
