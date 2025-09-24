// src/dashboard/dashboard.controller.ts
import { CurrentUser } from '@flusys/flusysnest/shared/decorators';
import { JwtAuthGuard } from '@flusys/flusysnest/shared/guards';
import { ILoggedUserInfo } from '@flusys/flusysnest/shared/interfaces';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IDashboard, IUserCashSummary } from './dashboard.interface';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(
    @CurrentUser() user: ILoggedUserInfo,
  ): Promise<IDashboard> {
    return this.dashboardService.getDashboardData(user);
  }

  @Get('user-summary')
  async getUserWiseCash(): Promise<IUserCashSummary[]> {
    return this.dashboardService.getUserWiseCash();
  }
}
