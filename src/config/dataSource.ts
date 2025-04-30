import { DataSource } from "typeorm";
import { Patient } from "../entity/Patient";
import { Doctor } from "../entity/Doctor";
import { Hospital } from "../entity/Hospital";
import { Surgery } from "../entity/Surgeries";

export const AppDataSource = new DataSource({
	type: "mongodb",
	host: "localhost",
	port: 27017,
	database: "hospital",
	entities: [Patient, Doctor, Hospital, Surgery],
	synchronize: true,
});
