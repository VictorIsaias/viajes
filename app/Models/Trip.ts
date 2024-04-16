import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Origin from './Origin'
import Quote from './Quote'
import Destination from './Destination'

export default class Trip extends BaseModel {

          /** 
  * @swagger
  * components:
  *   schemas:   
  *     Trips:
  *       type: object
  *       properties:
  *         trip_id:
  *           type: number 
  *           readOnly: true
  *         trip_date:
  *           type: string
  *           format: date
  *         origin_id:
  *           type: number
  *         destination_id:
  *           type: number
  *         category_id:
  *           type: number
  *         created_at:
  *           type: string
  *           format: date-time
  *         updated_at:
  *           type: string
  *           format: date-time
  * 
  * 
  */

  public static table = "trips"

  @column()
  public trip_date: Date

  @column()
  public origin_id: number

  @column()
  public destination_id: number

  @column({ isPrimary: true })
  public trip_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Trip, {
    localKey: 'trip_id',  
    foreignKey: 'trip_id',
  })
  public trip: BelongsTo<typeof Trip>
  
  @belongsTo(() => Destination, {
    localKey: 'destination_id',  
    foreignKey: 'destination_id',
  })
  public destination: BelongsTo<typeof Destination>
  
  @belongsTo(() => Origin, {
    localKey: 'origin_id',  
    foreignKey: 'origin_id',
  })
  public origin: BelongsTo<typeof Origin>
  
  @hasOne(() => Quote, {
    localKey: 'trip_id',  
    foreignKey: 'trip_id',
  })
  public quote: HasOne<typeof Quote>
  
}
