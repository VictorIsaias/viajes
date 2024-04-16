import Route from '@ioc:Adonis/Core/Route'

Route.group(() =>{
    Route.post('/login', 'AdministratorsController.login').middleware('token:api')
    Route.post('/restore-password/:administrator_id', 'AdministratorsController.restorePassword').middleware('auth:api').middleware('token:api')
}).prefix('/api/administrators')
