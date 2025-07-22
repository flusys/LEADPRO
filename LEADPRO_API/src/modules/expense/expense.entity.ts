import {
    Entity,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ExpenseType } from './expense-type.enum';
import { Identity, User } from '@flusys/flusysnest/persistence/entities';


@Entity()
export class Expense extends Identity {
    @Column({ type: 'varchar', length: 200 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: ExpenseType,
        default: ExpenseType.VARIABLE,
    })
    type: ExpenseType;

    @CreateDateColumn({ name: 'date' })
    date: Date;

    @ManyToOne(() => User, { nullable: false, eager: true })
    @JoinColumn({ name: 'recorded_by' })
    recordedBy: User;
}
