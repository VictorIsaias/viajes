import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Person from 'App/Models/Person'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class PeopleController {    
  public async index({request}: HttpContextContract) {
    /**
    * @swagger
    * /api/people:
    *   get:
    *     description: Lista de todas las personas en el sistema, tanto clientes como administradores. Se muestran aquellos que son administradores. De aquellos que son clientes se muestran las cotizaciones que han hecho y toda la informacion respecto a estas, sus costos, viajes, categorias, etc. 
    *     tags:
    *       - People
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

    var person: Person[] 
    if(request.input('page')||request.input('limit')){
      const page = request.input('page',1)
      const limit = request.input('limit',3)
      person = await Person.query()
        .preload('administrator')
        .preload('quote', (quotes) => {
            quotes.preload('category')
                .preload('trip', (trips) => {
                    trips.preload('origin',(origin)=>{
                        origin.preload('direction')
                    }).preload('destination',(destination)=>{
                        destination.preload('direction')    
                    })
                })
        })
        .paginate(page,limit)
    }else{
      person = await Person.query()
        .preload('administrator')
        .preload('quote', (quotes) => {
            quotes.preload('category')
                .preload('trip', (trips) => {
                    trips.preload('origin',(origin)=>{
                        origin.preload('direction')
                    }).preload('destination',(destination)=>{
                        destination.preload('direction')    
                    })
                })
        })
    }

    return {
      "type":"Exitoso",
      "title":"Recursos encontrados",
      "message":"La lista de recursos de personas ha sido encontrada con exito",
      "data":person,
    }
  }

  public async store({request,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/people:
    *   post:
    *     description: Crea un nuevo recurso de persona en la base de datos. Ingresa los datos obligatorios para crear el recurso.
    *     tags:
    *       - People
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
    *               name:
    *                 type: string
    *                 descripcion: Nombre de la persona
    *                 required: true
    *               last_name: 
    *                 type: string
    *                 descripcion: Apellido de la persona
    *                 required: true
    *               birth_date:
    *                 type: string
    *                 format: date
    *                 descripcion: Fecha de nacimiento de persona
    *                 required: true
    *               phone:
    *                 type: string
    *                 descripcion: Numero de telefono de persona
    *                 required: true
    *               email:
    *                 type: string
    *                 format: email
    *                 descripcion: Correo electronico de persona
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
        name: schema.string(),
        last_name: schema.string(),
        phone: schema.string([
            rules.phone()
        ]),
        email: schema.string([
            rules.unique({table:'people',column:'person_email'}),
            rules.email()
          ]),
        birth_date: schema.date()
      }),
      messages: {
        'name.required': 'El nombre de la persona es obligatorio para crear un recurso de persona',
        'last_name.required': 'El apellido de la persona es obligatorio para crear un recurso de persona',
        'phone.required': 'El telefono de la persona es obligatorio para crear un recurso de persona',
        'email.required': 'El correo electronico de la persona es obligatorio para crear un recurso de persona',
        'birth_date.required': 'La fecha de nacimiento de la persona es obligatorio para crear un recurso de persona',
        'email.unique': 'El correo electronico no esta disponible',
        'email.email': 'El formato del correo electronico no es valido',
        'birth_date.date.format': 'El formato de la fecha de nacimiento no es valida'
        }
    })

    const person = new Person()
    try{
      person.person_name = body.name
      person.person_last_name = body.last_name
      person.person_birth_date = body.birth_date
      person.person_email = body.email
      person.person_phone = body.phone
      await person.save()
    }catch(error){
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
      "message":"El recurso persona ha sido creado exitosamente",
      "data":person,
    })
  }

  public async show({params,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/people/{person_id}:
    *   get:
    *     description: Muestra una persona especifica identificada por el numero id que se pasa como parametro.
    *     tags:
    *       - People
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     parameters:
    *       - in: path
    *         name: person_id
    *         schema:
    *           type: number
    *         required: true
    *         description: Id de persona que se va a mostrar
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
    *         description: No se pudo encontrar el recurso de persona 
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
    const person = await Person.query()
      .where('person_id',params.person_id)
      .preload('administrator')
      .preload('quote', (quotes) => {
          quotes.preload('category')
              .preload('trip', (trips) => {
                  trips.preload('origin',(origin)=>{
                      origin.preload('direction')
                  }).preload('destination',(destination)=>{
                      destination.preload('direction')    
                  })
              })
      })
      .first()
    if(person){
      response.send ({
        "type":"Exitoso",
        "title":"Recurso encontrado",
        "message":"El recurso de persona ha sido encontrado con exito",
        "data":person,
      })
    }
    else{
      response.notFound({                 
        "type":"Error",
        "title": "Recurso no encontrado",
        "message": "El recurso de persona no pudo encontrarse",
        "errors": [] 
      })
    }
  }

  public async update({params,request,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/people/{person_id}:
    *   put:
    *     description: Actualiza el recurso de persona, se pueden actualizar los datos que se necesiten.
    *     tags:
    *       - People
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     requestBody:
    *       description: Se pueden cambiar los datos que sean necesarios
    *       required: true
    *       content:
    *         application/json:
    *           schema:
	  *             type: object
    *             properties:
    *               name:
    *                 type: string
    *                 descripcion: Nombre de la persona
    *                 required: false
    *               last_name: 
    *                 type: string
    *                 descripcion: Apellido de la persona
    *                 required: false
    *               birth_date:
    *                 type: string
    *                 format: date
    *                 descripcion: Fecha de nacimiento de persona
    *                 required: false
    *               phone:
    *                 type: string
    *                 descripcion: Numero de telefono de persona
    *                 required: false
    *               email:
    *                 type: string
    *                 format: email
    *                 descripcion: Correo electronico de persona
    *                 required: false
    *     parameters:
    *       - in: path
    *         name: person_id
    *         schema:
    *           type: number
    *         required: true
    *         description: Id de persona que se va a actualizar
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
          name: schema.string.nullableAndOptional(),
          last_name: schema.string.nullableAndOptional(),
          phone: schema.string.nullableAndOptional([
              rules.phone()
          ]),
          email: schema.string.nullableAndOptional([
              rules.unique({table:'people',column:'person_email'}),
              rules.email()
            ]),
          birth_date: schema.date.nullableAndOptional()
        }),
        messages: {
          'email.unique': 'El correo electronico no esta disponible',
          'email.email': 'El formato del correo electronico no es valido',
          'birth_date.date.format': 'El formato de la fecha de nacimiento no es valida'
          }
      })

    var person = await Person.find(params.person_id)
    if(!person){
        response.notFound({                 
            "type":"Error",
            "title": "Recurso no encontrado",
            "message": "El recurso de persona no pudo encontrarse",
            "errors": [] 
        })
        return
    }

    try{
      if(body.name){
        person.person_name = body.name
      }
      if(body.last_name){
        person.person_last_name = body.last_name
      }
      if(body.birth_date){
        person.person_birth_date = body.birth_date
      }
      if(body.phone){
        person.person_phone = body.phone
      }
      if(body.email){
        person.person_email = body.email
      }
      person.save()
    }catch(error){
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
      "message":"El recurso persona ha sido actualizado exitosamente",
      "data":person,
    })
    
  }

  public async destroy({params,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/people/{person_id}:
    *   delete:
    *     description: Elimina de la base de datos a la persona identificada por el numero id indicado.
    *     tags:
    *       - People
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     parameters:
    *       - in: path
    *         name: person_id
    *         schema:
    *           type: number
    *         required: true
    *         description: Id de persona que se va a eliminar
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
    *         description: No se pudo encontrar el recurso de persona para su eliminacion
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
    const person = await Person.query().where('person_id',params.person_id).preload('administrator').first()

    if(person){
     
      await person.related('quote').query().delete()
      await person.related('administrator').query().delete()
      await person.delete()

      response.send ({
        "type":"Exitoso",
        "title":"Recurso eliminado",
        "message":"El recurso persona ha sido eliminado exitosamente",
        "data":person,
      })
    }
    else{
      response.notFound({                 
        "type":"Error",
        "title": "Recurso no encontrado",
        "message": "El recurso de persona no pudo encontrarse",
        "errors": [] 
      })
    }

  }
}
