const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'messages.json');

app.use(bodyParser.json());

function loadMessages() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveMessages(messages) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Gagal menyimpan pesan:', error);
    throw error;
  }
}

app.get('/messages', (req, res) => {
  const messages = loadMessages();
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const { sender, message } = req.body;
  if (!sender || !message) {
    return res.status(400).json({ error: 'Sender and message are required' });
  }
  const messages = loadMessages();
  const newMessage = {
    id: Date.now(),
    sender,
    message,
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);
  saveMessages(messages);
  res.status(201).json({ success: true, message: 'Message saved' });
});

app.delete('/messages/:id', (req, res) => {
  const messageId = req.params.id;
  console.log(`Request DELETE /messages/${messageId} diterima`);
  if (!messageId) {
    return res.status(400).json({ error: 'Invalid message id' });
  }
  try {
    let messages = loadMessages();
    const initialLength = messages.length;
    messages = messages.filter(msg => String(msg.id) !== messageId);
    if (messages.length === initialLength) {
      console.log(`Pesan dengan id ${messageId} tidak ditemukan`);
      return res.status(404).json({ error: 'Message not found' });
    }
    saveMessages(messages);
    console.log(`Pesan dengan id ${messageId} berhasil dihapus`);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Gagal menghapus pesan:', error);
    res.status(500).json({ error: 'Gagal menghapus pesan' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.delete('/testdelete/:id', (req, res) => {
  const testId = req.params.id;
  console.log(`Request DELETE /testdelete/${testId} diterima`);
  res.json({ success: true, message: `Test delete for id ${testId} successful` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
