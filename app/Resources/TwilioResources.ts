import Env from '@ioc:Adonis/Core/Env'

export default class twilio{
    public static async sendSMS(message,phone){        
        try {
            const accountSid = Env.get('TWILIO_ACCOUNT_SID');
            const authToken = Env.get('TWILIO_AUTH_TOKEN');
            const client = require('twilio')(accountSid, authToken);
            await client.messages
                .create({
                body:message,
                    from: Env.get('TWILIO_FROM_NUMBER'),
                    to: '+52'+phone
                })
            return message
        } catch (error) {
            return null
        }
    }
}