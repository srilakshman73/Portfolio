// AI Chat Assistant client-side integration

function toggleChat() {
    const drawer = document.getElementById('ai-chat-drawer');
    if (!drawer) return;

    const isOpen = !drawer.classList.contains('opacity-0');
    
    if (isOpen) {
        // Close
        drawer.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none', 'scale-95');
    } else {
        // Open
        drawer.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none', 'scale-95');
        // Focus input
        setTimeout(() => {
            const input = document.getElementById('ai-chat-input');
            if (input) input.focus();
        }, 300);
    }
}

function appendMessage(text, isUser = false) {
    const messagesContainer = document.getElementById('ai-chat-messages');
    if (!messagesContainer) return;

    const msgRow = document.createElement('div');
    msgRow.className = `flex ${isUser ? 'justify-end' : 'justify-start'} items-start space-x-2 animate-fade-in`;

    const innerDiv = document.createElement('div');
    if (isUser) {
        innerDiv.className = "p-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-lg max-w-[85%] text-right";
        innerDiv.innerText = text;
    } else {
        innerDiv.className = "p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg max-w-[85%]";
        // Basic markdown parser for bold and links
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="underline hover:text-white">$1</a>');
        innerDiv.innerHTML = formattedText;
    }

    msgRow.appendChild(innerDiv);
    messagesContainer.appendChild(msgRow);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('ai-chat-messages');
    if (!messagesContainer) return null;

    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.className = "flex justify-start items-center space-x-2";
    indicator.innerHTML = `
        <div class="p-2 bg-cyan-500/5 border border-cyan-500/10 text-cyan-500 rounded-lg flex items-center space-x-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style="animation-delay: 0.1s"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style="animation-delay: 0.2s"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style="animation-delay: 0.3s"></span>
        </div>
    `;

    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return indicator;
}

function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
    }
}

function sendMessage(messageText) {
    if (!messageText.trim()) return;

    appendMessage(messageText, true);

    const indicator = showTypingIndicator();

    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageText })
    })
    .then(res => res.json())
    .then(data => {
        removeTypingIndicator(indicator);
        appendMessage(data.response || "No response received.");
    })
    .catch(err => {
        removeTypingIndicator(indicator);
        appendMessage("System telemetry error. Connection to AI grid interrupted.");
    });
}

function sendPreset(text) {
    sendMessage(text);
}

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');

    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = chatInput.value;
            chatInput.value = '';
            sendMessage(val);
        });
    }
});
