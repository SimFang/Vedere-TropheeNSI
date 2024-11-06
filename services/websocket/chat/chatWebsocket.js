class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.isConnected = false;

        // Create a promise that resolves when the connection is established
        this.connectionPromise = new Promise((resolve, reject) => {
            this.resolveConnection = resolve; // Store the resolve function
            this.rejectConnection = reject; // Store the reject function
        });

        // Bind the methods to the instance
        this.connect = this.connect.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.close = this.close.bind(this);
        this.setOnMessage = this.setOnMessage.bind(this); // Ensure this is bound
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('Connected to WebSocket server');
            this.isConnected = true;
            this.resolveConnection(); // Resolve the promise
        };

        this.ws.onmessage = (event) => {
            if (this.onMessageCallback) {
                this.onMessageCallback(event); // Call the callback if set
            } else {
                console.log('Message from server:', event.data); // Default logging
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
            this.isConnected = false;
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.rejectConnection(error); // Reject the promise on error
        };
    }

    sendMessage(message) {
        if (this.isConnected) {
            this.ws.send(message);
            console.log(`Sent: ${message}`);
        } else {
            console.log('WebSocket is not connected. Cannot send message.');
        }
    }

    // New method to set the onMessage callback
    setOnMessage(callback) {
        this.onMessageCallback = callback;
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export default WebSocketClient;
