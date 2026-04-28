// 1. GỌI ĐỒ NGHỀ (THƯ VIỆN)
const fs = require('fs');
const path = require('path');

// 2. XÁC ĐỊNH MỤC TIÊU (TÌM THƯ MỤC DATA)
const dataDir = path.join(__dirname, 'data');

// 3. QUÉT THƯ MỤC VÀ LẤY DANH SÁCH FILE
// Lệnh này đọc tất cả file, nhưng bộ lọc .filter() sẽ loại bỏ các file rác bị ẩn (những file có tên bắt đầu bằng dấu chấm)
const files = fs.readdirSync(dataDir).filter(file => !file.startsWith('.'));

// 4. XÂY DỰNG KHUNG GIAO DIỆN (HTML & CSS)
let html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kho Dữ Liệu GIS - KOKOBELLC</title>
    <style>
        /* PHẦN TRANG TRÍ (CSS) */
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px; }
        .container { max-width: 850px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: none; }
        h1 { color: #1a73e8; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        
        /* Hộp Hướng dẫn */
        .guide-box { background-color: #e8f0fe; border-left: 5px solid #1a73e8; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
        .guide-box h2 { color: #1557b0; margin-top: 0; font-size: 18px; }
        .guide-box ol { margin-bottom: 15px; padding-left: 20px; color: #333; line-height: 1.6; }
        .code-container { background: #202124; color: #58a6ff; padding: 15px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-family: monospace; font-size: 15px; }
        .code-container pre { margin: 0; white-space: pre-wrap; }
        .btn-copy-code { background: #2ea043; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .btn-copy-code:hover { background: #238636; }

        /* Danh sách file */
        .file-list { list-style: none; padding: 0; }
        .file-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee; transition: background 0.2s; }
        .file-item:hover { background: #f9f9f9; }
        .file-name { font-weight: 600; color: #333; text-decoration: none; font-size: 16px; word-break: break-all; margin-right: 15px;}
        .file-name:hover { color: #1a73e8; text-decoration: underline; }
        .copy-btn { padding: 8px 15px; background: #1a73e8; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.2s; white-space: nowrap; }
        .copy-btn:hover { background: #1557b0; }
        
        /* Màn hình khóa PIN */
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
            <h2>🚀 Cẩm nang thêm file tự động</h2>
            <ol>
                <li>Copy file dữ liệu mới (VD: <code>bando.tif</code>) dán vào thư mục <strong><code>data</code></strong> trên máy tính.</li>
                <li>Mở cửa sổ dòng lệnh (Terminal / Git Bash) tại thư mục <strong><code>my-gis-data</code></strong>.</li>
                <li>Bấm nút Copy bên dưới để lấy bộ 3 câu lệnh thần thánh.</li>
                <li>Chuột phải vào cửa sổ lệnh để <strong>Paste (Dán)</strong> -> Nhấn <strong>Enter</strong> và đợi chạy xong.</li>
            </ol>
            <div class="code-container">
                <pre id="git-commands">git add .
git commit -m "Cap nhat them file du lieu moi"
git push</pre>
                <button class="btn-copy-code" onclick="copyGitCommands(this)">📋 Copy Lệnh</button>
            </div>
            <p style="font-size: 13px; color: #555; margin-top: 10px; font-style: italic;">* Mẹo: Sau khi Push xong, đợi khoảng 30s - 1 phút và F5 (tải lại) trang web này, file mới sẽ tự xuất hiện bên dưới.</p>
        </div>

        <h2 style="font-size: 16px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">DANH SÁCH FILE HIỆN CÓ</h2>
        <ul class="file-list">
`;

// 5. TỰ ĐỘNG IN RA DANH SÁCH FILE (VÒNG LẶP)
// Đoạn này lấy từng file tìm được ở bước 3, tạo ra một hàng chứa Tên File và Nút Copy
files.forEach(file => {
    const fileUrl = `/data/${file}`;
    html += `
            <li class="file-item">
                <a href="${fileUrl}" class="file-name" target="_blank">📄 ${file}</a>
                <button class="copy-btn" onclick="copyToClipboard('${fileUrl}', this)">🔗 Copy Link Data</button>
            </li>
    `;
});

// 6. GẮN "NÃO BỘ" CHO GIAO DIỆN (JAVASCRIPT TẠI TRÌNH DUYỆT)
html += `
        </ul>
        <div class="footer">Hệ thống quản lý file tự động - KOKOBELLC</div>
    </div>

    <script>
        // --- CẤU HÌNH MẬT KHẨU ---
        const SECRET_PIN = "123456"; // Đổi số này thành mật khẩu riêng của bạn

        // Hàm kiểm tra Mật khẩu
        function checkPin() {
            const input = document.getElementById('pin-input').value;
            if(input === SECRET_PIN) {
                // Nếu đúng: Ẩn màn hình khóa, Hiện nội dung chính
                document.getElementById('lock-screen').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
            } else {
                // Nếu sai: Hiện dòng chữ báo lỗi
                document.getElementById('error-msg').style.display = 'block';
            }
        }

        // Cho phép ấn phím Enter để mở khóa thay vì phải click chuột
        document.getElementById('pin-input').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkPin();
        });

        // Hàm xử lý việc Copy Link Bản đồ
        function copyToClipboard(path, btnElement) {
            const fullUrl = window.location.origin + path;
            navigator.clipboard.writeText(fullUrl).then(() => {
                const originalText = btnElement.innerText;
                btnElement.innerText = "✔️ Đã Copy Link!";
                btnElement.style.background = "#28a745"; // Đổi màu xanh lá
                setTimeout(() => {
                    btnElement.innerText = originalText;
                    btnElement.style.background = "#1a73e8"; // Trả lại màu cũ sau 2 giây
                }, 2000);
            });
        }

        // Hàm xử lý việc Copy 3 câu lệnh Git
        function copyGitCommands(btnElement) {
            const code = document.getElementById('git-commands').innerText;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = btnElement.innerText;
                btnElement.innerText = "✔️ Đã Copy Lệnh!";
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

// 7. XUẤT XƯỞNG (TẠO FILE INDEX.HTML)
// Lệnh này lấy toàn bộ nội dung HTML vừa được nhào nặn ở trên và lưu thành file index.html thật
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Đã tạo trang index thành công với ' + files.length + ' files và bảng hướng dẫn!');