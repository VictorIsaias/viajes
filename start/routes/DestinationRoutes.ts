import Route from '@ioc:Adonis/Core/Route'

Route.group(() =>{
    Route.get('/', 'DestinationsController.index').middleware('auth:api').middleware('token:api')
    Route.get('/:destination_id', 'DestinationsController.show').middleware('auth:api').middleware('token:api')
    Route.post('/', 'DestinationsController.store').middleware('auth:api').middleware('token:api')
    Route.put('/:destination_id', 'DestinationsController.update').middleware('auth:api').middleware('token:api')
    Route.delete('/:destination_id', 'DestinationsController.destroy').middleware('auth:api').middleware('token:api')
}).prefix('/api/destinations')
