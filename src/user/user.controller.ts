// user.controller.ts
import { Controller, Get, Put, Delete, UseGuards, Req, Body, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription-dto';

@Controller('api/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Put('update')
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }

  @Delete('delete')
  async deleteUser(@Req() req) {
    return this.userService.deleteUser(req.user.id);
  }
  @Get('trial-status')
  async getTrialStatus(@Req() req): Promise<{ isActive: boolean; daysLeft: number }> {
    const user = await this.userService.findByEmail(req.user.email);
    const now = new Date();
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    const trialEndDate = new Date(user.trialStartDate?.toISOString() || now.toISOString());
    trialEndDate.setDate(trialEndDate.getDate() + 14);

    const isActive = user.trialActive && now <= trialEndDate;
    const daysLeft = isActive ? Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return { isActive, daysLeft };
  }

  @Put('subscription')
  async updateSubscription(@Req() req, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.userService.updateSubscription(req.user.sub, updateSubscriptionDto);
  }
}