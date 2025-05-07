import { Column } from "typeorm";

export class ResourceMetadata {
	@Column({ type: "number" })
	operatingRooms: number;

	@Column({ type: "number" })
	avgUtilization: number;
}
