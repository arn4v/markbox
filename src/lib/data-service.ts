import { PrismaClient } from "@prisma/client";

export default class DataService {
	private _instance: DataService;
	private static prisma = new PrismaClient();

	private constructor() {}

	public getInstance() {
		if (!this._instance) this._instance = new DataService();
		return this._instance;
	}
}
