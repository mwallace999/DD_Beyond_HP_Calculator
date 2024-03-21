import { getOne, saveOne } from '../model/character.js';

export const removeCondition = (char, condition) => char.conditions = char.conditions.filter(cond => cond !== condition);

export const addCondition = (char, condition) => !char.conditions.includes(condition) && char.conditions.push(condition);

// *** GET CHARACTER ***
export const getCharacter = async (id) => {
  try {
    const character = await getOne(id);
    return character;
  } catch (error) {
    console.error(`Error retrieving character with ID ${id}:`, error);
    throw new Error(`Failed to retrieve character with ID ${id}.`);
  }
};

// *** ADD TEMP HP ***
export const addTempHp = async (character, temphp) => {
  let message = `${character.name} gains ${temphp} temphp. `;

  // Check if character is Dead
  if (character.conditions.includes('Dead')) {
    message += `${character.name} is Dead and cannot receive temphp. `;
  } 
  // Check if current temphp is greater than new temphp
  else if (character.temphp > temphp) message += `${character.name} already has a greater number of TempHp (${character.temphp}). `;
  // Update temphp
  else {
    character.temphp = temphp;
    message += `${character.name} now has ${character.temphp} TempHp.`;
  }

  // Save updated character to db
  try {
    character = await saveOne(character);
  } catch (error) {
    console.error('Error updating character:', error);
    throw new Error('Failed to update character.');
  }

  // Log actions & send response
  console.log(message);
  console.log(character);
  return { message, character }
}
  
// *** HEAL ***
export const heal = async (character, health) => {
  let message = `${character.name} gets healed for ${health} HP. `;

  // Check if character is at max health
  if (character.currhp === character.maxhp) {
    message += `${character.name} is already at MAX health (${character.currhp} HP). `;
  }
  // Check if character is Dead
  else if (character.conditions.includes('Dead')) {
    message += `${character.name} is Dead and cannot be healed. `;
  } 
  // Heal character
  else {
    // Check if character was unconscious
    if (character.currhp === 0)  {
      // Remove unconscious condition and reset death saves
      removeCondition(character, 'Unconscious');
      character.deathfails = 0;
      character.deathsaves = 0;
      message += `${character.name} regains consciousness. `;
    }
    // Update currhp
    character.currhp = Math.min(character.currhp + health, character.maxhp);
    message += `${character.name} was healed to ${character.currhp} HP. `;
    // Check if character has been healed to max health.
    if (character.currhp === character.maxhp)  message += `${character.name} is now at MAX health. `;
  }
  // Save updated character to db
  try {
    character = await saveOne(character);
  } catch (error) {
    console.error('Error updating character:', error);
    throw new Error('Failed to update character.');
  }
  // Log actions & send response
  console.log(message);
  console.log(character);
  return { message, character }
}

// *** DEAL DAMAGE ***
export const dealDamage = async (character, damage, type, isCrit) => {

  let message = `${character.name} is attacked with ${damage} point(s) of ${type} damage. `;

  // Calculate modified damage
  // Check resistences
  if (character.resistances.includes(type)) {
    damage = Math.floor(damage / 2);
    message += `${character.name} is resistant to ${type} damage. Incoming damage is halved to ${damage}. `;
  }
  // Check vulnerabilities
  if (character.vulnerabilities.includes(type)) {
    damage *= 2;
    message += `${character.name} is vulnerable to ${type} damage. Incoming damage is doubled to ${damage}. `;
  }
  // Check immunities
  if (character.immunities.includes(type)) {
    damage = 0;
    message += `${character.name} is immune to ${type} damage. No damage is taken. `;
  }

  // Handle temphp if applicable
  if (damage && character.temphp) {
    // Determine new temphp value
    const newTempHp = Math.max(character.temphp - damage, 0);
    message += `${character.temphp - newTempHp} point(s) of damage are absorbed by temphp. ${newTempHp} temphp remaining. `;
    // Determine remaining damage value
    damage = Math.max(damage - character.temphp, 0);
    // Update temphp
    character.temphp = newTempHp;
  }
  
  // Handle remaining damage
  if (damage) {
    message += `${character.name} takes ${damage} point(s) of ${type} damage. `;
    const newHp = character.currhp - damage;

    // Handle damage to a Dead character
    if (character.conditions.includes('Dead')) {
      message += `${character.name} is already Dead.`
    }
    // Handle massive damage/instant death
    else if (Math.abs(newHp) > character.maxhp) {
      message += `${character.name} suffers massive damage and dies instantly. RIP. `;
      character.currhp = 0;
      character.deathfails = 0;
      character.deathsaves = 0;
      removeCondition(character, 'Unconscious');
      addCondition(character, 'Dead');
    }
    // Handle damage to an Unconscious character
    else if (character.currhp === 0) {
      // Check if critical and increase Death Saves
      character.deathfails += isCrit ? 2 : 1;
      message += `${character.name} suffers a ${isCrit ? 'Critical ' : ''}Hit while Unconscious and fails ${isCrit ? 2 : 1} Death Save(s). `;
      message += `${character.name} now has ${Math.min(character.deathfails, 3)} failed Death Save(s). `;
      // Check if Dead
      if (character.deathfails >= 3) {
        message += `${character.name} has died. RIP. `
        character.deathfails = 0;
        character.deathsaves = 0;
        removeCondition(character, 'Unconscious');
        addCondition(character, 'Dead');
      }
    }
    // Handle reducing character to 0 HP
    else if (newHp <= 0) {
      message += `${character.name} is reduced to 0 HP and falls Unconscious. `;
      character.currhp = 0;
      addCondition(character, 'Unconscious');
    } 
    // Handle normal damage
    else {
      message += `${character.name} is reduced to ${newHp} HP. `;
      character.currhp = newHp;
    }
  }
  // Save updated character to db
  try {
    character = await saveOne(character);
  } catch (error) {
    console.error('Error updating character:', error);
    throw new Error('Failed to update character.');
  }
  // Log actions & send response
  console.log(message);
  console.log(character);
  return { message, character }
}