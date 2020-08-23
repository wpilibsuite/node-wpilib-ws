# node-wpilib-ws: Node.js WPILib WebSocket protocol library

node-wpilib-ws provides both client and server implementations of the WPILib WebSocket protocol, which allows interaction with WPILib-based robot code.

## Installation
```
npm install node-wpilib-ws
```

## Usage Examples
The `src/apps` folder has very simple examples of a client and server.

Additionally, the [wpilib-ws-robot](https://github.com/bb-frc-workshops/wpilib-ws-robot) package shows a concrete example of how to use the client and server classes.

The Client and Server implementations are event based, and will fire off appropriate events whenever certain classes of messages arrive over the websocket.

### Listening for a DIO event
```typescript
const wss = new WPILibWebSocketServer(); // This can also be a WPILibWebSocketClient
wss.start(); // Start the server (or connect to a host in the case of the client)

wss.on("dioEvent", (channel: number, payload: WPILibWSMessages.DIOPayload) => {
    // Channel refers to the DIO channel number
    // payload contains a subset of the DIOPayload message
});
```

### Writing a PWM value
```typescript
const wss = new WPILibWebSocketServer(); // This can also be a WPILibWebSocketClient
wss.start(); // Start the server (or connect to a host in the case of the client)

wss.pwmUpdateToWpilib(0, {
    "<>value": 128
});
```
