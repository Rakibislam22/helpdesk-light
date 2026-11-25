import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from "class-validator";

export class FilterTicketQueryDto {
    @ApiPropertyOptional({ enum: ['open', 'closed'], description: 'Filter tickets by status' })
    @IsOptional()
    @IsIn(['open', 'closed'])
    status?: 'open' | 'closed';

    @ApiPropertyOptional({ enum: ['low', 'medium', 'high'], description: 'Filter tickets by priority' })
    @IsOptional()
    @IsIn(['low', 'medium', 'high'])
    priority?: 'low' | 'medium' | 'high';
}
