import { Request, Response } from "express";
import { User } from "../../database/models/user";

const auth = async ({ req, res }: { req: Request; res: Response }) => {
    try {
        if (req.cookies.sid) {
            // save all characters before : to userID
            let user = await User.findOne({
                where: { sid: req.cookies.sid },
                raw: true,
            });
            if (!user) return { req, res };

            let expires = new Date(user.expires);
            if (expires < new Date()) {
                await User.update(
                    { sid: null, expires: null },
                    { where: { id: user.id } }
                );
                return { req, res };
            }

            return { req, res, user };
        }
        return { req, res };
    } catch (err) {
        console.log(err);
        return { req, res };
    }
};

export default auth;
