class N0deView {
	constructor( bodyTag ) {
		this.bodyTag = bodyTag;
		this.bodyTag.innerHTML = "Nøde is under construction!"

	}
	loadFromFile(jsonFile) {
		fetch(jsonFile)
			.then(response => response.json())
			.then(json => console.log(json))
	}
}

export default N0deView
