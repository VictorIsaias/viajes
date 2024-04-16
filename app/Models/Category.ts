import { DateTime } from 'luxon'
import { BaseModel, HasMany, ManyToMany, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Quote from './Quote'
import Destination from './Destination'

export default class Category extends BaseModel {
 
    /** 
  * @swagger
  * components:
  *   schemas:   
  *     Categories:
  *       type: object
  *       properties:
  *         category_id:
  *           type: number 
  *           readOnly: true
  *         category_name:
  *           type: string
  *         person_id:
  *           type: number
  *         category_percentage:
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
  public static table = "categories"

  @column()
  public category_percentage: number

  @column()
  public category_name: String

  @column({ isPrimary: true })
  public category_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Quote, {
    localKey: 'category_id',
    foreignKey: 'category_id', 
  })
  public quote: HasMany<typeof Quote>

  @manyToMany(() => Destination, {
    localKey: 'category_id',
    pivotForeignKey: 'category_id',
    relatedKey: 'destination_id',
    pivotRelatedForeignKey: 'destination_id',
  })
  public destination: ManyToMany<typeof Destination>
}
