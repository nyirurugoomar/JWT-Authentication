require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = [] // Change the variable name to refreshTokens

app.post('/token', (req, res) => {
  const incomingRefreshToken = req.body.token // Change the variable name to incomingRefreshToken
  if (incomingRefreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(incomingRefreshToken)) res.sendStatus(403)
  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.post('/login', (req, res) => {
  const username = req.body.username
  const user = { name: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

app.listen(4000)
