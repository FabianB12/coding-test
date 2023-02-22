import session from 'express-session'
import dotenv from 'dotenv'

import sequelize from '../../database'

const SequelizeStore = require('connect-session-sequelize')(session.Store)

dotenv.config()

export default session({
    store: new SequelizeStore({
        db: sequelize
    }),
    secret: '12345lul67890',
    name: 'sid',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 604800000, // one week
        httpOnly: true,
        sameSite: 'none',
        secure: true
    },
    proxy: true
})