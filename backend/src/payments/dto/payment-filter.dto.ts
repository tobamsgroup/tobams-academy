import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsIn,
  IsEnum,
  Max,
  Min,
  IsInt,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum PaymentStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export class PaymentFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  courseName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['LAST_7_DAYS', 'LAST_30_DAYS', 'LAST_60_DAYS', 'LAST_90_DAYS'])
  range?: 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'LAST_60_DAYS' | 'LAST_90_DAYS';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 12;
}
