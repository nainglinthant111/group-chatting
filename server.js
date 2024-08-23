const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const User = require('./models/User');
const Chat = require('./models/Chat'); 


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Database Connection
mongoose.connect('mongodb+srv://nainglinthant1998:nainglinthant1998@customerdb0.jg9rnlh.mongodb.net/nainglinthant?retryWrites=true&w=majority&appName=customerdb0', { useNewUrlParser: true, useUnifiedTopology: true });

// Session Management
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Passport configuration
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// Serve HTML Files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'welcome.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
      if (err) {
        res.redirect('/login');
      }
      req.session.destroy(() => {
          res.clearCookie('connect.sid');
          res.redirect('/login'); 
      });
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', async ({ chatId, message,sender }) => {
      io.emit('receiveMessage', { chatId, message,sender });
  });

  socket.on('disconnect', () => {
      console.log('A user disconnected');
  });
});



server.listen(3300, () => {
  console.log('Server running on http://localhost:3300');
});
