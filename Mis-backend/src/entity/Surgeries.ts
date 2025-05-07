import { Entity, Column,  Index, ObjectIdColumn } from "typeorm";
import { ObjectId } from "mongodb";

@Entity("surgeries")
@Index(["procedureType", "duration"], { unique: false })
export class Surgery {
	@ObjectIdColumn()
	_id: ObjectId;

	@Column({ type: "string" })
	procedureType: string;

	@Column({ type: "int" })
	duration: number;

	@Column({ type: "timestamp" })
	date: Date;

	@Column({ type: "boolean" })
	complications: boolean;

	@Column({ type: "string" })
	patientId: ObjectId;

	@Column({ type: "string" })
	surgeonId: ObjectId;
}
