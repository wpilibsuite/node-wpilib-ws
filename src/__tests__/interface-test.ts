import { AIDeviceType, AIPayload, DIODeviceType, DIOPayload, EncoderDeviceType, IWpilibWsMsg } from "../protocol/wpilib-ws-proto-messages";
import WPILibWSInterface from "../protocol/wpilib-ws-interface";

class MockInterface extends WPILibWSInterface {
    protected _lastOutboundMsg: IWpilibWsMsg;

    public start(): void {
        this.emit("ready");
    }

    protected _sendWpilibUpdateMessage(msg: IWpilibWsMsg): void {
        this._lastOutboundMsg = msg;
    }

    public simulateIncomingMessage(msg: IWpilibWsMsg) {
        this._handleWpilibWsMsg(msg);
    }

    public getLastOutboundMessage(): IWpilibWsMsg {
        return this._lastOutboundMsg;
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

describe("WPILibWSInterface - Outgoing Messages", () => {
    let testInterface: MockInterface;

    beforeEach(() => {
        testInterface = new MockInterface();
        testInterface.start();
    });

    it("should send the appropriate DIO wire message", () => {
        const expectedChannel: number = 4;
        const expectedPayload: DIOPayload = {
            "<>value": true
        };

        testInterface.dioUpdateToWpilib(expectedChannel, expectedPayload);

        const lastMsg = testInterface.getLastOutboundMessage();
        expect(lastMsg.type).toBe(DIODeviceType);
        expect(lastMsg.device).toBe(expectedChannel.toString());
        expect(lastMsg.data).not.toBeUndefined();

        const msgPayload: DIOPayload = (lastMsg.data as DIOPayload);
        expect(msgPayload["<>value"]).not.toBeUndefined();
        expect(msgPayload["<>value"]).toBe(true);
    });

    it("should send the appropriate Analog In wire message", () => {
        const expectedChannel: number = 2;
        const expectedVoltage = 2.5678;
        const expectedPayload: AIPayload = {
            ">voltage": expectedVoltage
        };

        testInterface.analogInUpdateToWpilib(expectedChannel, expectedPayload);

        const lastMsg = testInterface.getLastOutboundMessage();
        expect(lastMsg.type).toBe(AIDeviceType);
        expect(lastMsg.device).toBe(expectedChannel.toString());
        expect(lastMsg.data).not.toBe(undefined);

        const msgPayload: AIPayload = (lastMsg.data as AIPayload);
        expect(msgPayload[">voltage"]).not.toBeUndefined();
        expect(msgPayload[">voltage"]).toBeCloseTo(expectedVoltage, 5);
    });
});
