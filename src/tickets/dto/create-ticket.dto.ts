import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateTicketDto {
    @ApiProperty({ example: 'Login issue', description: 'Short summary of the ticket' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Customer cannot sign in to the portal.', description: 'Detailed description of the issue' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ enum: ['low', 'medium', 'high'], example: 'high', description: 'Ticket priority level' })
    @IsIn(['low', 'medium', 'high'])
    priority: 'low' | 'medium' | 'high';
}
