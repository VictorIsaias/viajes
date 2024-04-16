import Route from '@ioc:Adonis/Core/Route'

Route.group(() =>{
    Route.get('/', 'QuotesController.index').middleware('auth:api').middleware('token:api')
    Route.get('/:quote_id', 'QuotesController.show').middleware('auth:api').middleware('token:api')
    Route.post('/', 'QuotesController.store').middleware('auth:api').middleware('token:api')
    Route.put('/:quote_id', 'QuotesController.update').middleware('auth:api').middleware('token:api')
    Route.delete('/:quote_id', 'QuotesController.destroy').middleware('auth:api').middleware('token:api')
}).prefix('/api/quotes')
