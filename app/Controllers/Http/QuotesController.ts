import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Destination from 'App/Models/Destination'
import Category from 'App/Models/Category'
import Quote from 'App/Models/Quote'
import Trip from 'App/Models/Trip'
import Env from '@ioc:Adonis/Core/Env'
import Person from 'App/Models/Person'
import twilio from 'App/Resources/TwilioResources'

export default class QuotesCotrollersController {
    
  public async index({request}: HttpContextContract) {
    /**
    * @swagger
    * /api/quotes:
    *   get:
    *     description: Lista de todas las cotizaciones en el sistema. Su destino detallado, categoria y su cliente.
    *     tags:
    *       - Quotes
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     parameters:
    *       - in: query
    *         name: page
    *         schema:
    *           type: number
    *         required: false
    *         description: Pagina que se mostrara
    *       - in: query
    *         name: limit
    *         schema:
    *           type: number
    *         required: false
    *         description: Limite de elementos que se mostraran en la pagina actual (3 por defecto)
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

    var quotes: Quote[] 
    if(request.input('page')||request.input('limit')){
      const page = request.input('page',1)
      const limit = request.input('limit',3)
      quotes = await Quote.query()
        .preload('category')
        .preload('trip',(trip)=>{
            trip.preload('destination',(destination)=>{
                    destination.preload('direction')    
                })
                .preload('origin',(origin)=>{
                    origin.preload('direction')    
                })
        })
        .preload('person')
        .paginate(page,limit)
    }else{
        quotes = await Quote.query()
        .preload('category')
        .preload('trip',(trip)=>{
            trip.preload('destination',(destination)=>{
                    destination.preload('direction')    
                })
                .preload('origin',(origin)=>{
                    origin.preload('direction')    
                })
        })
        .preload('person')
    }

    return {
      "type":"Exitoso",
      "title":"Recursos encontrados",
      "message":"La lista de recursos de cotizaciones ha sido encontrada con exito",
      "data":quotes,
    }
  }

  public async store({request,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/quotes:
    *   post:
    *     description: Crea un nuevo recurso de cotizacion en la base de datos. Ingresa los datos obligatorios para crear el recurso.
    *     tags:
    *       - Quotes
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     requestBody:
    *       description: Ingresa los datos para la creacion del recurso
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               destination_id:
    *                 type: string
    *                 descripcion: Numero id del destino del viaje
    *                 required: true
    *               person_id: 
    *                 type: string
    *                 descripcion: Numero id de la persona de la cotizacion
    *                 required: true
    *               category_id:
    *                 type: string
    *                 descripcion: Numero id de la categoria escojida para la cotizacion
    *                 required: true
    *               trip_date:
    *                 type: string
    *                 format: date
    *                 descripcion: Fecha del viaje
    *                 required: true
    *     responses:
    *       201:
    *         description: La creacion del recurso fue exitosa
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
    *       404:
    *         description: No se pudo encontrar el recurso solicitado 
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
        destination_id: schema.number(),
        person_id: schema.number(),
        category_id: schema.number(),
        trip_date: schema.date()
      }),
      messages: {
        'destination_id.required': 'El numero id del destino es obligatorio para crear un recurso de cotizacion',
        'person_id.required': 'La numero id de la persona es obligatorio para crear un recurso de cotizacion',
        'category_id.required': 'El numero id de la categoria es obligatorio para crear un recurso de cotizacion',
        'trip_date.required': 'La fecha del viaje es obligatoria para crear un recurso de cotizacion',
        'destination_id.number': 'El numero id del destino debe ser enviado como un numero entero',
        'person_id.number': 'El numero id de la persona debe ser enviado como un numero entero',
        'category_id.number': 'El numero id de la categoria debe ser enviado como un numero entero',
        'trip_date.date.format': 'El formato de la fecha de viaje no es valida'        
        }
      })

    var folio = ""
    for (let i = 0; i < 15; i++) {
      folio += Math.floor(Math.random() * 10).toString();
    }

    const category = await Category.query().where('category_id',body.category_id).first()
    const person = await Person.query().where('person_id',body.person_id).first()
    const destination = await Destination.query().where('destination_id',body.destination_id).first()
    if(!destination){
      response.notFound({                 
        "type":"Error",
        "title": "Recurso no encontrado",
        "message": "El recurso de destino no pudo encontrarse",
        "errors": [] 
      })
      return
    }
    if(!person){
      response.notFound({                 
        "type":"Error",
        "title": "Recurso no encontrado",
        "message": "El recurso de persona no pudo encontrarse",
        "errors": [] 
      })
      return
    }
    if(!category){
      response.notFound({                 
        "type":"Error",
        "title": "Recurso no encontrado",
        "message": "El recurso de categoria no pudo encontrarse",
        "errors": [] 
      })
      return
    }

    const percentage = category.category_percentage
    const price_per_km = destination.destination_price_per_km
    const distance = destination.destination_distance
    var price
    if(percentage==1){
      price = (price_per_km*distance)
    }else{
      price = (price_per_km*distance)+(((price_per_km*distance)*percentage)/100)
    }

    const trip = new Trip()
    const quote = new Quote()
    try{
      trip.trip_date = body.trip_date
      trip.origin_id = Env.get('ORIGIN_ID')
      trip.destination_id = body.destination_id
      await trip.save()
  
      quote.quote_folio = folio
      quote.quote_price = price
      quote.person_id = body.person_id
      quote.trip_id = trip.trip_id
      quote.category_id = body.category_id
      quote.quote_status = "pending"
      await quote.save()
    }catch(error){
      trip.delete()
      quote.delete()
      response.internalServerError({                 
        "type":"Error",
        "title": "Error de sevidor",
        "message": "Hubo un fallo en el servidor durante el registro de los datos",
        "errors": error
      })
      return
    }
    
    response.status(201)
    response.send ({
      "type":"Exitoso",
      "title":"Recurso creado",
      "message":"El recurso de cotizacion ha sido creado exitosamente",
      "data":quote,
    })
  }

  public async show({params,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/quotes/{quote_id}:
    *   get:
    *     description: Muestra una cotizacion especifica identificada por el numero id que se pasa como parametro.
    *     tags:
    *       - Quotes
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     parameters:
    *       - in: path
    *         name: quote_id
    *         schema:
    *           type: number
    *         required: true
    *         description: Id de la cotizacion que se va a mostrar
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
    *       404:
    *         description: No se pudo encontrar el recurso de cotizacion 
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
    const quote = await Quote.query()
      .where('quote_id',params.quote_id)
      .preload('category')
      .preload('trip',(trip)=>{
          trip.preload('destination',(destination)=>{
                  destination.preload('direction')    
              })
              .preload('origin',(origin)=>{
                  origin.preload('direction')    
              })
      })
      .preload('person')
      .first()
    if(quote){
      response.send ({
        "type":"Exitoso",
        "title":"Recurso encontrado",
        "message":"El recurso de cotizacion ha sido encontrado con exito",
        "data":quote,
      })
    }
    else{
      response.notFound({                 
        "type":"Error",
        "title": "Recurso no encontrado",
        "message": "El recurso de cotizacion no pudo encontrarse",
        "errors": [] 
      })
    }
  }

  public async update({params,request,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/quotes/{quote_id}:
    *   put:
    *     description: Actualiza el recurso de cotizacion, se pueden actualizar los datos que se necesiten.
    *     tags:
    *       - Quotes
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     requestBody:
    *       description: Ingresa los datos para la creacion del recurso
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               code:
    *                 type: string
    *                 descripcion: Codigo para autorizar cambios
    *                 required: true
    *               destination_id:
    *                 type: string
    *                 descripcion: Numero id del destino del viaje
    *                 required: false
    *               person_id: 
    *                 type: string
    *                 descripcion: Numero id de la persona de la cotizacion
    *                 required: false
    *               category_id:
    *                 type: string
    *                 descripcion: Numero id de la categoria escojida para la cotizacion
    *                 required: false
    *               trip_date:
    *                 type: string
    *                 format: date
    *                 descripcion: Fecha del viaje
    *                 required: false
    *               cancel:
    *                 type: string
    *                 descripcion: Selecciona true para cancelar la cotizacion
    *                 required: false        
    *     parameters:
    *       - in: path
    *         name: quote_id
    *         schema:
    *           type: number
    *         required: true
    *         description: Id de la cotizacion que se va a actualizar
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
    const quote = await Quote.query()
      .where('quote_id',params.quote_id)      
      .preload('category')
      .preload('trip',(trip)=>{
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

    if(request.input('send-code')=="true"){
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

      var code = ""
      for (let i = 0; i < 5; i++) {
        code += Math.floor(Math.random() * 10).toString()
      }
      const sendSms = await twilio.sendSMS("Tu codigo de autenticacion para actualizar tu cotizacion es: "+code,person.person_phone)
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
        destination_id: schema.number.nullableAndOptional(),
        person_id: schema.number.nullableAndOptional(),
        category_id: schema.number.nullableAndOptional(),
        trip_date: schema.date.nullableAndOptional(),
        code: schema.string()
      }),
      messages: {
        'code.required': 'El codigo de autenticacion es obligatorio para poder hacer cambios en la cotizacion',
        'destination_id.number': 'El numero id del destino debe ser enviado como un numero entero',
        'person_id.number': 'El numero id de la persona debe ser enviado como un numero entero',
        'category_id.number': 'El numero id de la categoria debe ser enviado como un numero entero',
        'trip_date.date.format': 'El formato de la fecha de viaje no es valida'        
        }
    })
    if(body.code!=quote.quote_code){
      response.unauthorized({                 
        "type":"Error",
        "title": "Accion no autorizada",
        "message": "El recurso no puede actualizarse porque el codigo no es correcto",
        "errors": [] 
      })
      return
    }

    if(body.cancel=="true"){
      quote.quote_status = "cancelled"
      response.send ({
        "type":"Exitoso",
        "title":"Recurso actualizado",
        "message":"El recurso cotizacion ha sido cancelado exitosamente",
        "data":quote,
      })
      await quote.save()
      return
    }

    var destination
    if(body.destination_id){
      destination = await Destination.query().where('destination_id',body.destination_id).first()
      if(!destination){
        response.notFound({                 
          "type":"Error",
          "title": "Recurso no encontrado",
          "message": "El recurso de destino no pudo encontrarse",
          "errors": [] 
        })
        return
      }
    }
    if(body.person_id){
      const person = await Person.query().where('person_id',body.person_id).first()
      if(!person){
        response.notFound({                 
          "type":"Error",
          "title": "Recurso no encontrado",
          "message": "El recurso de persona no pudo encontrarse",
          "errors": [] 
        })
        return
      }
    }
    var category
    if(body.category_id){
      category = await Category.query().where('category_id',body.category_id).first()
      if(!category){
        response.notFound({                 
          "type":"Error",
          "title": "Recurso no encontrado",
          "message": "El recurso de categoria no pudo encontrarse",
          "errors": [] 
        })
        return
      }
    }
    if(body.destination_id||body.category_id){
      var percentage
      var price_per_km
      var distance 
      if(body.destination_id&&body.category_id){
        price_per_km = destination.destination_price_per_km
        percentage = category.category_percentage
        distance = destination.destination_distance
      }else if (body.destination_id){
        percentage = quote.category.category_percentage
        price_per_km = destination.destination_price_per_km
        distance = destination.destination_distance
      }else if (body.category_id){
        percentage = category.category_percentage
        price_per_km = quote.trip.destination.destination_price_per_km
        distance = quote.trip.destination.destination_distance
      }
      if(percentage==1){
        quote.quote_price =(price_per_km*distance)
      }else{
        quote.quote_price =(price_per_km*distance)+(((price_per_km*distance)*percentage)/100)
      }
    }

    const trip = await Trip.query().where('trip_id',quote.trip_id).first()
    if(!trip){
      response.notFound({                 
        "type":"Error",
        "title": "Recurso no encontrado",
        "message": "El recurso de viaje no pudo encontrarse",
        "errors": [] 
      })
      return
    }
    try{
      if(body.trip_date){
        trip.trip_date = body.trip_date
      }
      if(body.destination_id){
        trip.destination_id = body.destination_id
      }
      await trip.save()

      if(body.person_id){
        quote.person_id = body.person_id
      }
      if(body.category_id){
        quote.category_id = body.category_id
      }
      quote.quote_code=null
      await quote.save()
    }catch(error){
      trip.delete()
      quote.delete()
      response.internalServerError({                 
        "type":"Error",
        "title": "Error de sevidor",
        "message": "Hubo un fallo en el servidor durante el registro de los datos",
        "errors": error
      })
      return
    }
    
    response.send ({
      "type":"Exitoso",
      "title":"Recurso actualizado",
      "message":"El recurso cotizacion ha sido actualizado exitosamente",
      "data":quote,
    })
  }

  public async destroy({params,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/quotes/{quote_id}:
    *   delete:
    *     description: Elimina de la base de datos a la cotizacion identificada por el numero id indicado.
    *     tags:
    *       - Quotes
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     parameters:
    *       - in: path
    *         name: quote_id
    *         schema:
    *           type: number
    *         required: true
    *         description: Id de la cotizacion que se va a eliminar
    *     responses:
    *       200:
    *         description: La eliminacion fue exitosa
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
    *       404:
    *         description: No se pudo encontrar el recurso de destino para su eliminacion
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
    const quote = await Quote.query().where('quote_id',params.quote_id).first()

    if(quote){
      await quote.delete()
      await quote.related('trip').query().delete()

      response.send ({
        "type":"Exitoso",
        "title":"Recurso eliminado",
        "message":"El recurso de cotizacion ha sido eliminado exitosamente",
        "data":quote,
      })
    }
    else{
      response.notFound({                 
        "type":"Error",
        "title": "Recurso no encontrado",
        "message": "El recurso de cotizacion no pudo encontrarse",
        "errors": [] 
      })
    }
  }
}
