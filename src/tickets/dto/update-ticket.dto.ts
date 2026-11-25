import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class UpdateTicketDto {
    @ApiPropertyOptional({ example: 'Updated ticket title', description: 'Updated summary of the ticket' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @ApiPropertyOptional({ example: 'Updated description details.', description: 'Updated description of the issue' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @ApiPropertyOptional({ enum: ['low', 'medium', 'high'], example: 'medium', description: 'Updated ticket priority' })
    @IsOptional()
    @IsIn(['low', 'medium', 'high'])
    priority?: 'low' | 'medium' | 'high';
}
