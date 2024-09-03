const express = require('express');
const path = require('path');
const app = express();

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Optional: Redirect from /index.html to /index
app.get('/index.html', (req, res) => {
  res.redirect('/index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});