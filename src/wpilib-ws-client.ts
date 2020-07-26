import WebSocket from "ws";

import WPILibWSInterface from "./protocol/wpilib-ws-interface";
import { IWpilibWsMsg, isValidWpilibWsMsg } from "./protocol/wpilib-ws-proto-messages";

export interface WPILibWSClientConfig {
    hostname?: string;
    port?: number;
    uri?: string;
    connectOnCreate?: boolean;
}

export default class WPILibWebSocketClient extends WPILibWSInterface {
    private _uri: string = "/wpilibws";
    private _hostname: string = "localhost";
    private _port: number = 8080;
    private _ws: WebSocket;
    private _ready: boolean = false;

    constructor(config?: WPILibWSClientConfig) {
        super();
        if (config?.hostname) {
            this._hostname = config.hostname;
        }
        if (config?.port) {
            this._port = config.port;
        }
        if (config?.uri) {
            this._uri = config.uri;
        }

        if (config?.connectOnCreate) {
            this.connect();
        }
    }

    public connect() {
        if (this._ready) {
            return;
        }

        const url = `ws://${this._hostname}:${this._port}${this._uri}`;
        this._ws = new WebSocket(url);

        this._ws.on("open", () => {
            this._ready = true;
            console.log("WS Ready");
            this.emit("ready");
        });

        this._ws.on("close", () => {
            this._ready = false;
            console.log("WS Closed");
        });

        this._ws.on("error", (code: number, reason: string) => {
            console.error(`WS Error ${code} ${reason}`);
            this._ready = false;
            this.emit("error", code, reason);
        });

        this._ws.on("message", msg => {
            try {
                const msgObj = JSON.parse(msg.toString());
                if (isValidWpilibWsMsg(msgObj)) {
                    this._handleWpilibWsMsg(msgObj);
                }
            }
            catch (e) {
                console.log("Problem parsing JSON");
            }
        });
    }

    protected _sendWpilibUpdateMessage(msg: IWpilibWsMsg): void {
        if (this._ready) {
            this._ws.send(JSON.stringify(msg));
        }
    }

}