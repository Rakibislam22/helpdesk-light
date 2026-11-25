import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketsService {
    private tickets = [];

    findAll() {
        return this.tickets;
    }
}
