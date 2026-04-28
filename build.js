const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
const files = fs.readdirSync(dataDir).filter(file => !file.startsWith('.'));

let html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wiki GIS - Hệ Thống Dữ Liệu KOKOBELLC</title>
    <style>
        :root { --primary: #1a73e8; --success: #1e8e3e; --dark: #202124; --bg: #f8f9fa; --warn: #f29900; --border: #dadce0; }
        body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background-color: var(--bg); margin: 0; padding: 20px; color: #3c4043; line-height: 1.6; }
        .container { max-width: 1000px; margin: auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid var(--border); }
        
        header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid var(--border); }
        h1 { color: var(--primary); font-size: 32px; margin: 0; font-weight: 700; }
        .subtitle { color: #5f6368; font-size: 16px; margin-top: 10px; }

        .method-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; margin-bottom: 15px; }
        .badge-github { background: #e8eaed; color: #202124; border: 1px solid #bdc1c6; }
        .badge-cloudflare { background: #feefe3; color: #d93025; border: 1px solid #fad2cf; }
        .badge-hybrid { background: #e6f4ea; color: #1e8e3e; border: 1px solid #ceead6; }

        .chapter { margin-bottom: 50px; background: #fff; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
        .chapter-header { background: #f1f3f4; padding: 15px 25px; border-bottom: 1px solid var(--border); }
        .chapter-title { font-size: 20px; color: var(--dark); font-weight: bold; margin: 0; display: flex; align-items: center; }
        .chapter-content { padding: 25px; }
        
        .step-card { margin-bottom: 20px; }
        .step-header { font-weight: bold; color: var(--primary); margin-bottom: 10px; font-size: 16px; }

        /* Code & CLI Styles */
        .code-wrapper { background: #202124; color: #e8eaed; padding: 15px; border-radius: 8px; position: relative; margin: 10px 0; font-family: 'Consolas', monospace; font-size: 14px; overflow-x: auto; border: 1px solid #3c4043; }
        .btn-copy { position: absolute; top: 10px; right: 10px; background: #3c4043; border: none; color: #fff; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; transition: 0.2s; }
        .btn-copy:hover { background: var(--success); }

        .alert { background: #fff3ce; border-left: 4px solid var(--warn); color: #856404; padding: 15px; margin: 20px 0; font-size: 14.5px; }
        
        .file-list { margin-top: 30px; border-top: 2px solid var(--border); padding-top: 20px; }
        .file-row { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #f1f3f4; transition: 0.2s; }
        .file-row:hover { background: #f8f9fa; }
        .link-data { color: var(--primary); text-decoration: none; font-weight: 600; font-size: 15px; }
        .btn-link { background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; }
        .btn-link:hover { background: #1557b0; }

        footer { text-align: center; margin-top: 40px; color: #9aa0a6; font-size: 14px; border-top: 1px solid var(--border); padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🌍 BÁCH KHOA TOÀN THƯ GIS</h1>
            <p class="subtitle">Trung tâm điều hành và phân phối dữ liệu không gian - KOKOBELLC</p>
            <p style="font-size: 14px; color: #80868b;">Dữ liệu gốc luôn an toàn tại máy tính: <code>my-gis-data/data/</code></p>
        </header>

        <section class="chapter">
            <div class="chapter-header">
                <h2 class="chapter-title">PHƯƠNG THỨC 1: Vercel Native (File &lt; 100MB)</h2>
            </div>
            <div class="chapter-content">
                <span class="method-badge badge-github">Nhỏ gọn & Nhanh</span>
                <p>Sử dụng khi bạn có các file GeoTIFF hoặc GeoJSON nhỏ (đã được cắt từ QGIS hoặc GEE chia phần). File đẩy thẳng lên GitHub và Vercel tự động load.</p>
                
                <div class="step-card">
                    <div class="step-header">Bước 1: Đẩy dữ liệu lên mạng (Terminal)</div>
                    <div class="code-wrapper">
                        <pre id="code-git">git add .
git commit -m "Cap nhat file nho len Vercel"
git push</pre>
                        <button class="btn-copy" onclick="copyCode('code-git', this)">Copy Lệnh</button>
                    </div>
                </div>

                <div class="step-card">
                    <div class="step-header">Bước 2: Cấu hình bắt buộc (vercel.json)</div>
                    <p>File <code>vercel.json</code> phải nằm ở thư mục gốc để Geoblaze đọc được Pixel từ Vercel Server:</p>
                    <div class="code-wrapper">
                        <pre id="code-vercel">{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, HEAD, OPTIONS" },
        { "key": "Access-Control-Expose-Headers", "value": "Accept-Ranges, Content-Encoding, Content-Length, Content-Range" }
      ]
    }
  ]
}</pre>
                        <button class="btn-copy" onclick="copyCode('code-vercel', this)">Copy JSON</button>
                    </div>
                </div>
            </div>
        </section>

        <section class="chapter">
            <div class="chapter-header">
                <h2 class="chapter-title">PHƯƠNG THỨC 2: Siêu Máy Chủ Cloudflare R2 (File &gt; 100MB)</h2>
            </div>
            <div class="chapter-content">
                <span class="method-badge badge-cloudflare">Chuyên nghiệp & Tốc độ cao</span>
                <p>Sử dụng cho file siêu nét 30m toàn quốc. Lách luật 100MB của GitHub. Tốc độ load cực nhanh nhờ CDN Châu Á.</p>
                
                <div class="step-card">
                    <div class="step-header">Bước 1: Upload thủ công</div>
                    <p>Kéo thả file .tif vào Bucket <code>my-gis-data</code> trên giao diện web Cloudflare R2. Mở tính năng <b>Public Development URL</b>.</p>
                </div>

                <div class="step-card">
                    <div class="step-header">Bước 2: Cài đặt Bùa chú CORS Policy (Cực kỳ quan trọng)</div>
                    <p>Chép đúng cấu trúc JSON này vào mục CORS Policy trên Cloudflare để mở khóa kỹ thuật "Range Request" cho Geoblaze:</p>
                    <div class="code-wrapper">
                        <pre id="code-cors">[
  {
    "AllowedOrigins": ["https://my-gis-data.vercel.app", "http://localhost:3000"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["Content-Length", "Content-Range", "Accept-Ranges", "ETag"],
    "MaxAgeSeconds": 3600
  }
]</pre>
                        <button class="btn-copy" onclick="copyCode('code-cors', this)">Copy CORS</button>
                    </div>
                </div>
            </div>
        </section>

        <section class="chapter">
            <div class="chapter-header">
                <h2 class="chapter-title">PHƯƠNG THỨC 3: Automation & Backup (Khuyên Dùng)</h2>
            </div>
            <div class="chapter-content">
                <span class="method-badge badge-hybrid">An Toàn 100% & Rảnh Tay</span>
                <p>Cơ chế này thực hiện cùng lúc 2 việc: Đẩy code và file nhỏ lên GitHub để sao lưu, đồng thời bắn file lớn lên Cloudflare R2 để chạy Web.</p>
                
                <div class="alert">
                    <b>Lưu ý:</b> Máy tính cần cài đặt AWS CLI và đăng nhập bằng API Token của Cloudflare R2 trước khi dùng lệnh này.
                </div>

                <div class="step-card">
                    <div class="step-header">Cấu hình File package.json</div>
                    <p>Thêm script sau. Khi bạn gõ <code>npm run deploy</code>, hệ thống tự động làm mọi thứ:</p>
                    <div class="code-wrapper">
                        <pre id="code-pkg">"scripts": {
  "start": "node build.js",
  "sync-r2": "aws s3 sync ./data s3://my-gis-data --endpoint-url https://[THAY_ID_CUA_BAN].r2.cloudflarestorage.com",
  "deploy": "npm run sync-r2 && git add . && git commit -m 'Auto Backup & Deploy' && git push"
}</pre>
                        <button class="btn-copy" onclick="copyCode('code-pkg', this)">Copy Script</button>
                    </div>
                </div>
            </div>
        </section>

        <div class="file-list">
            <h2 class="chapter-title" style="font-size: 20px; margin-bottom: 20px;">📦 Danh sách Dữ liệu trên Máy Tính (Local Data)</h2>
            <p style="font-size: 14px; margin-top: -15px; color: #5f6368;">Đây là các file đang nằm trong thư mục <code>data/</code>. Click Copy để lấy link cho vào code.</p>
            <div id="file-container">
`;

// Tự động sinh danh sách file từ thư mục data
files.forEach(file => {
    const fileUrl = `/data/${file}`;
    html += `
                <div class="file-row">
                    <div>
                        <a href="${fileUrl}" class="link-data" target="_blank">📄 ${file}</a>
                    </div>
                    <button class="btn-link" onclick="copyRawUrl('${fileUrl}', this)">🔗 Copy Link Data</button>
                </div>
    `;
});

html += `
            </div>
        </div>

        <footer>
            Hệ thống phân phối dữ liệu GIS - Thiết kế kiến trúc bởi KOKOBELLC &copy; 2026
        </footer>
    </div>

    <script>
        // Copy Code Blocks
        function copyCode(id, btnElement) {
            const code = document.getElementById(id).innerText;
            navigator.clipboard.writeText(code);
            const oldText = btnElement.innerText;
            btnElement.innerText = "✔️ Đã Copy!";
            btnElement.style.background = "#1e8e3e";
            setTimeout(() => { 
                btnElement.innerText = oldText; 
                btnElement.style.background = ""; 
            }, 2000);
        }

        // Copy Direct Link
        function copyRawUrl(path, btnElement) {
            const fullUrl = window.location.origin + path;
            navigator.clipboard.writeText(fullUrl);
            const oldText = btnElement.innerText;
            btnElement.innerText = "✔️ Đã Copy Link!";
            btnElement.style.background = "#1e8e3e";
            setTimeout(() => { 
                btnElement.innerText = oldText; 
                btnElement.style.background = "#1a73e8"; 
            }, 2000);
        }
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('✅ Đã xuất bản thành công Bách Khoa Toàn Thư GIS (Bản Đa Phương Thức)!');