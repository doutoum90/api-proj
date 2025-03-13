import { Controller, Get, Param } from '@nestjs/common';
import { FinancialService } from './financial.service';

@Controller('competitors/:id/financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) { }

  @Get()
  async getFinancialData(@Param('id') id: string) {
    return this.financialService.getFinancialData(id);

  }
}
