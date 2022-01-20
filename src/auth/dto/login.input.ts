import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class NewAuthInput {
  @Field()
  @MaxLength(30)
  username: string;

  @Field()
  @MaxLength(50)
  password: string;
}
