import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Trip from './Trip'
import Person from './Person'
import Category from './Category'

export default class Quote extends BaseModel {

  /** 
  * @swagger
  * components:
  *   schemas:   
  *     Quotes:
  *       type: object
  *       properties:
  *         quote_id:
  *           type: number 
  *           readOnly: true
  *         quote_folio:
  *           type: string
  *         quote_price:
  *           type: number
  *         quote_status:
  *           type: string
  *         quote_code:
  *           type: string
  *         person_id:
  *           type: number
  *         trip_id:
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

  public static table = "quotes"

  @column()
  public quote_folio: String

  @column()
  public quote_price: number

  @column()
  public quote_status: String

  @column()
  public quote_code: String | null

  @column()
  public person_id: number

  @column()
  public category_id: number

  @column()
  public trip_id: number

  @column({ isPrimary: true })
  public quote_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Trip, {
    localKey: 'trip_id',  
    foreignKey: 'trip_id',
  })
  public trip: BelongsTo<typeof Trip>
  
  @belongsTo(() => Person, {
    localKey: 'person_id',  
    foreignKey: 'person_id',
  })
  public person: BelongsTo<typeof Person>
  
  @belongsTo(() => Category, {
    localKey: 'category_id',  
    foreignKey: 'category_id',
  })
  public category: BelongsTo<typeof Category>
  
}
