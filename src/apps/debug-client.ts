import { WPILibWebSocketClient, WPILibWSMessages } from "../package";

const wsc = new WPILibWebSocketClient();
wsc.start();

wsc.on("ready", () => {
    console.log("Ready!");
});

wsc.on("dioEvent", (channel: number, payload: WPILibWSMessages.DIOPayload) => {
    console.log("Got DIO event for channel ", channel, " with payload: ", payload)
});
