async function translateText() {
    let text = document.getElementById("inputText").value;
    let targetLang = document.getElementById("targetLang").value;

    if (!text) {
        alert("Please enter text to translate.");
        return;
    }

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
    document.getElementById("outputText").innerText = data.translatedText;
}
