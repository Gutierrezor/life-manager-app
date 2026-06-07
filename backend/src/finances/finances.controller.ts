import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { CreateFinanceCategoryDto } from './dto/create-finance-category.dto';
import { CreateFinanceTransactionDto } from './dto/create-finance-transaction.dto';

@Controller('finances')
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Post('categories')
  createCategory(@Body() createFinanceCategoryDto: CreateFinanceCategoryDto) {
    return this.financesService.createCategory(createFinanceCategoryDto);
  }

  @Get('categories')
  findAllCategories() {
    return this.financesService.findAllCategories();
  }

  @Post('transactions')
  createTransaction(
    @Body() createFinanceTransactionDto: CreateFinanceTransactionDto,
  ) {
    return this.financesService.createTransaction(createFinanceTransactionDto);
  }

  @Get('transactions')
  findAllTransactions() {
    return this.financesService.findAllTransactions();
  }

  @Get('transactions/:id')
  findOneTransaction(@Param('id') id: string) {
    return this.financesService.findOneTransaction(+id);
  }

  @Delete('transactions/:id')
  removeTransaction(@Param('id') id: string) {
    return this.financesService.removeTransaction(+id);
  }

  @Get('summary')
  getSummary() {
    return this.financesService.getSummary();
  }
}
