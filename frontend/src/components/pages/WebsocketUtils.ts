export class WebsocketUtils {

    public static websocketUrlByPath(path: string) {
        return this.websocketProtocolByLocation() +
            window.location.hostname +
            this.websocketPortWithColonByLocation() +
            window.location.pathname +
            path;
    }

    private static websocketProtocolByLocation() {
        return window.location.protocol === "https:" ? "wss://" : "ws://";
    }

    private static websocketPortWithColonByLocation() {
        const defaultPort = window.location.protocol === "https:" ? "443" : "80";
        // override for ionic dev server which does not proxy ws
        if (window.location.port === "3000") {
            return ":4000";
        } else if (window.location.port !== defaultPort) {
            return ":" + window.location.port;
        } else {
            return "";
        }
    }
}