import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class Token {
  public async handle({}: HttpContextContract, next: () => Promise<void>) {
    
    // const ENV_CLIENT_TOKEN= Env.get('CLIENT_TOKEN')
    // const client_token = request.header('client-token')
    
    //  if (client_token != ENV_CLIENT_TOKEN){
    //    console.log('invalid token')
    //    response.status(409)
    //    response.send({                 
    //     "type":"Error",
    //     "title": "Sin autorizacion",
    //     "message": "El token de api no es valido",
    //     "errors": [] 
    //   })
    //    return
    //  }

    await next()
  }
}
