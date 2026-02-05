// OLIKE IMAGE GENERATOR - Ultra Safe Version

var API_KEY = 'sk_1nRMiKi5buYyq1cEkal0V0UBjW2gdguU'; // GANTI INI!
var presets = {};

// Load presets
function loadPresets() {
    fetch('presets.json')
        .then(function(response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
        })
        .then(function(data) {
            presets = data;
            console.log('Loaded:', presets);

            var select = document.getElementById('presetSelect');
            
            // Clear existing options (keep default)
            // select.innerHTML = '<option value="">-- Pilih Preset --</option>';

            for (var key in presets) {
                if (presets.hasOwnProperty(key)) {
                    var opt = document.createElement('option');
                    opt.value = key;
                    // FIX: Removed the floating 'key' variable which caused syntax error
                    opt.textContent = presets[key].name; 
                    select.appendChild(opt);
                }
            }
        })
        .catch(function(err) {
            console.error('Error:', err);
            // alert('Gagal load preset: ' + err.message); // Optional: uncomment if you want alert
        });
}

// Generate image
function generateImage() {
    var promptInput = document.getElementById('promptInput');
    var prompt = promptInput.value.trim();
    var presetSelect = document.getElementById('presetSelect');
    var presetKey = presetSelect.value;
    var btn = document.getElementById('generateBtn');
    var resultDiv = document.getElementById('result');

    if (!prompt) {
        alert('Isi prompt dulu!');
        return;
    }

    var finalPrompt = prompt;
    var model = 'flux';

    if (presetKey && presets[presetKey]) {
        finalPrompt = prompt + ', ' + presets[presetKey].enhancePrompt;
        // FIX: Added || operator
        model = presets[presetKey].model || 'flux'; 
    }

    btn.disabled = true;
    btn.textContent = '⏳ Generating...';
    resultDiv.innerHTML = '<p class="loading">Sedang membuat gambar...</p>';

    var requestBody = {
        model: model,
        prompt: finalPrompt,
        n: 1,
        size: '1024x1024'
    };

    fetch('https://gen.pollinations.ai/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
    })
    .then(function(data) {
        if (data.data && data.data[0] && data.data[0].url) {
            var imgUrl = data.data[0].url;
            resultDiv.innerHTML = 
                '<img src="' + imgUrl + '" style="max-width:100%;border-radius:12px;">' +
                '<p style="margin-top:10px;font-size:12px;color:#aaa;">' +
                'Model: ' + model + ' | Preset: ' + (presetKey || 'None') +
                '</p>' +
                '<a href="' + imgUrl + '" download target="_blank" style="color:#00d4aa;display:inline-block;margin-top:5px;text-decoration:none;border:1px solid #00d4aa;padding:5px 10px;border-radius:5px;">Download HD</a>';
        } else {
            throw new Error('Respons tidak valid');
        }
    })
    .catch(function(err) {
        console.error('Error:', err);
        resultDiv.innerHTML = '<p class="error">Gagal generate: ' + err.message + '</p>';
    })
    .finally(function() {
        btn.disabled = false;
        btn.textContent = '✨ Generate Image';
    });
}

// Start
loadPresets();
