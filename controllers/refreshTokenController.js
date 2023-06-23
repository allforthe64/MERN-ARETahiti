const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    console.log(Admin)

    const foundAdmin = await Admin.findOne({ refreshToken }).exec();

    if (!foundAdmin) {
        console.log('made it in here')
        return res.sendStatus(403);
    } //Forbidden 
    console.log('made it past found admin check')
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundAdmin.username !== decoded.username) return res.sendStatus(403);
            const id = foundAdmin._id
            const username = foundAdmin.username
            const email = foundAdmin.repEmail
            const phone = foundAdmin.repPhone
            const region = foundAdmin.region
    
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
                { expiresIn: '10s' }
            );

            res.json({ id, username, email, phone, region, accessToken })
        }
    );
}

module.exports = { handleRefreshToken }
