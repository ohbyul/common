import { Controller, Get, Post, Request, Query, UseGuards, Param, Body, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from 'src/dto/auth/login.dto';
import { SignUpDto } from 'src/dto/auth/sign-up.dto';
import { MemberService } from 'src/member/member.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

import { TransactionParam } from 'src/decorator/transaction.deco';
import { Transaction } from 'sequelize';
import requestIp from 'request-ip';
import { PwdChangeDto } from 'src/dto/auth/pwd-change.dto';
import { AuthCodeDto } from 'src/dto/auth/auth-code.dto';


@ApiTags('AUTH API')
@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private memberService: MemberService,
  ) {}

  /*************************************************
   * 로그인   
   * 
   * @param LoginDto
   * @returns 로그인 성공여부
   ************************************************/
  @Post('login')
  @ApiOperation({
    summary: '로그인 API',
    description: '멤버 포털 로그인',
  })
  @ApiBody({ type: LoginDto })
  async postLogin(@Request() req, @TransactionParam() transaction: Transaction) {
    let props: LoginDto = req.body;
    
    const clientIp = requestIp.getClientIp(req);
    props.ip = clientIp

    return this.authService.login({ props, transaction });
  }

  /*************************************************
   * 자동로그인   
   * 
   * @param LoginDto
   * @returns 자동로그인 성공여부
   ************************************************/
  @Post('auto-login')
  @ApiOperation({
    summary: '자동로그인 API',
    description: '공개 포털 자동로그인',
  })
  @ApiBody({ type: LoginDto })
  async autoLogin(@Request() req
                , @TransactionParam() transaction: Transaction
  ) {
    let props: LoginDto = req.body;

    const clientIp = requestIp.getClientIp(req);
    props.ip = clientIp

    return this.authService.autoLogin({ props, transaction });
  }

  /*************************************************
   * 인증코드 발송 
   * 
   * @param AuthCodeDto
   * @returns 인증코드 발송 여부
   ************************************************/
  @Post('auth-code')
  @ApiOperation({
    summary: '인증코드 발송 API',
    description: '관리 포탈 사용자 아이디/비밀번호 찾기 인증코드 발송',
  })
  @ApiBody({ type: AuthCodeDto })
  async createAuthCode( @TransactionParam() transaction: Transaction
                                        ,@Body() props : AuthCodeDto ){
    return this.authService.createAuthCode({ props , transaction });
  }
      
  /*************************************************
    * 인증코드 확인 
    * 
    * @param AuthCodeDto 
    * @returns 인증코드 발송 여부
    ************************************************/
  @Get('auth-code')
  @ApiOperation({
    summary: '인증코드 확인 API',
    description: '관리 포탈 사용자 아이디/비밀번호 찾기 인증코드 확인',
  })
  @ApiQuery({ type: AuthCodeDto })
  async getAuthCode( @Query() props 
                    ,@TransactionParam() transaction: Transaction ){
    return this.authService.getAuthCode({ props , transaction });
  }

  /*************************************************
   * 사용자 ID 조회 by 사용자 휴대폰 번호
   * 
   * @param {String} mobileNo 사용자 휴대폰 번호
   * @returns 사용자 휴대폰 번호와 일치하는 ID 반환 
   ************************************************/
  @Get('id/:mobileNo')
  @ApiOperation({
    summary: '사용자 ID 조회 by 사용자 휴대폰 번호 API',
    description: '공개 포탈 사용자 휴대폰 번호로 아이디 찾기',
  })
  @ApiParam({ name: 'mobileNo' })
  async getFindId( @Query() props
                  ,@Param('mobileNo') path: any
                  ,@TransactionParam() transaction: Transaction
  ) {
    props['mobileNo'] = path;
    return this.authService.getFindId({ props , transaction });
  }

  /*************************************************
  * 사용자 정보 조회 by 사용자 ID 
  * 
  * @param {String} memberId  사용자 아이디
  * @returns 사용자 ID와 일치하는 사용자 정보 반환
  ************************************************/
  @Get('member/:memberId')
  @ApiOperation({
    summary: '사용자 정보 조회 by 사용자 ID API',
    description: '공개 포탈 사용자 ID 검색 일치여부 반환'
  })
  @ApiParam({name: 'memberId'})
  async getFindSearchId( @Query() props 
                                        ,@Param('memberId') path: any
                                        ,@TransactionParam() transaction: Transaction

  ) {
    props['memberId'] = path;
    return this.authService.getFindSearchId({ props , transaction });
  }

  /*************************************************
  * 비밀번호 재설정
  * 
  * @param PwdChangeDto
  * @returns 비밀번호 재설정 성공여부
  ************************************************/
  @Put('password')
  @ApiOperation({
    summary: '비밀번호 재설정API',
    description: '관리포탈 비밀번호 재설정',
  })
  @ApiBody({ type: PwdChangeDto })
  async updatePw( @Body() props : PwdChangeDto
                  ,@TransactionParam() transaction: Transaction
  ) {
    return this.authService.updatePw({ props, transaction });
  }
  

}
