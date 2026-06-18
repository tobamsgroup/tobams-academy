import {
  Controller,
  Post,
  Body,
  Request,
  Delete,
  Param,
  Query,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentFilterDto } from './dto/payment-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'payments', version: '1' })
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post()
  create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreatePaymentDto,
  ) {
    return this.service.create(req.user.id, dto);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.service.findOne(req.user.id, id);
  }

  @Get()
  findAll(
    @Request() req: { user: { id: string } },
    @Query() query: PaymentFilterDto,
  ) {
    return this.service.findAll(req.user.id, query);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  remove(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.service.remove(req.user.id, id);
  }
}
