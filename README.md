# Ui-plugin
In beta, UI with preset plugins

markdown
Olike Image Generator
Web sederhana untuk generate gambar dengan Pollinations API.
Fitur: Preset View yang di-load dari file terpisah, jadi index.html tetap ringan!

🚀 Live Demo
https://[username].github.io/olike-image-gen/

🛠️ Teknologi
HTML + CSS + Vanilla JS
Pollinations Image API (/v1/images/generations)
External JSON config untuk preset

📦 Struktur File
| File | Fungsi |
|------|--------|
| index.html | UI utama (skeleton ringan) |
| presets.json | Preset gaya (bisa edit tanpa ubah HTML) |
| script.js | Logic generate & load preset |
| README.md | Dokumentasi ini |

⚡ Cara Pakai
Clone repo:
git clone https://github.com/username/olike-image-gen.git

Edit script.js, ganti API key:
const API_KEY = 'pk_xxxxxxxxxxxx'; // Dari enter.pollinations.ai
Buka index.html di browser atau deploy ke GitHub Pages
