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

    "<accum_init"?: boolean;
    ">accum_value"?: number;
    ">accum_count"?: number;
    "<accum_center"?: number;
    "<accum_deadband"?: number;

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

export const DriverStationDeviceType: string = "DriverStation";
export interface DriverStationPayload {
    ">enabled"?: boolean;
    ">autonomous"?: boolean;
    ">test"?: boolean;
    ">estop"?: boolean;
    ">fms"?: boolean;
    ">ds"?: boolean;
    "<match_time"?: number;
    ">station"?: string;
    ">new_data"?: boolean;
}

export const RoboRioDeviceType = "RoboRIO";
export interface RoboRioPayload {
    ">fpga_button"?: boolean;
    ">vin_voltage"?: number;
    ">vin_current"?: number;
    ">6v_voltage"?: number;
    ">6v_current"?: number;
    ">6v_faults"?: number;
    ">6v_active"?: boolean;
    ">5v_voltage"?: number;
    ">5v_current"?: number;
    ">5v_faults"?: number;
    ">5v_active"?: boolean;
    ">3v3_voltage"?: number;
    ">3v3_current"?: number;
    ">3v3_faults"?: number;
    ">3v3_active"?: boolean;
}

export const JoystickDeviceType = "Joystick";
export interface JoystickPayload {
    ">buttons"?: boolean[];
    ">povs"?: number[];
    ">axes"?: number[];
}

// This should be an OR of all the payload types
type WpilibWsMsgPayload = DIOPayload | AIPayload | AOPayload | EncoderPayload | PWMPayload | RelayPayload | DriverStationPayload | RoboRioPayload | JoystickPayload;

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
