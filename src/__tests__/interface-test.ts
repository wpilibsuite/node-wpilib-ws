import { AIDeviceType, AODeviceType, DIODeviceType, EncoderDeviceType, IWpilibWsMsg } from "../protocol/wpilib-ws-proto-messages";
import WPILibWSInterface from "../protocol/wpilib-ws-interface";

class MockInterface extends WPILibWSInterface {
    public start(): void {
        this.emit("ready");
    }

    protected _sendWpilibUpdateMessage(msg: IWpilibWsMsg): void {

    }

    public simulateIncomingMessage(msg: IWpilibWsMsg) {
        this._handleWpilibWsMsg(msg);
    }
}

describe("WPILibWSInterface - Incoming Messages", () => {
    let testInterface: MockInterface;

    beforeEach(() => {
        testInterface = new MockInterface();
        testInterface.start();
    });

    it("should emit a dioEvent when given a DIO message", (done) => {
        testInterface.once("dioEvent", (channel, payload) => {
            expect(channel).toBe(1);
            expect(payload).toHaveProperty("<init");
            expect(payload["<init"]).toBe(true);
            done();
        });

        testInterface.simulateIncomingMessage({
            type: DIODeviceType,
            device: "1",
            data: {
                "<init": true
            }
        });
    });

    it("should emit an analogInEvent when given an AI message", (done) => {
        testInterface.once("analogInEvent", (channel, payload) => {
            expect(channel).toBe(1);
            expect(payload["<init"]).toBe(true);
            done();
        });

        testInterface.simulateIncomingMessage({
            type: AIDeviceType,
            device: "1",
            data: {
                "<init": true
            }
        });
    });

    it("should emit an analogOutEvent when given an AO message", (done) => {
        testInterface.once("analogOutEvent", (channel, payload) => {
            expect(channel).toBe(1);
            expect(payload["<voltage"]).toEqual(2.0);
            done();
        });

        testInterface.simulateIncomingMessage({
            type: AODeviceType,
            device: "1",
            data: {
                "<voltage": 2.0
            }
        });
    });

    it("should emit an encoderEvent when given an Encoder message", (done) => {
        testInterface.once("encoderEvent", (channel, payload) => {
            expect(channel).toBe(1);
            expect(payload["<channel_a"]).toBe(4);
            expect(payload["<channel_b"]).toBe(5);
            done();
        });

        testInterface.simulateIncomingMessage({
            type: EncoderDeviceType,
            device: "1",
            data: {
                "<channel_a": 4,
                "<channel_b": 5
            }
        });
    });
});
