import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { NewUserInput } from 'src/user/dto/new-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { LoginUserInput } from './dto/login-user.input';
import { LoginResponse } from './dto/login-response';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ): Promise<LoginResponse> {
    // console.log(context);
    const user = await this.authService.login(context.user);
    return user;
  }

  @Mutation(() => User)
  async register(
    @Args('newUserData') newUserData: NewUserInput,
  ): Promise<User> {
    const newUser = await this.authService.register(newUserData);
    return newUser;
  }
}
