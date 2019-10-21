const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const moment = require('moment-timezone');

const twilioNumber = process.env.TWILIO_NUMBER;

const { smsLogger } = require('../utils/Logger');

module.exports.sendMessage = async (number, message) => {
	try {
		var result = await twilioClient.messages.create({
			body: message,
			from: twilioNumber,
			to: `+1${number}`
		});
		smsLogger.log('info', `Sent a sms to ${number}: ${message}`);
		return { error: null, result: result };
	} catch (error) {
		smsLogger.log('error', `Could not send a sms to ${number}: ${message}`);
		return { error };
	}
};

module.exports.parseMessage = message => {
	smsLogger.log('info', `Received a sms from ${message.From}: ${message.Body}`);
	return {
		number: message.From.slice(2, message.From.length),
		content: message.Body,
		sid: message.Sid,
		timestamp: moment(Date.now()).tz('America/Toronto').format('YYYY-MM-DD HH:mm:ss')
	};
};

module.exports.validateRequest = req => {
	return twilio.validateExpressRequest(req, process.env.TWILIO_AUTH_TOKEN);
};
