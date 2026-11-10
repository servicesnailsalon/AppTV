import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Chính Sách Bản Quyền & Tính Hợp Pháp
              </h2>
              <p className="text-xs text-slate-400">
                Cam kết kênh miễn phí hợp pháp, không vi phạm sở hữu trí tuệ
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">100% Kênh phát sóng công cộng & Miễn phí (FTA):</span>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Ứng dụng chỉ tổng hợp các luồng phát trực tiếp được công khai chính thức bởi cơ quan thông tấn, đài truyền hình công quyền hoặc phát hành theo giấy phép Public Domain.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
              <span>🇻🇳</span>
              <span>Kênh Việt Nam (VN):</span>
            </h4>
            <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
              <li><strong className="text-slate-200">Kênh Thiết yếu Quốc gia:</strong> VTV1, VTV2, VTV3, VTV4, VTV5, Truyền hình Quốc Hội, VTC1, VOV TV theo Nghị định quản lý dịch vụ phát thanh truyền hình công ích.</li>
              <li><strong className="text-slate-200">Kênh Thiết yếu Địa phương:</strong> Hà Nội 1, THVL1, Đà Nẵng TV phục vụ nhân dân miễn phí.</li>
              <li>Không chứa các kênh truyền hình trả tiền mã hóa (như K+, HBO, kênh thu phí có bản quyền thương mại khép kín).</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
              <span>🇺🇸 🇬🇧 🇯🇵 🇰🇷 🇪🇺 🇦🇺 🌌</span>
              <span>Kênh Quốc Tế & Toàn Cầu (Global Ecosystem):</span>
            </h4>
            <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
              <li><strong className="text-slate-200">Hoa Kỳ & Vũ trụ (US / Space):</strong> NASA TV, Trạm ISS Live Earth Views (Public Domain theo Title 17 U.S. Code § 105), Bloomberg TV Live (Free Web Feed).</li>
              <li><strong className="text-slate-200">Nhật Bản & Hàn Quốc (JP / KR):</strong> NHK WORLD-JAPAN (Đài truyền hình đối ngoại quốc gia Nhật Bản), KBS World & Arirang TV (Tổ chức truyền thông quốc tế Hàn Quốc).</li>
              <li><strong className="text-slate-200">Châu Âu & Anh Quốc (UK / EU):</strong> Sky News London, Deutsche Welle DW News (Đức), France 24 (Pháp), Euronews (Liên minh Châu Âu).</li>
              <li><strong className="text-slate-200">Úc & Đại dương (AU / Ocean):</strong> ABC News Australia (Tập đoàn phát thanh truyền hình quốc gia Úc), Coral City Camera (Khoa học sinh học biển tự nhiên).</li>
            </ul>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[11px]">
            <strong className="text-white block mb-0.5">Nguyên tắc kỹ thuật:</strong>
            Ứng dụng hoạt động như một trình duyệt đa phương tiện (Client Player), kết nối trực tiếp từ thiết bị của bạn đến các máy chủ phát sóng gốc của nhà đài. Ứng dụng không lưu trữ (no hosting) hay giải mã trái phép bất kỳ video nào.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
