import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { FilterTicketQueryDto } from './dto/filter-ticket-query.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { StaffGuard } from './guards/staff.guard.js';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Get()
    @ApiOperation({ summary: 'List all tickets', description: 'Returns all tickets, optionally filtered by status and priority.' })
    @ApiOkResponse({ description: 'List of matching tickets wrapped in { success: true, data }.' })
    findAll(@Query() filter: FilterTicketQueryDto) {
        return this.ticketsService.findAll(filter.status, filter.priority);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a ticket by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Numeric ticket ID' })
    @ApiOkResponse({ description: 'Ticket found.' })
    @ApiNotFoundResponse({ description: 'Ticket not found.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ticketsService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new ticket' })
    @ApiCreatedResponse({ description: 'Ticket created.' })
    @ApiBadRequestResponse({ description: 'Validation failed.' })
    create(@Body() CreateTicketDto: CreateTicketDto) {
        return this.ticketsService.create(CreateTicketDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an open ticket' })
    @ApiParam({ name: 'id', type: Number, description: 'Numeric ticket ID' })
    @ApiOkResponse({ description: 'Ticket updated.' })
    @ApiBadRequestResponse({ description: 'Validation failed or ticket is already closed.' })
    @ApiNotFoundResponse({ description: 'Ticket not found.' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTicketDto: UpdateTicketDto) {
        return this.ticketsService.update(id, updateTicketDto);
    }

    @UseGuards(StaffGuard)
    @Patch(':id/close')
    @ApiSecurity('x-staff-key')
    @ApiOperation({ summary: 'Close an open ticket (staff only)' })
    @ApiParam({ name: 'id', type: Number, description: 'Numeric ticket ID' })
    @ApiOkResponse({ description: 'Ticket closed.' })
    @ApiBadRequestResponse({ description: 'Ticket is already closed.' })
    @ApiForbiddenResponse({ description: 'Invalid or missing x-staff-key header.' })
    @ApiNotFoundResponse({ description: 'Ticket not found.' })
    closeTicket(@Param('id', ParseIntPipe) id: number) {
        return this.ticketsService.closeTicket(id);
    }
}
