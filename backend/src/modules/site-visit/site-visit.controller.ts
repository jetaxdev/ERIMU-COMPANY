import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import { CreateSiteVisitDto } from './dto/create-site-visit.dto';
import { SiteVisitService } from './site-visit.service';

@ApiTags('site-visits')
@Controller('site-visits')
export class SiteVisitController {
  constructor(private readonly siteVisitService: SiteVisitService) {}

  @AdminOnly()
  @Get()
  findAll() {
    return this.siteVisitService.findAll();
  }

  @Post()
  create(@Body() dto: CreateSiteVisitDto) {
    return this.siteVisitService.create(dto);
  }
}
