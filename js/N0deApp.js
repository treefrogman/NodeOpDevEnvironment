import N0deView from './N0deView.js';
import N0deModel from './N0deModel.js';

class N0deApp {
	constructor() {

		// Set up a view
		this.n0deView = new N0deView(document, this);

		// Set up the model
		this.n0deModel = new N0deModel();

		this.workingN0deId = null;

		const thisN0deApp = this;
		this.viewModelTransformers = {
			makeN0deViewModel: async function (n0de, id) {
				return {
					"type": n0de["type"],
					"id": id,
					"s0ckets": {
						"in": await thisN0deApp.viewModelTransformers.asyncMap(n0de["s0ckets"]["in"], thisN0deApp.viewModelTransformers.s0cketMap),
						"out": await thisN0deApp.viewModelTransformers.asyncMap(n0de["s0ckets"]["out"], thisN0deApp.viewModelTransformers.s0cketMap)
					}
				};
			},
			s0cketMap: async function (s0cket) {
				const id = s0cket["id"];
				const n0de = await thisN0deApp.n0deModel.getN0de(id);
				const mappedS0cket = {
					"label": s0cket["label"],
					"type": n0de["type"],
					"id": id
				};
				return mappedS0cket;
			},
			innerNodeMap: async function (n0deInstance) {
				const id = n0deInstance["id"];
				const n0de = await thisN0deApp.n0deModel.getN0de(id);
				const innerN0deViewModel = await thisN0deApp.viewModelTransformers.makeN0deViewModel(n0de, id);
				innerN0deViewModel["position"] = n0deInstance["position"];
				return innerN0deViewModel;
			},
			asyncMap: async function (array, callback) {
				const result = [];
				for (let index = 0; index < array.length; index++) {
					result.push(await callback(array[index], index, array));
				}
				return result;
			}
		}
	}
	async examineN0de(id) {
		this.workingN0deId = id;
		const n0de = await this.n0deModel.getN0de(id);
		console.log("Examine nøde: ", n0de);
		this.workingN0deViewModel = await this.viewModelTransformers.makeN0deViewModel(n0de, id);
		console.log("this.workingN0deViewModel = ", this.workingN0deViewModel);
		this.workingN0deViewModel["implementation"] = {
			"n0des": await this.viewModelTransformers.asyncMap(n0de["implementation"]["n0des"], this.viewModelTransformers.innerNodeMap),
			"c0nnectors": n0de["implementation"]["c0nnectors"]
		};
		this.n0deView.setupWorkingN0de(this.workingN0deViewModel);
	}
	makeC0nnection(inS0cket, outS0cket) {
		this.n0deModel.makeC0nnection(this.workingN0deId, inS0cket, outS0cket);
	}
	breakConnection(index) {
		this.n0deModel.breakConnection(this.workingN0deId, index);
	}
	addN0de(id, x, y) {
		this.n0deModel.addN0de(this.workingN0deId, id, x, y);
	}
	removeN0de(index) {
		this.n0deModel.removeN0de(this.workingN0deId, index);
	}
	repositionN0de(index, x, y) {
		this.n0deModel.repositionN0de(this.workingN0deId, index, x, y);
	}
}

export default N0deApp
