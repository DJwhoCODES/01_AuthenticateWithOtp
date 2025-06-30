require("dotenv").config();
const express = require('express');
const app = express();
const { OTP_ROUTES } = require("./routes");

app.use(express.json());

app.use('/api', OTP_ROUTES);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
