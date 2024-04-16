import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import Application from '@ioc:Adonis/Core/Application'

export default class mailer{
    public static async sendMailConfirmation(emailData,subject,email,fileName){        
        try {
    
            await Mail.send((message) => {
              message
                .from(Env.get('SMTP_USERNAME'),'Sistema UTT')
                .to(email)
                .subject(subject)
                .htmlView('emails/Confirmation', emailData)
                .attach(Application.tmpPath('uploads/'+fileName))
            })
            return emailData
        } catch (error) {
            return null
        }
    }
        public static async sendMailCode(emailData,subject,email){        
        try {
    
            await Mail.send((message) => {
              message
                .from(Env.get('SMTP_USERNAME'),'Sistema UTT')
                .to(email)
                .subject(subject)
                .htmlView('emails/Auth', emailData)
            })
            return emailData
        } catch (error) {
            return null
        }
    }
}