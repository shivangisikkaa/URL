const express = require('express');
const shortid = require('shortid');

const app = express();
const port = 3000;

// Store URLs in memory
const urls = {};

// Middleware
app.use(express.json());

// Create short URL
app.post('/shorten', (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const shortUrl = shortid.generate();
        urls[shortUrl] = url;
        
        return res.json({ 
            originalUrl: url,
            shortUrl: `http://localhost:${port}/${shortUrl}`
        });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// Redirect to original URL
app.get('/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;
    const originalUrl = urls[shortUrl];
    
    if (!originalUrl) {
        return res.status(404).json({ error: 'URL not found' });
    }
    
    res.redirect(originalUrl);
});

// List all URLs (optional)
app.get('/urls', (req, res) => {
    res.json(urls);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 