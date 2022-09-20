import { Model, UUID } from 'sequelize';
import { Table, Column, DataType } from 'sequelize-typescript';

@Table
export class Account extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  login: string;

  @Column
  password: string;

  @Column({
    type: UUID,
    allowNull: false,
  })
  profile_id: string;
}
