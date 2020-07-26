export const DIODeviceType: string = "DIO";
export interface DIOPayload {
    "<init"?: boolean;
    "<>value"?: boolean;
    "<pulse_length"?: number;
    "<input"?: boolean;
}

export const AIDeviceType: string = "AI";
export interface AIPayload {
    "<init"?: boolean;
    "<avg_Bits"?: number;
    "<oversample_bits"?: number;
    ">voltage"?: number;
    "accum"?: {
        "<init"?: boolean;
        ">value"?: number;
        ">count"?: number;
        "<center"?: number;
        "<deadband"?: number;
    }
}

export const AODeviceType: string = "AO";
export interface AOPayload {
    "<init"?: boolean;
    "<votage"?: number;
}

export const EncoderDeviceType: string = "Encoder";
export interface EncoderPayload {
    "<init"?: boolean;
    ">count"?: number;
    ">period"?: number;
    "<reset"?: boolean;
    "<reverse_direction"?: boolean;
    "<samples_to_avg"?: number;
}

export const PWMDeviceType: string = "PWM";
export interface PWMPayload {
    "<init"?: boolean;
    "<speed"?: number;
    "<position"?: number;
    "<raw"?: number;
    "<period_scale"?: number;
    "<zero_latch"?: boolean;
}

export const RelayDeviceType: string = "Relay";
export interface RelayPayload {
    "<init_fwd"?: boolean;
    "<init_rev"?: boolean;
    "<fwd"?: boolean;
    "<rev"?: boolean;
}

// This should be an OR of all the payload types
type WpilibWsMsgPayload = DIOPayload | AIPayload | AOPayload | EncoderPayload | PWMPayload | RelayPayload;

// This is the envelope type
export interface IWpilibWsMsg {
    type: string;
    device: string;
    data: WpilibWsMsgPayload;
}

export function isValidWpilibWsMsg(msg: any): boolean {
    if (typeof msg !== "object") {
        return false;
    }

    if (msg.type === undefined || typeof msg.type !== "string") {
        return false;
    }

    if (msg.device === undefined || typeof msg.device !== "string") {
        return false;
    }

    if (msg.data === undefined) {
        return false;
    }

    return true;
}