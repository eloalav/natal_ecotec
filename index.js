// Variáveis "globais para controle"
let client = null;
let connected = false;
let connectionAttempt = 1;

// Cria identificar único do cliente conectado
const clientId = "natalecotec_" + Math.floor(Math.random() * 900) + 100;

// Configurações do broker, usa TLS
const hostname = "broker.hivemq.com";
const port = 8884;
const path = "/mqtt";
const user = "MY_USER";
const pass = "MY_PASSWORD";

// Configurações do cliente
const keepAlive = 60;
const timeout = 30;
const tls = true;
const cleanSession = false;
const lastWillTopic = `natalecotec/${clientId}`;
const lastWillQos = 0;
const lastWillRetain = true;
const lastWillMessageVal = `Last will of ${clientId}`;

// Cria objeto
client = new Paho.MQTT.Client(hostname, Number(port), path, clientId);

// Configuração de Callbacks
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.onConnected = onConnected;

let lastWillMessage = new Paho.MQTT.Message(lastWillMessageVal);
lastWillMessage.destinationName = lastWillTopic;
lastWillMessage.qos = lastWillQos;
lastWillMessage.retained = lastWillRetain;

const connectOptions = {
    invocationContext: {
        host: hostname,
        port: port,
        path: client.path,
        clientId: clientId
    },
    timeout: timeout,
    keepAliveInterval: keepAlive,
    cleanSession: cleanSession,
    useSSL: tls,
    onSuccess: onConnect,
    onFailure: onFail,
    userName: user,
    password: pass,
    willMessage: lastWillMessage
};

// Realiza conexão do cliente
client.connect(connectOptions);


function onConnect() { }

function onConnected(reconnect, uri) {
    connected = true;
}
function onFail(context) {
    connected = false;
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) { }

    // Depois de 2 segundos tenta reconexão
    const reconnectSeconds = 2 * connectionAttempt
    connectionAttempt += 1
    setTimeout(() => {
        if (connectOptions.hasOwnProperty("mqttVersionExplicit")) {
            delete connectOptions.mqttVersionExplicit
        }
        client.connect(connectOptions)
    }, reconnectSeconds * 1000);
}
function onMessageArrived(message) { }


function acertou(cor) {
    const message = new Paho.MQTT.Message("Ligar");
    message.qos = 0;

    if (cor === "blue"){
        message.destinationName = `natalecotec/ligar/faixa/blue`;
    } else if (cor === "red"){
        message.destinationName = `natalecotec/ligar/faixa/red`;
    } else if (cor === "green"){
        message.destinationName = `natalecotec/ligar/faixa/green`;
    } else if ( cor === "yellow"){
        message.destinationName = `natalecotec/ligar/faixa/yellow`;
    } else if ( cor === "estrela"){
        message.destinationName = `natalecotec/ligar/faixa/estrela`;
    }
    
    // Publica a mensagem
    client.send(message)
}