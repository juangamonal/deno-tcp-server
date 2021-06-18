export enum Event {
	close = "close",
	connection = "connection",
	error = "error",
	listen = "listen",
	message = "message",
	shutdown = "shutdown"
}

type EventCallback = (data?: Object) => void;

export class EventEmitter {
	protected eventsHandler: Map<Event, EventCallback> = new Map();

	emit(name: Event, data?: Object) {
		const cb = this.eventsHandler.get(name);

		if (cb !== undefined) cb(data);
	}

	on(name: Event, callback: EventCallback) {
		this.eventsHandler.set(name, callback);
	}
}
