import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }
  async createUser(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async setResetToken(id: number, token: string) {
    return await this.userRepository.update(id, { resetPasswordToken: token });
  }
  async updatePassword(id: number, password: string) {
    return await this.userRepository.update(id, { password });
  }
  async getProfile(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

}
