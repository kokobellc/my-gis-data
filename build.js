const fs = require('fs');
const path = require('path');

// Đường dẫn tới thư mục data
const dataDir = path.join(__dirname, 'data');

// Đọc danh sách các file trong thư mục data (bỏ qua các file ẩn)
const files = fs.readdirSync(dataDir).filter(file => !file.startsWith('.'));

// Bắt đầu tạo nội dung cho trang web (HTML + CSS cho đẹp)
let html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kho Dữ Liệu GIS - KOKOBELLC</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 40px; }
        .container { max-width: 800px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { color: #1a73e8; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .file-list { list-style: none; padding: 0; }
        .file-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee; transition: background 0.2s; }
        .file-item:hover { background: #f9f9f9; }
        .file-name { font-weight: 600; color: #333; text-decoration: none; font-size: 16px; word-break: break-all; margin-right: 15px;}
        .file-name:hover { color: #1a73e8; text-decoration: underline; }
        .copy-btn { padding: 8px 15px; background: #1a73e8; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: background 0.2s; white-space: nowrap; }
        .copy-btn:hover { background: #1557b0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📁 KHO DỮ LIỆU BẢN ĐỒ CỦA TÔI</h1>
        <p style="text-align: center; color: #555;">Dưới đây là danh sách các file dữ liệu. Bấm nút Copy để lấy đường dẫn trực tiếp.</p>
        <ul class="file-list">
`;

// Tự động tạo một dòng cho mỗi file tìm thấy
files.forEach(file => {
    const fileUrl = `/data/${file}`;
    html += `
            <li class="file-item">
                <a href="${fileUrl}" class="file-name" target="_blank">📄 ${file}</a>
                <button class="copy-btn" onclick="copyToClipboard('${fileUrl}', this)">📋 Copy Link</button>
            </li>
    `;
});

// Đóng thẻ HTML và thêm Script cho nút Copy
html += `
        </ul>
        <div class="footer">Cập nhật tự động bởi hệ thống</div>
    </div>

    <script>
        function copyToClipboard(path, btnElement) {
            // Lấy tên miền hiện tại ghép với đường dẫn file
            const fullUrl = window.location.origin + path;
            navigator.clipboard.writeText(fullUrl).then(() => {
                // Đổi chữ nút thành Đã copy để báo hiệu cho người dùng
                const originalText = btnElement.innerText;
                btnElement.innerText = "✔️ Đã Copy!";
                btnElement.style.background = "#28a745";
                setTimeout(() => {
                    btnElement.innerText = originalText;
                    btnElement.style.background = "#1a73e8";
                }, 2000);
            });
        }
    </script>
</body>
</html>
`;

// Ghi nội dung này ra một file tên là index.html
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Đã tạo trang index thành công với ' + files.length + ' files!');