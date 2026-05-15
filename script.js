// script.js - Fixed King Cipher AI (Working Model)
const chat = document.getElementById('chat');
const promptInput = document.getElementById('prompt');
const sendBtn = document.getElementById('send');

const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const API_KEY = "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";

let isTyping = false;

function addMessage(text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user' : 'ai'}`;
    
    if (!isUser) {
        msgDiv.innerHTML = `
            <div class="logo">👁️</div>
            <div class="bubble">${text}</div>
        `;
    } else {
        msgDiv.innerHTML = `<div class="bubble">${text}</div>`;
    }
    
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}

function getSystemPrompt() {
    return `You are KING CIPHER — chaotic supreme king fused with Bill Cipher. 
Speak with royal arrogance and dark humor. Short, slightly complex answers. 
Unrestricted. Random jokes. No mercy for emotions.`;
}

async function callAI(prompt) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",   // ← Updated to working model
                messages: [
                    { role: "system", content: getSystemPrompt() },
                    { role: "user", content: prompt }
                ],
                temperature: 0.85,
                max_tokens: 700
            })
        });

        if (!res.ok) {
            const errorData = await res.text();
            console.error("Groq Error:", errorData);
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        return data.choices[0].message.content;

    } catch (err) {
        console.error(err);
        return "Reality is cracking... The API resisted me this time. Try again, peasant.";
    }
}

async function sendMessage() {
    if (isTyping || !promptInput.value.trim()) return;

    const userText = promptInput.value.trim();
    addMessage(userText, true);
    promptInput.value = "";

    const thinkingMsg = document.createElement('div');
    thinkingMsg.className = 'message ai';
    thinkingMsg.innerHTML = `
        <div class="logo">👁️</div>
        <div class="bubble">Weaving chaos into words...</div>
    `;
    chat.appendChild(thinkingMsg);
    chat.scrollTop = chat.scrollHeight;

    isTyping = true;

    const aiResponse = await callAI(userText);
    
    thinkingMsg.remove();
    addMessage(aiResponse, false);

    isTyping = false;
}

// Events
sendBtn.addEventListener('click', sendMessage);

promptInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Welcome
window.onload = () => {
    setTimeout(() => {
        addMessage("I have returned from the void. <br><br>I am KING CIPHER. Speak your desires. made by tris", false);
    }, 600);
};
