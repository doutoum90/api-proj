import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContentService } from './content.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CreateContactDto } from './dto/create-contact.dto';
@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) { }

  @Get('/api/settings')
  getSettings() {
    return this.contentService.getAllSettings();
  }
  @Post('/api/settings/update')
  updateSettings(@Body() updateSettingDto: UpdateSettingDto) {
    return this.contentService.updateSettings(updateSettingDto);
  }

  @Post('/api/support/contact')
  contact(@Body() createContactDto: CreateContactDto) {
    return this.contentService.contact(createContactDto);
  }
}
