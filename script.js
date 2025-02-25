async function translateText() {
    let text = document.getElementById("inputText").value.trim();
    let targetLang = document.getElementById("targetLang").value;
    let output = document.getElementById("outputText");

    if (!text) {
        alert("Please enter text to translate.");
        return;
    }

    alert("Text to translate: " + text);
    alert("Target language: " + targetLang);

    // CORS workaround for LibreTranslate
    try {
        alert("Trying LibreTranslate...");
        let response = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            body: JSON.stringify({
                q: text,
                source: "auto",
                target: targetLang,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });

        let data = await response.json();
        alert("LibreTranslate Response: " + JSON.stringify(data));

        if (data.translatedText) {
            output.innerText = data.translatedText;
            return;
        }
    } catch (error) {
        alert("LibreTranslate Error: " + error);
    }

    // Fallback to Lingva Translate
    try {
        alert("Trying Lingva Translate...");
        let lingvaResponse = await fetch(`https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`);
        
        let lingvaData = await lingvaResponse.json();
        alert("Lingva Translate Response: " + JSON.stringify(lingvaData));

        if (lingvaData.translation) {
            output.innerText = lingvaData.translation;
            return;
        }
    } catch (error) {
        alert("Lingva Translate Error: " + error);
    }

    output.innerText = "Translation unavailable.";
}