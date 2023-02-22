/* External dependencies */
import passport from 'passport';

import { User } from "../../database/models/user";
import strategy from "./strategy";

passport.serializeUser((user: User, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id: number, done) => {
    console.log(id)
    try {
        const user = await User.findByPk(id, { raw: true });

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
})

passport.use(strategy);

export default passport;