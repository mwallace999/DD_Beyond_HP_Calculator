import express from 'express';
import { dealDamage, heal, addTempHp } from '../controller/character.js';
import { getOne, saveOne } from '../model/character.js';

const router = express.Router();

const damageTypes = ['Piercing', 'Slashing', 'Bludgeoning', 'Fire', 'Cold', 'Acid', 'Thunder', 'Lightning', 'Poison', 'Radiant', 'Necrotic', 'Psychic', 'Force'];

const validateCharacterId = async (id) => {
  try {
    const character = await getOne(Number(id));    
    return character ? { character } : { error: `No character found with ID ${id}.` };
  } catch (error) {
    console.error('Error validating character ID:', error);
    return { error: 'An error occurred while validating character ID.' };
  }
};

// Get character data by id
router.get('/get-character/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const message = `Hitting Get Character API. Character ID = ${id}`;
    // Valid id and fetch character
    const { character, error } = await validateCharacterId(id);
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
router.post('/deal-damage', async (req, res) => {
  try {
    // Extract values
    const { id, damage, type, isCrit } = req.body;
    // Valid id and fetch character
    const { character, error } = await validateCharacterId(id);
    if (error) return res.status(400).json({ error });
    // Validate data types
    else if (!damageTypes.includes(type)) return res.status(400).json({ error: `'${type}' is not a valid damage type.` });
    // Validate damage value
    else if (!Number.isInteger(damage)) return res.status(400).json({ error: `Damage value must me an integer.` });
    // Call 'dealDamage' function
    const result = dealDamage(character, damage, type, isCrit);
    // Save update to db
    await saveOne(result.character);
    // Respond with message & updated character data - { message, character }
    res.json(result);
  } catch (error) {
    console.error(`Error in 'character/deal-damage' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Heal a character
router.post('/heal', async (req, res) => {
  try {
    // Extract values
    const { id, health } = req.body;
    // Valid id and fetch character
    const { character, error } = await validateCharacterId(id);
    if (error) return res.status(400).json({ error });
    // Validate damage value
    else if (!Number.isInteger(health)) return res.status(400).json({ error: `Health value must me an integer.` });
    // Call 'heal' function
    const result = heal(character, health);
    // Save update to db
    await saveOne(result.character);
    // Respond with message & updated character data - { message, character }
    res.json(result);
  } catch (error) {
    console.error(`Error in 'character/heal' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Give a character temphp
router.post('/add-temp-hp', async (req, res) => {
  try {
    // Extract values
    const { id, temphp } = req.body;
    // Valid id and fetch character
    const { character, error } = await validateCharacterId(id);

    if (error) return res.status(400).json({ error });
    // Validate damage value
    else if (!Number.isInteger(temphp)) return res.status(400).json({ error: `TempHp value must me an integer.` });
    // Call 'addTempHp' function
    const result = addTempHp(character, temphp);
    // Save update to db
    await saveOne(result.character);
    // Respond with message & updated character data - { message, character }
    res.json(result);
  } catch (error) {
    console.error(`Error in 'character/add-temp-hp' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;