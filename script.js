async function translateText() {
    let text = document.getElementById("inputText").value.trim();
    let targetLang = document.getElementById("targetLang").value;
    let output = document.getElementById("outputText");

    if (!text) {
        alert("Please enter text to translate.");
        return;
    }

    // Try LibreTranslate first
    try {
        console.log("Trying LibreTranslate...");
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

        if (!response.ok) throw new Error("LibreTranslate failed");

        let data = await response.json();
        console.log("LibreTranslate response:", data);

        if (data.translatedText) {
            output.innerText = data.translatedText;
            return;
        }
    } catch (error) {
        console.warn("LibreTranslate Error:", error);
    }

    // Fallback to Lingva Translate
    try {
        console.log("Trying Lingva Translate...");
        let lingvaResponse = await fetch(`https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`);
        
        if (!lingvaResponse.ok) throw new Error("Lingva Translate failed");

        let lingvaData = await lingvaResponse.json();
        console.log("Lingva Translate response:", lingvaData);

        if (lingvaData.translation) {
            output.innerText = lingvaData.translation;
            return;
        }
    } catch (error) {
        console.warn("Lingva Translate Error:", error);
    }

    // If both fail
    output.innerText = "Translation unavailable.";
}