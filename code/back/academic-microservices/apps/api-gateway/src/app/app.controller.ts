import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

import { RabbitMQService } from '@org/rabbitmq';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    private readonly rabbitmqService: RabbitMQService,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('publish')
  async publishMessage() {
    await this.rabbitmqService.publish(
      'student.created',
      {
        id: '1',
        name: 'Matheus',
        email: 'matheus@gmail.com',
        createdAt: new Date(),
      },
    );

    return {
      message: 'Event published successfully',
    };
  }
}