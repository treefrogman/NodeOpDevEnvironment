class DragManager {
	constructor() {
		this.dragEpisodes = [];
		this.dropTargets = {};
		const thisDragManager = this;
		function moveHandler(event) {
			const dropTarget = thisDragManager.dropTargets[event.target.address];
			thisDragManager.dragEpisodes.forEach((episode) => {
				if (episode.active) {
					episode.target = dropTarget;
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
	registerDropTarget(targetElement, properties) {
		targetElement.address = properties.targetAddress;
		this.dropTargets[properties.targetAddress] = properties;
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
		this.clientPosition = [event.clientX, event.clientY];
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
		this.active = false;
		const thisDragEpisode = this;
		this.dropCallbacks.forEach((callback) => {
			callback(thisDragEpisode);
		});
	}
}

export default DragManager
