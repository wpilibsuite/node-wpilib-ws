import { WPILibWebSocketServer } from "../package";
import WebSocket from "ws";
import { DIODeviceType, DIOPayload, IWpilibWsMsg } from "../protocol/wpilib-ws-proto-messages";

describe("WPILibWebSocketServer", () => {
    let client: WebSocket;
    let server: WPILibWebSocketServer;

    const testPort = 3300;
    const testUri = "/wpilibws";

    const baseWsUrl = `ws://localhost:${testPort}`;
    const testWsUrl = `${baseWsUrl}${testUri}`;

    let shouldWaitForConnectionClose = true;

    beforeEach((done) => {
        server = new WPILibWebSocketServer({
            port: testPort,
            uri: testUri
        });

        server.start();

        server.once("ready", () => {
            done();
        });

        shouldWaitForConnectionClose = true;
    });

    afterEach((done) => {
        client.close();
        server.stop();

        if (shouldWaitForConnectionClose) {
            server.once("closeConnection", () => {
                done();
            });
        }
        else {
            done();
        }
    });

    it("should accept a connection to the right URI", (done) => {
        let serverGotConnection = false;
        let clientReady = false;

        function checkDone() {
            if (serverGotConnection && clientReady) {
                done();
            }
        }

        client = new WebSocket(testWsUrl);
        server.once("openConnection", () => {
            serverGotConnection = true;
            checkDone();
        });

        client.once("open", () => {
            clientReady = true;
            checkDone();
        });
    });

    it("should drop connections to an incorrect URI", (done) => {
        const errorUrl = `${baseWsUrl}/most_def_incorrect_uri`;
        client = new WebSocket(errorUrl);
        shouldWaitForConnectionClose = false;

        client.once("error", (err) => {
            done();
        });
    });

    it("should reject subsequent connections to same URI", (done) => {
        // Open the initial connection
        client = new WebSocket(testWsUrl);
        client.once("open", () => {
            // Once we have the connection, try to open a second one
            const client2 = new WebSocket(testWsUrl);
            client2.once("error", () => {
                done();
            });
        });
    });

    it("should handle receiving messages over the wire", (done) => {
        const expectedChannel = 6;
        const expectedPayload: DIOPayload = {
            "<>value": true
        };

        const expectedMsg: IWpilibWsMsg = {
            type: DIODeviceType,
            device: expectedChannel.toString(),
            data: expectedPayload
        };

        server.once("dioEvent", (channel, payload) => {
            expect(channel).toBe(expectedChannel);
            expect(payload).toEqual(expectedPayload);
            done();
        });

        client = new WebSocket(testWsUrl);

        client.once("open", () => {
            client.send(JSON.stringify(expectedMsg));
        });
    });

    it("should send messages over the wire", (done) => {
        const expectedChannel = 5;
        const expectedPayload: DIOPayload = {
            "<>value": false
        };

        const expectedMsg: IWpilibWsMsg = {
            type: DIODeviceType,
            device: expectedChannel.toString(),
            data: expectedPayload
        };

        client = new WebSocket(testWsUrl);

        client.once("message", msg => {
            try {
                const msgObj = JSON.parse(msg.toString());
                expect(msgObj).toEqual(expectedMsg);
                done();
            }
            catch (e) {}
        });

        client.once("open", () => {
            server.dioUpdateToWpilib(expectedChannel, expectedPayload);
        });
    });
});
