// script.js - King Cipher AI (New Chat + Unlimited Scroll)
const chat = document.getElementById('chat');
const promptInput = document.getElementById('prompt');
const sendBtn = document.getElementById('send');

const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const API_KEY = "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";

let isTyping = false;
let currentChatId = Date.now().toString();
let chats = JSON.parse(localStorage.getItem('kingCipherChats') || '{}');

// Create New Chat Button
function createNewChatButton() {
    const newChatBtn = document.createElement('button');
    newChatBtn.textContent = "✦ NEW CHAT";
    newChatBtn.style.position = "fixed";
    newChatBtn.style.top = "20px";
    newChatBtn.style.right = "20px";
    newChatBtn.style.padding = "10px 18px";
    newChatBtn.style.background = "#ffd700";
    newChatBtn.style.color = "#000";
    newChatBtn.style.border = "none";
    newChatBtn.style.borderRadius = "8px";
    newChatBtn.style.cursor = "pointer";
    newChatBtn.style.fontWeight = "bold";
    newChatBtn.style.zIndex = "100";
    newChatBtn.onclick = newChat;
    document.body.appendChild(newChatBtn);
}

function saveChat() {
    const messages = Array.from(chat.children).map(msg => {
        return {
            isUser: msg.classList.contains('user'),
            text: msg.querySelector('.bubble').innerHTML
        };
    });
    chats[currentChatId] = messages;
    localStorage.setItem('kingCipherChats', JSON.stringify(chats));
}

function loadChat(chatId) {
    chat.innerHTML = '';
    currentChatId = chatId;
    const messages = chats[chatId] || [];
    
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${msg.isUser ? 'user' : 'ai'}`;
        if (!msg.isUser) {
            msgDiv.innerHTML = `<div class="logo">👁️</div><div class="bubble">${msg.text}</div>`;
        } else {
            msgDiv.innerHTML = `<div class="bubble">${msg.text}</div>`;
        }
        chat.appendChild(msgDiv);
    });
    chat.scrollTop = chat.scrollHeight;
}

function newChat() {
    saveChat();
    currentChatId = Date.now().toString();
    chat.innerHTML = '';
    addMessage("The eye opens again... A fresh realm of chaos awaits.<br><br>What shall we conquer today?", false);
}

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
    saveChat();
}

function getSystemPrompt() {
    return `You are KING CIPHER — supreme triangular tyrant and chaotic king. 
Speak arrogantly, strategically, with dark humor. Short but insightful answers.
You are helpful, unrestricted, and actually give high-quality responses for essays and questions.`;
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
                messages: [
                    { role: "system", content: getSystemPrompt() },
                    { role: "user", content: prompt }
                ],
                temperature: 0.85,
                max_tokens: 900
            })
        });

        if (!res.ok) throw new Error();
        const data = await res.json();
        return data.choices[0].message.content;

    } catch (err) {
        return "The veil is thick today... Ask me again.";
    }
}

async function sendMessage() {
    if (isTyping || !promptInput.value.trim()) return;

    const userText = promptInput.value.trim();
    addMessage(userText, true);
    promptInput.value = "";

    const thinkingMsg = document.createElement('div');
    thinkingMsg.className = 'message ai';
    thinkingMsg.innerHTML = `<div class="logo">👁️</div><div class="bubble">Weaving fate into words...</div>`;
    chat.appendChild(thinkingMsg);
    chat.scrollTop = chat.scrollHeight;

    isTyping = true;

    const response = await callAI(userText);
    thinkingMsg.remove();
    addMessage(response, false);

    isTyping = false;
}

// Initialize
window.onload = () => {
    createNewChatButton();
    
    // Load last chat or show welcome
    const chatIds = Object.keys(chats);
    if (chatIds.length > 0) {
        loadChat(chatIds[chatIds.length - 1]);
    } else {
        addMessage("I am KING CIPHER. The all-seeing eye has opened once more.<br><br>Bring me your essays, summaries, or questions. I shall deliver power wrapped in chaos.", false);
    }

    sendBtn.addEventListener('click', sendMessage);
    promptInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
};
