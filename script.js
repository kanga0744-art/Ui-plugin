javascript
// ============================
// OLIKE IMAGE GENERATOR
// ============================

const API_KEY = 'pk_xxxxxxxxxxxx'; // Ganti dengan API key lo dari enter.pollinations.ai
let presets = {};

// Load presets dari file terpisah
async function loadPresets() {
    try {
        const response = await fetch('presets.json');
presets = await response.json();

        // Isi dropdown
        const select = document.getElementById('presetSelect');
        Object.keys(presets).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = presets[key].name;
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Gagal load preset:', error);
        showResult('❌ Gagal memuat preset. Refresh halaman.', true);
    }
}

// Generate image
async function generateImage() {
    const prompt = document.getElementById('promptInput').value.trim();
    const presetKey = document.getElementById('presetSelect').value;
    const btn = document.getElementById('generateBtn');
    const resultDiv = document.getElementById('result');

    // Validasi
    if (!prompt) {
        alert('Isi prompt dulu!');
        return;
    }

    // Build final prompt dengan preset
    let finalPrompt = prompt;
    let model = 'flux';

    if (presetKey && presets[presetKey]) {
        const preset = presets[presetKey];
        finalPrompt = ${prompt}, ${preset.enhancePrompt};
        model = preset.model;
    }

    // UI Loading
    btn.disabled = true;
    btn.textContent = '⏳ Generating...';
    resultDiv.innerHTML = '<p class="loading">Sedang membuat gambar...</p>';

    try {
        // Panggil Pollinations API
        const response = await fetch(https://gen.pollinations.ai/v1/images/generations, {
            method: 'POST',
            headers: {
                'Authorization': Bearer ${API_KEY},
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                prompt: finalPrompt,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();
if (data.data && data.data[0] && data.data[0].url) {
            // Success - tampilkan gambar
            resultDiv.innerHTML = 
                <img src="${data.data[0].url}" alt="Generated image">
                <p style="margin-top:10px; font-size:12px; color:#aaa;">
                    Model: ${model} | Preset: ${presetKey || 'None'}
                </p>
                <a href="${data.data[0].url}" download style="color:#00d4aa;">
                    ⬇️ Download
                </a>
            ;
        } else {
            throw new Error('Respons tidak valid');
        }

    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p class="error">❌ Gagal generate. Cek API key atau coba lagi.</p>';
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ Generate Image';
    }
}

// Helper
function showResult(text, isError = false) {
    const div = document.getElementById('result');
    div.innerHTML = <p class="${isError ? 'error' : ''}">${text}</p>;
}

// Init
loadPresets();
