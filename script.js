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
        let response = await fetch(myMemoryURL);
        let data = await response.json();

        if (data?.responseData?.translatedText) {
            outputElement.innerText = data.responseData.translatedText;
        } else {
            throw new Error("MyMemory API returned an invalid response.");
        }
    } catch (error) {
        console.error("❌ MyMemory translation failed.", error);
        outputElement.innerText = "⚠️ Translation failed. Try again later.";
    }
}