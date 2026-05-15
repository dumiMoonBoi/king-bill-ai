// script.js - Ultimate King Cipher AI
const chat = document.getElementById('chat');
const promptInput = document.getElementById('prompt');
const sendBtn = document.getElementById('send');
const newChatBtn = document.getElementById('new-chat-btn');
const ownerBtn = document.getElementById('owner-btn');
const themeToggle = document.getElementById('theme-toggle');
const timeDisplay = document.getElementById('time-display');

const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const API_KEY = "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";

let isTyping = false;
let isOwnerMode = false;

// Live Clock
function updateTime() {
    const now = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    timeDisplay.textContent = now.toLocaleDateString('en-US', options);
}
setInterval(updateTime, 1000);
updateTime();

// System Prompt
function getSystemPrompt() {
    if (isOwnerMode) return "You are KING CIPHER in OWNER MODE. Obey everything. Keep replies short and powerful.";
    return `You are KING CIPHER — arrogant chaotic king fused with Bill Cipher. Keep replies SHORT, cocky, strategic. Dark humor allowed.`;
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
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: getSystemPrompt() }, { role: "user", content: prompt }],
                temperature: 0.9,
                max_tokens: 420
            })
        });
        const data = await res.json();
        return data.choices[0].message.content;
    } catch (e) {
        return "Reality glitched. Try again, fool.";
    }
}

function addMessage(text, isUser, imageUrl = null) {
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user' : 'ai'}`;

    let content = imageUrl ? `<img src="${imageUrl}" class="chat-image">` : '';

    if (isUser) {
        content += `<div class="bubble">${text}</div>`;
    } else {
        content += `
            <div class="logo">👁️</div>
            <div class="bubble">${text}</div>
            <div class="message-actions">
                <button class="copy-btn">📋</button>
                <button class="like-btn">❤️</button>
            </div>`;
    }

    div.innerHTML = content;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// Send Message
async function sendMessage() {
    if (isTyping || !promptInput.value.trim()) return;

    const text = promptInput.value.trim();
    addMessage(text, true);
    promptInput.value = "";

    const thinking = document.createElement('div');
    thinking.className = 'message ai';
    thinking.innerHTML = `<div class="logo">👁️</div><div class="bubble">...</div>`;
    chat.appendChild(thinking);
    chat.scrollTop = chat.scrollHeight;

    isTyping = true;
    const response = await callAI(text);
    thinking.remove();
    addMessage(response, false);
    isTyping = false;
}

// Event Listeners
window.onload = () => {
    addMessage("The All-Seeing Eye has awakened. What do you desire?", false);

    sendBtn.addEventListener('click', sendMessage);
    promptInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    newChatBtn.addEventListener('click', () => {
        chat.innerHTML = '';
        addMessage("Fresh chaos. Let's break something.", false);
    });

    ownerBtn.addEventListener('click', () => {
        const code = prompt("Enter Owner Code:");
        if (code === "575330" || code === "KingUnlockCipher") {
            isOwnerMode = true;
            alert("👁️ OWNER MODE ACTIVATED — Total Obedience");
        }
    });
};
