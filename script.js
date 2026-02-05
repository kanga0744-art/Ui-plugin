// SCRIPT UTAMA - ENGINE
// File ini hanya menjalankan logika, datanya diambil dari window.APP_CONFIG

document.addEventListener('DOMContentLoaded', () => {
    
    // Referensi Elemen UI
    const elStatus = document.getElementById('pluginStatus');
    const elSelect = document.getElementById('presetSelect');
    const elPrompt = document.getElementById('promptInput');
    const elBtn = document.getElementById('generateBtn');
    const elResult = document.getElementById('resultArea');
    const elImage = document.getElementById('generatedImage');
    const elDownload = document.getElementById('downloadBtn');

    // 1. CEK KONEKSI DENGAN PLUGIN (PRESETS.JS)
    if (window.APP_CONFIG && window.APP_CONFIG.presets) {
        // SUKSES
        elStatus.textContent = `Plugin v${window.APP_CONFIG.version} Aktif`;
        elStatus.classList.add('active');
        populatePresets(window.APP_CONFIG.presets);
    } else {
        // GAGAL
        elStatus.textContent = "⚠️ Error: presets.js tidak terdeteksi";
        elStatus.classList.add('error');
        elSelect.innerHTML = '<option>Gagal memuat plugin</option>';
        elSelect.disabled = true;
        elBtn.disabled = true;
        alert("File presets.js tidak terbaca. Pastikan file berada di folder yang sama dengan index.html");
        return; // Hentikan script
    }

    // 2. FUNGSI ISI DROPDOWN
    function populatePresets(presets) {
        elSelect.innerHTML = '<option value="">-- Original (Tanpa Style) --</option>';
        
        Object.keys(presets).forEach(key => {
            const preset = presets[key];
            const option = document.createElement('option');
            option.value = key;
            option.textContent = preset.name;
            elSelect.appendChild(option);
        });
    }

    // 3. LOGIC GENERATE GAMBAR
    elBtn.addEventListener('click', async () => {
        const rawPrompt = elPrompt.value.trim();
        const selectedKey = elSelect.value;
        
        if (!rawPrompt) {
            alert("Tuliskan sesuatu di kolom prompt!");
            elPrompt.focus();
            return;
        }

        // UI Loading
        setLoading(true);

        // Siapkan Parameter
        let finalPrompt = rawPrompt;
        let model = "flux"; // Default model
        let seed = Math.floor(Math.random() * 1000000);

        // Ambil data dari Plugin jika ada yang dipilih
        if (selectedKey && window.APP_CONFIG.presets[selectedKey]) {
            const p = window.APP_CONFIG.presets[selectedKey];
            
            // LOGIC PENGGABUNGAN PROMPT (Magic-nya ada disini)
            // Format: [Enhance Prompt] + [User Prompt]
            finalPrompt = `${p.enhancePrompt}, ${rawPrompt}`;
            
            // Jika ada negative prompt, kita bisa menambahkannya di URL nanti (Pollinations support basic prompt only via URL usually, but let's stick to simple prompt concat for stability)
            // Tapi untuk hasil terbaik, kita gabung keyword negatif secara deskriptif 'avoiding ...' atau biarkan model flux bekerja (model ini pintar).
            
            if (p.model) model = p.model;
        }

        console.log("Generating:", { finalPrompt, seed, model });

        // Buat URL
        const encodedPrompt = encodeURIComponent(finalPrompt);
        const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1000&height=1000&seed=${seed}&model=${model}&nologo=true`;

        // Load Gambar
        const imgLoader = new Image();
        
        imgLoader.onload = () => {
            elImage.src = imageUrl;
            elDownload.href = imageUrl;
            elResult.style.display = 'flex'; // Tampilkan hasil
            setLoading(false);
            
            // Scroll ke hasil
            elResult.scrollIntoView({ behavior: 'smooth' });
        };

        imgLoader.onerror = () => {
            alert("Gagal mengambil gambar dari server AI. Coba lagi.");
            setLoading(false);
        };

        imgLoader.src = imageUrl;
    });

    // Helper: UI State
    function setLoading(isLoading) {
        if (isLoading) {
            elBtn.disabled = true;
            elBtn.innerHTML = '🎨 Sedang Menggambar...';
            elImage.style.opacity = '0.5';
        } else {
            elBtn.disabled = false;
            elBtn.innerHTML = '⚡ Generate Image';
            elImage.style.opacity = '1';
        }
    }

});
