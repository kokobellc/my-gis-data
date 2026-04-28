const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const files = fs.readdirSync(dataDir).filter(file => !file.startsWith('.'));

let html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kho Dữ Liệu GIS - KOKOBELLC (Hệ Thống Mở)</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 950px; margin: auto; background: white; padding: 35px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        h1 { color: #1a73e8; text-align: center; border-bottom: 2px solid #e8eaed; padding-bottom: 15px; margin-bottom: 30px; font-size: 28px; font-weight: 700; }
        
        /* Box Hướng dẫn Tổng */
        .guide-box { background-color: #f8f9fa; border: 1px solid #e8eaed; border-top: 5px solid #1a73e8; padding: 25px; border-radius: 8px; margin-bottom: 40px; }
        .guide-box h2 { color: #1a73e8; margin-top: 0; font-size: 22px; margin-bottom: 20px;}
        
        /* Box Từng Bước (Step-by-step) */
        .step-box { background: #ffffff; border: 1px solid #d2e3fc; padding: 15px 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(26,115,232,0.03); }
        .step-box h4 { margin: 0 0 10px 0; color: #1a73e8; font-size: 16px; display: flex; align-items: center;}
        .step-box h4 span { background: #1a73e8; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; justify-content: center; align-items: center; font-size: 14px; margin-right: 10px; font-weight: bold;}
        .step-box p { margin: 0 0 12px 0; font-size: 14.5px; color: #444; line-height: 1.6; }
        
        /* Accordion cho tính năng nâng cao */
        details { margin-top: 20px; background: #fff8e1; padding: 15px 20px; border-radius: 8px; border: 1px solid #ffecb3; }
        details[open] summary { border-bottom: 1px solid #ffe082; padding-bottom: 10px; margin-bottom: 15px; }
        summary { font-weight: 600; color: #f57f17; cursor: pointer; font-size: 16px; outline: none; list-style: none; display: flex; align-items: center;}
        summary::-webkit-details-marker { display: none; }
        summary::before { content: '►'; font-size: 12px; margin-right: 10px; transition: 0.2s; }
        details[open] summary::before { content: '▼'; }

        /* Code Container */
        .code-container { background: #202124; color: #58a6ff; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-family: 'Consolas', monospace; font-size: 14px; margin-bottom: 5px; border: 1px solid #3c4043;}
        .code-container pre { margin: 0; white-space: pre-wrap; line-height: 1.5; }
        .btn-copy-code { background: #2ea043; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s; white-space: nowrap; font-size: 13px;}
        .btn-copy-code:hover { background: #238636; }

        /* Danh sách file */
        .file-list { list-style: none; padding: 0; }
        .file-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #e8eaed; transition: background 0.2s; }
        .file-item:hover { background: #f1f3f4; }
        .file-name { font-weight: 600; color: #202124; text-decoration: none; font-size: 16px; word-break: break-all; margin-right: 15px;}
        .file-name:hover { color: #1a73e8; text-decoration: underline; }
        .copy-btn { padding: 10px 18px; background: #1a73e8; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s; white-space: nowrap; }
        .copy-btn:hover { background: #1557b0; }
        
        .footer { text-align: center; margin-top: 30px; font-size: 13px; color: #5f6368; padding-top: 20px; border-top: 1px solid #e8eaed;}
        .highlight { background: #fff3cd; padding: 2px 6px; border-radius: 4px; font-weight: 600; color: #856404; }
    </style>
</head>
<body>
    <div class="container" id="main-content">
        <h1>📁 TRUNG TÂM PHÂN PHỐI DỮ LIỆU GIS (PUBLIC)</h1>
        
        <div class="guide-box">
            <h2>📚 BÁCH KHOA TOÀN THƯ HỆ THỐNG</h2>
            <p style="font-size: 15px; color: #5f6368; margin-bottom: 25px;">Tài liệu này lưu trữ toàn bộ quy trình và cách khắc phục sự cố (Troubleshooting) khi làm việc với file GeoTIFF dung lượng lớn, Git LFS và Vercel.</p>
            
            <h3 style="color: #202124; font-size: 18px; margin-top: 30px; border-bottom: 2px solid #e8eaed; padding-bottom: 8px;">CHƯƠNG I: QUY TRÌNH UPLOAD CƠ BẢN (File < 50MB)</h3>
            <p style="font-size: 14px;"><strong>Chuẩn bị:</strong> Paste file .tif mới vào thư mục <code>data</code>. Mở Terminal tại thư mục <code>my-gis-data</code>.</p>
            
            <div class="step-box">
                <h4><span>⚡</span> LỆNH GỘP (FAST-TRACK)</h4>
                <p>Dành cho các file nhỏ, chạy ổn định. Copy 1 lần, dán vào Terminal và nhấn Enter.</p>
                <div class="code-container">
                    <pre id="cmd-step-all">git add .
git commit -m "Cap nhat file du lieu"
git push</pre>
                    <button class="btn-copy-code" onclick="copyCommand('cmd-step-all', this)">📋 Copy Lệnh Nhanh</button>
                </div>
            </div>

            <h3 style="color: #202124; font-size: 18px; margin-top: 40px; border-bottom: 2px solid #e8eaed; padding-bottom: 8px;">CHƯƠNG II: XỬ LÝ SỰ CỐ FILE LỚN (Lỗi Invalid Byte Order)</h3>
            <p style="font-size: 14px; margin-bottom: 15px;"><strong>Nguyên nhân:</strong> Khi đẩy file >50MB, Git LFS tự động biến file TIF thành "tờ giấy nhớ" 134 bytes. Vercel đọc tờ giấy này thay vì file thật, khiến Geoblaze báo lỗi <span class="highlight">Invalid byte order value</span>.</p>

            <details>
                <summary>PHƯƠNG ÁN A: ÉP TẢI FILE THẬT (Khuyên dùng cho file 50MB - 100MB)</summary>
                <div style="margin-top: 10px; font-size: 14.5px;">
                    <p>Phương pháp này "tẩy não" Git, gỡ bỏ LFS và ép đẩy nguyên khối dữ liệu nhị phân (Binary) lên thẳng Vercel.</p>
                    
                    <div class="step-box" style="border-color: #ffe082;">
                        <h4><span>1</span> GỠ BỎ BÙA CHÚ LFS</h4>
                        <p>Xóa quyền kiểm soát của LFS và xóa file cấu hình.</p>
                        <div class="code-container">
                            <pre id="cmd-bypass-1">git lfs untrack "*.tif"
rm .gitattributes</pre>
                            <button class="btn-copy-code" onclick="copyCommand('cmd-bypass-1', this)">📋 Copy Lệnh 1</button>
                        </div>
                    </div>

                    <div class="step-box" style="border-color: #ffe082;">
                        <h4><span>2</span> XÓA BỘ NHỚ ĐỆM (CACHE)</h4>
                        <p>Bắt Git quên file 134 bytes cũ đi để chuẩn bị đọc lại file thật.</p>
                        <div class="code-container">
                            <pre id="cmd-bypass-2">git rm --cached -r data/</pre>
                            <button class="btn-copy-code" onclick="copyCommand('cmd-bypass-2', this)">📋 Copy Lệnh 2</button>
                        </div>
                    </div>

                    <div class="step-box" style="border-color: #ffe082;">
                        <h4><span>3</span> QUÉT LẠI VÀ ĐẨY LÊN (ÉP BUỘC)</h4>
                        <p>Quét lại toàn bộ thư mục data (lúc này Git sẽ nhận diện đúng dung lượng file thật) và đẩy lên mạng.</p>
                        <div class="code-container">
                            <pre id="cmd-bypass-3">git add data/
git commit -m "Ep Git nhan lai file TIF that"
git push</pre>
                            <button class="btn-copy-code" onclick="copyCommand('cmd-bypass-3', this)">📋 Copy Lệnh 3</button>
                        </div>
                        <p style="font-size: 13px; color: #d93025; margin-top: 10px;"><em>*Lưu ý: Lệnh push sẽ chạy khá lâu (vài phút) vì phải tải thực sự vài chục MB lên mạng. Bỏ qua các cảnh báo màu vàng của GitHub.</em></p>
                    </div>
                </div>
            </details>

            <details>
                <summary>PHƯƠNG ÁN B: SỬ DỤNG CHUẨN LFS (Bắt buộc nếu file > 100MB)</summary>
                <div style="margin-top: 10px; font-size: 14.5px;">
                    <p>Nếu file vượt quá 100MB, GitHub sẽ chặn cứng. Ta bắt buộc dùng LFS, nhưng phải dạy Vercel cách kéo file thật về.</p>
                    
                    <div class="step-box" style="border-color: #ffe082;">
                        <h4><span>1</span> KÍCH HOẠT LẠI LFS</h4>
                        <div class="code-container">
                            <pre id="cmd-lfs-1">git lfs install
git lfs track "*.tif"
git add .gitattributes</pre>
                            <button class="btn-copy-code" onclick="copyCommand('cmd-lfs-1', this)">📋 Copy Lệnh 1</button>
                        </div>
                    </div>

                    <div class="step-box" style="border-color: #ffe082;">
                        <h4><span>2</span> SỬA FILE PACKAGE.JSON (QUAN TRỌNG NHẤT)</h4>
                        <p>Mở file <code>package.json</code> bằng Notepad, sửa phần <code>"scripts"</code> thành nội dung dưới đây để Vercel tự động kéo file thật trước khi xuất bản web:</p>
                        <div class="code-container">
                            <pre id="cmd-lfs-2">"scripts": {
  "build": "git lfs pull && node build.js"
}</pre>
                            <button class="btn-copy-code" onclick="copyCommand('cmd-lfs-2', this)">📋 Copy Dòng Code</button>
                        </div>
                    </div>
                    
                    <div class="step-box" style="border-color: #ffe082;">
                        <h4><span>3</span> ĐẨY CẬP NHẬT LÊN</h4>
                        <div class="code-container">
                            <pre id="cmd-lfs-3">git add .
git commit -m "Cau hinh Git LFS Pull cho Vercel"
git push</pre>
                            <button class="btn-copy-code" onclick="copyCommand('cmd-lfs-3', this)">📋 Copy Lệnh 3</button>
                        </div>
                    </div>
                </div>
            </details>

            <h3 style="color: #202124; font-size: 18px; margin-top: 40px; border-bottom: 2px solid #e8eaed; padding-bottom: 8px;">CHƯƠNG III: CHÌA KHÓA CORS (Đọc Pixel Trực Tiếp)</h3>
            <p style="font-size: 14.5px;">Để Geoblaze / Georaster có thể đọc đúng tọa độ Pixel mà không cần tải nguyên file khổng lồ về trình duyệt, file <code>vercel.json</code> phải LUÔN LUÔN tồn tại ở thư mục gốc với nội dung chuẩn sau:</p>
            <div class="code-container" style="background: #282a36; border: none;">
                <pre id="cmd-cors">{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, HEAD, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Range, Origin, X-Requested-With, Content-Type, Accept" },
        { "key": "Access-Control-Expose-Headers", "value": "Accept-Ranges, Content-Encoding, Content-Length, Content-Range" }
      ]
    }
  ]
}</pre>
                <button class="btn-copy-code" style="background: #6272a4;" onclick="copyCommand('cmd-cors', this)">📋 Copy JSON</button>
            </div>
        </div>

        <h2 style="font-size: 20px; color: #1a73e8; border-bottom: 2px solid #e8eaed; padding-bottom: 10px; margin-top: 50px;">📦 DANH SÁCH FILE HIỆN CÓ</h2>
        <ul class="file-list">
`;

// Tự động sinh danh sách file
files.forEach(file => {
    const fileUrl = `/data/${file}`;
    html += `
            <li class="file-item">
                <a href="${fileUrl}" class="file-name" target="_blank">📄 ${file}</a>
                <button class="copy-btn" onclick="copyToClipboard('${fileUrl}', this)">🔗 Copy Link Data</button>
            </li>
    `;
});

// Đóng thẻ và thêm Scripts hỗ trợ
html += `
        </ul>
        <div class="footer">Hệ thống phân phối Dữ liệu Không gian (Spatial Data) - Phát triển bởi KOKOBELLC</div>
    </div>

    <script>
        // Copy đường dẫn File Bản Đồ
        function copyToClipboard(path, btnElement) {
            const fullUrl = window.location.origin + path;
            navigator.clipboard.writeText(fullUrl).then(() => {
                const originalText = btnElement.innerText;
                btnElement.innerText = "✔️ Đã Copy Link!";
                btnElement.style.background = "#28a745";
                setTimeout(() => {
                    btnElement.innerText = originalText;
                    btnElement.style.background = "#1a73e8";
                }, 2000);
            });
        }

        // Copy các đoạn mã Lệnh
        function copyCommand(elementId, btnElement) {
            const codeElement = document.getElementById(elementId);
            if (!codeElement) return;
            const code = codeElement.innerText;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = btnElement.innerText;
                const originalBg = btnElement.style.background;
                btnElement.innerText = "✔️ Đã Copy!";
                btnElement.style.background = "#2ea043";
                setTimeout(() => {
                    btnElement.innerText = originalText;
                    btnElement.style.background = originalBg;
                }, 2000);
            });
        }
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Đã tạo thành công Bách Khoa Toàn Thư Hệ Thống (Ver 2.0)!');