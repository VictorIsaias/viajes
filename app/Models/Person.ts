import { DateTime } from 'luxon'
import { BaseModel, HasMany, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Admininstrator from './Admininstrator'
import Quote from './Quote'

export default class Person extends BaseModel {

        /** 
  * @swagger
  * components:
  *   schemas:   
  *     People:
  *       type: object
  *       properties:
  *         person_id:
  *           type: number 
  *           readOnly: true
  *         person_name:
  *           type: string
  *         person_last_name:
  *           type: string
  *         person_phone:
  *           type: string
  *         person_email:
  *           type: string
  *         person_birth_date:
  *           type: string
  *           format: date
  *         created_at:
  *           type: string
  *           format: date-time
  *         updated_at:
  *           type: string
  *           format: date-time
  * 
  * 
  */

  public static table = "people"

  @column()
  public person_birth_date: Date

  @column()
  public person_name: String

  @column()
  public person_last_name: String

  @column()
  public person_phone: String

  @column()
  public person_email: String

  @column({ isPrimary: true })
  public person_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public deleted_at: DateTime

  @hasMany(() => Quote, {
    localKey: 'person_id',
    foreignKey: 'person_id', 
  })
  public quote: HasMany<typeof Quote>

  @hasOne(() => Admininstrator, {
    localKey: 'person_id',
    foreignKey: 'person_id', 
  })
  public administrator: HasOne<typeof Admininstrator>
  
}
