"use strict";
const clearCookie = (req, res, next) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        samesite: 'None',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    });
    next();
};
module.exports = clearCookie;
