import { Event, Server, Socket } from "../mod.ts";

const server = new Server();

server.on(Event.listen, () => console.log('server listening'));
server.on(Event.message, (socket: Socket) => Deno.copy(socket.connection, socket.connection));

await server.listen();
