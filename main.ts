import { Event, Server } from "./mod.ts";

const server = new Server();

server.on(Event.connection, () => console.log("Client connected"));
server.on(Event.close, () => console.log("Client closed"));
server.on(Event.listen, () => console.log("TCP Server listening with default options"));
server.on(Event.shutdown, () => console.log("TCP Server off"));

await server.listen();
// server.close();
