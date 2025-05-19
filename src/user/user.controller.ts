import { Controller, Get, Put, Delete, UseGuards, Req, Body, NotFoundException, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express, Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
      };
    }
  }
}
@Controller('api/user')
@UseGuards(UserAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Put('avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const filename = `${req.user?.sub}-${Date.now()}.jpg`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/image\/(jpg|jpeg|png)/)) {
        return cb(new Error('Only images are allowed'), false);
      }
      cb(null, true);
    },
  }))
  async updateAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.sub;
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    return this.userService.updateAvatar(userId, avatarUrl);
  }


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


  @Put()
  @HttpCode(HttpStatus.OK)
  async updateSettings(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.sub;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUser(@Req() req) {
    const userId = req.user.sub;
    return await this.userService.findById(userId)
  }

  @Put('subscription')
  async updateSubscription(@Req() req, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.userService.updateSubscription(req.user.sub, updateSubscriptionDto);
  }
}