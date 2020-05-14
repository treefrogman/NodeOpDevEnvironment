class InnerN0de extends N0deViewComponent {
	constructor( view, title, x, y ) {
		this.view = view;
		this.title = title || "";
		this.x = x || 0;
		this.y = y || 0;
		this.svg = view.innerN0deSVG( title, x, y );
		this.view.addN0de( this.svg );
	}
}

export default class InnerN0de