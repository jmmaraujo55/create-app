import Server from "src/server";

export default class Application {
  async init() {
    const server = new Server();
    server.listen();
  }
}
