import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSubscriptionDto } from './dto/update-subscription-dto';
import * as bcrypt from 'bcrypt';

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
  async updateSubscription(userId: number, updateSubscriptionDto: UpdateSubscriptionDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.typeAbonnement = updateSubscriptionDto.typeAbonnement;
    return this.userRepository.save(user);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.password) user.password = await bcrypt.hash(updateUserDto.password, 10);

    return this.userRepository.save(user);
  }
  async updateAvatar(userId: number, avatarUrl: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.avatar = avatarUrl;
    return this.userRepository.save(user);
  }

  async getAvatar(userId: number): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user.avatar || null;
  }

}
