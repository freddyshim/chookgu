import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PlayerDocument } from '@players/schemas/player.schema'

/**
 * Purchsed player schema
 */
@Schema({ _id: false })
export class PurchasedPlayer {
  @Prop({ type: Number, required: true, ref: 'Player' })
  player: number | PlayerDocument

  @Prop({ required: true })
  amount: number

  @Prop({ required: true })
  averageValue: number
}

export type PurchasedPlayerDocument = PurchasedPlayer & Document
export const PurchasedPlayerSchema =
  SchemaFactory.createForClass(PurchasedPlayer)

/**
 * User portfolio schema
 */
@Schema({ _id: false })
export class UserPortfolio {
  @Prop({ type: String, required: true })
  mode: string

  @Prop({ type: Number, default: 0 })
  balance: number

  @Prop({ type: [PurchasedPlayerSchema], default: [] })
  players: PurchasedPlayer[]
}

export type UserPortfolioDocument = UserPortfolio & Document
export const UserPortfolioSchema = SchemaFactory.createForClass(UserPortfolio)
