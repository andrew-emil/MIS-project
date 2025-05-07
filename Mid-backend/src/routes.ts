import { Request, Response, Router } from "express";
import { AppDataSource } from "./config/dataSource";
import { Patient } from "./entity/Patient";
import { Doctor } from "./entity/Doctor";
import { Hospital } from "./entity/Hospital";
import { Surgery } from "./entity/Surgeries";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";

const router = Router();

type CollectionType = "patients" | "doctors" | "hospitals" | "surgeries";

router.post("/:collection", async (req: Request, res: Response) => {
	try {
		const collection = req.params.collection as CollectionType;
		const data = req.body;

		const repo = getRepository(collection);
		if (collection === "doctors") {
			data.hospitalId = new ObjectId(data.hospitalId as string);
		} else if (collection === "surgeries") {
			data.surgeonId = new ObjectId(data.surgeonId as string);
			data.patientId = new ObjectId(data.patientId as string);
		}

		const result = await repo.insertOne(data);

		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

router.post("/many/:collection", async (req: Request, res: Response) => {
	try {
		const collection = req.params.collection as CollectionType;
		const data: any[] = req.body;

		const repo = getRepository(collection);

		data.map((doc) => {
			if (collection === "doctors") {
				doc.hospitalId = new ObjectId(doc.hospitalId as string);
			} else if (collection === "surgeries") {
				doc.surgeonId = new ObjectId(doc.surgeonId as string);
				doc.patientId = new ObjectId(doc.patientId as string);
			}
			return doc;
		});

		const result = await repo.insertMany(data);

		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

router.patch("/:collection", async (req: Request, res: Response) => {
	try {
		const collection = req.params.collection as CollectionType;
		const { filter, update, options } = req.body;

		const repo = getRepository(collection);
		const result = await repo.updateOne(filter, update, options);

		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.delete("/:collection", async (req: Request, res: Response) => {
	try {
		const collection = req.params.collection as CollectionType;
		const filter = req.body;

		const repo = getRepository(collection);
		const result = await repo.deleteOne(filter);

		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/query/:collection", async (req: Request, res: Response) => {
	try {
		const collection = req.params.collection as CollectionType;
		const query = req.body;

		const repo = getRepository(collection);
		const result = await repo.find(query);

		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/operations/updates", async (req: Request, res: Response) => {
	try {
		const { operations } = req.body;

		for (const op of operations) {
			const repo = getRepository(op.collection);
			await repo.updateOne(op.filter, op.update);
		}

		res.json({ message: "Batch updates completed" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/operations/aggregate", async (req: Request, res: Response) => {
	try {
		const { collection, pipeline } = req.body;
		const repo = getRepository(collection);

		const result = await repo.aggregate(pipeline).toArray();
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/calculate/array-sum", async (req: Request, res: Response) => {
	try {
		const { collection, arrayField, targetField } = req.body;
		const repo = getRepository(collection);

		await repo.updateMany({ [arrayField]: { $exists: true } }, [
			{ $set: { [targetField]: { $sum: `$${arrayField}` } } },
		]);

		res.json({
			message: `Sum of ${arrayField} calculated and stored in ${targetField}`,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

function getRepository(collection: CollectionType): MongoRepository<any> {
	switch (collection) {
		case "patients":
			return AppDataSource.getMongoRepository(Patient);
		case "doctors":
			return AppDataSource.getMongoRepository(Doctor);
		case "hospitals":
			return AppDataSource.getMongoRepository(Hospital);
		case "surgeries":
			return AppDataSource.getMongoRepository(Surgery);
		default:
			throw new Error("Invalid collection name");
	}
}

export default router;
