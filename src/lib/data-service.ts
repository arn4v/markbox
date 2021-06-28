export default class DataService {
	private _instance: DataService;

	private constructor() {}

	public getInstance() {
		if (!this._instance) this._instance = new DataService();
		return this._instance;
	}
}
