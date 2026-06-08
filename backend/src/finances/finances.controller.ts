import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { FinancesService } from './finances.service';
import { CreateFinanceCategoryDto } from './dto/create-finance-category.dto';
import { CreateFinanceTransactionDto } from './dto/create-finance-transaction.dto';

@Controller('finances')
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Post('categories')
  createCategory(@Body() createFinanceCategoryDto: CreateFinanceCategoryDto, @Req() request: AuthenticatedRequest) {
    return this.financesService.createCategory(createFinanceCategoryDto, request.user.id);
  }

  @Get('categories')
  findAllCategories(@Req() request: AuthenticatedRequest) {
    return this.financesService.findAllCategories(request.user.id);
  }

  @Post('transactions')
  createTransaction(
    @Body() createFinanceTransactionDto: CreateFinanceTransactionDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.financesService.createTransaction(createFinanceTransactionDto, request.user.id);
  }

  @Get('transactions')
  findAllTransactions(@Req() request: AuthenticatedRequest) {
    return this.financesService.findAllTransactions(request.user.id);
  }

  @Get('transactions/:id')
  findOneTransaction(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.financesService.findOneTransaction(+id, request.user.id);
  }

  @Delete('transactions/:id')
  removeTransaction(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.financesService.removeTransaction(+id, request.user.id);
  }

  @Get('summary')
  getSummary(@Req() request: AuthenticatedRequest) {
    return this.financesService.getSummary(request.user.id);
  }
}
