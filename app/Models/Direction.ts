import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Origin from './Origin'
import Destination from './Destination'

export default class Direction extends BaseModel {
      /** 
  * @swagger
  * components:
  *   schemas:   
  *     Directions:
  *       type: object
  *       properties:
  *         direction_id:
  *           type: number 
  *           readOnly: true
  *         direction_zip:
  *           type: string
  *         direction_city:
  *           type: string
  *         direction_country:
  *           type: string
  *         direction_settlement:
  *           type: string
  *         direction_type_settlement:
  *           type: string
  *         direction_state:
  *           type: string
  *         direction_municipality:
  *           type: string
  *         created_at:
  *           type: string
  *           format: date-time
  *         updated_at:
  *           type: string
  *           format: date-time
  * 
  * 
  */

  public static table = "directions"

  @column()
  public direction_zip: String
  
  @column()
  public direction_city: String
  
  @column()
  public direction_country: String

  @column()
  public direction_municipality: String
  
  @column()
  public direction_state: String
  
  @column()
  public direction_settlement: String
  
  @column()
  public direction_type_settlement: String

  @column({ isPrimary: true })
  public direction_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Origin, {
    localKey: 'direction_id',
    foreignKey: 'direction_id', 
  })
  public origin: HasOne<typeof Origin>
  
  @hasOne(() => Destination, {
    localKey: 'direction_id',
    foreignKey: 'direction_id', 
  })
  public destination: HasOne<typeof Destination>

}
