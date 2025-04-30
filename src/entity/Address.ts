import { Column } from "typeorm";

export class Address {
	@Column({ type: "string" })
	street: string;

	@Column({ type: "string" })
	city: string;
}
