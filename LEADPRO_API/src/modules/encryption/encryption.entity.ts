import { Identity, User } from '@flusys/flusysnest/persistence/entities';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class EncryptionKey extends Identity {
  @ManyToOne(() => User, { nullable: false, eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: true })
  publicKey: string | null;
}

@Entity()
export class EncryptionData extends Identity {
  @ManyToOne(() => EncryptionKey, { nullable: false, eager: true })
  @JoinColumn({ name: 'key_id' })
  key: EncryptionKey;

  @Column({ type: 'text', nullable: true })
  storedEncryptionData: string;

  @Column({ type: 'text', nullable: true })
  storedIV: string;

  @Column({ type: 'text', nullable: true })
  storedEncryptionAESKey: string;
}
