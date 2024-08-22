const express = require('express');
const Chat = require('../models/Chat');
const User = require('../models/User');

const router = express.Router();

// Get all users except the logged-in user
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select('name');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get chat room or create one if it doesn't exist
router.get('/:userId', async (req, res) => {
    
    try {
        const chat = await Chat.findOne({
            $or: [
                { participants: [req.user._id, req.params.userId] },
                { participants: [req.params.userId, req.user._id] }
            ]
        });

        if (!chat) {
            const newChat = new Chat({
                participants: [req.user._id, req.params.userId],
                messages: []
            });
            await newChat.save();
            return res.json(newChat);
        }

        res.json(chat);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Post a new message to a chat room
router.post('/:chatId/message', async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId);
        if (!chat) {
            return res.status(404).json({ msg: 'Chat not found' });
        }

        const newMessage = {
            sender: req.user._id,
            content: req.body.content
        };

        chat.messages.push(newMessage);
        await chat.save();

        res.json(chat);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
