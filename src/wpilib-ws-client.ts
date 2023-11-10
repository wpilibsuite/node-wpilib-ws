import ReconnectingWebSocket from "reconnecting-websocket";

import WPILibWSInterface from "./protocol/wpilib-ws-interface";
import { IWpilibWsMsg, isValidWpilibWsMsg } from "./protocol/wpilib-ws-proto-messages";

export interface WPILibWSClientConfig {
    hostname?: string;
    port?: number;
    uri?: string;
    connectOnCreate?: boolean;
    verbose?: boolean;
}

export default class WPILibWebSocketClient extends WPILibWSInterface {
    private _uri: string = "/wpilibws";
    private _hostname: string = "localhost";
    private _port: number = 3300;
    private _ws: ReconnectingWebSocket;

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

        if (config?.verbose) {
            this.verboseMode = config.verbose;
        }

        if (config?.connectOnCreate) {
            this.start();
        }
    }

    public start() {
        if (this._ready) {
            return;
        }

        const url = `ws://${this._hostname}:${this._port}${this._uri}`;
        this._ws = new ReconnectingWebSocket(url);

        this._ws.addEventListener("open", () => {
            this._ready = true;
            console.log("WS Ready");
            this.emit("ready");
            this.emit("openConnection");
        });

        this._ws.addEventListener("close", () => {
            this._ready = false;
            console.log("WS Closed");
            this.emit("closeConnection");
        });

        this._ws.addEventListener("error", (error) => {
            console.error(`WS Error ${error.message}`);
            this._ready = false;
            this.emit("error", -1, error.message);
        });

        this._ws.addEventListener("message", msg => {
            try {
                const msgObj = JSON.parse(msg.toString());
                if (isValidWpilibWsMsg(msgObj)) {
                    this._handleWpilibWsMsg(msgObj);
                }
                else if (this._verbose) {
                    console.log("Invalid WS message: ", msg);
                }
            }
            catch (e) {
                console.log("Problem parsing JSON");
            }
        });
    }

    protected _sendWpilibUpdateMessage(msg: IWpilibWsMsg): void {
        if (this._ready) {
            if (this._verbose) {
                console.log("WS MSG (to Robot Code): ", msg);
            }
            this._ws.send(JSON.stringify(msg));
        }
    }

}
