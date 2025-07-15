// 생성: backend/src/resource/resource.controller.ts

import { Controller, Get } from '@nestjs/common';
import { ResourceService } from './resource.service';

@Controller('resource')
export class ResourceController {
    constructor(private readonly resourceService: ResourceService) {}

    @Get('history')
    async getHistory() {
        return this.resourceService.getResourceHistory();
    }
}