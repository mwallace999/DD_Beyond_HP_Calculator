import express from 'express';
import { getCharacter, dealDamage, heal, addTempHp } from '../controller/character.js';

const router = express.Router();

// Get character data by id
router.get('/get-character/:id', (req, res) => {
  try {
    const { id } = req.params;
    const message = `Hitting Get Character API. Character ID = ${id}`;
    // Call 'getCharcter' function
    const activeChar = getCharacter(Number(id));
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
    // Call 'dealDamage' function
    const result = dealDamage(id, damage, type, isCrit);
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
    // Call 'heal' function
    const result = heal(id, health);
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
    // Call 'addTempHp' function
    const result = addTempHp(id, tempHp);
    // Respond with message & updated character data - { message, character }
    res.json(result);
  } catch (error) {
    console.error(`Error in 'character/add-temp-hp' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;