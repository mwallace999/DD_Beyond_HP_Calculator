### INSTRUCTIONS

`npm install` Installs node module dependencies  
`npm start` Runs the app in a production environment on localhost:3000  
`npm test` Runs jest test suite defined in 'tests/api.test.js' on localhost:3001  

Swagger api info page available at `http://localhost:3000/api-docs`

NOTE: `npm run dev` Runs the app in a development environment using nodemon to monitor file changes

### NOTES

Changes to briv.json:
- Changed structure to array of character jsons instead of a single character
- Added 'id' field as primary key in place of 'name'.
  NOTE: Briv is id = 1
- Added fields: 'tempHp', 'conditions', 'deathSaves', 'deathFails'
- Changed field 'hitPoints' --> 'currHp' / 'maxHp'
- Changed 'defenses' object to separate 'resistances', 'immunities', 'vulnerabilities' fields

### ENDPOINTS

POST http://localhost:3000/character/deal-damage  
PURPOSE: Handles dealing damage to a character  
PAYLOAD: {  
    id: INT (unique character id),  
    damage: INT (value of damage being dealt),  
    type: STRING (type of damage dealt),  
    isCrit: BOOL (is strike a critical hit)  
}  
RESPONSE: {  
    message: STRING (record of resulting effects from damage),  
    character: JSON (character state after damage is resolved)  
}  
__________________________________________________________

POST http://localhost:3000/character/heal  
PURPOSE: Handles healing a character  
PAYLOAD: {  
    id: INT (unique character id),  
    health: INT (value of health being healed),  
}  
RESPONSE: {  
    message: STRING (record of resulting effects from healing),  
    character: JSON (character state after healing is resolved)  
}  
__________________________________________________________

POST http://localhost:3000/character/add-temp-hp  
PURPOSE: Handles granting tempHp to a character  
PAYLOAD: {  
    id: INT (unique character id),  
    tempHp: INT (value of tempHp being granted),  
}  
RESPONSE: {  
    message: STRING (record of resulting effects from granting tempHp),  
    character: JSON (character state after tempHp is resolved)  
}  
__________________________________________________________

GET http://localhost:3000/character/get-character/:id  
PURPOSE: Fetches a character by 'id'  
PARAMS: {  
   id:  INT (unique character id included in the URL path)  
}  
RESPONSE: {  
    message: STRING (confirmation message),  
    character: JSON (requested character info)  
}  
__________________________________________________________

### ORIGINAL INSTRUCTIONS
# DDB Back End Developer Challenge

### Overview
This task focuses on creating an API for managing a player character's Hit Points (HP) within our game. The API will enable clients to perform various operations related to HP, including dealing damage of different types, considering character resistances and immunities, healing, and adding temporary Hit Points. The task requires building a service that interacts with HP data provided in the `briv.json` file and persists throughout the application's lifetime.

### Task Requirements

#### API Operations
1. **Deal Damage**
    - Implement the ability for clients to deal damage of different types (e.g., bludgeoning, fire) to a player character.
    - Ensure that the API calculates damage while considering character resistances and immunities.

    > Suppose a player character is hit by an attack that deals Piercing damage, and the attacker rolls a 14 on the damage's Hit Die (with a Piercing damage type). `[Character Hit Points - damage: 25 - 14 = 11]`

2. **Heal**
    - Enable clients to heal a player character, increasing their HP.

3. **Add Temporary Hit Points**
    - Implement the functionality to add temporary Hit Points to a player character.
    - Ensure that temporary Hit Points follow the rules: they are not additive, always taking the higher value, and cannot be healed.

    > Imagine a player character named "Eldric" currently has 11 Hit Points (HP) and no temporary Hit Points. He finds a magical item that grants him an additional 10 HP during the next fight. When the attacker rolls a 19, Eldric will lose all 10 temporary Hit Points and 9 from his player HP.

#### Implementation Details
- Build the API using your preferred technology stack.
- Ensure that character information, including HP, is initialized during the start of the application. Developers do not need to calculate HP; it is provided in the `briv.json` file.
- Retrieve character information, including HP, from the `briv.json` file.


#### Data Storage
- You have the flexibility to choose the data storage method for character information.

### Instructions to Run Locally
1. Clone the repository or obtain the project files.
2. Install any required dependencies using your preferred package manager.
3. Configure the API with necessary settings (e.g., database connection if applicable).
4. Build and run the API service locally.
5. Utilize the provided `briv.json` file as a sample character data, including HP, for testing the API.

### Additional Notes
- Temporary Hit Points take precedence over the regular HP pool and cannot be healed.
- Characters with resistance take half damage, while characters with immunity take no damage from a damage type.
- Use character filename as identifier

#### Possible Damage Types in D&D
Here is a list of possible damage types that can occur in Dungeons & Dragons (D&D). These damage types should be considered when dealing damage or implementing character resistances and immunities:
- Bludgeoning
- Piercing
- Slashing
- Fire
- Cold
- Acid
- Thunder
- Lightning
- Poison
- Radiant
- Necrotic
- Psychic
- Force

If you have any questions or require clarification, please reach out to your Wizards of the Coast contact, and we will provide prompt assistance.

Good luck with the implementation!