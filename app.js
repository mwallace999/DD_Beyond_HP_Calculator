const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const characters = require('./lib/briv-new.json');

const getCharacter = (id) => characters.find(char => char.id === id);

const removeCondition = (char, condition) => char.conditions = char.conditions.filter(cond => cond !== condition);

const addCondition = (char, condition) => !char.conditions.includes(condition) && char.conditions.push(condition);


// Dummy endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Hitting Test API'});
})

// Get character data by id
app.get('/character/:id', (req, res) => {
  const { id } = req.params;
  const activeChar = getCharacter(Number(id));
  // Respond with character data
  res.json({ message: 'Hitting Get Character API', character: activeChar});
})

// API route for dealing damage
app.post('/deal-damage', (req, res) => {
  const { id, damage, type, isCrit } = req.body;
  const activeChar = getCharacter(id);
  console.log(activeChar.currHP)

  activeChar.currHP -= damage;
  addCondition(activeChar, "Poisoned")
  console.log(activeChar)
  // Update character HP based on the damage type and amount
  // Respond with the updated character data
  res.json({ message: 'Damage dealt successfully' });
});

// Heal a character
app.post('/heal', (req, res) => {
  const { id, health } = req.body;
  const activeChar = getCharacter(id);
  let message = '';

  if (activeChar.currHP === activeChar.maxHP) {
    console.log(`${activeChar.name} is already at MAX health (${activeChar.currHP} HP)`)
    message = 'Character is at max health';
  }
  else {
    activeChar.currHP = Math.min(activeChar.currHP + health, activeChar.maxHP);
    console.log(`${activeChar.name} was healed to ${activeChar.currHP} HP`)
    message = 'Healing applied successfully';
  }
  // Respond with the updated character data
  res.json({ message, character: activeChar });
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