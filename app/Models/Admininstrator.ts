import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Person from './Person'
import { BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class Admininstrator extends BaseModel {
  /** 
  * @swagger
  * components:
  *   schemas:   
  *     Administrator:
  *       type: object
  *       properties:
  *         administrator_id:
  *           type: number 
  *           readOnly: true
  *         administrator_password:
  *           type: string
  *         person_id:
  *           type: number
  *         administrator_code:
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

  public static table = "administrators"

  @column()
  public administrator_code: String | null

  @column()
  public administrator_password: String

  @column()
  public person_id: number

  @column({ isPrimary: true })
  public administrator_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Person, {
    localKey: 'person_id',  
    foreignKey: 'person_id',
  })
  public person: BelongsTo<typeof Person>


}