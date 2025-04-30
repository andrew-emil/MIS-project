import { Entity, Column, ObjectIdColumn } from "typeorm";
import { ObjectId } from "mongodb";
import { ResourceMetadata } from "./ResourceMetadata";

@Entity("hospitals")
export class Hospital {
	@ObjectIdColumn()
	_id: ObjectId;

	@Column({ type: "string" })
	name: string;

	@Column({ type: "string" })
	location: string;

	@Column(() => ResourceMetadata)
	resourceMetadata: ResourceMetadata;
}
