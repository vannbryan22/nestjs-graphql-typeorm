import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class LoginResponse extends PartialType(User) {
  @Field()
  accessToken: string;
}
