import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAccountDto } from './dto/login-account.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from './entities/account.entity';
import { RegisterAccountDto } from './dto/register-account';
import { Sequelize } from 'sequelize-typescript';
import { UsersService } from 'src/users/users.service';

function authdata_encrypt(authdata: LoginAccountDto) {
  const txt = JSON.stringify(authdata);
  const enc = [];
  for (let i = 0; i < txt.length; i += 1) {
    const keyC = process.env.COOKIE_KEY[i % process.env.COOKIE_KEY.length];
    const encC = `${String.fromCharCode(
      (txt[i].charCodeAt(0) + keyC.charCodeAt(0)) % 256,
    )}`;
    enc.push(encC);
  }
  const str = enc.join('');
  return Buffer.from(str, 'binary').toString('base64');
}

@Injectable()
export class AccountsService {
  constructor(
    private usersService: UsersService,
    @InjectModel(() => Account) private accountModel: typeof Account,
    private sequelize: Sequelize,
  ) {}

  /*

  create(createAccountDto: CreateAccountDto) {
    return 'This action adds a new account';
  }

  findAll() {
    return `This action returns all accounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  */

  async login(loginAccountDto: LoginAccountDto) {
    const account = await this.accountModel.findOne({
      where: {
        login: loginAccountDto.login,
      },
    });
    if (account) {
      if (account.password === loginAccountDto.password) {
        return authdata_encrypt(loginAccountDto);
      } else {
        throw new HttpException('Bad password', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
    }
  }

  async register(registerAccountDto: RegisterAccountDto) {
    const check = await this.accountModel.findOne({
      where: {
        login: registerAccountDto.login,
      },
    });
    if (check) {
      try {
        await this.sequelize.transaction(async (t) => {
          const transactionHost = { transaction: t };

          const user = await this.usersService.createProfile(registerAccountDto.login, transactionHost)

          if(user){
            await this.accountModel.create(
              {
                login: registerAccountDto.login,
                password: registerAccountDto.password,
                profile_id: user.id,
              },
              transactionHost,
            );
          }else{
            throw new Error("User not created")
          }
          
        });
        return authdata_encrypt(registerAccountDto);
      } catch (e) {
        console.log('[TRANSACTION ERROR] ' + e);
        throw new HttpException(
          '???????????? ?????? ???????????????????? ???????????????????? ??????????????????????',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException(
        '?????????????? ?? ?????????? ?????????????? ?????? ????????????????????',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
