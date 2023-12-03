// Import required modules
const express = require('express');
const multer = require('multer'); // for file uploads
const fs = require('fs'); // for file system operations
const path = require('path'); // for handling file paths

const app = express();
const upload = multer({ dest: 'uploads/' }); // configure multer

// Mock data
let messages = [{"message_type":"quote_offer","text":"Hey, I would love to work for you. my mail is benedict.bode11@gmail.com and my phone number is +4915757778208 and my website is https:\/\/www.google.com just leave a quick message but my price is $ 1500","created_at":"2023-12-03T09:26:09Z","sender_type":"service_provider","attachments":[],"conversation_id":1,"id":1},{"message_type":"quote_offer","conversation_id":2,"sender_type":"service_provider","created_at":"2023-12-03T09:26:09Z","id":1,"text":"Hey I have a great offer for you! I would fix your broken toilet for only 100000$ 😇","attachments":[]}]
let conversations = [{"service_provider_name":"Colton Ruecker","id":1,"updated_at":"2023-12-03T09:26:48Z","state":"quoted","created_at":"2023-12-03T09:26:48Z","customer_name":"Reyes Herzog"},{"customer_name":"Alycia Homenick","id":2,"created_at":"2023-12-03T09:26:48Z","updated_at":"2023-12-03T09:26:48Z","state":"quoted","service_provider_name":"Ampara West"}]
// Routes
app.get('/conversations', (req, res) => {
  res.json(conversations);
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

// ... other routes ...

// File upload route
app.post('/upload/:conversation_id/:message_id', upload.single('file'), (req, res) => {
  // Handle file upload
  // File is available in req.file
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
