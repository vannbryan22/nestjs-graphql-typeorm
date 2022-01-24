import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { isEmpty } from 'lodash';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,
  ) {}

  findAll() {
    return `This action returns all user`;
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    if (isEmpty(user)) {
      throw new ApolloError('User not found', 'NOT_FOUND');
    }

    return user;
  }

  async findOneWithPassword(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      select: ['username', 'password'],
    });

    return user;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
