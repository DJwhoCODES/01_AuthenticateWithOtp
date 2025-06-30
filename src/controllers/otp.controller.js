const { OTP_SERVICE, QUEUE_SERVICE } = require("../services");

exports.sendOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

        const [error, response] = await OTP_SERVICE.generateOtp(phoneNumber);

        if (error) {
            throw new Error(error);
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to generate OTP' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp, hash } = req.body;

        if (!phone || !otp || !hash) {
            return res.status(400).json({ msg: "All fields are required!" });
        }

        const [error, isValid] = await OTP_SERVICE.verifyOtp(phone, otp, hash);
        if (error || !isValid) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        await QUEUE_SERVICE.enqueue(phone);


        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error({ error });
        return res.status(500).json({ message: 'Server error' });
    }
};