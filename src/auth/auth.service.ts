import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.inteface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username } = await this.userRepository.signup(authCredentialsDto);
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!username) throw new UnauthorizedException('Invalid Credentials');

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }
}
