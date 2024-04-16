import { DateTime } from 'luxon'
import { BaseModel, HasMany, ManyToMany, belongsTo, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Direction from './Direction'
import { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import Trip from './Trip'

export default class Destination extends BaseModel {

    /** 
  * @swagger
  * components:
  *   schemas:   
  *     Destination:
  *       type: object
  *       properties:
  *         destination_id:
  *           type: number 
  *           readOnly: true
  *         destination_distance:
  *           type: number
  *         destination_price_per_km:
  *           type: number
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

  public static table = "destinations"

  @column()
  public destination_name: String
  
  @column()
  public destination_price_per_km: number
  
  @column()
  public destination_distance: number

  @column()
  public direction_id: number

  @column({ isPrimary: true })
  public destination_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Direction, {
    localKey: 'direction_id',  
    foreignKey: 'direction_id',
  })
  public direction: BelongsTo<typeof Direction>

  @manyToMany(() => Category, {
    localKey: 'destination_id',
    pivotForeignKey: 'destination_id',
    relatedKey: 'category_id',
    pivotRelatedForeignKey: 'category_id',
  })
  public category: ManyToMany<typeof Category>
  
  @hasMany(() => Trip, {
    localKey: 'destination_id',
    foreignKey: 'destination_id', 
  })
  public trip: HasMany<typeof Trip>

}
