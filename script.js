async function detectLanguage(text) {
    let detectURL = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`;

    try {
        let response = await fetch(detectURL);
        let data = await response.json();
        
        console.log("Language detection response:", data); // Debugging log

        if (data?.responseData?.detectedSourceLanguage) {
            return data.responseData.detectedSourceLanguage; // Correct field
        } else if (data?.matches?.length > 0) {
            // Alternative way to get detected language
            return data.matches[0].segment; 
        } else {
            throw new Error("Language detection failed.");
        }
    } catch (error) {
        console.error("❌ Language detection failed:", error);
        return null;
    }
}

async function translateText() {
    let text = document.getElementById("inputText")?.value.trim();
    let targetLang = document.getElementById("targetLang")?.value;
    let outputElement = document.getElementById("outputText");

    if (!text) {
        outputElement.innerText = "⚠️ Please enter text to translate.";
        return;
    }

    // Step 1: Detect the language
    let detectedLang = await detectLanguage(text);

    if (!detectedLang) {
        outputElement.innerText = "⚠️ Unable to detect language.";
        return;
    }

    console.log("Detected language:", detectedLang);

    // Step 2: Translate the text using the detected language
    let translateURL = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${detectedLang}|${targetLang}`;

    try {
        let response = await fetch(translateURL);
        let data = await response.json();

        console.log("Translation response:", data); // Debugging log

        if (data?.responseData?.translatedText) {
            outputElement.innerText = data.responseData.translatedText;
        } else {
            throw new Error("MyMemory API returned an invalid response.");
        }
    } catch (error) {
        console.error("❌ MyMemory translation failed:", error);
        outputElement.innerText = "⚠️ Translation failed. Try again later.";
    }
}