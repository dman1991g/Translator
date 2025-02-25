async function translateText() {
    let text = document.getElementById("inputText")?.value.trim();
    let targetLang = document.getElementById("targetLang")?.value;
    let outputElement = document.getElementById("outputText");

    if (!text) {
        outputElement.innerText = "⚠️ Please enter text to translate.";
        return;
    }

    let myMemoryURL = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;

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

function startSpeechToText() {
    let inputElement = document.getElementById("inputText");

    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech-to-text is not supported in this browser.");
        return;
    }

    let recognition = new webkitSpeechRecognition(); // Safari uses webkit prefix
    recognition.lang = "en-US"; // Change this to match your language
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
        inputElement.placeholder = "Listening...";
    };

    recognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript;
        inputElement.value = transcript; // Set the recognized text into the input field
    };

    recognition.onerror = function(event) {
        alert("Speech recognition error: " + event.error);
    };

    recognition.onend = function() {
        inputElement.placeholder = "Type a message";
        translateText();  // Automatically translate after speech recognition ends
    };

    recognition.start();
}