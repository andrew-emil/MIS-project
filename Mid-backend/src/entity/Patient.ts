import { Entity, Column, Index, ObjectIdColumn } from "typeorm";
import { ObjectId } from "mongodb";
import { Address } from "./Address";

@Entity("patinets")
export class Patient {
	@ObjectIdColumn()
	_id: ObjectId;
	
	@Column({ type: "string" })
	@Index()
	name: string;

	@Column({ type: "int" })
	age: number;

	@Column({ unique: true, type: "string" }) // Unique index
	email: string;

	@Column("simple-array")
	comorbidities: string[];

	@Column(() => Address)
	address: Address;
}
