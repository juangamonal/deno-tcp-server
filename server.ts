import { CommandHandler } from "./command.ts";
import { Event } from "./event.ts";
import { EventEmitter } from "./deps.ts";
import { Socket } from "./socket.ts";

export const defaultOptions: ServerOptions = {
	hostname: "localhost",
	port: 8080,
	useCommands: false
}

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
				this.emit(Event.connection, conn);
				this.handleConnection(conn);
			}
		} catch (e) {
			this.emit(Event.error, e);
		}
	}

	close() {
		for (const c of this.connections) {
			c.close();
		}

		this.listener.close();
		this.emit(Event.shutdown);
	}

	private async handleConnection(conn: Deno.Conn) {
		if (this.commandHandler !== null) {
			this.commandHandler.handle(conn);
		} else {
			for await (const buffer of Deno.iter(conn)) {
				this.emit(Event.message, new Socket(conn, buffer));
			}
		}
	}
}
