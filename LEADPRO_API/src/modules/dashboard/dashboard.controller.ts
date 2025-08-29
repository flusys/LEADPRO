// src/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { IDashboard, IUserCashSummary } from './dashboard.interface';
import { JwtAuthGuard } from '@flusys/flusysnest/core/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ILoggedUserInfo } from '@flusys/flusysnest/shared/interfaces';
import { User } from '@flusys/flusysnest/shared/decorators';

@Controller('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get()
  async getDashboard(
    @User() user: ILoggedUserInfo
  ): Promise<IDashboard> {
    return this.dashboardService.getDashboardData(user);
  }
  
  @Get('user-summary')
  async getUserWiseCash(
  ): Promise<IUserCashSummary[]> {
    return this.dashboardService.getUserWiseCash();
  }
}
