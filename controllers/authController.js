const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { username, pwd } = req.body;
    if (!username || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' })
    
    const foundAdmin = await Admin.findOne({ username: username }).exec()
    if (!foundAdmin) return res.sendStatus(401); //Unauthorized 
    
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundAdmin.password)
    
    
    if (match) {

        // create JWTs
        const accessToken = jwt.sign(
            { 
                'AdminInfo': {
                    'username': foundAdmin.username,
                    'email': foundAdmin.repEmail,
                    'phone': foundAdmin.repPhone,
                    'region': foundAdmin.region
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        )
        const refreshToken = jwt.sign(
            { "username": foundAdmin.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        // Saving refreshToken with current user
        foundAdmin.refreshToken = refreshToken


        const id = foundAdmin._id
        const username = foundAdmin.username
        const email = foundAdmin.repEmail
        const phone = foundAdmin.repPhone
        const region = foundAdmin.region

        const result = await foundAdmin.save()

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }) //secure: true,
        res.json({ id, username, email, phone, region, accessToken })
    } else {
        res.sendStatus(401)
    }
}

module.exports = { handleLogin }