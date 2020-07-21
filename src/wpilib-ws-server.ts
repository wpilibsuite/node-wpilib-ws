import WebSocket from "ws";
import http from "http";
import net from "net";
import url from "url";
import { EventEmitter } from "events";

export interface WPILibWSConfig {
    port?: number;
    uri?: string;
}

export class WPILibWebSocketServer extends EventEmitter {
    private _uri: string = "/wpilibws";
    private _port: number = 8080;
    private _httpServer: http.Server;
    private _wss: WebSocket.Server;
    private _activeSocket: WebSocket | null = null;

    constructor(config?: WPILibWSConfig) {
        super();
        if (config) {
            if (config.port) {
                this._port = config.port;
            }

            if (config.uri) {
                this._uri = config.uri;
            }
        }

        this._httpServer = http.createServer();

        this._wss = new WebSocket.Server({
            noServer: true
        });

        this._hookupServerEvents();
    }

    public start() {
        this._httpServer.listen(this._port);
    }

    private _hookupServerEvents() {
        this._httpServer.on("upgrade", (request, socket: net.Socket, head) => {
            const pathName = url.parse(request.url).pathname;

            if (pathName === this._uri) {
                if (this._activeSocket) {
                    socket.write("HTTP/1.1 409 Conflict\r\n");
                    console.log("Already have an active socket");
                    socket.destroy();
                    return;
                }

                this._wss.handleUpgrade(request, socket, head, (ws) => {
                    this._wss.emit("connection", ws, request);
                });
            }
            else {
                socket.write("HTTP/1.1 404 Not Found\r\n");
                console.log("Unknown path");
                socket.destroy();
            }
        });

        this._wss.on("connection", socket => {
            this._activeSocket = socket;
            socket.on("message", msg => {
                console.log(`Message Received: ${msg}`);
            });

            socket.on("close", (code, reason) => {
                console.log(`Socket closed (${code}): ${reason}`);
                this._activeSocket = null;
            });
        });
    }
}