class DragManager {
	constructor() {
		this.dragEpisodes = [];
		const thisDragManager = this;
		function moveHandler(event) {
			thisDragManager.dragEpisodes.forEach((episode) => {
				if (episode.active) {
					episode.triggerMoveEvent(event);
				}
			});
		}
		window.addEventListener("mousemove", moveHandler);
		function endDrag(event) {
			thisDragManager.dragEpisodes.forEach((episode) => {
				if (episode.active) {
					episode.triggerDropEvent(event);
				}
			});
		}
		window.addEventListener("contextmenu", endDrag);
		window.addEventListener("mouseup", endDrag);
	}
	initiateDragEpisode(event) {
		const newDragEpisode = new DragEpisode(event);
		this.dragEpisodes.push(newDragEpisode);
		return newDragEpisode;
	}

}

class DragEpisode {
	constructor(event) {
		this.initiatingEvent = event;
		this.moveCallbacks = [];
		this.dropCallbacks = [];
		this.active = true;
		console.log(this);
	}

	addMoveCallback(callback) {
		this.moveCallbacks.push(callback);
		return this;
	}

	triggerMoveEvent(event) {
		this.delta = [event.clientX - this.initiatingEvent.clientX, event.clientY - this.initiatingEvent.clientY];
		const thisDragEpisode = this;
		this.moveCallbacks.forEach((callback) => {
			callback(thisDragEpisode);
		});
	}

	addDropCallback(callback) {
		this.dropCallbacks.push(callback);
		return this;
	}

	triggerDropEvent(event) {
		this.delta = [event.clientX - this.initiatingEvent.clientX, event.clientY - this.initiatingEvent.clientY];
		this.active = false;
		const thisDragEpisode = this;
		this.dropCallbacks.forEach((callback) => {
			callback(thisDragEpisode);
		});
	}
}

export default DragManager
