// Check if the browser supports SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Default language
    recognition.interimResults = false; // Only return final results

    const micButton = document.getElementById("micButton");
    const inputField = document.getElementById("inputText");

    micButton.addEventListener("click", () => {
        micButton.innerText = "🎤 Listening...";
        micButton.style.backgroundColor = "#ff5555"; // Change color while listening
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        inputField.value = transcript; // Insert spoken text into input field
        micButton.innerText = "🎤 Speak";
        micButton.style.backgroundColor = ""; // Reset color
        translateText(); // Auto-translate after speech input
    };

    recognition.onspeechend = () => {
        recognition.stop();
        micButton.innerText = "🎤 Speak";
        micButton.style.backgroundColor = ""; // Reset color
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        micButton.innerText = "🎤 Speak";
        micButton.style.backgroundColor = ""; // Reset color
    };
} else {
    console.warn("SpeechRecognition API is not supported in this browser.");
}

// Function to translate text
async function translateText() {
    let text = document.getElementById("inputText").value.trim();
    let targetLang = document.getElementById("targetLang").value;
    let output = document.getElementById("outputText");

    if (!text) {
        alert("Please enter text to translate.");
        return;
    }

    console.log("Text to translate:", text);
    console.log("Target language:", targetLang);

    // CORS workaround for LibreTranslate
    try {
        console.log("Trying LibreTranslate...");
        let response = await fetch("https://cors-anywhere.herokuapp.com/https://libretranslate.de/translate", {
            method: "POST",
            body: JSON.stringify({
                q: text,
                source: "auto",
                target: targetLang,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });

        console.log("LibreTranslate HTTP Status:", response.status);

        let data = await response.json();
        console.log("LibreTranslate Response:", data);

        if (data.translatedText) {
            output.innerText = data.translatedText;
            return;
        }
    } catch (error) {
        console.error("LibreTranslate Error:", error);
    }

    // Fallback to Lingva Translate
    try {
        console.log("Trying Lingva Translate...");
        let lingvaResponse = await fetch(`https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`);
        
        console.log("Lingva HTTP Status:", lingvaResponse.status);

        let lingvaData = await lingvaResponse.json();
        console.log("Lingva Translate Response:", lingvaData);

        if (lingvaData.translation) {
            output.innerText = lingvaData.translation;
            return;
        }
    } catch (error) {
        console.error("Lingva Translate Error:", error);
    }

    output.innerText = "Translation unavailable.";
}