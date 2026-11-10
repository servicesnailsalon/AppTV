import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Eye, 
  Layout, 
  FileText, 
  Layers, 
  X, 
  HelpCircle,
  ExternalLink,
  Smartphone,
  Monitor
} from 'lucide-react';
import { generateBloggerGadgetCode, generateBloggerCss } from '../utils/m3uParser';
import { Channel } from '../types/tv';

interface BloggerExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeChannel: Channel;
}

export const BloggerExportModal: React.FC<BloggerExportModalProps> = ({
  isOpen,
  onClose,
  activeChannel,
}) => {
  const [activeTab, setActiveTab] = useState<'gadget' | 'css' | 'post' | 'preview'>('gadget');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [countryPreset, setCountryPreset] = useState<string>('ALL');

  if (!isOpen) return null;

  const gadgetCode = generateBloggerGadgetCode(countryPreset);
  const cssCode = generateBloggerCss();
  const postEmbedCode = activeChannel.embedUrl ? `<!-- Mã nhúng kênh ${activeChannel.name} vào bài viết Blogger -->
<div style="position:relative;padding-top:56.25%;width:100%;background:#000;border-radius:8px;overflow:hidden;margin:16px 0;">
  <iframe 
    src="${activeChannel.embedUrl}" 
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" 
    allow="autoplay; encrypted-media; fullscreen; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>
<p style="font-size:13px;color:#666;text-align:center;">
  Xem trực tuyến: <strong>${activeChannel.name}</strong> (${activeChannel.country === 'VN' ? 'Việt Nam' : 'Hoa Kỳ'}) · Miễn phí hợp pháp
</p>` : `<!-- Mã nhúng video HLS kênh ${activeChannel.name} vào Blogger -->
<div style="position:relative;padding-top:56.25%;width:100%;background:#000;border-radius:8px;overflow:hidden;margin:16px 0;">
  <video id="tv_player_${activeChannel.id}" controls playsinline style="position:absolute;top:0;left:0;width:100%;height:100%;"></video>
</div>
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script>
(function(){
  var v = document.getElementById("tv_player_${activeChannel.id}");
  var src = "${activeChannel.streamUrl}";
  if(Hls.isSupported()){
    var h = new Hls(); h.loadSource(src); h.attachMedia(v);
    h.on(Hls.Events.MANIFEST_PARSED, function(){ v.play().catch(function(){}); });
  } else if(v.canPlayType("application/vnd.apple.mpegurl")){
    v.src = src; v.play().catch(function(){});
  }
})();
</script>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Tích Hợp Google Blogger (Blogspot)</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-mono">
                  Blogger CSS & Gadget
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Xuất mã widget, template CSS tương thích hoàn hảo với giao diện Google Blogger
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
            onClick={() => setActiveTab('gadget')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'gadget'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Tiện ích Blogger (Gadget)</span>
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'css'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mã CSS Template</span>
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'post'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mã nhúng bài viết</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Mô phỏng Blogger</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          {activeTab === 'gadget' && (
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-orange-950/30 border border-orange-500/20 text-orange-200 rounded-xl leading-relaxed">
                <span className="font-semibold">Cách dùng trên Google Blogger:</span>
                <ol className="list-decimal list-inside mt-1.5 space-y-1 text-slate-300">
                  <li>Đăng nhập vào trang quản trị <span className="text-white font-semibold">Blogger.com</span></li>
                  <li>Chọn menu <span className="text-white font-semibold">Bố cục (Layout)</span></li>
                  <li>Nhấp <span className="text-white font-semibold">Thêm tiện ích (Add a Gadget)</span> ở cột bên (Sidebar) hoặc thân trang</li>
                  <li>Chọn loại tiện ích <span className="text-white font-semibold">HTML/JavaScript</span></li>
                  <li>Dán toàn bộ đoạn mã bên dưới vào ô Nội dung và nhấn <span className="text-white font-semibold">Lưu (Save)</span>.</li>
                </ol>
              </div>

              {/* Blogger XML Safety Info Banner */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 rounded-xl flex items-start gap-2.5">
                <span className="text-base shrink-0">🛡️</span>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-emerald-300">
                    Bảo Vệ Chuẩn XML Blogger (100% Không Lỗi Parse & Không Xung Đột CSS):
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Blogger thường xuyên báo lỗi cú pháp XML đối với mã CSS/JS do các ký tự đặc biệt (&lt;, &gt;, &amp;). Mã tiện ích này đã được đóng gói trong thẻ <strong>/*&lt;![CDATA[*/ ... /*]]&gt;*/</strong>, chuẩn hóa không dùng toán tử con trực tiếp (&gt;), và cô lập toàn bộ class bằng tiền tố <code>.optv-*</code> để không bao giờ xung đột với template Blogspot của bạn.
                  </p>
                </div>
              </div>

              {/* Country and Category preset selector */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Chọn bộ lọc mặc định cho Widget Blogger:</span>
                  <button
                    onClick={() => copyToClipboard(gadgetCode, 'gadget')}
                    className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-sm text-xs"
                  >
                    {copiedType === 'gadget' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedType === 'gadget' ? 'Đã sao chép!' : 'Sao chép mã Gadget'}</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setCountryPreset('ALL')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                      countryPreset === 'ALL' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🌐 Tất cả ({34})
                  </button>
                  <button
                    onClick={() => setCountryPreset('music')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                      countryPreset === 'music' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🎵 Âm nhạc
                  </button>
                  <button
                    onClick={() => setCountryPreset('comedy')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                      countryPreset === 'comedy' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🎭 Hài kịch & Cải lương
                  </button>
                  <button
                    onClick={() => setCountryPreset('wildlife')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                      countryPreset === 'wildlife' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🦁 Hoang dã & Đại dương
                  </button>
                  <button
                    onClick={() => setCountryPreset('diy')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                      countryPreset === 'diy' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🔨 Xây dựng & Sửa chữa
                  </button>
                  <button
                    onClick={() => setCountryPreset('VN')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                      countryPreset === 'VN' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🇻🇳 Việt Nam
                  </button>
                  <button
                    onClick={() => setCountryPreset('US')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                      countryPreset === 'US' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🇺🇸 Hoa Kỳ
                  </button>
                  <button
                    onClick={() => setCountryPreset('JP')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                      countryPreset === 'JP' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🇯🇵 Nhật Bản
                  </button>
                  <button
                    onClick={() => setCountryPreset('KR')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                      countryPreset === 'KR' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🇰🇷 Hàn Quốc
                  </button>
                </div>
              </div>

              {/* Code display */}
              <div className="relative">
                <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-64 leading-normal">
                  {gadgetCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'css' && (
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl leading-relaxed">
                <p className="font-semibold text-white mb-1">
                  Đoạn mã CSS tương thích với tất cả giao diện mẫu của Blogger (Contempo, Soho, Emporio, Notable hoặc XML cũ):
                </p>
                <p className="text-slate-400">
                  Dán vào mục: <span className="text-rose-400">Chủ đề (Theme)</span> → <span className="text-rose-400">Tùy chỉnh (Customize)</span> → <span className="text-rose-400">Nâng cao (Advanced)</span> → <span className="text-rose-400">Thêm CSS</span>.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => copyToClipboard(cssCode, 'css')}
                  className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiedType === 'css' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedType === 'css' ? 'Đã sao chép CSS!' : 'Sao chép CSS'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-64 leading-normal">
                  {cssCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'post' && (
            <div className="flex flex-col gap-4">
              <p className="text-slate-300 leading-relaxed">
                Đoạn mã HTML responsive để dán trực tiếp vào bài viết Blogger khi bạn chuyển sang chế độ <span className="font-semibold text-white">"Chế độ xem HTML"</span> trong trình soạn thảo bài viết:
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => copyToClipboard(postEmbedCode, 'post')}
                  className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiedType === 'post' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedType === 'post' ? 'Đã sao chép!' : 'Sao chép mã nhúng bài viết'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-64 leading-normal">
                  {postEmbedCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-slate-400">
                <span>Mô phỏng hiển thị trên Blogspot Template:</span>
                <span className="text-[11px]">Giao diện Blogspot chuẩn</span>
              </div>

              {/* Blogger Blog Mockup */}
              <div className="bg-[#f8f9fa] text-slate-800 rounded-xl border border-slate-300 overflow-hidden font-sans shadow-lg">
                {/* Blogger Blog Header */}
                <div className="bg-white border-b border-slate-200 px-6 py-4">
                  <div className="text-xl font-bold text-slate-900 tracking-tight">
                    BLOG TIN TỨC & TRUYỀN THÔNG CÔNG CỘNG
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Chia sẻ các kênh truyền hình mở hợp pháp và thông tin đời sống
                  </div>
                </div>

                {/* Blogger Blog Content Area */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Main Post Column (2 cols) */}
                  <div className="md:col-span-2 flex flex-col gap-3">
                    <div className="text-base font-bold text-slate-900">
                      Trực Tiếp: Xem Kênh Truyền Hình {activeChannel.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Đăng bởi Admin · Chuyên mục: Truyền hình trực tuyến
                    </div>

                    {/* Embedded Widget Box */}
                    <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-800">
                      <div className="text-xs text-rose-400 font-semibold mb-2 flex items-center justify-between">
                        <span>📺 OpenTV Widget for Blogger</span>
                        <span className="text-[10px] text-slate-400">{activeChannel.license}</span>
                      </div>
                      <div className="relative bg-black rounded overflow-hidden aspect-video flex items-center justify-center text-center p-4">
                        <div className="text-xs text-slate-300">
                          <div className="font-semibold text-white mb-1">
                            {activeChannel.country === 'VN' ? '🇻🇳' : '🇺🇸'} {activeChannel.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Khung phát video 16:9 nhúng tương thích hoàn toàn trên Blogger
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Kênh truyền hình được truyền tải trực tiếp thông qua luồng hợp pháp công cộng. Đảm bảo bản quyền, không quảng cáo chen ngang, tải nhanh trên điện thoại và máy tính.
                    </p>
                  </div>

                  {/* Sidebar (1 col) */}
                  <div className="flex flex-col gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
                      <div className="font-bold text-slate-900 mb-2 border-b pb-1">
                        TIỆN ÍCH BLOGGER (WIDGET)
                      </div>
                      <div className="text-slate-600 space-y-1.5 text-[11px]">
                        <div>• Tổng cộng: <strong>34 kênh chọn lọc</strong></div>
                        <div>• Âm nhạc Lofi & Smooth Jazz 24/7</div>
                        <div>• Hài kịch Xuân Bắc & Cải lương Nam Bộ</div>
                        <div>• Hoang dã Safari & San hô đại dương</div>
                        <div>• Xây dựng tháp gỗ & Phục chế đồ cổ</div>
                        <div>• Bản quyền: Giấy phép FTA / Công quyền</div>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
                      <div className="font-bold text-slate-900 mb-1 border-b pb-1">
                        LƯU Ý TRÊN BLOGGER
                      </div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Tiện ích sử dụng thư viện chuẩn CDN HLS.js, không yêu cầu chứng chỉ đặc biệt, hỗ trợ chạy trên cả tên miền miễn phí <code>.blogspot.com</code> lẫn tên miền riêng!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
          <div>Hỗ trợ mọi mẫu giao diện Blogger Blogspot máy tính & điện thoại</div>
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
