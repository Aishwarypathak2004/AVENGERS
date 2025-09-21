// File: netlify/functions/api.js

const serverless = require('serverless-http');
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Path adjustment for serverless environment
app.use(express.static(path.join(__dirname, '../../public')));

// Set EJS as templating engine with adjusted path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../views'));

// API Key and Google AI Setup
const geminiApiKey = "AIzaSyDc-_VWstyRX2fxlx5RPV9xJQH7rbctdT8";
if (!geminiApiKey) {
    console.error('GEMINI_API_KEY is not set');
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

app.get("/games",(req,res)=>{res.render("games.ejs")});
app.get("/piano",(req,res)=>{res.render("piano.ejs")});
app.get("/musicflower",(req,res)=>{res.render("musicflower.ejs")});
app.get("/bubblepop",(req,res)=>{res.render("bubblepop.ejs")});
app.get("/leafbasket",(req,res)=>{res.render("leafbasket.ejs")});

app.get('/assessment', (req, res) => {
  try {
    res.redirect('/?openAssessment=true');
  } catch (error) {
    console.error('Error accessing assessment:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/chat', (req, res) => {
  try {
    res.redirect('/?openChat=true');
  } catch (error) {
    console.error('Error accessing chat:', error);
    res.status(500).send('Internal Server Error');
  }
});

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
            generationConfig: {
                maxOutputTokens: 200,
            },
        });

        const result = await chat.sendMessage(message);
        const aiMessage = result.response.text();

        return res.json({
            success: true,
            message: aiMessage,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return res.status(500).json({
            success: false,
            error: 'Unable to process chat message',
        });
    }
});

app.post('/api/assessment', async (req, res) => {
  try {
    const { responses, score, category, timestamp } = req.body;
    
    if (!responses || !score || typeof score !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid assessment data'
      });
    }
    
    console.log('Assessment saved:', { score, category, timestamp });
    
    res.json({
      success: true,
      message: 'Assessment saved successfully',
      resources: getResourcesForScore(score)
    });
    
  } catch (error) {
    console.error('Assessment API error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to save assessment'
    });
  }
});

// Helper function
function getResourcesForScore(score) {
  if (score <= 7) {
    return {
      category: 'well',
      suggestions: ['Continue daily self-care practices', 'Maintain regular sleep schedule', 'Keep connecting with supportive people']
    };
  } else if (score <= 15) {
    return {
      category: 'mild',
      suggestions: ['Practice deep breathing exercises', 'Consider guided meditation', 'Reach out to trusted friends or family']
    };
  } else if (score <= 23) {
    return {
      category: 'moderate',
      suggestions: ['Consider speaking with a counselor', 'Practice stress-reduction techniques', 'Maintain regular check-ins with support network']
    };
  } else {
    return {
      category: 'high',
      suggestions: ['Strongly consider professional support', 'Contact mental health resources', 'Reach out to crisis support if needed']
    };
  }
}

// Export the handler for Netlify
module.exports.handler = serverless(app);