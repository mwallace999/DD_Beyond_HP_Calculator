import { characters } from '../lib/characterReader.js';

export const getCharacter = (id) => characters.find(char => char.id === id);

export const removeCondition = (char, condition) => char.conditions = char.conditions.filter(cond => cond !== condition);

export const addCondition = (char, condition) => !char.conditions.includes(condition) && char.conditions.push(condition);

// *** ADD TEMP HP ***
export const addTempHp = (id, tempHp) => {
  const activeChar = getCharacter(id);

  // Check for valid character
  if (!activeChar) return { message: `No character found with ID ${id}.`, character: null };
  let message = `${activeChar.name} gains ${tempHp} tempHp. `;

  // Check if character is Dead
  if (activeChar.conditions.includes('Dead')) {
    message += `${activeChar.name} is Dead and cannot receive tempHp. `;
  } 
  // Check if current tempHp is greater than new tempHp
  else if (activeChar.tempHp > tempHp) message += `${activeChar.name} already has a greater number of TempHp (${activeChar.tempHp}). `;
  // Update tempHp
  else {
    activeChar.tempHp = Math.max(tempHp, activeChar.tempHp);
    message += `${activeChar.name} now has ${activeChar.tempHp} TempHp.`;
  }
  // Log actions & send response
  console.log(message);
  return { message, character: activeChar }
}
  
// *** HEAL ***
export const heal = (id, health) => {
  const activeChar = getCharacter(id);

  // Check for valid character
  if (!activeChar) return { message: `No character found with ID ${id}.`, character: null };
  let message = `${activeChar.name} gets healed for ${health} HP. `;

  // Check if character is at max health
  if (activeChar.currHp === activeChar.maxHp) {
    message += `${activeChar.name} is already at MAX health (${activeChar.currHp} HP). `;
  }
  // Check if character is Dead
  else if (activeChar.conditions.includes('Dead')) {
    message += `${activeChar.name} is Dead and cannot be healed. `;
  } 
  // Heal character
  else {
    // Check if character was unconscious
    if (activeChar.currHp === 0)  {
      // Remove unconscious condition and reset death saves
      removeCondition(activeChar, "Unconscious");
      activeChar.deathFails = 0;
      activeChar.deathSaves = 0;
      message += `${activeChar.name} regains consciousness. `;
    }
    // Update currHp
    activeChar.currHp = Math.min(activeChar.currHp + health, activeChar.maxHp);
    message += `${activeChar.name} was healed to ${activeChar.currHp} HP. `;
    // Check if character has been healed to max health.
    if (activeChar.currHp === activeChar.maxHp)  message += `${activeChar.name} is now at MAX health. `
  }
  // Log actions & send response
  console.log(message);
  return { message, character: activeChar }
}

// *** DEAL DAMAGE ***
export const dealDamage = (id, damage, type, isCrit) => {
  const activeChar = getCharacter(id);

  // Check for valid character
  if (!activeChar) return { message: `No character found with ID ${id}.`, character: null };
  let message = `${activeChar.name} is attacked with ${damage} point(s) of ${type} damage. `;
  let modDamage = damage;

  // Calculate modified damage
  if (activeChar.resistances.includes(type)) {
    modDamage = Math.floor(modDamage / 2);
    message += `${activeChar.name} is resistant to ${type} damage. Incoming damage is halved to ${modDamage}. `;
  }
  if (activeChar.vulnerabilites.includes(type)) {
    modDamage = modDamage * 2;
    message += `${activeChar.name} is vulnerable to ${type} damage. Incoming damage is doubled to ${modDamage}. `;
  }
  if (activeChar.immunities.includes(type)) {
    modDamage = 0;
    message += `${activeChar.name} is immune to ${type} damage. No damage is taken. `;
  }

  // Handle tempHp if applicable
  if (modDamage && activeChar.tempHp) {
    // Determine new tempHp value
    const newTempHp = Math.max(activeChar.tempHp - modDamage, 0);
    message += `${activeChar.tempHp - newTempHp} point(s) of damage were absorbed by tempHp. ${newTempHp} tempHp remaining. `;
    // Determine remaining damage value
    modDamage = Math.max(modDamage - activeChar.tempHp, 0);
    // Update tempHp
    activeChar.tempHp = newTempHp;
  }
  
  // handle remaining damage
  if (modDamage) {
    message += `${activeChar.name} takes ${modDamage} point(s) of ${type} damage. `
    const newHp = activeChar.currHp - modDamage;

    // Handle damage to a Dead character
    if (activeChar.conditions.includes('Dead')) {
      message += `${activeChar.name} is already Dead.`
    }
    // Handle massive damage/instant death
    else if (Math.abs(newHp) > activeChar.maxHp) {
      message += `${activeChar.name} suffers massive damage and dies instantly. RIP. `
      activeChar.currHp = 0;
      activeChar.deathFails = 0;
      activeChar.deathSaves = 0;
      removeCondition(activeChar, 'Unconscious');
      addCondition(activeChar, 'Dead');
    }
    // Handle damage to an Unconcious character
    else if (activeChar.currHp === 0) {
      // Critical Hit
      if (isCrit) {
        activeChar.deathFails += 2;
        message += `${activeChar.name} suffers a Critical Hit while unconcious and fails 2 Death Saves. `   
      } 
      // Normal Hit
      else {
        activeChar.deathFails++;
        message += `${activeChar.name} suffers a Hit while unconcious and fails 1 Death Save. `
      }
      message += `${activeChar.name} now has ${Math.min(activeChar.deathFails, 3)} failed Death Saves. `
      // Check if Dead
      if (activeChar.deathFails >= 3) {
        message += `${activeChar.name} has died. RIP. `
        activeChar.deathFails = 0;
        activeChar.deathSaves = 0;
        removeCondition(activeChar, 'Unconscious');
        addCondition(activeChar, 'Dead');
      }
      
    }
    // Handle reducing character to 0 HP
    else if (newHp <= 0) {
      message += `${activeChar.name} is reduced to 0 HP and falls unconcious. `
      activeChar.currHp = 0;
      addCondition(activeChar, 'Unconscious');
    } 
    // Handle normal damage
    else {
      message += `${activeChar.name} is reduced to ${newHp} HP. `
      activeChar.currHp = newHp;
    }
  }
  // Log actions & send response
  console.log(message);
  return { message, character: activeChar }
}