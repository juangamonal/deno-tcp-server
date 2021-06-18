import { CommandHandler } from "./command.ts";
import { Event, EventEmitter } from "./event.ts";

export const defaultOptions: ServerOptions = {
	hostname: "localhost",
	port: 8080,
	useCommands: false
};

interface ServerOptions {
	hostname?: string;
	port: number;
	useCommands?: boolean;
}

export class Server extends EventEmitter {
	private commandHandler: CommandHandler | null;
	private connections!: Deno.Conn[];
	private listener!: Deno.Listener;
	private options: ServerOptions;

	constructor(options?: ServerOptions, commandHandler?: CommandHandler) {
		super();
		this.options = options ? { ...defaultOptions, ...options } : defaultOptions;
		this.commandHandler = commandHandler ? commandHandler : null;
	}

	async listen() {
		this.connections = [];
		this.listener = Deno.listen({ hostname: this.options.hostname, port: this.options.port });
		this.emit(Event.listen);

		try {
			for await (const conn of this.listener) {
				this.connections.push(conn);
				this.emit(Event.connection);
				this.handleConnection(conn);
			}
		} catch (e) {
			this.emit(Event.error);
		}
	}

	async close() {
		this.emit(Event.shutdown);
		for (let c of this.connections) {
			c.close();
		}
		this.listener.close();
	}

	private handleConnection(conn: Deno.Conn) {
		if (this.commandHandler !== null) {
			this.commandHandler.handle(conn);
		} else {
			console.log(conn)
		}
	}
}
