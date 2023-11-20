import { Controller, Get, Post, Body,Request, Patch, Param, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { OrphanHistoryService } from './orphan-history.service';
import { CreateOrphanHistoryDto } from './dto/create-orphan-history.dto';
import { UpdateOrphanHistoryDto } from './dto/update-orphan-history.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('orphan-history')
@ApiTags("orphan-history")

export class OrphanHistoryController {
  constructor(private readonly orphanHistoryService: OrphanHistoryService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createOrphanHistoryDto: CreateOrphanHistoryDto) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.orphanHistoryService.create(createOrphanHistoryDto);
  }

  @UseGuards(AuthGuard)

  @Get()
  findAll(@Request() req,) {
    if (!req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.orphanHistoryService.findAll();
  }


}
