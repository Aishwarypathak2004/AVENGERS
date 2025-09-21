
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Add your NEW key in the Vercel project settings
const geminiApiKey = "AIzaSyDc-_VWstyRX2fxlx5RPV9xJQH7rbctdT8"; 
if (!geminiApiKey) {
    console.error('GEMINI_API_KEY environment variable is not set');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);
const chatModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// Main routes
app.get('/', (req, res) => {
  try {
    res.render('index', { 
      title: 'ALL IS WELL - Mental Wellness App',
      pageClass: 'homepage'
    });
  } catch (error) {
    console.error('Error rendering homepage:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/games", (req, res) => { res.render("games.ejs") });
app.get("/piano", (req, res) => { res.render("piano.ejs") });
app.get("/musicflower", (req, res) => { res.render("musicflower.ejs") });
app.get("/bubblepop", (req, res) => { res.render("bubblepop.ejs") });
app.get("/leafbasket", (req, res) => { res.render("leafbasket.ejs") });

app.get('/assessment', (req, res) => { res.redirect('/?openAssessment=true') });
app.get('/chat', (req, res) => { res.redirect('/?openChat=true') });

// --- API ENDPOINTS ---
app.post('/api/chat', async (req, res) => {
   try {
        const { message, history = [] } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }
        const chat = chatModel.startChat({
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }],
            })),
        });
        const result = await chat.sendMessage(message);
        const aiMessage = result.response.text();
        return res.json({ success: true, message: aiMessage });
    } catch (error) {
        console.error('Chat API error:', error);
        return res.status(500).json({ success: false, error: 'Unable to process chat message' });
    }
});

app.post('/api/assessment', async (req, res) => {
    // This route seems fine, no changes needed
    console.log('Assessment saved:', req.body);
    res.json({ success: true, message: 'Assessment received' });
});

// --- THIS IS THE CORRECT EXPORT FOR VERCEL ---
module.exports = app;