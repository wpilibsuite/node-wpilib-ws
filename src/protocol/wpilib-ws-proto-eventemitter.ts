import StrictEventEmitter from "strict-event-emitter-types";
import { DIOPayload, AIPayload, AOPayload, EncoderPayload, PWMPayload, RelayPayload, DriverStationPayload, RoboRioPayload, JoystickPayload, SimDevicesPayload } from "./wpilib-ws-proto-messages";
import { EventEmitter } from "events";

interface BaseEvents {
    ready: void;
    error: (code: number, reason: string) => void;
    openConnection: void;
    closeConnection: void;
}

interface WpilibWsProtocolEvents extends BaseEvents {
    dioEvent: (channel: number, payload: DIOPayload) => void;
    analogInEvent: (channel: number, payload: AIPayload) => void;
    analogOutEvent: (channel: number, payload: AOPayload) => void;
    encoderEvent: (channel: number, payload: EncoderPayload) => void;
    pwmEvent: (channel: number, payload: PWMPayload) => void;
    relayEvent: (channel: number, payload: RelayPayload) => void;
    driverStationEvent: (payload: DriverStationPayload) => void;
    roboRioEvent: (payload: RoboRioPayload) => void;
    joystickEvent: (channel: number, payload: JoystickPayload) => void;
    simDevicesEvent: (deviceName: string, deviceChannel: number | null, payload: SimDevicesPayload) => void;
}

export type WpilibWsEventEmitter = StrictEventEmitter<EventEmitter, WpilibWsProtocolEvents>;
