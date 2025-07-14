import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AUTH_ROUTES, COMPANY_ROUTES, GALLERY_ROUTES, SETTINGS_ROUTES } from '@flusys/flusysnest/pages';

const ROUTES = [...AUTH_ROUTES,...SETTINGS_ROUTES, ...COMPANY_ROUTES,...GALLERY_ROUTES];

@Module({
  imports: [RouterModule.register(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule { }