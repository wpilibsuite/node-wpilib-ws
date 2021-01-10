import StrictEventEmitter from "strict-event-emitter-types";
import { DIOPayload, AIPayload, EncoderPayload, PWMPayload, RelayPayload, DriverStationPayload, RoboRIOPayload, JoystickPayload, AccelPayload, dPWMPayload, DutyCyclePayload, GyroPayload, SimDevicePayload } from "./wpilib-ws-proto-messages";
import { EventEmitter } from "events";
import RemoteConnectionInfo from "../remote-connection-info";

interface BaseEvents {
    ready: void;
    error: (code: number, reason: string) => void;
    openConnection: (remoteIpAddress?: RemoteConnectionInfo) => void;
    closeConnection: void;
}

interface WpilibWsProtocolEvents extends BaseEvents {
    accelEvent: (deviceName: string, deviceChannel: number | null, payload: AccelPayload) => void;
    analogInEvent: (channel: number, payload: AIPayload) => void;
    dioEvent: (channel: number, payload: DIOPayload) => void;
    dpwmEvent: (channel: number, payload: dPWMPayload) => void;
    driverStationEvent: (payload: DriverStationPayload) => void;
    dutyCycleEvent: (channel: number, payload: DutyCyclePayload) => void;
    encoderEvent: (channel: number, payload: EncoderPayload) => void;
    gyroEvent: (deviceName: string, deviceChannel: number | null, payload: GyroPayload) => void;
    joystickEvent: (channel: number, payload: JoystickPayload) => void;
    pwmEvent: (channel: number, payload: PWMPayload) => void;
    relayEvent: (channel: number, payload: RelayPayload) => void;
    roboRioEvent: (payload: RoboRIOPayload) => void;
    simDeviceEvent: (deviceName: string, deviceChannel: number | null, payload: SimDevicePayload) => void;
}

export type WpilibWsEventEmitter = StrictEventEmitter<EventEmitter, WpilibWsProtocolEvents>;
