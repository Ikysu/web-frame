import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { AccountsService } from './accounts.service';
import { LoginAccountDto } from './dto/login-account.dto';
import { RegisterAccountDto } from './dto/register-account';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  /*
  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(+id);
  }
  */

  @Post('login')
  async login(
    @Body() loginAccountDto: LoginAccountDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const auth = await this.accountsService.login(loginAccountDto);
    response.cookie('set-cookie', auth);
    return { ok: true };
  }

  @Post('register')
  async register(
    @Body() registerAccountDto: RegisterAccountDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const auth = await this.accountsService.register(registerAccountDto);
    response.cookie('set-cookie', auth);
    return { ok: true };
  }
}
