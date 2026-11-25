import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './ticket.interface.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

@Injectable()
export class TicketsService {
    private readonly tickets: Ticket[] = [
        {
            id: 1,
            title: 'Sample Ticket',
            description: 'This is a sample ticket',
            status: 'open',
            priority: 'high',
            createdAt: '2026-11-25T10:00:00Z'
        },
        {
            id: 2,
            title: 'Payment Issue',
            description: 'Customer is facing issues with payment processing.',
            status: 'open',
            priority: 'medium',
            createdAt: '2026-11-25T10:30:00Z'
        },
        {
            id: 3,
            title: 'Invoice download problem',
            description: 'Customer is unable to download the invoice from the portal.',
            status: 'closed',
            priority: 'low',
            createdAt: '2026-11-25T11:00:00Z'
        }
    ]
    private nextId = 4;

    findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
        let tickets = this.tickets;
        if (status) {
            tickets = tickets.filter(ticket => ticket.status === status);
        }
        if (priority) {
            tickets = tickets.filter(ticket => ticket.priority === priority);
        }
        return tickets;
    }
    findOne(id: number) {

        const ticket = this.tickets.find(ticket => ticket.id === id);
        if (!ticket) {
            throw new NotFoundException(`Ticket with id ${id} not found`);
        }
        return ticket;
    }

    create(createTickDto: CreateTicketDto) {
        const newTicket: Ticket = {
            id: this.nextId++,
            title: createTickDto.title,
            description: createTickDto.description,
            status: 'open',
            priority: createTickDto.priority,
            createdAt: new Date().toISOString()
        };
        this.tickets.push(newTicket);
        return newTicket;
    }

    update(id: number, updateTicketDto: UpdateTicketDto) {
        const ticket = this.findOne(id);

        if (ticket.status === 'closed') {
            throw new BadRequestException(`Cannot update a closed ticket with id ${id}`);
        }

        Object.assign(ticket, updateTicketDto);
        return ticket;
    }

    closeTicket(id: number) {
        const ticket = this.findOne(id);
        if (ticket.status === 'closed') {
            throw new BadRequestException(`Ticket with id ${id} is already closed`);
        }
        ticket.status = 'closed';

        return ticket;
    }
}
