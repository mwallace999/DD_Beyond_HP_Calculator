import express from 'express';
import character from './character.js'

const router = express.Router();

// Utilize the 'character' router to handle API endpoints that modify characters
router.use('/character', character);

// Test endpoint
router.get('/test', (req, res) => {
  let message = 'Hitting Test API';
  console.log(message)
  res.json({ message });
})

export default router;
