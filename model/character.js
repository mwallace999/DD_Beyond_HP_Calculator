import client from '../db.js';

export async function getOne(id) {

    const query = {
        text: `
            SELECT 
                id,
                name,
                level,
                currhp,
                maxhp,
                temphp,
                deathsaves,
                deathfails,
                classes,
                stats,
                immunities,
                resistances,
                vulnerabilities,
                conditions,
                items
            FROM characters
            WHERE id = $1
        `,
        values: [id]
    };

    try {
        const qres = await client.query(query);
        return qres.rows[0];
    } catch (error) {
        console.error('Error getting character:', error);
        throw error;
    }       
}

export async function saveOne(character) {

    const query = {
        text: `
            UPDATE characters
            SET name = $2, 
                level = $3, 
                currhp = $4, 
                maxhp = $5, 
                temphp = $6, 
                deathsaves = $7, 
                deathfails = $8, 
                classes = $9, 
                stats = $10, 
                immunities = $11, 
                resistances = $12, 
                vulnerabilities = $13, 
                conditions = $14, 
                items = $15
            WHERE id = $1
            RETURNING *;
        `,
        values: [
            character.id,
            character.name,
            character.level,
            character.currhp,
            character.maxhp,
            character.temphp,
            character.deathsaves,
            character.deathfails,
            JSON.stringify(character.classes),
            JSON.stringify(character.stats),
            JSON.stringify(character.immunities),
            JSON.stringify(character.resistances),
            JSON.stringify(character.vulnerabilities),
            JSON.stringify(character.conditions),
            JSON.stringify(character.items)
        ]
    };

    try {
        const result = await client.query(query);
        return result.rows[0];
    } catch (error) {
        console.error('Error inserting character:', error);
        throw error;
    }
}
