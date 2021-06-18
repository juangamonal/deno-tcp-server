export class Socket {
	connection: Deno.Conn;
	message: Uint8Array;

	constructor(connection: Deno.Conn,message: Uint8Array) {
		this.connection = connection;
		this.message = message;
	}
}
