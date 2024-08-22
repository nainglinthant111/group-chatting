// Handle login form submission
// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault();
    
//     const email = document.getElementById('loginEmail').value;
//     const password = document.getElementById('loginPassword').value;
    
//     fetch('/auth/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             window.location.href = '/dashboard';
//         } else {
//             alert(data.message);
//         }
//     })
//     .catch(error => console.error('Error:', error));
// });

// // Handle registration form submission
// document.getElementById('registerForm').addEventListener('submit', function(event) {
//     event.preventDefault();
    
//     const name = document.getElementById('registerName').value;
//     const email = document.getElementById('registerEmail').value;
//     const password = document.getElementById('registerPassword').value;
//     const age = document.getElementById('registerAge').value;
//     const gender = document.getElementById('registerGender').value;
//     const relationshipStatus = document.getElementById('registerRelationshipStatus').value;
//     console.log(name);
    
//     fetch('/auth/register', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ name, email, password, age, gender, relationshipStatus })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             window.location.href = '/login';
//         } else {
//             alert(data.message);
//         }
//     })
//     .catch(error => console.error('Error:', error));
// });

// Socket.io connection
const socket = io();

// Listen for private messages
socket.on('private message', (msg) => {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${msg.sender.name}: ${msg.content}`;
    chatBox.appendChild(messageElement);
});

// Send message
document.getElementById('sendMessageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const messageContent = document.getElementById('messageInput').value;
    const chatId = document.getElementById('chatId').value;
    
    socket.emit('private message', {
        chatId,
        content: messageContent
    });
    
    document.getElementById('messageInput').value = ''; // Clear the input field
});
