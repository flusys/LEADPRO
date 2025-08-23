import { developerId } from '@flusys/flusysnest/core/data';
import { IApp, IMenu } from '@flusys/flusysnest/modules/settings/interfaces';
import { App, Menu } from '@flusys/flusysnest/persistence/entities';
import { IconTypeEnum } from '@flusys/flusysnest/shared/enums';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';

const menuIds = Array.from({ length: 3 }, () => randomUUID());
const menus: Array<IMenu> = [
  {
    id: menuIds[0],
    name: 'FINANCE',
    routerLink: '/accounts/finance',
    icon: 'pi pi-wallet',
    serial: 15,
    parent: null,
  },
  {
    id: menuIds[1],
    name: 'Cash',
    routerLink: '/accounts/cash',
    icon: 'pi pi-chart-line',
    serial: 16,
    parent: { id: menuIds[0] },
  },
  {
    id: menuIds[2],
    name: 'Expense',
    routerLink: '/accounts/expense',
    icon: 'pi pi-directions-alt',
    serial: 17,
    parent: { id: menuIds[0] },
  },
].map((menu) => ({
  ...menu,
  readOnly: false,
  isActive: true,
  groups: ['accounts'],
  createdBy: developerId,
})) as unknown as Array<IMenu>;

const app = {
  isActive: true,
  id: menuIds[2],
  iconType: IconTypeEnum.IMAGE_FILE_LINK,
  icon: 'https://cdn-icons-png.flaticon.com/512/9503/9503519.png',
  name: 'Accounts',
  slug: 'accounts',
} as unknown as IApp;

export async function seedMenuV1Data(dataSource: DataSource): Promise<void> {
  const menuRepository = dataSource.getRepository(Menu);
  const appRepository = dataSource.getRepository(App);
  await menuRepository.save(menus as any);
  await appRepository.save(app as any);
}
