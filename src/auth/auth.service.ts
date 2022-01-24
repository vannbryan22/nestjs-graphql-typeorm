import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { isEmpty } from 'lodash';
import { LoginResponse } from './dto/login-response';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from 'src/common.service';
import { NewUserInput } from 'src/user/dto/new-user.input';
import { AuthValidator } from './auth.validator';
import { ApolloError } from 'apollo-server-express';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService extends CommonService {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,
    private jwtService: JwtService,
    private authValidator: AuthValidator,
    private userService: UserService,
  ) {
    super();
  }

  async register(data: NewUserInput): Promise<User> {
    if (!isEmpty(await this.authValidator.registerValidate(data))) {
      throw new ApolloError(
        JSON.stringify(await this.authValidator.registerValidate(data)),
        'BAD_USER_INPUT',
      );
    }

    const { password } = data;

    try {
      const salt = await bcrypt.genSalt(5);
      const hashedPassword = await bcrypt.hash(password, salt);

      const createArgs: DeepPartial<User> = {
        ...data,
        password: hashedPassword,
      };

      const newUser = await this.userRepository.save(createArgs);

      if (newUser) {
        const toReturn: User = {
          ...newUser,
          firstName: await this.toTitleCase(newUser.firstName),
          lastName: await this.toTitleCase(newUser.lastName),
        };
        return toReturn;
      }
    } catch (error) {
      throw new ApolloError(JSON.stringify(error), 'INTERNAL_SERVER_ERROR');
    }
  }

  async login(user: User): Promise<LoginResponse> {
    return {
      ...user,
      accessToken: this.jwtService.sign({
        email: user.username,
        id: user.id,
      }),
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const errors: any = {};

    if (!isEmpty(username) && !isEmpty(password)) {
      if (!username) {
        errors.email = 'Required';
      }

      if (!password) {
        errors.password = 'Required';
      }

      if (password && password.length < 8) {
        errors.password = 'Password must at least 8 characters';
      }
    }

    const userFoundWithPassword = await this.userService.findOneWithPassword(
      username,
    );

    if (isEmpty(userFoundWithPassword)) {
      errors.username = 'User not found';
      throw new ApolloError(JSON.stringify(errors), 'BAD_USER_INPUT');
    }

    const isMatch = await bcrypt.compare(
      password,
      userFoundWithPassword?.password,
    );

    if (userFoundWithPassword && isMatch) {
      const userFound = await this.userService.findOne(username);
      return userFound;
    } else {
      errors.password = 'Wrong password';
      throw new ApolloError(JSON.stringify(errors), 'BAD_USER_INPUT');
    }
  }
}
