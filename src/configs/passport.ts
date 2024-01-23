import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { dataSource } from "./dbConfig";
import { JWT_SECRET } from "./envConfig";
import type { Request } from "express";
import { User } from "../entity/User";

const cookieExtractor = (req: Request): string => {
  let token = null;
  if (req?.cookies) {
    token = req.cookies.jwt;
  }
  return token;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const profileRepository = dataSource.getRepository(User);
      const profile = await profileRepository.findOne({
        where: { id: jwtPayload.userId },
      });

      if (!profile) {
        done(null, false);
      } else {
        done(null, profile);
      }
    } catch (error) {
      done(error, false);
    }
  }),
);

export default passport;
