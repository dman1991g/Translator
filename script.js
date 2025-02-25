async function translateText() {
    let text = document.getElementById("inputText").value.trim();
    let targetLang = document.getElementById("targetLang").value;
    let output = document.getElementById("outputText");

    if (!text) {
        alert("Please enter text to translate.");
        return;
    }

    alert("Text: " + text + "\nLanguage: " + targetLang);

    // **Primary Translation: LibreTranslate**
    try {
        let response = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            body: JSON.stringify({
                q: text,
                source: "auto", // Auto-detects input language
                target: targetLang,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });

        let data = await response.json();
        alert("LibreTranslate API Response: " + JSON.stringify(data));

        if (data.translatedText) {
            output.innerText = data.translatedText;
            alert("Translation Successful (LibreTranslate): " + data.translatedText);
            return;
        }
    } catch (error) {
        alert("LibreTranslate failed, trying Lingva Translate...\nError: " + error);
    }

    // **Fallback: Lingva Translate**
    try {
        let lingvaResponse = await fetch(`https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`);

        let lingvaData = await lingvaResponse.json();
        alert("Lingva Translate API Response: " + JSON.stringify(lingvaData));

        if (lingvaData.translation) {
            output.innerText = lingvaData.translation;
            alert("Translation Successful (Lingva): " + lingvaData.translation);
            return;
        }
    } catch (error) {
        alert("Lingva Translate also failed. Error: " + error);
    }

    output.innerText = "Translation unavailable.";
}

// Ensure the button works even if inline `onclick` fails
document.addEventListener("DOMContentLoaded", function () {
    let translateButton = document.getElementById("translateButton");
    if (translateButton) {
        translateButton.addEventListener("click", translateText);
    } else {
        alert("Translate button not found!");
    }
});