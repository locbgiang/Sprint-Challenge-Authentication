const supertest = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig');

afterEach(async ()=>{
    await db('users').truncate();
})

describe('server',()=>{
    it('can run test',()=>{
        expect(true).toBeTruthy();
    })

    describe ('GET /',()=>{
        it('should return http status code 200',()=>{
            return supertest(server)
            .get('/').then(response=>{
                expect(response.status).toBe(200);
            })
        })

        it('should return {API: "UP"',()=>{
            return supertest(server)
            .get('/').then(response=>{
                expect(response.body).toEqual({API:'UP'});
                expect(response.body.API).toBeDefined();
                expect(response.body.API).toBe('UP');
            })
        })
    })

    describe('POST /register',()=>{
        it('should return http code 201 after register',()=>{
            return supertest(server)
            .post('/api/auth/register')
            .send({username: '123', password: "hello"})
            .then(response=>{
                expect(response.status).toBe(201);
            })
        })

        it('should return http code 400 if missing username or password',()=>{
            return supertest(server)
            .post('/api/auth/register')
            .send({username: "noPassword"})
            .then(response=>{
                expect(response.status).toBe(400)
            })
        })
    })

    describe('POST /login',()=>{
        it('should return http code 200 on successful log in',()=>{
            return supertest(server)
            .post('/api/auth/register')
            .send({username: 'testing', password: 'password'})
            .then(()=>{
                return supertest(server)
                .post('/api/auth/login')
                .send({username: 'testing', password: 'password'})
                .then(response=>{
                    expect(response.status).toBe(200);
                })
            })
        })

        it('should return http code 401 with wrong credentials',()=>{
            return supertest(server)
            .post('/api/auth/register')
            .send({username: 'testing22222', password: 'password'})
            .then(()=>{
                return supertest(server)
                .post('/api/auth/login')
                .send({username: 'testing11111', password: 'password'})
                .then(response=>{
                    expect(response.status).toBe(401);
                })
            })
        })
    })
})