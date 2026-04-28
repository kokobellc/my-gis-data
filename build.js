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
        :root { --primary: #1a73e8; --success: #2ea043; --dark: #202124; --bg: #f8f9fa; --warn: #f57f17; }
        body { font-family: 'Inter', -apple-system, sans-serif; background-color: var(--bg); margin: 0; padding: 20px; color: #3c4043; line-height: 1.6; }
        .container { max-width: 1000px; margin: auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        
        header { text-align: center; margin-bottom: 50px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        h1 { color: var(--primary); font-size: 32px; margin: 0; }
        .subtitle { color: #5f6368; font-size: 16px; margin-top: 10px; }

        .chapter { margin-bottom: 40px; }
        .chapter-title { display: flex; align-items: center; font-size: 22px; color: var(--dark); border-left: 5px solid var(--primary); padding-left: 15px; margin-bottom: 20px; }
        
        .step-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; margin-bottom: 15px; transition: transform 0.2s; }
        .step-card:hover { border-color: var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .step-header { font-weight: bold; color: var(--primary); margin-bottom: 10px; display: flex; align-items: center; }
        .step-num { background: var(--primary); color: white; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; justify-content: center; align-items: center; font-size: 12px; margin-right: 10px; }

        /* Code & CLI Styles */
        .code-wrapper { background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; position: relative; margin: 10px 0; font-family: 'Fira Code', monospace; font-size: 13.5px; overflow-x: auto; }
        .btn-copy { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; }
        .btn-copy:hover { background: var(--success); }

        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
        .badge-cloud { background: #e8f0fe; color: #1967d2; }
        .badge-local { background: #e6ffed; color: #22863a; }

        .alert { background: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
        
        .file-list { margin-top: 30px; border-top: 2px solid #eee; padding-top: 20px; }
        .file-row { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #f1f1f1; }
        .link-data { color: var(--primary); text-decoration: none; font-weight: 500; }
        .btn-link { background: var(--primary); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; }

        footer { text-align: center; margin-top: 50px; color: #9aa0a6; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🌍 BÁCH KHOA TOÀN THƯ GIS</h1>
            <p class="subtitle">Hệ thống quản lý dữ liệu Google Buildings 30m - Tự động hóa Cloudflare & Vercel</p>
        </header>

        <section class="chapter">
            <div class="chapter-title">I. Trích xuất Siêu dữ liệu (Google Earth Engine)</div>
            <div class="step-card">
                <div class="step-header"><span class="step-num">1</span> Xuất dữ liệu độ phân giải 30m</div>
                <p>Truy cập GEE và dùng Script trích xuất. Lưu ý: Google sẽ tự động cắt file thành các phần (Part 1, Part 2...) nếu vượt quá 32k pixel. Điều này giúp né giới hạn 100MB của Vercel/GitHub.</p>
                <div class="code-wrapper">
                    <pre id="code-gee">// Dùng Scale: 30 và Hệ tọa độ: EPSG:4326
Export.image.toDrive({
  image: buildingDensity,
  scale: 30,
  crs: 'EPSG:4326',
  formatOptions: { cloudOptimized: true }
});</pre>
                    <button class="btn-copy" onclick="copyCode('code-gee')">Copy Script</button>
                </div>
            </div>
        </section>

        <section class="chapter">
            <div class="chapter-title">II. Lưu trữ Đám mây (Cloudflare R2)</div>
            <div class="step-card">
                <div class="step-header"><span class="step-num">2</span> Cấu hình "Chìa khóa" CORS</div>
                <p>Để Web Tool (Vercel) đọc được pixel từ Cloudflare mà không bị chặn, dán đoạn JSON này vào mục <b>CORS Policy</b> của Bucket:</p>
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
                    <button class="btn-copy" onclick="copyCode('code-cors')">Copy CORS JSON</button>
                </div>
            </div>
            <div class="step-card">
                <div class="step-header"><span class="step-num">3</span> Lấy Link Public</div>
                <p>Bật <b>Public Development URL</b>. Link file sẽ có dạng:</p>
                <div class="code-wrapper">
                    <pre id="code-url">https://pub-abd68e7e9d5e4c539cebcfd1330db070.r2.dev/vnm_google_30m.tif</pre>
                    <button class="btn-copy" onclick="copyCode('code-url')">Copy URL Mẫu</button>
                </div>
            </div>
        </section>

        <section class="chapter">
            <div class="chapter-title">III. Tự động hóa CI/CD (GitHub + R2)</div>
            <div class="alert">
                💡 <b>Mẹo Pro:</b> Không cần kéo thả file thủ công. Hãy dùng lệnh để đồng bộ cả Code và Data trong 1 giây.
            </div>
            <div class="step-card">
                <div class="step-header"><span class="step-num">4</span> Lệnh đồng bộ dữ liệu (AWS CLI)</div>
                <p>Cài AWS CLI và cấu hình khóa Cloudflare. Sau đó chạy lệnh để đẩy file từ <code>/data</code> lên Cloud:</p>
                <div class="code-wrapper">
                    <pre id="code-sync">aws s3 sync ./data s3://my-gis-data --endpoint-url https://[ID].r2.cloudflarestorage.com</pre>
                    <button class="btn-copy" onclick="copyCode('code-sync')">Copy Lệnh Sync</button>
                </div>
            </div>
            <div class="step-card">
                <div class="step-header"><span class="step-num">5</span> Cấu hình package.json</div>
                <p>Thêm script này để gộp lệnh: Chỉ cần gõ <code>npm run deploy</code> là xong tất cả.</p>
                <div class="code-wrapper">
                    <pre id="code-pkg">"deploy": "npm run sync-data && git add . && git commit -m 'Update' && git push"</pre>
                    <button class="btn-copy" onclick="copyCode('code-pkg')">Copy Script Pkg</button>
                </div>
            </div>
        </section>

        <div class="file-list">
            <div class="chapter-title">📦 Danh mục dữ liệu Local (Dưới 100MB)</div>
            <div id="file-container">
`;

// Tự động sinh danh sách file
files.forEach(file => {
    const fileUrl = `/data/${file}`;
    html += `
                <div class="file-row">
                    <div>
                        <span class="badge badge-local">LOCAL</span>
                        <a href="${fileUrl}" class="link-data" target="_blank">${file}</a>
                    </div>
                    <button class="btn-link" onclick="copyRawUrl('${fileUrl}')">🔗 Copy Link</button>
                </div>
    `;
});

html += `
            </div>
        </div>

        <footer>
            Hệ thống phân phối dữ liệu GIS chiến lược - Phát triển bởi KOKOBELLC &copy; 2026
        </footer>
    </div>

    <script>
        function copyCode(id) {
            const code = document.getElementById(id).innerText;
            navigator.clipboard.writeText(code);
            const btn = document.querySelector(\`[onclick="copyCode('\${id}')"]\`);
            const oldText = btn.innerText;
            btn.innerText = "Đã Copy!";
            btn.style.background = "#2ea043";
            setTimeout(() => { btn.innerText = oldText; btn.style.background = ""; }, 2000);
        }

        function copyRawUrl(path) {
            const fullUrl = window.location.origin + path;
            navigator.clipboard.writeText(fullUrl);
            alert("Đã copy link dữ liệu!");
        }
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('✅ Đã tạo Bách Khoa Toàn Thư GIS Ver 3.0 hoàn hảo!');