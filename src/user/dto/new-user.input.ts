import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class NewUserInput {
  @Field()
  @MinLength(10)
  employeeNumber: string;

  @Field()
  @MaxLength(30)
  username: string;

  @Field()
  @Length(8, 255)
  password: string;

  @Field()
  @Length(8, 255)
  confirmPassword: string;

  @Field()
  @Length(5, 100)
  firstName: string;

  @Field()
  @Length(5, 100)
  middleName: string;

  @Field()
  @Length(5, 100)
  lastName: string;

  @Field({ nullable: true })
  @IsOptional()
  suffix: string;

  @Field()
  @IsEmail()
  emailAddress: string;
}
