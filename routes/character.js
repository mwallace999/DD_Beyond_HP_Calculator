import express from 'express';
import { getCharacter, dealDamage, heal, addTempHp } from '../controller/character.js';
const router = express.Router();

const damageTypes = ['Piercing', 'Slashing', 'Fire', 'Cold', 'Acid', 'Thunder', 'Lightning', 'Poison', 'Radiant', 'Necrotic', 'Psychic', 'Force'];

// Get character data by id
router.get('/get-character/:id', (req, res) => {
  try {
    const { id } = req.params;
    const message = `Hitting Get Character API. Character ID = ${id}`;
    // Call 'getCharcter' function
    const activeChar = getCharacter(Number(id));
    // Validate character
    if (!activeChar) return res.status(400).json({ error: `No character found with ID ${id}.` });
    // Log & Respond with character data
    console.log(message);
    res.json({ message, character: activeChar });
  } catch (error) {
    console.error(`Error in 'character/get-character' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Deal damage
router.post('/deal-damage', (req, res) => {
  try {
    // Extract values
    const { id, damage, type, isCrit } = req.body;
    // Validate data types
    if (!damageTypes.includes(type)) return res.status(400).json({ error: `'${type}' is not a valid damage type.` });
    // Validate damage value
    else if (!Number.isInteger(damage)) return res.status(400).json({ error: `Damage value must me an integer.` });
    // Call 'dealDamage' function
    const result = dealDamage(id, damage, type, isCrit);
    // Validate character
    if (result.character === null) return res.status(400).json({ error: `No character found with ID ${id}.` });
    // Respond with message & updated character data - { message, character }
    res.json(result);
  } catch (error) {
    console.error(`Error in 'character/deal-damage' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Heal a character
router.post('/heal', (req, res) => {
  try {
    // Extract values
    const { id, health } = req.body;
    // Validate damage value
    if (!Number.isInteger(health)) return res.status(400).json({ error: `Health value must me an integer.` });
    // Call 'heal' function
    const result = heal(id, health);
    // Validate character
    if (result.character === null) return res.status(400).json({ error: `No character found with ID ${id}.` });
    // Respond with message & updated character data - { message, character }
    res.json(result);
  } catch (error) {
    console.error(`Error in 'character/heal' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Give a character tempHp
router.post('/add-temp-hp', (req, res) => {
  try {
    // Extract values
    const { id, tempHp } = req.body;
    // Validate damage value
    if (!Number.isInteger(tempHp)) return res.status(400).json({ error: `TempHp value must me an integer.` });
    // Call 'addTempHp' function
    const result = addTempHp(id, tempHp);
    // Validate character
    if (result.character === null) return res.status(400).json({ error: `No character found with ID ${id}.` });
    // Respond with message & updated character data - { message, character }
    res.json(result);
  } catch (error) {
    console.error(`Error in 'character/add-temp-hp' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;