import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Gallery, User, Identity } from '@flusys/flusysnest/persistence/entities'

@Entity('user_personal_info')
export class UserPersonalInfo extends Identity {

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'father_name', nullable: true })
    fatherName: string;

    @Column({ name: 'mother_name', nullable: true })
    motherName: string;

    @Column({ name: 'marital_status', nullable: true })
    maritalStatus: 'Single' | 'Married' | 'Divorced';

    @Column({ name: 'present_address', nullable: true, type: 'text' })
    presentAddress: string;

    @Column({ name: 'permanent_address', nullable: true, type: 'text' })
    permanentAddress: string;

    @Column({ name: 'profession', nullable: true })
    profession: string;

    @Column({ name: 'nominee_name', nullable: true })
    nomineeName: string;

    @Column({ name: 'relation_with_nominee', nullable: true })
    relationWithNominee: string;

    @ManyToOne(() => Gallery, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'nid_photo_id' })
    nidPhoto: Gallery | null;

    @ManyToOne(() => Gallery, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'nominee_nid_photo_id' })
    nomineeNidPhoto: Gallery | null;

    @Column({ type: 'text', nullable: true })
    comments: string;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'refer_user_id' })
    referUser: User;

}
