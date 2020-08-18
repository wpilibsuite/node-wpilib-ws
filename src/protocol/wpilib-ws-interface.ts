import { EventEmitter } from "events";
import { WpilibWsEventEmitter } from "./wpilib-ws-proto-eventemitter";
import { DIOPayload, AOPayload, AIPayload, EncoderPayload, PWMPayload, RelayPayload, IWpilibWsMsg, DIODeviceType, AIDeviceType, AODeviceType, EncoderDeviceType, PWMDeviceType, RelayDeviceType, DriverStationPayload, DriverStationDeviceType, RoboRioPayload, RoboRioDeviceType, JoystickPayload, JoystickDeviceType } from "./wpilib-ws-proto-messages";

export default abstract class WPILibWSInterface extends (EventEmitter as new () => WpilibWsEventEmitter) {
    public dioUpdateToWpilib(channel: number, payload: DIOPayload): void {
        const msg: IWpilibWsMsg = {
            type: DIODeviceType,
            device: channel.toString(),
            data: payload
        };

        this._sendWpilibUpdateMessage(msg);
    }

    public analogOutUpdateToWpilib(channel: number, payload: AOPayload): void {
        const msg: IWpilibWsMsg = {
            type: AODeviceType,
            device: channel.toString(),
            data: payload
        };

        this._sendWpilibUpdateMessage(msg);
    }

    public analogInUpdateToWpilib(channel: number, payload: AIPayload): void {
        const msg: IWpilibWsMsg = {
            type: AIDeviceType,
            device: channel.toString(),
            data: payload
        };

        this._sendWpilibUpdateMessage(msg);
    }

    public encoderUpdateToWpilib(channel: number, payload: EncoderPayload): void {
        const msg: IWpilibWsMsg = {
            type: EncoderDeviceType,
            device: channel.toString(),
            data: payload
        };

        this._sendWpilibUpdateMessage(msg);
    }

    public pwmUpdateToWpilib(channel: number, payload: PWMPayload): void {
        const msg: IWpilibWsMsg = {
            type: PWMDeviceType,
            device: channel.toString(),
            data: payload
        };

        this._sendWpilibUpdateMessage(msg);
    }

    public relayUpdateToWpilib(channel: number, payload: RelayPayload): void {
        const msg: IWpilibWsMsg = {
            type: RelayDeviceType,
            device: channel.toString(),
            data: payload
        };

        this._sendWpilibUpdateMessage(msg);
    }

    public driverStationUpdateToWpilib(payload: DriverStationPayload): void {
        const msg: IWpilibWsMsg = {
            type: DriverStationDeviceType,
            device: "",
            data: payload
        };

        this._sendWpilibUpdateMessage(msg);
    }

    public roboRioUpdateToWpilib(payload: RoboRioPayload): void {
        const msg: IWpilibWsMsg = {
            type: RoboRioDeviceType,
            device: "",
            data: payload
        };

        this._sendWpilibUpdateMessage(msg);
    }

    public joystickUpdateToWpilib(joystickNum: number, payload: JoystickPayload): void {
        const msg: IWpilibWsMsg = {
            type: JoystickDeviceType,
            device: joystickNum.toString(),
            data: payload
        };

        this._sendWpilibUpdateMessage(msg);
    }


    protected abstract _sendWpilibUpdateMessage(msg: IWpilibWsMsg): void;

    /**
     * Utility method that will emit appropriate events base on data
     * @param msg
     */
    protected _handleWpilibWsMsg(msg: IWpilibWsMsg): void {
        const channel = Number.parseInt(msg.device);

        switch (msg.type) {
            case DIODeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("dioEvent", channel, msg.data as DIOPayload);
                }
                break;
            case AIDeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("analogInEvent", channel, msg.data as AIPayload);
                }
                break;
            case AODeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("analogOutEvent", channel, msg.data as AOPayload);
                }
                break;
            case EncoderDeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("encoderEvent", channel, msg.data as EncoderPayload);
                }
                break;
            case PWMDeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("pwmEvent", channel, msg.data as PWMPayload);
                }
                break;
            case RelayDeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("relayEvent", channel, msg.data as RelayPayload);
                }
                break;
            case DriverStationDeviceType:
                this.emit("driverStationEvent", msg.data as DriverStationPayload);
                break;
            case RoboRioDeviceType:
                this.emit("roboRioEvent", msg.data as RoboRioPayload);
                break;
            case JoystickDeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("joystickEvent", channel, msg.data as JoystickPayload);
                }
                break;
        }
    }
}
