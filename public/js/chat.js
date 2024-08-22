const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const chatId = document.getElementById('chatId').value;
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessage');
    const messagesContainer = document.getElementById('messages');

    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message && chatId.match(/^[0-9a-fA-F]{24}$/)) {
            socket.emit('private message', { chatId, content: message });
            messageInput.value = '';
        } else {
            console.error('Invalid chatId or empty message');
        }
    });

    socket.on('private message', (data) => {
        if (data.chatId === chatId) {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${data.sender}: ${data.content}`;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
});
