import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string; // Nullable for OAuth later if needed, but required for now

    @Column({ nullable: true })
    fullName: string;

    @Column({ default: 'user' })
    role: string; // 'user' | 'admin'

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
