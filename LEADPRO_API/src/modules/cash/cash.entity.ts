import { Identity, User } from '@flusys/flusysnest/persistence/entities';
import { Entity, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { CashTransactionType } from './cash-transaction-type.enum';


@Entity()
export class Cash extends Identity {
    @ManyToOne(() => User, { nullable: false, eager: true })
    @JoinColumn({ name: 'cash_by' })
    cashBy: User;

    @CreateDateColumn({ name: 'date' })
    date: Date;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: CashTransactionType,
    })
    type: CashTransactionType;

    @Column({ type: 'text', nullable: true })
    note: string | null;
}