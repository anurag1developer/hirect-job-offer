const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilloPhone = process.env.TWILIO_ACCOUNT_PHONE;
const client = require("twilio")(accountSid, authToken);

module.exports = { twilloPhone, client };
