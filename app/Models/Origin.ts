import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Trip from './Trip'
import Direction from './Direction'

export default class Origin extends BaseModel {

      /** 
  * @swagger
  * components:
  *   schemas:   
  *     Origins:
  *       type: object
  *       properties:
  *         origin_id:
  *           type: number 
  *           readOnly: true
  *         origin_name:
  *           type: string
  *         direction_id:
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

  public static table = "origins"

  @column()
  public origin_name: String
  
  @column()
  public direction_id: Number

  @column({ isPrimary: true })
  public origin_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Trip, {
    localKey: 'origin_id',
    foreignKey: 'origin_id', 
  })
  public trip: HasMany<typeof Trip>
  
  @belongsTo(() => Direction, {
    localKey: 'direction_id',
    foreignKey: 'direction_id', 
  })
  public direction: BelongsTo<typeof Direction>

}
