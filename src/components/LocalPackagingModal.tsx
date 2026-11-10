import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  Plus, 
  FileCode, 
  Server, 
  HardDrive, 
  Check, 
  Copy, 
  X,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { Channel } from '../types/tv';
import { exportToM3U, parseM3U, downloadFile, generateStandaloneHtml } from '../utils/m3uParser';

interface LocalPackagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  onAddChannel: (channel: Channel) => void;
  onImportChannels: (imported: Partial<Channel>[]) => void;
}

export const LocalPackagingModal: React.FC<LocalPackagingModalProps> = ({
  isOpen,
  onClose,
  channels,
  onAddChannel,
  onImportChannels,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'html' | 'import' | 'add'>('export');
  const [copiedM3u, setCopiedM3u] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string>('');

  // Add custom channel form state
  const [newName, setNewName] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [newCountry, setNewCountry] = useState<any>('VN');
  const [newCategory, setNewCategory] = useState<any>('news');
  const [newRes, setNewRes] = useState<string>('1080p');

  if (!isOpen) return null;

  const handleExportM3U = () => {
    const content = exportToM3U(channels);
    downloadFile('World_OpenTV_Global_Channels.m3u', content, 'audio/x-mpegurl');
  };

  const handleCopyM3U = () => {
    const content = exportToM3U(channels);
    navigator.clipboard.writeText(content).then(() => {
      setCopiedM3u(true);
      setTimeout(() => setCopiedM3u(false), 2500);
    });
  };

  const handleDownloadStandaloneHtml = () => {
    const htmlContent = generateStandaloneHtml(channels);
    downloadFile('World_OpenTV_Universal_Player.html', htmlContent, 'text/html;charset=utf-8');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseM3U(text);
        if (parsed.length > 0) {
          onImportChannels(parsed);
          setImportStatus(`Đã nhập thành công ${parsed.length} kênh từ file M3U!`);
          setTimeout(() => setImportStatus(''), 4000);
        } else {
          setImportStatus('Không tìm thấy kênh hợp lệ trong file M3U.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    const newChannel: Channel = {
      id: `custom-${Date.now()}`,
      channelNumber: channels.length + 1,
      name: newName.trim(),
      country: newCountry,
      category: newCategory,
      streamUrl: newUrl.trim(),
      resolution: newRes,
      license: 'Kênh cục bộ tự thêm',
      description: `Kênh phát do người dùng nhập từ nguồn cục bộ hoặc internet: ${newUrl.trim()}`,
      schedule: [{ time: '00:00', title: 'Phát trực tiếp theo nguồn' }],
      isCustom: true,
    };

    onAddChannel(newChannel);
    setNewName('');
    setNewUrl('');
    setImportStatus('Đã thêm kênh mới vào danh sách!');
    setTimeout(() => setImportStatus(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Đóng Gói & Chạy Cục Bộ (Localhost / Offline)
              </h2>
              <p className="text-xs text-slate-400">
                Xuất file M3U, tải file HTML tự chạy hoặc nạp kênh tùy chỉnh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4">
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Xuất Playlist M3U
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'html'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Đóng gói HTML độc lập
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Nhập file M3U
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'add'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Thêm kênh URL mới
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          {importStatus && (
            <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="flex flex-col gap-4">
              <p className="text-slate-300 leading-relaxed">
                Tạo và tải danh sách phát chuẩn <span className="font-mono text-rose-400">#EXTM3U</span> chứa toàn bộ các kênh hợp pháp của Việt Nam (VN) và Hoa Kỳ (US). Tương thích 100% với các ứng dụng xem TV phổ biến như:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-slate-300">
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 font-semibold">VLC Player</div>
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 font-semibold">PotPlayer</div>
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 font-semibold">TiviMate</div>
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 font-semibold">Kodi / Smart TV</div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleExportM3U}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file M3U ({channels.length} kênh)</span>
                </button>
                <button
                  onClick={handleCopyM3U}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
                >
                  {copiedM3u ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedM3u ? 'Đã sao chép M3U!' : 'Sao chép nội dung M3U'}</span>
                </button>
              </div>

              {/* M3U Preview Snippet */}
              <div className="mt-3">
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Mẫu nội dung file M3U:</label>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 overflow-x-auto max-h-36">
                  {exportToM3U(channels.slice(0, 3))}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'html' && (
            <div className="flex flex-col gap-4">
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start gap-3">
                <FileCode className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Gói đóng gói HTML độc lập (Standalone Single File)
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Tải về 1 file <span className="font-mono text-white">OpenTV_Offline_Player.html</span> duy nhất. Bạn chỉ cần nhấp đúp vào file này trên máy tính (Windows, Mac, Linux) để mở trực tiếp trên Chrome hoặc Edge mà không cần cài đặt Node.js hay mở server terminal!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadStandaloneHtml}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file OpenTV_Offline_Player.html</span>
                </button>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 flex flex-col gap-1.5 text-slate-300">
                <div className="font-semibold text-white">Đặc điểm gói HTML cục bộ:</div>
                <div>• Nhẹ ~30KB, tích hợp sẵn trình phát Hls.js tự động giải mã.</div>
                <div>• Tích hợp sẵn bộ kênh Việt Nam & Hoa Kỳ không vi phạm bản quyền.</div>
                <div>• Dễ dàng copy vào USB hoặc lưu trên màn hình desktop để xem bất kỳ lúc nào.</div>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="flex flex-col gap-4">
              <p className="text-slate-300 leading-relaxed">
                Nhập file danh sách phát kênh IPTV của bạn định dạng <span className="font-mono text-rose-400">.m3u</span> hoặc <span className="font-mono text-rose-400">.m3u8</span> để bổ sung vào ứng dụng. Các kênh sẽ được lưu an toàn trong trình duyệt (localStorage).
              </p>

              <div className="border-2 border-dashed border-slate-700 hover:border-rose-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40">
                <input
                  type="file"
                  accept=".m3u,.m3u8,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="m3u-file-input"
                />
                <label htmlFor="m3u-file-input" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-rose-400" />
                  <span className="text-sm font-semibold text-white">
                    Nhấp để chọn file .m3u từ máy tính
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Hỗ trợ tệp M3U tiêu chuẩn (#EXTINF)
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tên kênh truyền hình *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Kênh Địa phương / Home Stream..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Đường dẫn luồng HLS .m3u8 (hoặc localhost) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="http://localhost:8080/live.m3u8 hoặc https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Khu vực / Quốc gia</label>
                  <select
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="VN">🇻🇳 Việt Nam</option>
                    <option value="US">🇺🇸 Hoa Kỳ</option>
                    <option value="JP">🇯🇵 Nhật Bản</option>
                    <option value="KR">🇰🇷 Hàn Quốc</option>
                    <option value="UK">🇬🇧 Vương quốc Anh</option>
                    <option value="EU">🇪🇺 Châu Âu</option>
                    <option value="AU">🇦🇺 Úc</option>
                    <option value="GL">🌌 Không gian & Thiên nhiên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Thể loại</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="news">Thời sự & Tin tức</option>
                    <option value="national">Quốc gia</option>
                    <option value="education">Giáo dục & Khoa học</option>
                    <option value="local">Địa phương</option>
                    <option value="entertainment">Giải trí</option>
                    <option value="sports">Thể thao</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Độ phân giải</label>
                  <input
                    type="text"
                    value={newRes}
                    onChange={(e) => setNewRes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm kênh vào ứng dụng</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span>Hỗ trợ chạy mượt mà trên môi trường máy chủ cục bộ hoặc trình duyệt đơn lẻ</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
