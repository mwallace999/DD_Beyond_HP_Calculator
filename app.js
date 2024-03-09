const express = require('express');
const app = express();
const port = 3000; // You can choose any available port

app.use(express.json());

const characters = require('./briv.json');

app.get('/test', (req, res) => {
    // Update character HP based on the damage type and amount
    // Respond with the updated character data
    res.json({ message: 'Hitting Test API' });
  })

// API route for dealing damage
app.post('/deal-damage', (req, res) => {
  // Update character HP based on the damage type and amount
  // Respond with the updated character data
  res.json({ message: 'Damage dealt successfully' });
});

// API route for healing
app.post('/heal', (req, res) => {
  // Update character HP based on the amount of healing
  // Respond with the updated character data
  res.json({ message: 'Healing applied successfully' });
});

// API route for adding temporary Hit Points
app.post('/add-temporary-hp', (req, res) => {
  // Update character data with temporary Hit Points
  // Respond with the updated character data
  res.json({ message: 'Temporary Hit Points added successfully' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});