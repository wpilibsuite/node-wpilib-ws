import { EventEmitter } from "events";
import { WpilibWsEventEmitter } from "./wpilib-ws-proto-eventemitter";
import { DIOPayload, AIPayload, EncoderPayload, PWMPayload, RelayPayload, IWpilibWsMsg, DIODeviceType, AIDeviceType, EncoderDeviceType, PWMDeviceType, RelayDeviceType, DriverStationPayload, DriverStationDeviceType, RoboRIOPayload, RoboRIODeviceType, JoystickPayload, JoystickDeviceType, SimDeviceType, SimDevicePayload, AccelDeviceType, AccelPayload, dPWMDeviceType, dPWMPayload, DutyCycleDeviceType, DutyCyclePayload, GyroDeviceType, GyroPayload } from "./wpilib-ws-proto-messages";

export default abstract class WPILibWSInterface extends (EventEmitter as new () => WpilibWsEventEmitter) {
    protected _ready: boolean;
    protected _verbose: boolean = false;

    public set verboseMode(mode: boolean) {
        this._verbose = mode;
    }

    public get verboseMode(): boolean {
        return this._verbose;
    }

    public isReady(): boolean {
        return this._ready;
    }

    public isReadyP(): Promise<void> {
        if (this._ready) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            this.once("ready", () => {
                resolve();
            });
        });
    }

    public abstract start(): void;

    public accelUpdateToWpilib(deviceName: string, deviceChannel: number | null, payload: AccelPayload): void {
        const deviceIdent: string = `${deviceName}${deviceChannel !== null ? "[" + deviceChannel + "]" : ""}`;
        const msg: IWpilibWsMsg = {
            type: AccelDeviceType,
            device: deviceIdent,
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

    public dioUpdateToWpilib(channel: number, payload: DIOPayload): void {
        const msg: IWpilibWsMsg = {
            type: DIODeviceType,
            device: channel.toString(),
            data: payload
        };

        this._sendWpilibUpdateMessage(msg);
    }

    public dpwmUpdateToWpilib(channel: number, payload: dPWMPayload): void {
        const msg: IWpilibWsMsg = {
            type: dPWMDeviceType,
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

    public dutyCycleUpdateToWpilib(channel: number, payload: DutyCyclePayload): void {
        const msg: IWpilibWsMsg = {
            type: DutyCycleDeviceType,
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

    public gyroUpdateToWpilib(deviceName: string, deviceChannel: number, payload: GyroPayload): void {
        const deviceIdent: string = `${deviceName}${deviceChannel !== null ? "[" + deviceChannel + "]" : ""}`;
        const msg: IWpilibWsMsg = {
            type: GyroDeviceType,
            device: deviceIdent,
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

    public roboRioUpdateToWpilib(payload: RoboRIOPayload): void {
        const msg: IWpilibWsMsg = {
            type: RoboRIODeviceType,
            device: "",
            data: payload
        };

        this._sendWpilibUpdateMessage(msg);
    }

    public simDeviceUpdateToWpilib(deviceName: string, deviceIndex: number | null, deviceChannel: number | null, payload: SimDevicePayload): void {
        let deviceIdent: string = deviceName;
        if (deviceIndex !== null) {
            if (deviceChannel !== null) {
                deviceIdent += `[${deviceIndex},${deviceChannel}]`;
            }
            else {
                deviceIdent += `[${deviceIndex}]`;
            }
        }

        const msg: IWpilibWsMsg = {
            type: SimDeviceType,
            device: deviceIdent,
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

        if(this._verbose) {
            console.log("WS MSG (from Robot Code): ", msg);
        }

        switch (msg.type) {
            case AccelDeviceType: {
                const indexRegex = /\[([0-9]+)\]/;
                const deviceIdxResult = indexRegex.exec(msg.device);
                let deviceName: string = "";
                let deviceChannel: number | null = null;

                if (deviceIdxResult !== null) {
                    deviceChannel = parseInt(deviceIdxResult[1], 10);
                    deviceName = msg.device.substr(0, deviceIdxResult.index);
                }
                else {
                    deviceName = msg.device;
                }

                this.emit("accelEvent", deviceName, deviceChannel, msg.data as AccelPayload);
            } break;

            case AIDeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("analogInEvent", channel, msg.data as AIPayload);
                }
                break;

            case DIODeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("dioEvent", channel, msg.data as DIOPayload);
                }
                break;

            case dPWMDeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("dpwmEvent", channel, msg.data as dPWMPayload);
                }
                break;

            case DriverStationDeviceType:
                this.emit("driverStationEvent", msg.data as DriverStationPayload);
                break;

            case DutyCycleDeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("dutyCycleEvent", channel, msg.data as DutyCyclePayload);
                }
                break;

            case EncoderDeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("encoderEvent", channel, msg.data as EncoderPayload);
                }
                break;

            case GyroDeviceType: {
                const indexRegex = /\[([0-9]+)\]/;
                const deviceIdxResult = indexRegex.exec(msg.device);
                let deviceName: string = "";
                let deviceChannel: number | null = null;

                if (deviceIdxResult !== null) {
                    deviceChannel = parseInt(deviceIdxResult[1], 10);
                    deviceName = msg.device.substr(0, deviceIdxResult.index);
                }
                else {
                    deviceName = msg.device;
                }

                this.emit("gyroEvent", deviceName, deviceChannel, msg.data as GyroPayload);
            } break;

            case JoystickDeviceType:
                if (!Number.isNaN(channel)) {
                    this.emit("joystickEvent", channel, msg.data as JoystickPayload);
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

            case RoboRIODeviceType:
                this.emit("roboRioEvent", msg.data as RoboRIOPayload);
                break;

            case SimDeviceType: {
                // SimDevice "device" name could be of the form `deviceName` or `deviceName[channel]`
                const indexRegex = /\[([0-9]+)\]/;
                const deviceIdxResult = indexRegex.exec(msg.device);
                let deviceName: string = "";
                let deviceChannel: number | null = null;

                if (deviceIdxResult !== null) {
                    deviceChannel = parseInt(deviceIdxResult[1], 10);
                    deviceName = msg.device.substr(0, deviceIdxResult.index);
                }
                else {
                    deviceName = msg.device;
                }
                this.emit("simDeviceEvent", deviceName, deviceChannel, msg.data as SimDevicePayload);

            } break;
        }
    }
}
