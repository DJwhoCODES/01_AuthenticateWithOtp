const bcrypt = require('bcryptjs');

exports.generateOtp = async (phoneNumber) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const ttl = 1000 * 60 * 3;
        const expiresIn = Date.now() + ttl;

        const _otp = `${phoneNumber}:${otp}:${expiresIn}`;

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedOtp = await bcrypt.hash(_otp, salt);

        console.log(`OTP for ${phoneNumber}: ${otp}`);

        return [null, {
            hash: `${hashedOtp}:${expiresIn}`,
            phone: phoneNumber
        }];
    } catch (error) {
        return [error, null];
    }
};

exports.verifyOtp = async (phone, otp, hash) => {
    try {
        const [hashedOtp, expiresIn] = hash.split(":");

        if (Date.now() > +expiresIn) {
            return [null, false];
        }

        const data = `${phone}:${otp}:${expiresIn}`;
        const isValid = await bcrypt.compare(data, hashedOtp);

        return [null, isValid];
    } catch (error) {
        return [error, null];
    }
};
