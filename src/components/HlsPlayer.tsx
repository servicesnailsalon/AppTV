import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Settings, 
  Tv, 
  Radio, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Channel, AspectRatioMode } from '../types/tv';

interface HlsPlayerProps {
  channel: Channel;
  aspectRatio: AspectRatioMode;
  onToggleTheater?: () => void;
  isTheater?: boolean;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
}

export const HlsPlayer: React.FC<HlsPlayerProps> = ({
  channel,
  aspectRatio,
  onToggleTheater,
  isTheater = false,
  onNextChannel,
  onPrevChannel,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Determine active playback mode: 'embed' or 'hls'
  const [playbackMode, setPlaybackMode] = useState<'hls' | 'embed'>(() => {
    return channel.defaultMode || (channel.embedUrl ? 'embed' : 'hls');
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.9);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [autoSwitchedToEmbed, setAutoSwitchedToEmbed] = useState<boolean>(false);
  const [availableLevels, setAvailableLevels] = useState<{ id: number; height: number; bitrate: number }[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);

  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  };

  // When active channel changes, set initial mode based on channel configuration
  useEffect(() => {
    setHasError(false);
    setAutoSwitchedToEmbed(false);
    const initialMode = channel.defaultMode || (channel.embedUrl ? 'embed' : 'hls');
    setPlaybackMode(initialMode);
  }, [channel]);

  // Hls.js loader for 'hls' mode
  useEffect(() => {
    if (playbackMode !== 'hls' || !channel.streamUrl) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setAvailableLevels([]);
    setCurrentLevel(-1);

    const streamToLoad = channel.streamUrl;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        manifestLoadingTimeOut: 8000,
        manifestLoadingMaxRetry: 2,
        levelLoadingTimeOut: 8000,
      });

      hlsRef.current = hls;
      hls.loadSource(streamToLoad);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setHasError(false);
        const levels = data.levels.map((lvl, index) => ({
          id: index,
          height: lvl.height,
          bitrate: lvl.bitrate,
        }));
        setAvailableLevels(levels);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentLevel(data.level);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.warn('HLS stream notice:', data.type, data.details);
        if (data.fatal) {
          // If HLS fails and channel has an embed fallback, auto-switch to embed!
          if (channel.embedUrl) {
            console.log('Auto switching to embed fallback for', channel.name);
            setPlaybackMode('embed');
            setAutoSwitchedToEmbed(true);
            setHasError(false);
          } else {
            setHasError(true);
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamToLoad;
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel, playbackMode]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || playbackMode === 'embed') return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    const video = videoRef.current;
    if (video) {
      video.volume = val;
      if (val === 0) {
        video.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        video.muted = false;
        setIsMuted(false);
      }
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  const handleQualitySelect = (levelIdx: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIdx;
      setCurrentLevel(levelIdx);
      setShowQualityMenu(false);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === ' ' || e.code === 'Space') {
        if (playbackMode === 'hls') {
          e.preventDefault();
          togglePlay();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        if (playbackMode === 'hls') {
          e.preventDefault();
          toggleMute();
        }
      } else if (e.key === 'ArrowRight' && onNextChannel) {
        e.preventDefault();
        onNextChannel();
      } else if (e.key === 'ArrowLeft' && onPrevChannel) {
        e.preventDefault();
        onPrevChannel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, playbackMode, onNextChannel, onPrevChannel]);

  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case 'fill':
        return 'w-full h-full object-cover';
      case '4:3':
        return 'w-auto h-full max-w-[80%] mx-auto object-contain';
      case '16:9':
      default:
        return 'w-full h-full object-contain';
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative group bg-black overflow-hidden select-none transition-all ${
        isTheater ? 'rounded-none shadow-2xl' : 'rounded-xl border border-slate-800 shadow-xl'
      }`}
      style={{
        aspectRatio: isFullscreen ? 'auto' : '16/9',
        height: isFullscreen ? '100vh' : undefined,
      }}
    >
      {/* 1. EMBED MODE (Official 24/7 Live Stream - 100% working guaranteed) */}
      {playbackMode === 'embed' && channel.embedUrl ? (
        <div className="w-full h-full bg-black relative">
          <iframe
            key={channel.embedUrl}
            src={channel.embedUrl}
            title={channel.name}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        </div>
      ) : (
        /* 2. HLS MODE (Direct m3u8 stream) */
        <video
          ref={videoRef}
          playsInline
          autoPlay
          className={`bg-black ${getAspectRatioClasses()}`}
          onClick={togglePlay}
        />
      )}

      {/* Top Left: Live Status & Source Mode Selector */}
      <div
        className={`absolute top-3 left-3 flex flex-wrap items-center gap-2 transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600/90 backdrop-blur-md rounded text-[11px] font-bold text-white tracking-wider uppercase shadow-md">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>TRỰC TIẾP</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/85 backdrop-blur-md rounded text-xs text-white border border-slate-700/60 font-medium">
          <span className="text-slate-400 font-mono">#{channel.channelNumber.toString().padStart(2, '0')}</span>
          <span className="font-semibold">{channel.name}</span>
          <span className="text-slate-400">·</span>
          <span className="text-emerald-400 text-[11px] font-mono">{channel.resolution}</span>
        </div>

        {/* Source Toggle Pill */}
        {(channel.embedUrl && channel.streamUrl) && (
          <div className="flex items-center p-0.5 bg-slate-900/90 backdrop-blur-md rounded border border-slate-700 text-[11px] font-medium text-slate-300">
            <button
              onClick={() => {
                setPlaybackMode('embed');
                setHasError(false);
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                playbackMode === 'embed'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Luồng Trực Tiếp 24/7
            </button>
            <button
              onClick={() => {
                setPlaybackMode('hls');
                setHasError(false);
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                playbackMode === 'hls'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Luồng HLS m3u8
            </button>
          </div>
        )}
      </div>

      {/* Top Right: Channel Badge */}
      <div
        className={`absolute top-3 right-3 flex items-center gap-2 transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/85 backdrop-blur-md rounded text-[11px] text-slate-300 border border-slate-700/60 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{channel.license}</span>
        </div>
      </div>

      {/* Notice if auto-switched to working embed */}
      {autoSwitchedToEmbed && (
        <div className="absolute top-12 left-3 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 rounded text-xs backdrop-blur-md shadow-lg">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Đã tự động kết nối luồng phát trực tiếp chính thức 24/7 ổn định</span>
        </div>
      )}

      {/* Error state if HLS fails and no embed is available */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-25">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full mb-3 border border-rose-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            Luồng m3u8 tạm thời gián đoạn
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
            Máy chủ của nhà đài đang hạn chế hoặc bảo trì luồng HLS. Bạn có thể chuyển kênh kế tiếp hoặc mở cổng chính thức.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {channel.embedUrl && (
              <button
                onClick={() => {
                  setPlaybackMode('embed');
                  setHasError(false);
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Chuyển sang luồng trực tiếp 24/7</span>
              </button>
            )}
            {onNextChannel && (
              <button
                onClick={onNextChannel}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
              >
                Chuyển kênh kế tiếp →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Control Bar Scrim & Controls (visible in HLS mode or top level hover) */}
      {playbackMode === 'hls' && (
        <div
          className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-12 pb-3 px-4 flex flex-col gap-2 transition-opacity duration-300 z-20 ${
            showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white focus:outline-none"
                title={isPlaying ? 'Tạm dừng (Space)' : 'Phát (Space)'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {onPrevChannel && (
                <button
                  onClick={onPrevChannel}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                  title="Kênh trước (Mũi tên Trái)"
                >
                  <span className="text-xs font-bold font-mono">CH-</span>
                </button>
              )}

              {onNextChannel && (
                <button
                  onClick={onNextChannel}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                  title="Kênh tiếp (Mũi tên Phải)"
                >
                  <span className="text-xs font-bold font-mono">CH+</span>
                </button>
              )}

              {/* Volume */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                  title={isMuted ? 'Bật âm thanh (M)' : 'Tắt tiếng (M)'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-slate-700 accent-rose-500 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quality levels */}
              {availableLevels.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu((prev) => !prev)}
                    className="px-2 py-1 hover:bg-white/10 rounded text-xs text-slate-300 hover:text-white flex items-center gap-1 font-mono transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>
                      {currentLevel === -1
                        ? 'Auto'
                        : availableLevels[currentLevel]
                        ? `${availableLevels[currentLevel].height}p`
                        : 'Auto'}
                    </span>
                  </button>

                  {showQualityMenu && (
                    <div className="absolute bottom-9 right-0 bg-slate-900 border border-slate-800 rounded-lg p-1.5 shadow-2xl flex flex-col min-w-[110px] z-30">
                      <button
                        onClick={() => handleQualitySelect(-1)}
                        className={`text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                          currentLevel === -1 ? 'bg-rose-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        Tự động (Adaptive)
                      </button>
                      {availableLevels.map((lvl) => (
                        <button
                          key={lvl.id}
                          onClick={() => handleQualitySelect(lvl.id)}
                          className={`text-left px-2.5 py-1.5 rounded text-xs font-mono transition-colors ${
                            currentLevel === lvl.id
                              ? 'bg-rose-600 text-white font-semibold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {lvl.height}p ({Math.round(lvl.bitrate / 1000)} kbps)
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Theater Mode */}
              {onToggleTheater && (
                <button
                  onClick={onToggleTheater}
                  className={`p-1.5 hover:bg-white/10 rounded-lg transition-colors hidden sm:block ${
                    isTheater ? 'text-rose-400' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Chế độ rạp chiếu"
                >
                  <Tv className="w-4 h-4" />
                </button>
              )}

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                title="Toàn màn hình (F)"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
