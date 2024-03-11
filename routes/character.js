import express from 'express';
import { getCharacter, dealDamage, heal, addTempHp } from '../controller/character.js';

const router = express.Router();

// Get character data by id
router.get('/get-character/:id', (req, res) => {
    const { id } = req.params;
    const activeChar = getCharacter(Number(id));
    let message = `Hitting Get Character API. Character ID = ${id}`;
    // Log && Respond with character data
    console.log(message)
    res.json({ message, character: activeChar});
  })
  
  // Deal damage
  router.post('/deal-damage', (req, res) => {
    // Extract values
    const { id, damage, type, isCrit } = req.body;
    // Call 'dealDamage' function
    const result = dealDamage(id, damage, type, isCrit);
    // Respond with message & updated character data - { message, character }
    res.json(result);
  });
  
  // Heal a character
  router.post('/heal', (req, res) => {
    // Extract values
    const { id, health } = req.body;
    // Call 'heal' fuction
    const result = heal(id, health);
    // Respond with message & updated character data  - { message, character }
    res.json(result);
  });
  
  // Give a character tempHp
  router.post('/add-temp-hp', (req, res) => {
    // Extract values
    const { id, tempHp } = req.body;
    // Call 'addTempHp' function
    const result = addTempHp(id, tempHp);
    // Respond with message & updated character data  - { message, character }
    res.json(result);
  });
  
  export default router;