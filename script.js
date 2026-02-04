// OLIKE IMAGE GENERATOR - Ultra Safe Version

var API_KEY = 'pk_xxxxxxxxxxxx'; // GANTI INI!
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
            for (var key in presets) {
                if (presets.hasOwnProperty(key)) {
                    var opt = document.createElement('option');
                    opt.value = key;
                    opt.textContent = presets[key].name  key;
                    select.appendChild(opt);
                }
            }
        })
        .catch(function(err) {
            console.error('Error:', err);
            alert('Gagal load preset: ' + err.message);
        });
}

// Generate image
function generateImage() {
    var prompt = document.getElementById('promptInput').value.trim();
    var presetKey = document.getElementById('presetSelect').value;
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
        model = presets[presetKey].model  'flux';
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
                '<a href="' + imgUrl + '" download style="color:#00d4aa;">Download</a>';
        } else {
            throw new Error('Respons tidak valid');
        }
    })
    .catch(function(err) {
        console.error('Error:', err);
        resultDiv.innerHTML = '<p class="error">Gagal generate. Cek API key.</p>';
    })
    .finally(function() {
        btn.disabled = false;
        btn.textContent = 'Generate Image';
    });
}

// Start
loadPresets();
`
