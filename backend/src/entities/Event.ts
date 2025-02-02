import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Location } from "./Location";
import { EventRegistration } from "./EventRegistration";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column("text")
  description: string;

  @Column({ type: "date" })
  date: string;

  @Column({ length: 50 })
  category: string;

  @ManyToOne(() => Location, (location) => location.id, { onDelete: "CASCADE" })
  location_id: Location;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  created_by: User;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

}
