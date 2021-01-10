import WebSocket from "ws";
import http from "http";
import net from "net";
import url from "url";
import { Address4, Address6 } from "ip-address";

import WPILibWSInterface from "./protocol/wpilib-ws-interface";
import { isValidWpilibWsMsg, IWpilibWsMsg } from "./protocol/wpilib-ws-proto-messages";


export interface WPILibWSServerConfig {
    port?: number;
    uri?: string;
    startOnCreate?: boolean;
    verbose?: boolean;
}

export default class WPILibWebSocketServer extends WPILibWSInterface {
    private _uri: string = "/wpilibws";
    private _port: number = 3300;
    private _httpServer: http.Server;
    private _wss: WebSocket.Server;
    private _activeSocket: WebSocket | null = null;

    constructor(config?: WPILibWSServerConfig) {
        super();
        if (config?.port) {
            this._port = config.port;
        }
        if (config?.uri) {
            this._uri = config.uri;
        }

        if (config?.verbose) {
            this.verboseMode = config.verbose;
        }

        this._httpServer = http.createServer();

        this._wss = new WebSocket.Server({
            noServer: true
        });

        this._hookupServerEvents();

        if (config?.startOnCreate) {
            this.start();
        }
    }

    public start() {
        if (this._httpServer.listening) {
            return;
        }

        this._httpServer.listen(this._port, () => {
            this._ready = true;
            this.emit("ready");
        });
    }

    public stop() {
        if (!this._httpServer.listening) {
            return;
        }

        this._httpServer.close();
    }

    protected _sendWpilibUpdateMessage(msg: IWpilibWsMsg): void {
        if (this._activeSocket) {
            if (this._verbose) {
                console.log("WS MSG (to Robot Code): ", msg);
            }
            this._activeSocket.send(JSON.stringify(msg));
        }
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

                // Handle the WebSocket upgrade
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

        this._wss.on("connection", (socket, request) => {
            this._activeSocket = socket;
            console.log("Successfully connected");

            // Pass the remote connection information up the chain
            const remoteAddr = request.connection.remoteAddress;
            let ipv4String: string = "";

            if (Address4.isValid(remoteAddr)) {
                ipv4String = remoteAddr;
            }
            else if (Address6.isValid(remoteAddr)) {
                const addrV6 = new Address6(remoteAddr);
                ipv4String = addrV6.to4().address;
            }

            this.emit("openConnection", { ipv4Address: ipv4String }); // For robot initialization
            socket.on("message", msg => {
                try {
                    const msgObj = JSON.parse(msg.toString());
                    if (isValidWpilibWsMsg(msgObj)) {
                        this._handleWpilibWsMsg(msgObj as IWpilibWsMsg);
                    }
                    else if (this._verbose) {
                        console.log("Invalid WS message: ", msg);
                    }
                }
                catch (e) {
                    console.log(`Problem parsing JSON`);
                }

            });

            socket.on("close", (code, reason) => {
                console.log(`Socket closed (${code}): ${reason}`);
                this._activeSocket = null;
                this.emit("closeConnection"); // For robot cleanup
            });
        });
    }

}
