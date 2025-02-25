async function translateText() {
    let text = document.getElementById("inputText").value;
    let targetLang = document.getElementById("targetLang").value;

    if (!text) {
        alert("Please enter text to translate.");
        return;
    }

    try {
        // First attempt: Use LibreTranslate
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
        document.getElementById("outputText").innerText = data.translatedText;
    } catch (error) {
        console.warn("LibreTranslate failed, switching to Lingva...", error);

        // Fallback: Use Lingva Translate
        try {
            let lingvaResponse = await fetch(`https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`);
            
            if (!lingvaResponse.ok) throw new Error("Lingva failed");

            let lingvaData = await lingvaResponse.json();
            document.getElementById("outputText").innerText = lingvaData.translation;
        } catch (fallbackError) {
            console.error("Both LibreTranslate and Lingva failed", fallbackError);
            document.getElementById("outputText").innerText = "Translation unavailable.";
        }
    }
}