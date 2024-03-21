import express from 'express';
import character from './character.js';
import { resetDb } from '../model/index.js';


const router = express.Router();

// Utilize the 'character' router to handle API endpoints that modify characters
router.use('/character', character);

// Test endpoint
router.get('/test', (req, res) => {
  let message = 'Hitting Test API';
  console.log(message)
  res.json({ message });
})

// ResetDB
router.post('/reset-db', async (req, res) => {
  try {
    await resetDb();
    res.status(200).json({ message: "Database reset successfully." });
  } catch (error) {
    console.error(`Error in 'character/reset-db' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
