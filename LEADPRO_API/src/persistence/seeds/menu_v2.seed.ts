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
    name: 'Password',
    routerLink: '/password',
    icon: 'pi pi-key',
    serial: 18,
    parent: null,
  },
].map((menu) => ({
  ...menu,
  readOnly: false,
  isActive: true,
  groups: ['encryption'],
  createdBy: developerId,
})) as unknown as Array<IMenu>;

const app = {
  isActive: true,
  id: menuIds[2],
  iconType: IconTypeEnum.IMAGE_FILE_LINK,
  icon: 'https://cdn-icons-png.flaticon.com/512/2092/2092692.png',
  name: 'Encryption',
  slug: 'encryption',
} as unknown as IApp;

export async function seedMenuV2Data(dataSource: DataSource): Promise<void> {
  const menuRepository = dataSource.getRepository(Menu);
  const appRepository = dataSource.getRepository(App);
  await menuRepository.save(menus as any);
  await appRepository.save(app as any);
}
