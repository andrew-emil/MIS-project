import { Entity, Column, ObjectIdColumn } from "typeorm";
import { ObjectId } from "mongodb";

@Entity("doctors")
export class Doctor {
	@ObjectIdColumn()
	_id: ObjectId;

	@Column({ type: "string" })
	name: string;

	@Column({ type: "int" })
	experienceYears: number;

	@Column({ type: "string" })
	specialty: string;

	@Column({ type: "string" })
	hospitalId: ObjectId;

	@Column({type: 'simple-array'})
	successRate: number[]
}
