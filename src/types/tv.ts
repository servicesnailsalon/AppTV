export type CountryCode = 
  | 'VN' 
  | 'US' 
  | 'UK' 
  | 'JP' 
  | 'KR' 
  | 'EU' 
  | 'AU' 
  | 'GL';

export type ChannelCategory = 
  | 'news' 
  | 'national' 
  | 'education' 
  | 'local' 
  | 'entertainment' 
  | 'sports' 
  | 'weather'
  | 'nature'
  | 'music'
  | 'comedy'
  | 'wildlife'
  | 'diy';

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  isLive?: boolean;
}

export interface Channel {
  id: string;
  channelNumber: number;
  name: string;
  country: CountryCode;
  category: ChannelCategory;
  streamUrl?: string;
  backupStreamUrl?: string;
  embedType?: 'hls' | 'embed';
  embedUrl?: string;
  defaultMode?: 'hls' | 'embed';
  logoUrl?: string;
  resolution: string;
  license: string;
  description: string;
  officialSite?: string;
  schedule: ScheduleItem[];
  isCustom?: boolean;
}

export type AspectRatioMode = '16:9' | 'fill' | '4:3';

export interface PlayerSettings {
  volume: number;
  muted: boolean;
  aspectRatio: AspectRatioMode;
  autoPlay: boolean;
  useProxy: boolean;
  theaterMode: boolean;
}
