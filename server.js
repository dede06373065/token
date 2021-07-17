require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const posts = [
    {
        username: "dede",
        gender: "F",
        age: 20
    },
    {
        username: "gogo",
        gender: "M",
        age: 19
    }
]
app.use(express.json())

app.get('/posts', authToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const user = { name: username }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
})

function authToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
app.listen(4000)