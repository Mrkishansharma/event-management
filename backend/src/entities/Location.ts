import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column("text")
  address: string;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 50 })
  state: string;

  @Column({ length: 50 })
  country: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
