async function translateText() {
    let text = document.getElementById("inputText").value.trim();
    let targetLang = document.getElementById("targetLang").value;
    let output = document.getElementById("outputText");
    let errorDisplay = document.getElementById("errorDisplay");

    if (!text) {
        errorDisplay.innerText = "Please enter text to translate.";
        return;
    }

    errorDisplay.innerText = "";  // Clear previous errors

    // CORS workaround for LibreTranslate
    try {
        let response = await fetch("https://cors-anywhere.herokuapp.com/https://libretranslate.de/translate", {
            method: "POST",
            body: JSON.stringify({
                q: text,
                source: "auto",  // Auto-detect source language
                target: targetLang,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });

        let data = await response.json();

        if (data.translatedText) {
            output.innerText = data.translatedText;
            return;
        } else {
            errorDisplay.innerText = "Error: Translation failed (LibreTranslate).";
        }
    } catch (error) {
        errorDisplay.innerText = "Error: " + error.message;
    }

    // Fallback to Lingva Translate
    try {
        let lingvaResponse = await fetch(`https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`);
        
        let lingvaData = await lingvaResponse.json();

        if (lingvaData.translation) {
            output.innerText = lingvaData.translation;
            return;
        } else {
            errorDisplay.innerText = "Error: Translation failed (Lingva).";
        }
    } catch (error) {
        errorDisplay.innerText = "Error: " + error.message;
    }

    output.innerText = "Translation unavailable.";
}