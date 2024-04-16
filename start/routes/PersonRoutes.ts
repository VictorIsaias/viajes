import Route from '@ioc:Adonis/Core/Route'

Route.group(() =>{
    Route.get('/', 'PeopleController.index').middleware('auth:api').middleware('token:api')
    Route.get('/:person_id', 'PeopleController.show').middleware('auth:api').middleware('token:api')
    Route.post('/', 'PeopleController.store').middleware('auth:api').middleware('token:api')
    Route.put('/:person_id', 'PeopleController.update').middleware('auth:api').middleware('token:api')
    Route.delete('/:person_id', 'PeopleController.destroy').middleware('auth:api').middleware('token:api')
}).prefix('/api/people')
