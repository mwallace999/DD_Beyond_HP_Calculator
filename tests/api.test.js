import supertest from 'supertest';
import app from '../server';

describe('API Endpoint Tests', () => {

  test('GET /test - Test Endpoint', async () => {
    const response = await supertest(app).get('/test');
    expect(response.status).toBe(200);
  });

  test('GET /character/get-character/1 - Should fetch character data by id', async () => {
    const response = await supertest(app).get('/character/get-character/1');
    expect(response.status).toBe(200);
    expect(response.body.character.name).toBe('Briv');
  });

  test('POST /character/add-temp-hp - Should add tempHp', async () => {
    const requestData = {
      id: 1,
      tempHp: 10
    };
    const response = await supertest(app).post('/character/add-temp-hp').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.tempHp).toBe(10);
  });

  test('POST /character/deal-damage - Should deal damage to tempHP and currHp', async () => {
    const requestData = {
      id: 1,
      damage: 15,
      type: 'Lightning',
      isCrit: false
    };
    const response = await supertest(app).post('/character/deal-damage').send(requestData);
    expect(response.status).toBe(200);
  });

  test('POST /character/heal - Should heal chacacter to max health', async () => {
    const requestData = {
      id: 1,
      health: 15
    };
    const response = await supertest(app).post('/character/heal').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.currHp).toBe(30);
  });

  test('POST /character/deal-damage - Should deal damage testing character Resistance', async () => {
    const requestData = {
      id: 1,
      damage: 20,
      type: 'Fire',
      isCrit: false
    };
    const response = await supertest(app).post('/character/deal-damage').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.currHp).toBe(20);
  });

  test('POST /character/deal-damage - Should deal damage testing character Immunity', async () => {
    const requestData = {
      id: 1,
      damage: 100,
      type: 'Cold',
      isCrit: false
    };
    const response = await supertest(app).post('/character/deal-damage').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.currHp).toBe(20);
  });

  test('POST /character/deal-damage - Should deal damage testing character Vulnerability', async () => {
    const requestData = {
      id: 1,
      damage: 5,
      type: 'Acid',
      isCrit: false
    };
    const response = await supertest(app).post('/character/deal-damage').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.currHp).toBe(10);
  });

  test('POST /character/deal-damage - Should deal damage reducing character to 0 HP and apply the Unconscious condition', async () => {
    const requestData = {
      id: 1,
      damage: 15,
      type: 'Slashing',
      isCrit: false
    };
    const response = await supertest(app).post('/character/deal-damage').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.currHp).toBe(0);
    expect(response.body.character.conditions).toContain('Unconscious');
  });

  test('POST /character/deal-damage - Should deal damage to Unconscious character resulting in adding 1 DeathFail', async () => {
    const requestData = {
      id: 1,
      damage: 15,
      type: 'Slashing',
      isCrit: false
    };
    const response = await supertest(app).post('/character/deal-damage').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.currHp).toBe(0);
    expect(response.body.character.deathFails).toBe(1);
  });

  test('POST /character/heal - Should heal chacacter with 0 HP, remove the Unconscious condition, and reset DeathFails', async () => {
    const requestData = {
      id: 1,
      health: 15
    };
    const response = await supertest(app).post('/character/heal').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.currHp).toBe(15);
    expect(response.body.character.conditions).not.toContain('Unconscious');
    expect(response.body.character.deathFails).toBe(0);
  });

  test('POST /character/deal-damage - Should deal damage reducing character to 0 HP and apply the Unconscious condition', async () => {
    const requestData = {
      id: 1,
      damage: 20,
      type: 'Force',
      isCrit: false
    };
    const response = await supertest(app).post('/character/deal-damage').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.currHp).toBe(0);
    expect(response.body.character.conditions).toContain('Unconscious');
  });

  test('POST /character/deal-damage - Should deal critical damage to Unconscious character resulting in adding 2 DeathFails', async () => {
    const requestData = {
      id: 1,
      damage: 15,
      type: 'Slashing',
      isCrit: true
    };
    const response = await supertest(app).post('/character/deal-damage').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.currHp).toBe(0);
    expect(response.body.character.deathFails).toBe(2);
  });

  test('POST /character/deal-damage - Should deal damage to Unconscious character with 2 DeathFails resulting in death, apply the Dead condition, remove the Unconscious condition, and reset DeathFails', async () => {
    const requestData = {
      id: 1,
      damage: 15,
      type: 'Slashing',
      isCrit: false
    };
    const response = await supertest(app).post('/character/deal-damage').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.currHp).toBe(0);
    expect(response.body.character.conditions).toContain('Dead');
    expect(response.body.character.conditions).not.toContain('Unconscious');
    expect(response.body.character.deathFails).toBe(0);
  });

  test('POST /character/heal - Should not be able to heal Dead character', async () => {
    const requestData = {
      id: 1,
      health: 15
    };
    const response = await supertest(app).post('/character/heal').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.conditions).toContain('Dead');
    expect(response.body.character.currHp).toBe(0);
  });

  test('POST /character/add-temp-hp - Should not be able to heal Dead character', async () => {
    const requestData = {
      id: 1,
      tempHp: 15
    };
    const response = await supertest(app).post('/character/add-temp-hp').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.conditions).toContain('Dead');
    expect(response.body.character.tempHp).toBe(0);
  });

  test('POST /character/deal-damage - Should deal massive damage resulting in instant death', async () => {
    const requestData = {
      id: 2,
      damage: 200,
      type: 'Force',
      isCrit: false
    };
    const response = await supertest(app).post('/character/deal-damage').send(requestData);
    expect(response.status).toBe(200);
    expect(response.body.character.currHp).toBe(0);
    expect(response.body.character.conditions).toContain('Dead');
    expect(response.body.character.conditions).not.toContain('Unconscious');
    expect(response.body.character.deathFails).toBe(0);
  });

});