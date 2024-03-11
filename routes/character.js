import express from 'express';
import { getCharacter, dealDamage, heal, addTempHp } from '../controller/character.js';
const router = express.Router();

const damageTypes = ['Piercing', 'Slashing', 'Bludgeoning', 'Fire', 'Cold', 'Acid', 'Thunder', 'Lightning', 'Poison', 'Radiant', 'Necrotic', 'Psychic', 'Force'];

const validateCharacterId = (id) => {
  const character = getCharacter(Number(id));
  return character ? { character } : { error: `No character found with ID ${id}.` };
};

// Get character data by id
router.get('/get-character/:id', (req, res) => {
  try {
    const { id } = req.params;
    const message = `Hitting Get Character API. Character ID = ${id}`;
    // Valid id and fetch character
    const { character, error } = validateCharacterId(id);
    if (error) return res.status(400).json({ error });
    // Log & Respond with character data
    console.log(message);
    res.json({ message, character });
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
    // Valid id and fetch character
    const { character, error } = validateCharacterId(id);
    if (error) return res.status(400).json({ error });
    // Validate data types
    else if (!damageTypes.includes(type)) return res.status(400).json({ error: `'${type}' is not a valid damage type.` });
    // Validate damage value
    else if (!Number.isInteger(damage)) return res.status(400).json({ error: `Damage value must me an integer.` });
    // Call 'dealDamage' function
    const result = dealDamage(character, damage, type, isCrit);
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
    // Valid id and fetch character
    const { character, error } = validateCharacterId(id);
    if (error) return res.status(400).json({ error });
    // Validate damage value
    else if (!Number.isInteger(health)) return res.status(400).json({ error: `Health value must me an integer.` });
    // Call 'heal' function
    const result = heal(character, health);
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
    // Valid id and fetch character
    const { character, error } = validateCharacterId(id);
    if (error) return res.status(400).json({ error });
    // Validate damage value
    else if (!Number.isInteger(tempHp)) return res.status(400).json({ error: `TempHp value must me an integer.` });
    // Call 'addTempHp' function
    const result = addTempHp(character, tempHp);
    // Respond with message & updated character data - { message, character }
    res.json(result);
  } catch (error) {
    console.error(`Error in 'character/add-temp-hp' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;