import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService,
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.microservice.pingCheck('redis', {
        transport: Transport.REDIS,
        options: {
          host: this.configService.get<string>('REDIS_HOST'),
          port: this.configService.get<number>('REDIS_PORT'),
        },
      }),
    ]);
  }
}
