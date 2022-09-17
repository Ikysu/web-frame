import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Account extends Model {
  @Column({
      type:DataType.STRING,
      unique:true,
      primaryKey:true
  })
  login: string;

  @Column
  password: string;

  @Column
  profile_id: number;
}

@Module({
  controllers: [AccountsController],
  providers: [AccountsService]
})
export class AccountsModule {}
