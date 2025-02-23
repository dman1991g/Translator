// 1. Speech-to-Text (STT) - Converts speech to text
function startSpeechRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = document.getElementById("targetLang").value; // Set language dynamically
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        document.getElementById("inputText").value = event.results[0][0].transcript;
    };

    recognition.onerror = (event) => {
        alert("Speech recognition error: " + event.error);
    };

    recognition.start();
}

// 2. Text-to-Speech (TTS) - Reads the translated text aloud
function speakText() {
    let text = document.getElementById("outputText").innerText;
    let targetLang = document.getElementById("targetLang").value;

    if (!text) {
        alert("No text to speak.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang; // Set language for speech
    window.speechSynthesis.speak(utterance);
}

// 3. Translation Function - Uses LibreTranslate, with Lingva as fallback
async function translateText() {
    let text = document.getElementById("inputText").value;
    let targetLang = document.getElementById("targetLang").value;

    if (!text) {
        alert("Please enter text to translate.");
        return;
    }

    try {
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

        if (!response.ok) {
            throw new Error("LibreTranslate failed, trying Lingva...");
        }

        let data = await response.json();
        document.getElementById("outputText").innerText = data.translatedText;
    } catch (error) {
        console.warn(error.message);
        // Fallback to Lingva
        try {
            let lingvaResponse = await fetch(`https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`);
            let lingvaData = await lingvaResponse.json();
            document.getElementById("outputText").innerText = lingvaData.translation;
        } catch (fallbackError) {
            alert("Translation service is unavailable. Please try again later.");
        }
    }
}

// 4. Event Listeners for Button Clicks
document.getElementById("speakButton").addEventListener("click", startSpeechRecognition);
document.getElementById("listenButton").addEventListener("click", speakText);
document.getElementById("translateButton").addEventListener("click", translateText);