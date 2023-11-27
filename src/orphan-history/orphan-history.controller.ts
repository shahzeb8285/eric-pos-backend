import { Controller, Get, Post, Body, Request, Patch, Param, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { OrphanHistoryService } from './orphan-history.service';
import { CreateOrphanHistoryDto } from './dto/create-orphan-history.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('orphan')
@ApiTags('orphan')
export class OrphanHistoryController {
  constructor(private readonly orphanHistoryService: OrphanHistoryService) { }

  @Post('mapOrphan')
  mapOrphan(@Request() req, @Body() createOrphanHistoryDto: CreateOrphanHistoryDto) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.orphanHistoryService.create(createOrphanHistoryDto);
  }

  @Get('getOrphanHistory')
  findAll(@Request() req,) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.orphanHistoryService.findAll();
  }
}
