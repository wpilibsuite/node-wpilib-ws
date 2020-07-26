
import { WPILibWebSocketServer, WPILibWSMessages } from "../package";

const wss = new WPILibWebSocketServer();
wss.startServer();

wss.on("dioEvent", (channel: number, payload: WPILibWSMessages.DIOPayload) => {
    console.log("Got DIO event for channel ", channel, " with payload: ", payload)
});
