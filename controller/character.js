import { characters } from '../lib/characterReader.js';

export const getCharacter = (id) => characters.find(char => char.id === id);

export const removeCondition = (char, condition) => char.conditions = char.conditions.filter(cond => cond !== condition);

export const addCondition = (char, condition) => !char.conditions.includes(condition) && char.conditions.push(condition);

export const addTempHp = (id, tempHp) => {
  const activeChar = getCharacter(id);
  let message = `${activeChar.name} gains tempHp. `;

  // Check if current tempHp is greater than new tempHp
  if (activeChar.tempHp > tempHp) message += `${activeChar.name} already has a greater number of TempHp (${activeChar.tempHp}).`;
  else {
    // Update tempHp
    activeChar.tempHp = Math.max(tempHp, activeChar.tempHp);
    message += `${activeChar.name} now has ${activeChar.tempHp} TempHp.`;
  }
  // Log actions
  console.log(message);
  return { message, character: activeChar }
}
  
export const heal = (id, health) => {
  const activeChar = getCharacter(id);
  let message = `${activeChar.name} gets healed for ${health} HP. `;

  // Check if character is at max health
  if (activeChar.currHp === activeChar.maxHp) {
    message += `${activeChar.name} is already at MAX health (${activeChar.currHp} HP). `;
  }
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
  // Log actions
  console.log(message);
  return { message, character: activeChar }
}

export const dealDamage = (id, damage, type, isCrit) => {
  const activeChar = getCharacter(id);
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
    newTempHp = Math.max(activeChar.tempHp - modDamage, 0);
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
    // Check for instant death i.e. remaining damage after reaching 0 > maxHp
    if (Math.abs(newHp) > activeChar.maxHp) {
      message += `${activeChar.name} suffers massive damage and dies instantly. RIP. `
      activeChar.currHp = 0;
      removeCondition(activeChar, "Unconscious");
      addCondition(activeChar, "Dead");
    } else if (newHp <= 0) {
      message += `${activeChar.name} is reduced to 0 HP and falls unconcious. `
      activeChar.currHp = 0;
      addCondition(activeChar, "Unconscious");
    } else {
      message += `${activeChar.name} is reduced to ${newHp} HP. `
      activeChar.currHp = newHp;
    }
  }
  // Log actions
  console.log(message);
  return { message, character: activeChar }
}