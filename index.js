// Import required modules
const express = require('express');
const multer = require('multer'); // for file uploads
const fs = require('fs'); // for file system operations
const path = require('path'); // for handling file paths

const app = express();

// Mock data
let messages = [{"message_type":"quote_offer","text":"Hey, I would love to work for you. my mail is colton.ruecker@gmail.com and my phone number is +4915756678208 and my website is https:\/\/www.ColtonCanFixIt.com just leave a quick message. My price is $1500 😊","created_at":"2023-12-03T09:26:09Z","sender_type":"service_provider","attachments":[],"conversation_id":1,"id":1},{"message_type":"quote_offer","conversation_id":2,"sender_type":"service_provider","created_at":"2023-12-03T09:26:09Z","id":1,"text":"Hey, I would fix your broken laptop for 450€! Just call me 0154566777","attachments":[]}]
let conversations = [{"service_provider_name":"Colton Ruecker","id":1,"updated_at":"2023-12-03T09:26:48Z","state":"quoted","created_at":"2023-12-03T09:26:48Z","customer_name":"Reyes Herzog"},{"customer_name":"Alycia Homenick","id":2,"created_at":"2023-12-03T09:26:48Z","updated_at":"2023-12-03T09:26:48Z","state":"quoted","service_provider_name":"Ampara West"}]

app.use(express.json());

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { conversation_id, message_id } = req.params;
        const dir = `./uploads/${conversation_id}/${message_id}`;

        // Create directory if it doesn't exist
        fs.mkdirSync(dir, { recursive: true });

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // You can access the original filename of the file using `file.originalname`
        // and set the filename as you wish. Here, I'm keeping the original filename.
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/conversations', (req, res) => {
  res.json(conversations);
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.get('/conversation/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const conversation = conversations.find(c => c.id === id);

  if (!conversation) {
    return res.status(404).send('Conversation not found');
  }

  res.json(conversation);
});

app.get('/message/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const message = messages.find(m => m.id === id);

  if (!message) {
    return res.status(404).send('Message not found');
  }

  res.json(message);
});

app.get('/messages/conversation/:conversation_id', (req, res) => {
  const conversation_id = parseInt(req.params.conversation_id);
  const filteredMessages = messages.filter(m => m.conversation_id === conversation_id);

  res.json(filteredMessages);
});


app.get('/reset', (req, res) => {
  messages = [{"message_type":"quote_offer","text":"Hey, I would love to work for you. my mail is colton.ruecker@gmail.com and my phone number is +4915756678208 and my website is https:\/\/www.ColtonCanFixIt.com just leave a quick message. My price is $1500 😊","created_at":"2023-12-03T09:26:09Z","sender_type":"service_provider","attachments":[],"conversation_id":1,"id":1},{"message_type":"quote_offer","conversation_id":2,"sender_type":"service_provider","created_at":"2023-12-03T09:26:09Z","id":1,"text":"Hey I have a great offer for you! I would fix your broken toilet for only 100000$ 😈","attachments":[]}]
  conversations = [{"service_provider_name":"Colton Ruecker","id":1,"updated_at":"2023-12-03T09:26:48Z","state":"quoted","created_at":"2023-12-03T09:26:48Z","customer_name":"Reyes Herzog"},{"customer_name":"Alycia Homenick","id":2,"created_at":"2023-12-03T09:26:48Z","updated_at":"2023-12-03T09:26:48Z","state":"quoted","service_provider_name":"Ampara West"}]
  return res.status(200).send('resetted');
});

app.post('/messages', (req, res) => {
  const message = req.body; // Get the message from the request body
  messages.push(message); // Add the message to the array
  res.json(message); // Send the message back in the response
});

app.put('/messages', (req, res) => {
  const newMessageData = req.body;
  const id = newMessageData.id;
  const conversation_id = newMessageData.conversation_id;
  const messageIndex = messages.findIndex(m => m.id === id && m.conversation_id === conversation_id);

  if (messageIndex === -1) {
    return res.status(404).send('Message not found');
  }

  messages[messageIndex] = { ...messages[messageIndex], ...newMessageData };
  res.json(messages[messageIndex]);
});

app.put('/conversations', (req, res) => {
  const newConversationData = req.body;
  const id = newConversationData.id;
  const conversationIndex = conversations.findIndex(c => c.id === id);

  if (conversationIndex === -1) {
    return res.status(404).send('Conversation not found');
  }

  conversations[conversationIndex] = { ...conversations[conversationIndex], ...newConversationData };
  res.json(conversations[conversationIndex]);
});


// ... other routes ...

// File upload route
app.post('/upload/:conversation_id/:message_id', upload.single('file'), (req, res) => {
  if (!req.file) {
    console.log('No file received');
    return res.status(400).send('No file uploaded.');
  }

  console.log('File received:', req.file);
  res.status(200).send('File uploaded');
});

// File download route
app.get('/download/:conversation_id/:message_id/:filename', (req, res) => {
  const { conversation_id, message_id, filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', conversation_id, message_id, filename);
  res.download(filePath);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
