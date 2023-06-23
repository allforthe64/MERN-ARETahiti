const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    console.log(user, pwd)
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundAdmin = await Admin.findOne({ username: user }).exec();
    if (!foundAdmin) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundAdmin.password);
    if (match) {
        const region = foundAdmin.region;
        // create JWTs
        const accessToken = jwt.sign(
            {
                "AdminInfo": {
                    "username": foundAdmin.username,
                    "region": region
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundAdmin.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundAdmin.refreshToken = refreshToken;
        const result = await foundAdmin.save();
        console.log(result);
        console.log(region);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to user
        res.json({ region, accessToken });

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };