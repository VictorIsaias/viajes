import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Destination from 'App/Models/Destination'
import Direction from 'App/Models/Direction'
import copomex from 'App/Resources/CopomexResources'
import Category from 'App/Models/Category'

export default class DestinationsController {
  public async index({request}: HttpContextContract) {
    /**
    * @swagger
    * /api/destinations:
    *   get:
    *     description: Lista de todos los destinos en el sistema. Su direccion detallada y las categorias que maneja.
    *     tags:
    *       - Destinations
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

    var destination: Destination[] 
    if(request.input('page')||request.input('limit')){
      const page = request.input('page',1)
      const limit = request.input('limit',3)
      destination = await Destination.query()
        .preload('category')
        .preload('direction')
        .paginate(page,limit)
    }else{
        destination = await Destination.query()
        .preload('category')
        .preload('direction')
    }

    return {
      "type":"Exitoso",
      "title":"Recursos encontrados",
      "message":"La lista de recursos de destinos ha sido encontrada con exito",
      "data":destination,
    }
  }

  public async store({request,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/destinations:
    *   post:
    *     description: Crea un nuevo recurso de destino en la base de datos. Ingresa los datos obligatorios para crear el recurso.
    *     tags:
    *       - Destinations
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
    *               name:
    *                 type: string
    *                 descripcion: Nombre del destino
    *                 required: true
    *               zip_code: 
    *                 type: string
    *                 descripcion: Codigo postal del destino
    *                 required: true
    *               distance:
    *                 type: string
    *                 descripcion: Distancia con respecto al punto de origen
    *                 required: true
    *               price_per_km:
    *                 type: string
    *                 descripcion: Precio del viaje por kilometro
    *                 required: true
    *               categories:
    *                 type: array
    *                 items:
    *                   type: string
    *                 descripcion: Categorias extra disponibles para seleccionar en esta direccion (1 es clase comercial, 2 es clase media, 3 es primera clase)
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
        name: schema.string(),
        distance: schema.number(),
        zip_code: schema.string([
            rules.zip()
        ]),
        price_per_km: schema.number(),
        categories: schema.array().members(schema.number())
      }),
      messages: {
        'name.required': 'El nombre del destino es obligatorio para crear un recurso de destino',
        'distance.required': 'La distancia del destino es obligatoria para crear un recurso de destino',
        'zip_code.required': 'El codigo postal del destino es obligatorio para crear un recurso de destino',
        'price_per_km.required': 'El precio por kilometro del destino es obligatorio para crear un recurso de destino',
        'categories.required': 'Las categorias del destino son obligatorias para crear un recurso de destino',
        'categories.array': 'Las categorias deben ser enviadas como arreglo de numeros enteros',
        'distance.number': 'La distancia debe ser enviada como un numero entero',
        'price_per_km.number': 'El precio por kilometro debe ser enviado como un numero entero',
        'categories.*.number': 'Las categorias deben ser enviadas como arreglo de numeros enteros'
        }
      })

    const address = await copomex.getAddress(body.zip_code)
    if(!address){
      response.notFound({                 
        "type":"Error",
        "title": "Recurso no encontrado",
        "message": "La direccion indicada no pudo encontrarse",
        "errors": [] 
      })
      return
    } 
    for (let i = 0; i < body.categories.length; i++) {
      if(!await Category.query().where("category_id",body.categories[i]).first()){
        response.notFound({                 
          "type":"Error",
          "title": "Recurso no encontrado",
          "message": "Alguna de las categorias indicadas no pudieron encontrarse",
          "errors": [] 
        })
        return
      }
      for (let o = i+1; o < body.categories.length; o++) {
        if(body.categories[o]==body.categories[i]){
          response.badRequest({                 
            "type":"Error",
            "title": "Conflicto en el registro",
            "message": "La relacion con una de las categorias se repite en la solicitud",
            "errors": [] 
          })
          return
        }
      }
    }
      
    const direction = new Direction()
    const destination = new Destination()
    try{
      direction.direction_country = address.pais
      direction.direction_city = address.ciudad
      direction.direction_settlement = address.asentamiento
      direction.direction_type_settlement = address.tipo_asentamiento
      direction.direction_state = address.estado
      direction.direction_zip = address.cp
      direction.direction_municipality = address.municipio
      await direction.save()
  
      destination.destination_distance = body.distance
      destination.destination_name = body.name
      destination.destination_price_per_km = body.price_per_km
      await destination.save()
      await destination.related('direction').associate(direction)
      await destination.related('category').attach(body.categories)
    }catch(error){
      direction.delete()
      destination.delete()
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
      "message":"El recurso destino ha sido creado exitosamente",
      "data":destination,
    })
  }

  public async show({params,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/destinations/{destination_id}:
    *   get:
    *     description: Muestra un destino especifico identificado por el numero id que se pasa como parametro.
    *     tags:
    *       - Destinations
    *     produces:
    *       - application/json
    *     security:
    *       - bearerAuth: []
    *     parameters:
    *       - in: path
    *         name: destination_id
    *         schema:
    *           type: number
    *         required: true
    *         description: Id de destino que se va a mostrar
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
    *         description: No se pudo encontrar el recurso de destino 
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
    const destination = await Destination.query()
      .where('destination_id',params.destination_id)
      .preload('category')
      .preload('direction')
      .first()
    if(destination){
      response.send ({
        "type":"Exitoso",
        "title":"Recurso encontrado",
        "message":"El recurso de destino ha sido encontrado con exito",
        "data":destination,
      })
    }
    else{
      response.notFound({                 
        "type":"Error",
        "title": "Recurso no encontrado",
        "message": "El recurso de destino no pudo encontrarse",
        "errors": [] 
      })
    }
  }

  public async update({params,request,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/destinations/{destination_id}:
    *   put:
    *     description: Actualiza el recurso de destino, se pueden actualizar los datos que se necesiten.
    *     tags:
    *       - Destinations
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
    *               name:
    *                 type: string
    *                 descripcion: Nombre del destino
    *                 required: false
    *               zip_code: 
    *                 type: string
    *                 descripcion: Codigo postal del destino
    *                 required: false
    *               distance:
    *                 type: string
    *                 descripcion: Distancia con respecto al punto de origen
    *                 required: true
    *               price_per_km:
    *                 type: string
    *                 descripcion: Precio del viaje por kilometro
    *                 required: false
    *               categories:
    *                 type: array
    *                 items:
    *                   type: string
    *                 descripcion: Agregar categorias disponibles para seleccionar en esta direccion (1 es clase comercial, 2 es clase media, 3 es primera clase)
    *                 required: false
    *               delete_categories:
    *                 type: array
    *                 items:
    *                   type: string
    *                 descripcion: Eliminar categorias disponibles para seleccionar en esta direccion (1 es clase comercial, 2 es clase media, 3 es primera clase)
    *                 required: false
    *     parameters:
    *       - in: path
    *         name: destination_id
    *         schema:
    *           type: number
    *         required: true
    *         description: Id del destino que se va a actualizar
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
        name: schema.string.nullableAndOptional(),
        distance: schema.number.nullableAndOptional(),
        zip_code: schema.string.nullableAndOptional([
            rules.zip()
        ]),
        price_per_km: schema.number.nullableAndOptional(),
        categories: schema.array.nullableAndOptional().members(schema.number()),
        delete_categories: schema.array.nullableAndOptional().members(schema.number())
      }),
      messages: {
        'categories.array': 'Las categorias deben ser enviadas como arreglo de numeros enteros',
        'distance.number': 'La distancia debe ser enviada como un numero entero',
        'price_per_km.number': 'El precio por kilometro debe ser enviado como un numero entero',
        'categories.*.number': 'Las categorias deben ser enviadas como arreglo de numeros enteros'
        }
      })

    var destination = await Destination.find(params.destination_id)
    if(!destination){
        response.notFound({                 
            "type":"Error",
            "title": "Recurso no encontrado",
            "message": "El recurso de destino no pudo encontrarse",
            "errors": [] 
        })
        return
    }
    
    var address
    if(body.zip_code){
      address = await copomex.getAddress(body.zip_code)
      if(!address){
        response.notFound({                 
          "type":"Error",
          "title": "Recurso no encontrado",
          "message": "La direccion indicada no pudo encontrarse",
          "errors": [] 
        })
        return
      } 
    }
    if(body.categories){
      for (let i = 0; i < body.categories.length; i++) {
        if(!await Category.query().where("category_id",body.categories[i]).first()){
          response.notFound({                 
            "type":"Error",
            "title": "Recurso no encontrado",
            "message": "Alguna de las categorias indicadas no pudieron encontrarse",
            "errors": [] 
          })
          return
        }
        if((await destination.related('category').query().where('category_destination.category_id', body.categories[i])).length!=0){
          response.conflict({                 
            "type":"Error",
            "title": "Conflicto en el registro",
            "message": "La relacion con una de las categorias ya esta creada",
            "errors": [] 
          })
          return
        }
        for (let o = i+1; o < body.categories.length; o++) {
          if(body.categories[o]==body.categories[i]){
            response.badRequest({                 
              "type":"Error",
              "title": "Conflicto en el registro",
              "message": "La relacion con una de las categorias se repite en la solicitud",
              "errors": [] 
            })
            return
          }
        }
      }
    }
    if(body.delete_categories){
      for (let i = 0; i < body.delete_categories.length; i++) {
        if((await destination.related('category').query().where('category_destination.category_id', body.delete_categories[i])).length==0){
          response.notFound({                 
            "type":"Error",
            "title": "Registro no encontrado",
            "message": "La relacion de una de las categorias con el destino no fue existe",
            "errors": [] 
          })
          return
        }
      }
    }
    var direction = await Direction.query().where("direction_id",destination.direction_id).first()
    if(!direction){
      response.notFound({                 
          "type":"Error",
          "title": "Recurso no encontrado",
          "message": "El recurso de la direccion del destino no pudo encontrarse",
          "errors": [] 
      })
      return
    }
    try{
      if(body.zip_code){
        direction.direction_country = address.pais
        direction.direction_city = address.ciudad
        direction.direction_settlement = address.asentamiento
        direction.direction_type_settlement = address.tipo_asentamiento
        direction.direction_state = address.estado
        direction.direction_zip = address.cp
        direction.direction_municipality = address.municipio
        await direction.save()
      }
      if(body.distance){
        destination.destination_distance = body.distance
      }
      if(body.name){
        destination.destination_name = body.name
      }
      if(body.price_per_km){
        destination.destination_price_per_km = body.price_per_km
      }
      await destination.save()
      if(body.zip_code){
        await destination.related('direction').associate(direction)
      }
      if(body.categories){
        await destination.related('category').attach(body.categories)
      }
      if(body.delete_categories){
        await destination.related('category').detach(body.delete_categories)
      }
    }catch(error){
      direction.delete()
      destination.delete()
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
      "message":"El recurso destino ha sido actualizado exitosamente",
      "data":destination,
    })
  }

  public async destroy({params,response}: HttpContextContract) {
    /**
    * @swagger
    * /api/destinations/{destination_id}:
    *   delete:
    *     description: Elimina de la base de datos al destino identificado por el numero id indicado.
    *     tags:
    *       - Destinations
    *     security:
    *       - bearerAuth: []
    *     produces:
    *       - application/json
    *     parameters:
    *       - in: path
    *         name: destination_id
    *         schema:
    *           type: number
    *         required: true
    *         description: Id de destino que se va a eliminar
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
    const destination = await Destination.query().where('destination_id',params.destination_id).preload('direction').first()

    if(destination){
      await destination.related('category').query().delete()
      await destination.related('trip').query().update({ 'destination_id': null })
      await destination.delete()
      await destination.related('direction').query().delete()

      response.send ({
        "type":"Exitoso",
        "title":"Recurso eliminado",
        "message":"El recurso de destino ha sido eliminado exitosamente",
        "data":destination,
      })
    }
    else{
      response.notFound({                 
        "type":"Error",
        "title": "Recurso no encontrado",
        "message": "El recurso de destino no pudo encontrarse",
        "errors": [] 
      })
    }

  }
}
