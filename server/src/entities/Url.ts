import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('urls')
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ name: 'short_code', type: 'varchar', length: 20 })
  shortCode!: string;

  @Column({ type: 'text' })
  originalUrl!: string;

  @Column({ type: 'int', default: 0 })
  clicks!: number;

  @Column({name: 'user_id', type:'varchar' , nullable: true})
  userId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

 @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt!: Date | null;

}