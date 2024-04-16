import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Quote from 'App/Models/Quote'
import Person from 'App/Models/Person'
import twilio from 'App/Resources/TwilioResources'
import Application from '@ioc:Adonis/Core/Application'
import mailer from 'App/Resources/MailerResources'


export default class AuthorizationsController {
    public async authQuote({request,params,response}: HttpContextContract) {
        /**
        * @swagger
        * /api/auth/authorize-quote/{quote_id}:
        *   post:
        *     description: Autorizar una cotizacion con el INE y el codigo de autenticacion del cliente
        *     tags:
        *       - Auth
        *     security:
        *       - bearerAuth: []
        *     produces:
        *       - application/json
        *     requestBody:
        *       description: Ingresa los datos para la creacion del recurso
        *       required: true
        *       content:
        *         multipart/form-data:
        *           schema:
        *             type: object
        *             properties:
        *               code:
        *                 type: string
        *                 descripcion: Codigo para autorizar cotizacion
        *                 required: true
        *               ine_photo:
        *                 type: string
        *                 format: binary
        *                 descripcion: Foto de la INE del cliente
        *                 required: true
        *     parameters:
        *       - in: query
        *         name: send-code
        *         schema:
        *           type: boolean
        *         required: false
        *         description: Asignar con true para enviar codigo de autenticacion
        *       - in: path
        *         name: quote_id
        *         schema:
        *           type: number
        *         required: true
        *         description: Numero id de la cotizacion que se autorizara
        *     responses:
        *       200:
        *         description: La busqueda fue exitosa
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de respuesta
        *                 title:
        *                   type: string
        *                   descripcion: titulo de la respuesta
        *                 message:
        *                   type: string
        *                   descripcion: mensaje de la respuesta
        *                 data: 
        *                   type: object
        *                   descripcion: Datos de la respuesta
        *       400:
        *         description: Los datos en el cuerpo de la solicitud no estan bien formulados, por un tipo de dato incorrecto 
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error  
        *       422:
        *         description: Los datos en el cuerpo de la solicitud no son procesables porque el formato es incorrecto o falta un elemento en el cuerpo de la solicitud 
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 errors:
        *                   type: array
        *                   items:
        *                     type: object
        *                   descripcion: errores en la solicitud  
        *       401:
        *         description: No esta autorizado para actualizar el recurso por un codigo incorrecto
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error  
        *       404:
        *         description: No se pudo encontrar el recurso de cotizacion para su actualizacion
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 data: 
        *                   type: object
        *                   descripcion: Datos del error   
        *       409:
        *         description: Los datos en el cuerpo de la solicitud causan conflicto con los registros ya hechos
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error  
        *       500:
        *         description: Hubo un fallo en el servidor durante la solicitud 
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                   descripcion: tipo de error
        *                 title:
        *                   type: string
        *                   descripcion: titulo del error
        *                 message:
        *                   type: string
        *                   descripcion: mensaje del error
        *                 errors: 
        *                   type: object
        *                   descripcion: Datos del error 
        * 
        */

        const body = request.all()
        const quote = await Quote.query().where('quote_id',params.quote_id).preload('trip',(trip)=>{
            trip.preload('destination',(destination)=>{
                    destination.preload('direction')    
                })
        }).first() 
        if(!quote){
          response.notFound({                 
            "type":"Error",
            "title": "Recurso no encontrado",
            "message": "El recurso de cotizacion no pudo encontrarse",
            "errors": [] 
          })
          return
        }
        if(quote.quote_status=="aproved"){
            response.conflict({                 
                "type":"Error",
                "title": "Conflicto con el servidor",
                "message": "El recurso de cotizacion ya esta autorizado",
                "errors": [] 
              })
            return
        }
        if(quote.quote_status=="cancelled"){
            response.conflict({                 
                "type":"Error",
                "title": "Conflicto con el servidor",
                "message": "El recurso de cotizacion no puede autorizarse porque ha sido cancelado",
                "errors": [] 
              })
            return
        }
        const person = await Person.query().where('person_id',quote.person_id).first()
        if(!person){
          response.notFound({                 
            "type":"Error",
            "title": "Recurso no encontrado",
            "message": "El recurso de persona no pudo encontrarse",
            "errors": [] 
          })
          return
        }
        if(request.input('send-code')=="true"){
          var code = ""
          for (let i = 0; i < 5; i++) {
            code += Math.floor(Math.random() * 10).toString();
          }
          const sendSms = await twilio.sendSMS("Tu codigo de autenticacion para autorizar tu cotizacion es: "+code,person.person_phone)
          if(!sendSms){
            response.internalServerError({                 
              "type":"Error",
              "title": "Error de sevidor",
              "message": "Hubo un fallo en el servidor durante el envio del codigo",
              "errors": []
            })
          }else{
            quote.quote_code = code
            await quote.save()
            response.send ({
              "type":"Exitoso",
              "title":"Codigo enviado",
              "message":"El codigo de autenticacion ha sido enviado exitosamente",
              "data":[],
            })
            return
          }
        }
        await request.validate({
            schema: schema.create({
              ine_photo: schema.file({
                extnames: ['jpg', 'jpeg', 'png']
              }),
              code: schema.string()
            }),
            messages: {
              'code.required': 'El codigo de autenticacion es obligatorio para poder hacer cambios en la cotizacion',
              'ine_photo.required': 'La foto del INE es obligatoria para poder hacer aprovar la cotizacion',
              'ine_photo.file': 'La foto del INE debe tener formato de imagen',
              'ine_photo.file.extname': 'La foto del INE solo admite formatos png, jpg y jpeg',
            }
          })

        if(body.code!=quote.quote_code){
            response.unauthorized({                 
              "type":"Error",
              "title": "Accion no autorizada",
              "message": "El recurso no puede autorizarse porque el codigo no es correcto",
              "errors": [] 
            })
            return
          }
        try{
            const photo = request.file('ine_photo')
            const fileName ='FILE-'+ new Date().getTime()+'.'+photo?.extname
            await photo?.move(Application.tmpPath('uploads'),{
                name:fileName
            })
            const emailData={ code:body.code,destination:quote.trip.destination,price:quote.quote_price}
            const mail = await mailer.sendMailConfirmation(emailData,"Confirmacion de cotizacion",person.person_email,fileName)
            if(!mail){
                response.internalServerError({                 
                    "type":"Error",
                    "title": "Error de sevidor",
                    "message": "Hubo un fallo en el servidor durante el envio de los datos",
                    "errors": []
                  })
                  return
            }
            quote.quote_status="aproved"
            quote.quote_code=null
            quote.save()
        }catch(error){
            response.internalServerError({                 
                "type":"Error",
                "title": "Error de sevidor",
                "message": "Hubo un fallo en el servidor durante el registro de los datos",
                "errors": error
              })
              return
        }
        


        return {
        "type":"Exitoso",
        "title":"Recurso actualizado",
        "message":"La cotizacion ha sido aprovada con exito",
        "data":quote,
        }
    }
}
