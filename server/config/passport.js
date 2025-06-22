
// config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope:['profile','email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ 'socialLogin.providerId': profile.id });
            
            if (!user) {
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    socialLogin: {
                        provider: 'google',
                        providerId: profile.id
                    }
                });
            }
            
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email', 'photos']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ 'socialLogin.providerId': profile.id });
            
            if (!user) {
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    socialLogin: {
                        provider: 'facebook',
                        providerId: profile.id
                    }
                });
            }
            
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
