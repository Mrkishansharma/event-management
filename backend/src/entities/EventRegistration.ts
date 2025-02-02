import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Event } from "./Event";

@Entity("event_registrations")
export class EventRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;  // Store the user's id as a reference

  @Column()
  event_id: number; // Store the event's id as a reference

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  registration_date: Date;

  @Column({
    type: "enum",
    enum: ["registered", "cancelled"],
    default: "registered",
  })
  status: "registered" | "cancelled";

  // Relations (for TypeORM to join the tables when needed)
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Event, (event) => event.id)
  @JoinColumn({ name: "event_id" })
  event: Event;
}
