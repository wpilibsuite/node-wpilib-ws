import { DIODeviceType, DIOPayload, EncoderDeviceType, EncoderPayload, IWpilibWsMsg } from "../protocol/wpilib-ws-proto-messages";
import { isValidWpilibWsMsg } from "../protocol/wpilib-ws-proto-messages";
import WebSocket from "ws";

import { WPILibWebSocketClient } from "../package";

describe("WPILibWebSocketClient", () => {
    let client: WPILibWebSocketClient;
    let server: WebSocket.Server;

    const testPort = 3300;
    const testUri = "/wpilibws";

    beforeEach(() => {
        server = new WebSocket.Server({
            port: testPort
        });

        client = new WPILibWebSocketClient({
            hostname: "localhost",
            port: testPort,
            uri: testUri
        });
    });

    afterEach((done) => {
        let serverClosed: boolean = false;
        let clientClosed: boolean = false;

        function checkDone() {
            if (serverClosed && clientClosed) {
                done();
            }
        }
        server.close(err => {
            serverClosed = true;
            checkDone();
        });

        client.on("closeConnection", () => {
            clientClosed = true;
            checkDone();
        });
    });

    it("should connect to the server on the prescribed port", (done) => {
        server.on("connection", socket => {
            done();
        });

        client.start();
    });

    it("should send a message on the wire", (done) => {
        const expectedChannel: number = 3;
        const expectedDioValue: boolean = false;
        server.on("connection", socket => {
            socket.once("message", msg => {
                try {
                    const msgObj = JSON.parse(msg.toString());
                    expect(isValidWpilibWsMsg(msgObj)).toBe(true);

                    const wpilibMsg: IWpilibWsMsg = msgObj as IWpilibWsMsg;
                    expect(wpilibMsg.type).toBe(DIODeviceType);
                    expect(wpilibMsg.device).toBe(expectedChannel.toString());
                    expect(wpilibMsg.data).not.toBeUndefined();

                    const dioPayload: DIOPayload = wpilibMsg.data as DIOPayload;
                    expect(dioPayload["<>value"]).toBe(expectedDioValue);
                    done();
                }
                catch (e) {}
            });
        });

        client.start();
        client.on("ready", () => {
            client.dioUpdateToWpilib(expectedChannel, {"<>value": expectedDioValue});
        });
    });

    it("should send multiple messages on the wire", (done) => {
        interface IEncoderMessage {
            channel: number;
            payload: EncoderPayload;
        }

        const expectedMessages: IEncoderMessage[] = [
            {
                channel: 0,
                payload: {
                    ">count": 0
                }
            },
            {
                channel: 1,
                payload: {
                    ">count": 0
                }
            },
            {
                channel: 0,
                payload: {
                    ">count": 100
                }
            },
            {
                channel: 1,
                payload: {
                    ">count": 100
                }
            }
        ];

        server.on("connection", socket => {
            const receivedMessages: IWpilibWsMsg[] = [];
            socket.on("message", msg => {
                try {
                    const msgObj = JSON.parse(msg.toString());
                    expect(isValidWpilibWsMsg(msgObj)).toBe(true);

                    const wpilibMsg: IWpilibWsMsg = msgObj as IWpilibWsMsg;
                    receivedMessages.push(wpilibMsg);
                }
                catch (e) {}

                // Verify the messages
                if (receivedMessages.length === expectedMessages.length) {
                    for (let i = 0; i < receivedMessages.length; i++) {
                        const rcvMsg = receivedMessages[i];
                        expect(rcvMsg.type).toBe(EncoderDeviceType);
                        expect(rcvMsg.device).toBe(expectedMessages[i].channel.toString());
                        expect(rcvMsg.data).toEqual(expectedMessages[i].payload);
                    }
                    done();
                }
            });
        });

        client.start();
        client.on("ready", () => {
            expectedMessages.forEach(msg => {
                client.encoderUpdateToWpilib(msg.channel, msg.payload);
            });
        });
    });
});
