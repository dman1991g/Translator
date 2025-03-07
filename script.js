async function detectLanguage(text) {
    let response = await fetch("https://libretranslate.de/detect", {
        method: "POST",
        body: JSON.stringify({ q: text }),
        headers: { "Content-Type": "application/json" }
    });

    let data = await response.json();
    return data?.[0]?.language || "en"; // Default to English if detection fails
}

async function translateText() {
    let text = document.getElementById("inputText")?.value.trim();
    let targetLang = document.getElementById("targetLang")?.value;
    let outputElement = document.getElementById("outputText");

    if (!text) {
        outputElement.innerText = "⚠️ Please enter text to translate.";
        return;
    }

    try {
        let detectedLang = await detectLanguage(text);
        console.log("Detected language:", detectedLang);

        if (detectedLang === targetLang) {
            outputElement.innerText = "⚠️ The input and target languages are the same.";
            return;
        }

        let myMemoryURL = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${detectedLang}|${targetLang}`;

        let response = await fetch(myMemoryURL);
        let data = await response.json();

        if (data?.responseData?.translatedText) {
            outputElement.innerText = data.responseData.translatedText;
        } else {
            throw new Error("MyMemory API returned an invalid response.");
        }
    } catch (error) {
        console.error("❌ Translation error:", error);
        outputElement.innerText = "⚠️ Translation failed. Try again later.";
    }
}