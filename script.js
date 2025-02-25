async function translateText() {
    let text = document.getElementById("inputText").value.trim();
    let targetLang = document.getElementById("targetLang").value;
    let outputElement = document.getElementById("outputText");

    if (!text) {
        outputElement.innerText = "⚠️ Please enter text to translate.";
        return;
    }

    let libreTranslateURL = "https://libretranslate.de/translate";
    let lingvaTranslateURL = `https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`;

    try {
        // 🔹 Attempt LibreTranslate first
        let response = await fetch(libreTranslateURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: text,          // ✅ Text to translate
                source: "auto",   // ✅ Auto-detect language
                target: targetLang,
                format: "text"
            })
        });

        let data = await response.json();

        if (data && data.translatedText) {
            outputElement.innerText = data.translatedText; // ✅ Success
            return;
        } else {
            throw new Error("LibreTranslate returned an invalid response.");
        }
    } catch (error) {
        outputElement.innerText = "LibreTranslate failed. Trying Lingva...";
    }

    // 🔹 Fallback: Use Lingva Translate
    try {
        let lingvaResponse = await fetch(lingvaTranslateURL);
        let lingvaData = await lingvaResponse.json();

        if (lingvaData && lingvaData.translation) {
            outputElement.innerText = lingvaData.translation; // ✅ Success
        } else {
            throw new Error("Lingva returned an invalid response.");
        }
    } catch (fallbackError) {
        outputElement.innerText = "⚠️ Both translation services failed. Please try again later.";
    }
}