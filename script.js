async function translateText() {
    let text = document.getElementById("inputText")?.value.trim();
    let targetLang = document.getElementById("targetLang")?.value;
    let outputElement = document.getElementById("outputText");

    if (!text) {
        outputElement.innerText = "⚠️ Please enter text to translate.";
        return;
    }

    let myMemoryURL = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`;

    try {
        // First try MyMemory API
        let response = await fetch(myMemoryURL);
        let data = await response.json();

        if (data?.responseData?.translatedText) {
            outputElement.innerText = data.responseData.translatedText;
            return; // Success, no need to try Lingva
        } else {
            throw new Error("MyMemory API returned an invalid response.");
        }
    } catch (error) {
        console.error("❌ MyMemory translation failed. Trying Lingva...", error);
        
        // Try Lingva Translate as a fallback
        let lingvaURL = `https://lingva.ml/api/v1/auto/${targetLang}/${encodeURIComponent(text)}`;

        try {
            let lingvaResponse = await fetch(lingvaURL);
            let lingvaData = await lingvaResponse.json();

            if (lingvaData?.translation) {
                outputElement.innerText = lingvaData.translation;
            } else {
                throw new Error("Lingva API returned an invalid response.");
            }
        } catch (lingvaError) {
            console.error("❌ Lingva Translate failed.", lingvaError);
            outputElement.innerText = "⚠️ Translation failed. Try again later.";
        }
    }
}