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
    <title>Kho Dữ Liệu GIS - KOKOBELLC (Public)</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px; }
        /* Đã xóa lệnh display: none; để container hiện ra ngay lập tức */
        .container { max-width: 900px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h1 { color: #1a73e8; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 30px; }
        
        /* Box Hướng dẫn Tổng */
        .guide-box { background-color: #e8f0fe; border-left: 5px solid #1a73e8; padding: 25px; border-radius: 8px; margin-bottom: 40px; }
        .guide-box h2 { color: #1557b0; margin-top: 0; font-size: 20px; border-bottom: 1px dashed #abc2e8; padding-bottom: 10px;}
        
        /* Box Từng Bước (Step-by-step) */
        .step-box { background: #ffffff; border: 1px solid #d2e3fc; padding: 15px 20px; border-radius: 6px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(26,115,232,0.05); }
        .step-box h4 { margin: 0 0 8px 0; color: #1a73e8; font-size: 16px; display: flex; align-items: center;}
        .step-box h4 span { background: #1a73e8; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; justify-content: center; align-items: center; font-size: 14px; margin-right: 10px; }
        .step-box p { margin: 0 0 12px 0; font-size: 14px; color: #444; line-height: 1.5; }
        .step-box strong { color: #d93025; }

        /* Code Container */
        .code-container { background: #202124; color: #58a6ff; padding: 12px 15px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-family: monospace; font-size: 15px; }
        .code-container pre { margin: 0; white-space: pre-wrap; }
        .btn-copy-code { background: #2ea043; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.2s; white-space: nowrap; font-size: 13px;}
        .btn-copy-code:hover { background: #238636; }

        /* Danh sách file */
        .file-list { list-style: none; padding: 0; }
        .file-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee; transition: background 0.2s; }
        .file-item:hover { background: #f9f9f9; }
        .file-name { font-weight: 600; color: #333; text-decoration: none; font-size: 16px; word-break: break-all; margin-right: 15px;}
        .file-name:hover { color: #1a73e8; text-decoration: underline; }
        .copy-btn { padding: 8px 15px; background: #1a73e8; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.2s; white-space: nowrap; }
        .copy-btn:hover { background: #1557b0; }
        
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div class="container" id="main-content">
        <h1>📁 KHO DỮ LIỆU BẢN ĐỒ (DỰ ÁN MỞ)</h1>
        
        <div class="guide-box">
            <h2>🚀 Quy trình Upload file chi tiết (Step-by-Step)</h2>
            <p style="font-size: 14px; color: #555; margin-bottom: 20px;"><em>Chuẩn bị: Mở ổ đĩa, copy file bản đồ mới thả vào thư mục <strong>data</strong>. Sau đó mở Terminal / Git Bash ngay tại thư mục gốc <strong>my-gis-data</strong> và làm lần lượt các bước sau:</em></p>
            
            <div class="step-box">
                <h4><span>⚡</span> LỆNH GỘP (ALL-IN-ONE)</h4>
                <p>Dành cho khi bạn đã làm quen tay. Copy 1 lần, dán vào Terminal và Enter.</p>
                <div class="code-container">
                    <pre id="cmd-step-all">git add .
git commit -m "Cap nhat file du lieu"
git push</pre>
                    <button class="btn-copy-code" onclick="copyCommand('cmd-step-all', this)">📋 Copy Lệnh Nhanh</button>
                </div>
            </div>

            <div class="step-box">
                <h4><span>1</span> GOM HÀNG VÀO THÙNG</h4>
                <p>Lệnh này giúp máy tính quét toàn bộ thư mục và gom tất cả các file mới/file vừa chỉnh sửa vào một danh sách chờ xuất phát.</p>
                <div class="code-container">
                    <pre id="cmd-step-1">git add .</pre>
                    <button class="btn-copy-code" onclick="copyCommand('cmd-step-1', this)">📋 Copy Lệnh 1</button>
                </div>
            </div>

            <div class="step-box">
                <h4><span>2</span> ĐÓNG GÓI & GHI CHÚ</h4>
                <p>Lệnh này đóng gói các file ở Bước 1 và dán nhãn ghi chú lại. <em>(Mẹo: Bạn có thể sửa dòng chữ trong ngoặc kép để sau này dễ nhớ ngày hôm nay tải lên cái gì).</em></p>
                <div class="code-container">
                    <pre id="cmd-step-2">git commit -m "Cap nhat file du lieu"</pre>
                    <button class="btn-copy-code" onclick="copyCommand('cmd-step-2', this)">📋 Copy Lệnh 2</button>
                </div>
            </div>

            <div class="step-box">
                <h4><span>3</span> ĐẨY LÊN ĐÁM MÂY (VERCEL)</h4>
                <p>Lệnh quyết định. Nó sẽ đẩy toàn bộ kiện hàng lên Cloud. Khi thấy Terminal báo chạy xong 100%, hãy <strong>F5 (tải lại)</strong> trang web này để lấy link tải file.</p>
                <div class="code-container">
                    <pre id="cmd-step-3">git push</pre>
                    <button class="btn-copy-code" onclick="copyCommand('cmd-step-3', this)">📋 Copy Lệnh 3</button>
                </div>
            </div>
            
            <details style="margin-top: 25px; background: #fff3cd; padding: 15px; border-radius: 5px; border: 1px solid #ffe69c;">
                <summary style="font-weight: bold; color: #856404; cursor: pointer; font-size: 15px;">⚠️ Cách xử lý file siêu nặng (> 50MB) bằng Git LFS</summary>
                <div style="margin-top: 15px; color: #333; font-size: 14px;">
                    <p style="margin-top: 0;">Nếu lúc chạy Bước 3 (git push) mà GitHub báo lỗi hoặc cảnh báo file quá lớn, bạn <strong>chỉ cần chạy khối lệnh này 1 lần duy nhất</strong>. Có thể copy dán toàn bộ 1 lần vì đây là cài đặt tự động:</p>
                    <div class="code-container" style="background: #2d2d2d;">
                        <pre id="lfs-commands">git lfs install
git lfs track "*.tif"
git add .gitattributes
git commit -m "Cai dat Git LFS"
git push</pre>
                        <button class="btn-copy-code" onclick="copyCommand('lfs-commands', this)">📋 Copy Cài đặt LFS</button>
                    </div>
                </div>
            </details>
        </div>

        <h2 style="font-size: 18px; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 8px;">📑 DANH SÁCH FILE HIỆN CÓ</h2>
        <ul class="file-list">
`;

files.forEach(file => {
    const fileUrl = `/data/${file}`;
    html += `
            <li class="file-item">
                <a href="${fileUrl}" class="file-name" target="_blank">📄 ${file}</a>
                <button class="copy-btn" onclick="copyToClipboard('${fileUrl}', this)">🔗 Copy Link Data</button>
            </li>
    `;
});

html += `
        </ul>
        <div class="footer">Hệ thống lưu trữ và phân phối dữ liệu GIS (Public) - KOKOBELLC</div>
    </div>

    <script>
        // Đã xóa toàn bộ Script liên quan đến checkPin() và SECRET_PIN

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

        function copyCommand(elementId, btnElement) {
            const code = document.getElementById(elementId).innerText;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = btnElement.innerText;
                btnElement.innerText = "✔️ Đã Copy!";
                btnElement.style.background = "#2ea043";
                setTimeout(() => {
                    btnElement.innerText = originalText;
                }, 2000);
            });
        }
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Đã tạo trang index thành công với giao diện Public hoàn toàn!');