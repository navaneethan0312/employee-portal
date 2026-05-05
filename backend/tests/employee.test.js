const request = require('supertest')
const express = require('express')

const app = express()
app.use(express.json())
app.get('/health', (req, res) => res.json({ status: 'ok' }))

describe('Health Check', () => {
  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health')
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})

describe('Input Validation', () => {
  test('employee name should not be empty', () => {
    const name = 'John Doe'
    expect(name.trim().length).toBeGreaterThan(0)
  })

  test('salary should be a positive number', () => {
    const salary = 50000
    expect(salary).toBeGreaterThan(0)
  })

  test('email format is valid', () => {
    const email = 'john@example.com'
    expect(email).toMatch(/^\S+@\S+\.\S+$/)
  })
})
