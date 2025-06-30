const User = require('../models/user.model');

exports.verifyUser = async (phoneNumber) => {
    const user = await User.findOneAndUpdate(
        { phoneNumber },
        { isVerified: true },
        { new: true }
    );
    console.log(`✅ User verified: ${phoneNumber}`);
    return user;
};
