import StrictEventEmitter from "strict-event-emitter-types";
import { DIOPayload, AIPayload, AOPayload, EncoderPayload, PWMPayload, RelayPayload } from "./wpilib-ws-proto-messages";
import { EventEmitter } from "events";

interface BaseEvents {
    ready: void;
    error: (code: number, reason: string) => void;
}

interface WpilibWsProtocolEvents extends BaseEvents {
    dioEvent: (channel: number, payload: DIOPayload) => void;
    analogInEvent: (channel: number, payload: AIPayload) => void;
    analogOutEvent: (channel: number, payload: AOPayload) => void;
    encoderEvent: (channel: number, payload: EncoderPayload) => void;
    pwmEvent: (channel: number, payload: PWMPayload) => void;
    relayEvent: (channel: number, payload: RelayPayload) => void;
}

export type WpilibWsEventEmitter = StrictEventEmitter<EventEmitter, WpilibWsProtocolEvents>;
