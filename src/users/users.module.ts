import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UUID, UUIDV4 } from 'sequelize';
import { Column, Model, Table, DataType, HasMany, ForeignKey } from 'sequelize-typescript';

@Table
export class User extends Model {
  @ForeignKey(()=>User)
  @Column({
    type:UUID,
    defaultValue:UUIDV4,
    allowNull:false,
    primaryKey:true
  })
  id:string;

  @Column
  username: string;

  @Column
  avatar: string;

  @HasMany(()=>User)
  friends: Array<User>;
}

@Module({
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
