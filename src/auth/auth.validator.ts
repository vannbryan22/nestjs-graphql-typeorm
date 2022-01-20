import { isEmpty } from 'lodash';
import * as emailValidator from 'email-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { NewUserInput } from 'src/user/dto/new-user.input';

@Injectable()
export class AuthValidator {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async loginValidate(username: string, password: string) {
    const errors: any = {};

    if (!username) {
      errors.username = 'Required';
    }

    if (username && username.length < 8) {
      errors.username = 'Username must at least 8 characters';
    }

    if (!password) {
      errors.password = 'Required';
    }

    if (password && password.length < 8) {
      errors.password = 'Password must at least 8 characters';
    }

    return errors;
  }

  async registerValidate(data: NewUserInput) {
    const errors: any = {};

    if (!isEmpty(data)) {
      if (!data.employeeNumber) {
        errors.employeeNumber = 'Required';
      }

      const employeeNumberDuplicate = await this.userRepository.findOne({
        where: {
          employeeNumber: data.employeeNumber,
        },
      });

      if (employeeNumberDuplicate) {
        errors.employeeNumber = 'Duplicate of employee number';
      }

      if (!data.username) {
        errors.username = 'Required';
      }

      const usernameDuplicate = await this.userRepository.findOne({
        where: {
          username: data.username,
        },
      });

      if (usernameDuplicate) {
        errors.username = 'Duplicate of username';
      }

      if (data.username && data.username.length < 6) {
        errors.username = 'Atleast 6 characters';
      }

      if (!data.password) {
        errors.password = 'Required';
      }

      if (data.password && data.password.length < 8) {
        errors.password = 'At least 8 characters';
      }

      if (!data.confirmPassword) {
        errors.confirmPassword = 'Required';
      }

      if (data.password !== data.confirmPassword) {
        errors.password = "Password didn't matched";
      }

      if (!data.firstName) {
        errors.firstname = 'Required';
      }

      if (!data.middleName) {
        errors.lastname = 'Required';
      }

      if (!data.lastName) {
        errors.lastname = 'Required';
      }

      if (!data.emailAddress) {
        errors.emailAddress = 'Required';
      }

      const emailAddressDuplicate = await this.userRepository.findOne({
        where: {
          emailAddress: data.emailAddress,
        },
      });

      if (emailAddressDuplicate) {
        errors.emailAddress = 'Duplicate of email address';
      }

      if (data.emailAddress && !emailValidator.validate(data.emailAddress)) {
        errors.emailAddress = 'Invalid Format';
      }
    }

    return errors;
  }
}
