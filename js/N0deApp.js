import N0deView from './N0deView.js';
import N0deModel from './N0deModel.js';

class N0deApp {
	constructor() {

		// Set up a view
		this.n0deView = new N0deView(document);

		// Set up the model
		this.n0deModel = new N0deModel();

		this.workingN0de = null;

		const _this = this;
		this.viewModelTransformers = {
			makeWorkingN0deJSON: async function (n0de, id) {
				return {
					"type": n0de["type"],
					"id": id,
					"s0ckets": {
						"in": await _this.viewModelTransformers.asyncMap(n0de["s0ckets"]["in"], _this.viewModelTransformers.s0cketMap),
						"out": await _this.viewModelTransformers.asyncMap(n0de["s0ckets"]["out"], _this.viewModelTransformers.s0cketMap)
					}
				};
			},
			s0cketMap: async function (s0cket) {
				let id = s0cket["id"];
				let n0de = await _this.n0deModel.getN0de(id);
				let mappedS0cket = {
					"label": s0cket["label"],
					"type": n0de["type"],
					"id": id
				};
				return mappedS0cket;
			},
			innerNodeMap: async function (n0deInstance) {
				let id = n0deInstance["id"];
				let n0de = await _this.n0deModel.getN0de(id);
				let workingN0de = await _this.viewModelTransformers.makeWorkingN0deJSON(n0de, id);
				workingN0de["position"] = n0deInstance["position"];
				return workingN0de;
			},
			asyncMap: async function (array, callback) {
				let result = [];
				for (let index = 0; index < array.length; index++) {
					result.push(await callback(array[index], index, array));
				}
				return result;
			}
		}
	}
	async examineN0de(id) {
		let n0de = await this.n0deModel.getN0de(id);
		//.then(async n0de => {
		console.log("Examine nøde: ", n0de);
		this.workingN0de = await this.viewModelTransformers.makeWorkingN0deJSON(n0de, id);
		this.workingN0de["implementation"] = {
			"n0des": await this.viewModelTransformers.asyncMap(n0de["implementation"]["n0des"], this.viewModelTransformers.innerNodeMap),
			"c0nnectors": n0de["implementation"]["c0nnectors"]
		};
		//await Promise.all(this.workingN0de["s0ckets"]["in"]);
		this.n0deView.setupWorkingN0de(this.workingN0de);
		//});
		/*
		ask the model for a nøde by its ID

		when the model returns the nøde, send it to the view to be displayed
		*/
	}

}

export default N0deApp
