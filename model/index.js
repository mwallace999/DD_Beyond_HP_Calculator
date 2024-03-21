import client from '../db.js';

export async function resetDb() {

    const query = {
        text: `
            -- Drop the characters table if it exists
            DROP TABLE IF EXISTS characters;
            
            -- Create the characters table
            CREATE TABLE characters (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                level INT NOT NULL,
                currhp INT NOT NULL,
                maxhp INT NOT NULL,
                temphp INT NOT NULL,
                deathsaves INT NOT NULL,
                deathfails INT NOT NULL,
                classes JSONB NOT NULL,
                stats JSONB NOT NULL,
                immunities JSONB NOT NULL,
                resistances JSONB NOT NULL,
                vulnerabilities JSONB NOT NULL,
                conditions JSONB NOT NULL,
                items JSONB NOT NULL
            );
            
            -- Insert the provided data into the characters table
            INSERT INTO characters (name, level, currhp, maxhp, temphp, deathsaves, deathfails, classes, stats, immunities, resistances, vulnerabilities, conditions, items)
            VALUES 
                ('Briv', 5, 25, 30, 0, 0, 0, '[{"class": "Fighter", "hitDiceValue": 10, "classLevel": 5}]', '{"strength": 15, "dexterity": 12, "constitution": 14, "intelligence": 13, "wisdom": 10, "charisma": 8}', '["Cold"]', '["Fire"]', '["Acid"]', '[]', '[{"name": "Ioun Stone of Fortitude", "modifier": {"affectedObject": "stats", "affectedValue": "constitution", "value": 2}}]'),
                ('Lux', 5, 34, 34, 10, 0, 0, '[{"class": "Rogue", "hitDiceValue": 8, "classLevel": 1}, {"class": "Wizard", "hitDiceValue": 6, "classLevel": 4}]', '{"strength": 8, "dexterity": 16, "constitution": 14, "intelligence": 18, "wisdom": 10, "charisma": 8}', '["Cold"]', '["Fire"]', '[]', '[]', '[{"name": "Bag of Holding", "modifier": {}}]');
        `
    };

    try {
        const qres = await client.query(query);
    } catch (error) {
        console.error('Error getting character:', error);
        throw error;
    }       
}