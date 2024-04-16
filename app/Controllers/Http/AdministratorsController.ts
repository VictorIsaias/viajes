import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Person from 'App/Models/Person'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Admininstrator from 'App/Models/Admininstrator'
import Hash from '@ioc:Adonis/Core/Hash'
import mailer from 'App/Resources/MailerResources'

export default class AdministratorsController {

  public async login({request,response,auth}: HttpContextContract) {
    /**
    * @swagger
    * /api/administrators/login:
    *   post:
    *     description: Inicia sesion en el sistema como administrador
    *     tags:
    *       - Administrators
    *     produces:
    *       - application/json
    *     requestBody:
    *       description: Ingresa los datos basicos para la identificacion del administrador
    *       required: true
    *       content:
    *         application/json:
    *           schema:
	  *             type: object
    *             properties:
    *               email:
    *                 type: string
    *                 descripcion: Nombre de la persona
    *                 required: true
    *               password: 
    *                 type: string
    *                 descripcion: Apellido de la persona
    *                 required: true
    *     responses:
    *       200:
    *         description: La autenticacion del recurso fue exitosa
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
    *       404:
    *         description: No se pudo encontrar el recurso de persona para su actualizacion
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

    await request.validate({
      schema: schema.create({
        password: schema.string(),
        email: schema.string([
            rules.email()
          ]),
      }),
      messages: {
        'password.required': 'La contraseña de la persona es obligatoria para iniciar sesion',
        'email.required': 'El correo electronico de la persona es obligatorio para iniciar sesion',
        'email.email': 'El formato del correo electronico no es valido'
        }
    })
    var token, person
    try{
      person = await Person.query().where('person_email',body.email).preload('administrator').first()
      
      if(!person){
        response.notFound({                 
            "type":"Error",
            "title": "Recurso no encontrado",
            "message": "El correo electronico es incorrecto",
            "errors": [] 
        })
        return
      }

      const password_hash = person.administrator.administrator_password.toString()
      
    if(!await Hash.verify(password_hash,body.password)){
        response.unauthorized({                 
          "type":"Error",
          "title": "Sin autorizacion",
          "message": "La contraseña es incorrecta",
          "errors": [] 
        })
        return
      }
      const administrator = await Admininstrator.query().where('administrator_id',person.person_id).first()
      if(!administrator){
        response.unauthorized({                 
            "type":"Error",
            "title": "Sin autorizacion",
            "message": "La persona no es un administrador",
            "errors": [] 
        })
        return
      }
      token = await auth.use('api').generate(administrator,{
        expiresIn:'30mins'
      })
    }catch(error){
      response.internalServerError({                 
        "type":"Error",
        "title": "Error de sevidor",
        "message": "Hubo un fallo en el servidor durante el registro de los datos",
        "errors": error
      })
      return
    }
    
    response.status(200)
    response.send ({
      "type":"Exitoso",
      "title":"Sesion iniciada",
      "message":"Sesion iniciada correctamente",
      "data":person,
      "token":token
    })
  }
  
  public async restorePassword({request,response,params}: HttpContextContract) {
    /**
    * @swagger
    * /api/administrators/restore-password/{administrator_id}:
    *   post:
    *     description: Restaura la contraseña del administrador, primero enviando un codigo de verificacion
    *     tags:
    *       - Administrators
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     requestBody:
    *       description: Ingresa los datos basicos para la identificacion y el contacto de la persona
    *       required: true
    *       content:
    *         application/json:
    *           schema:
	  *             type: object
    *             properties:
    *               code:
    *                 type: string
    *                 descripcion: Codigo de autenticacion
    *                 required: true
    *               password: 
    *                 type: string
    *                 descripcion: Nueva contraseña
    *                 required: true
    *     parameters:
    *       - in: path
    *         name: administrator_id
    *         schema:
    *           type: number
    *         required: true
    *         description: Id del administrador que se va a actualizar
    *       - in: query
    *         name: send-code
    *         schema:
    *           type: boolean
    *         required: false
    *         description: Asignar con true para enviar codigo de autenticacion
    *     responses:
    *       200:
    *         description: La actualizacion del recurso fue exitosa
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
    const administrator = await Admininstrator.query().where('administrator_id',params.administrator_id).preload('person').first()
    if(!administrator){
        response.notFound({                 
            "type":"Error",
            "title": "Recurso no encontrado",
            "message": "El recurso de administrador no pudo encontrarse",
            "errors": [] 
        })
        return
    }
    
    if(request.input('send-code')=="true"){
        var code = ""
        for (let i = 0; i < 5; i++) {
          code += Math.floor(Math.random() * 10).toString();
        }
        const emailData={ code:code}
        const mail = await mailer.sendMailCode(emailData,"Codigo de autenticacion",administrator.person.person_email)
        if(!mail){
            response.internalServerError({                 
                "type":"Error",
                "title": "Error de sevidor",
                "message": "Hubo un fallo en el servidor durante el envio de los datos",
                "errors": []
              })
              return
        }
        else{
          administrator.administrator_code = code
          await administrator.save()
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
        code: schema.string(),
        password: schema.string()
      }),
      messages: {
        'code.required': 'El codigo de autenticacion es obligatorio para actualizar contraseña',
        'password.required': 'La nueva contraseña es obligatoria para actualizar contraseña',
        }
    })

    if(body.code!=administrator.administrator_code){
        response.unauthorized({                 
          "type":"Error",
          "title": "Accion no autorizada",
          "message": "El recurso no puede autorizarse porque el codigo no es correcto",
          "errors": [] 
        })
        return
      }

    try{
      administrator.administrator_password = await Hash.make(body.password)
      administrator.administrator_code = null
      await administrator.save()
    }catch(error){
      response.internalServerError({                 
        "type":"Error",
        "title": "Error de sevidor",
        "message": "Hubo un fallo en el servidor durante el registro de los datos",
        "errors": error
      })
      return
    }
    
    response.status(200)
    response.send ({
      "type":"Exitoso",
      "title":"Recurso actualizado",
      "message":"El recurso administrador ha sido actualizado exitosamente",
      "data":administrator,
    })
  }

    
}

