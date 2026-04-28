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
    <title>Kho Dữ Liệu GIS - KOKOBELLC</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px; }
        .container { max-width: 850px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: none; }
        h1 { color: #1a73e8; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        
        /* Box Hướng dẫn */
        .guide-box { background-color: #e8f0fe; border-left: 5px solid #1a73e8; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
        .guide-box h2 { color: #1557b0; margin-top: 0; font-size: 18px; }
        .guide-box ol { margin-bottom: 15px; padding-left: 20px; color: #333; line-height: 1.6; }
        .code-container { background: #202124; color: #58a6ff; padding: 15px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-family: monospace; font-size: 15px; margin-bottom: 10px;}
        .code-container pre { margin: 0; white-space: pre-wrap; }
        .btn-copy-code { background: #2ea043; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.2s; white-space: nowrap; }
        .btn-copy-code:hover { background: #238636; }

        /* Danh sách file */
        .file-list { list-style: none; padding: 0; }
        .file-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee; transition: background 0.2s; }
        .file-item:hover { background: #f9f9f9; }
        .file-name { font-weight: 600; color: #333; text-decoration: none; font-size: 16px; word-break: break-all; margin-right: 15px;}
        .file-name:hover { color: #1a73e8; text-decoration: underline; }
        .copy-btn { padding: 8px 15px; background: #1a73e8; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.2s; white-space: nowrap; }
        .copy-btn:hover { background: #1557b0; }
        
        /* Màn hình khóa */
        #lock-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #2c3e50; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 9999; }
        #lock-screen input { padding: 15px; font-size: 18px; border-radius: 5px; border: none; text-align: center; margin-bottom: 15px; outline: none; width: 250px;}
        #lock-screen button { padding: 12px 30px; font-size: 16px; cursor: pointer; background: #27ae60; color: white; border: none; border-radius: 5px; font-weight: bold;}
        #error-msg { color: #e74c3c; margin-top: 10px; display: none; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div id="lock-screen">
        <h2 style="color: white; margin-bottom: 20px;">KHO DỮ LIỆU BẢO MẬT</h2>
        <input type="password" id="pin-input" placeholder="Nhập mã PIN để vào...">
        <button onclick="checkPin()">Mở Khóa</button>
        <p id="error-msg">Mã PIN không đúng!</p>
    </div>

    <div class="container" id="main-content">
        <h1>📁 KHO DỮ LIỆU BẢN ĐỒ CỦA TÔI</h1>
        
        <div class="guide-box">
            <h2>🚀 Quy trình Upload file hàng ngày</h2>
            <ol>
                <li>Copy file dữ liệu mới dán vào thư mục <strong><code>data</code></strong> trên máy tính.</li>
                <li>Mở Terminal tại thư mục <strong><code>my-gis-data</code></strong>.</li>
                <li>Copy bộ 3 câu lệnh bên dưới, dán vào Terminal và nhấn <strong>Enter</strong>.</li>
            </ol>
            <div class="code-container">
                <pre id="git-commands">git add .
git commit -m "Cap nhat file du lieu"
git push</pre>
                <button class="btn-copy-code" onclick="copyCommand('git-commands', this)">📋 Copy Lệnh</button>
            </div>
            
            <details style="margin-top: 20px; background: #fff3cd; padding: 15px; border-radius: 5px; border: 1px solid #ffe69c;">
                <summary style="font-weight: bold; color: #856404; cursor: pointer; font-size: 15px;">⚠️ Cách xử lý file siêu nặng (> 50MB) bằng Git LFS</summary>
                <div style="margin-top: 15px; color: #333; font-size: 14px;">
                    <p style="margin-top: 0;">Nếu GitHub cảnh báo file quá lớn, bạn <strong>chỉ cần chạy bộ lệnh này 1 lần duy nhất</strong> để mở rộng băng thông cho định dạng <code>.tif</code>:</p>
                    <div class="code-container" style="background: #2d2d2d;">
                        <pre id="lfs-commands">git lfs install
git lfs track "*.tif"
git add .gitattributes
git commit -m "Cai dat Git LFS cho file TIF"
git push</pre>
                        <button class="btn-copy-code" onclick="copyCommand('lfs-commands', this)">📋 Copy Lệnh LFS</button>
                    </div>
                </div>
            </details>
        </div>

        <h2 style="font-size: 16px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">DANH SÁCH FILE HIỆN CÓ</h2>
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
        <div class="footer">Hệ thống quản lý file tự động - KOKOBELLC</div>
    </div>

    <script>
        const SECRET_PIN = "123456"; 

        function checkPin() {
            const input = document.getElementById('pin-input').value;
            if(input === SECRET_PIN) {
                document.getElementById('lock-screen').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
            } else {
                document.getElementById('error-msg').style.display = 'block';
            }
        }

        document.getElementById('pin-input').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkPin();
        });

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

        // Hàm copy dùng chung cho cả Lệnh Git thường và Lệnh Git LFS
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
console.log('Đã tạo trang index thành công với ' + files.length + ' files và bảng hướng dẫn LFS!');