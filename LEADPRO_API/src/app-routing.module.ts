import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AUTH_ROUTES, ACCESS_ROUTES } from '@flusys/flusysnest/pages';

const ROUTES = [...AUTH_ROUTES, ...ACCESS_ROUTES];

@Module({
  imports: [RouterModule.register(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
