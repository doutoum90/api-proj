import { Injectable } from '@nestjs/common';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Setting } from './entities/setting.entity';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CreateContactDto } from './dto/create-contact.dto';
@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}


  getAllSettings() {
    return this.settingRepository.find();
  }

  updateSettings(updateSettingDto: UpdateSettingDto) {
    return this.settingRepository.update(updateSettingDto.id|| '', updateSettingDto);
  }

  contact(updateContactDto: CreateContactDto) {
    return this.contactRepository.save(updateContactDto);
  }
}
