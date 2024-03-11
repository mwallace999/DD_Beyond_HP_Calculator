import { characters } from '../lib/characterReader.js';

export const getCharacter = (id) => characters.find(char => char.id === id);

export const removeCondition = (char, condition) => char.conditions = char.conditions.filter(cond => cond !== condition);

export const addCondition = (char, condition) => !char.conditions.includes(condition) && char.conditions.push(condition);

// *** ADD TEMP HP ***
export const addTempHp = (character, tempHp) => {
  let message = `${character.name} gains ${tempHp} tempHp. `;

  // Check if character is Dead
  if (character.conditions.includes('Dead')) {
    message += `${character.name} is Dead and cannot receive tempHp. `;
  } 
  // Check if current tempHp is greater than new tempHp
  else if (character.tempHp > tempHp) message += `${character.name} already has a greater number of TempHp (${character.tempHp}). `;
  // Update tempHp
  else {
    character.tempHp = tempHp;
    message += `${character.name} now has ${character.tempHp} TempHp.`;
  }
  // Log actions & send response
  console.log(message);
  return { message, character }
}
  
// *** HEAL ***
export const heal = (character, health) => {
  let message = `${character.name} gets healed for ${health} HP. `;

  // Check if character is at max health
  if (character.currHp === character.maxHp) {
    message += `${character.name} is already at MAX health (${character.currHp} HP). `;
  }
  // Check if character is Dead
  else if (character.conditions.includes('Dead')) {
    message += `${character.name} is Dead and cannot be healed. `;
  } 
  // Heal character
  else {
    // Check if character was unconscious
    if (character.currHp === 0)  {
      // Remove unconscious condition and reset death saves
      removeCondition(character, 'Unconscious');
      character.deathFails = 0;
      character.deathSaves = 0;
      message += `${character.name} regains consciousness. `;
    }
    // Update currHp
    character.currHp = Math.min(character.currHp + health, character.maxHp);
    message += `${character.name} was healed to ${character.currHp} HP. `;
    // Check if character has been healed to max health.
    if (character.currHp === character.maxHp)  message += `${character.name} is now at MAX health. `
  }
  // Log actions & send response
  console.log(message);
  return { message, character }
}

// *** DEAL DAMAGE ***
export const dealDamage = (character, damage, type, isCrit) => {
  let message = `${character.name} is attacked with ${damage} point(s) of ${type} damage. `;
  let modDamage = damage;

  // Calculate modified damage
  // Check resistences
  if (character.resistances.includes(type)) {
    modDamage = Math.floor(modDamage / 2);
    message += `${character.name} is resistant to ${type} damage. Incoming damage is halved to ${modDamage}. `;
  }
  // Check vulnerabilities
  if (character.vulnerabilites.includes(type)) {
    modDamage *= 2;
    message += `${character.name} is vulnerable to ${type} damage. Incoming damage is doubled to ${modDamage}. `;
  }
  // Check immunities
  if (character.immunities.includes(type)) {
    modDamage = 0;
    message += `${character.name} is immune to ${type} damage. No damage is taken. `;
  }

  // Handle tempHp if applicable
  if (modDamage && character.tempHp) {
    // Determine new tempHp value
    const newTempHp = Math.max(character.tempHp - modDamage, 0);
    message += `${character.tempHp - newTempHp} point(s) of damage are absorbed by tempHp. ${newTempHp} tempHp remaining. `;
    // Determine remaining damage value
    modDamage = Math.max(modDamage - character.tempHp, 0);
    // Update tempHp
    character.tempHp = newTempHp;
  }
  
  // handle remaining damage
  if (modDamage) {
    message += `${character.name} takes ${modDamage} point(s) of ${type} damage. `
    const newHp = character.currHp - modDamage;

    // Handle damage to a Dead character
    if (character.conditions.includes('Dead')) {
      message += `${character.name} is already Dead.`
    }
    // Handle massive damage/instant death
    else if (Math.abs(newHp) > character.maxHp) {
      message += `${character.name} suffers massive damage and dies instantly. RIP. `
      character.currHp = 0;
      character.deathFails = 0;
      character.deathSaves = 0;
      removeCondition(character, 'Unconscious');
      addCondition(character, 'Dead');
    }
    // Handle damage to an Unconcious character
    else if (character.currHp === 0) {
      // Critical Hit
      if (isCrit) {
        character.deathFails += 2;
        message += `${character.name} suffers a Critical Hit while unconcious and fails 2 Death Saves. `   
      } 
      // Normal Hit
      else {
        character.deathFails++;
        message += `${character.name} suffers a Hit while unconcious and fails 1 Death Save. `
      }
      message += `${character.name} now has ${Math.min(character.deathFails, 3)} failed Death Saves. `
      // Check if Dead
      if (character.deathFails >= 3) {
        message += `${character.name} has died. RIP. `
        character.deathFails = 0;
        character.deathSaves = 0;
        removeCondition(character, 'Unconscious');
        addCondition(character, 'Dead');
      }
      
    }
    // Handle reducing character to 0 HP
    else if (newHp <= 0) {
      message += `${character.name} is reduced to 0 HP and falls unconcious. `
      character.currHp = 0;
      addCondition(character, 'Unconscious');
    } 
    // Handle normal damage
    else {
      message += `${character.name} is reduced to ${newHp} HP. `
      character.currHp = newHp;
    }
  }
  // Log actions & send response
  console.log(message);
  return { message, character }
}