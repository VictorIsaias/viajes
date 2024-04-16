import Route from '@ioc:Adonis/Core/Route'

Route.group(() =>{
    Route.post('/authorize-quote/:quote_id', 'AuthorizationsController.authQuote').middleware('auth:api').middleware('token:api')
}).prefix('/api/auth')
