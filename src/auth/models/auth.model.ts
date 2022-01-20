import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthModel {
  @Field()
  id: number;

  @Field()
  username: string;

  @Field()
  firstName: string;

  @Field()
  middleName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  suffix: string;

  @Field()
  emailAddress: string;

  @Field()
  mobileNumber: string;

  @Field()
  token: string;
}
