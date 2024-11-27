// Variáveis "globais para controle"
let client = null;
let connected = false;
let connectionAttempt = 1;

// Definir o número máximo de tentativas
let maxAttempts = 3;
let currentAttempt = 0;

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

// Função chamada após o cliente se conectar com sucesso
function onConnect() { }

// Função chamada quando a conexão é bem-sucedida
function onConnected(reconnect, uri) {
    connected = true;
}

// Função chamada em caso de falha na conexão
function onFail(context) {
    connected = false;
}

// Função chamada quando a conexão é perdida
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

// Função chamada quando uma mensagem chega ao cliente
function onMessageArrived(message) { }


// Função chamada quando o jogador acertar
function acertou(cor) {
    const message = new Paho.MQTT.Message("Ligar");
    message.qos = 0;

    if (cor === "blue") {
        message.destinationName = `natalecotec/ligar/faixa/blue`;
    } else if (cor === "red") {
        message.destinationName = `natalecotec/ligar/faixa/red`;
    } else if (cor === "green") {
        message.destinationName = `natalecotec/ligar/faixa/green`;
    } else if (cor === "yellow") {
        message.destinationName = `natalecotec/ligar/faixa/yellow`;
    } else if (cor === "estrela") {
        message.destinationName = `natalecotec/ligar/faixa/estrela`;
    } else if (cor === "apagar") {
        message.destinationName = `natalecotec/ligar/faixa/apagar`;
    }
    
    // Publica a mensagem
    client.send(message);

    // Reseta as tentativas após acerto
    currentAttempt = 0;
    atualizarTentativas();
}

// Função chamada quando o jogador errar
function errou(cor) {
    currentAttempt += 1;

    // Adiciona o presente errado na caixinha
    adicionarPresenteNaCaixinha(cor);

    // Verifica se o jogador ainda tem tentativas
    if (currentAttempt >= maxAttempts) {
        alert("Você perdeu! O jogo terminou!");
        // Lógica para esconder o presente (por exemplo, removendo-o da tela)
        esconderPresente();
    } else {
        alert(`Você errou! Tente novamente! Tentativas restantes: ${maxAttempts - currentAttempt}`);
        mostrarPresente(); // Garantir que o presente continue visível
        atualizarTentativas();
    }
}

// Função para adicionar o presente na caixinha
function adicionarPresenteNaCaixinha(cor) {
    const caixinha = document.getElementById("caixinha");
    const presenteErrado = document.createElement("div");
    presenteErrado.classList.add("presente");
    presenteErrado.textContent = `Presente de cor ${cor} errado!`;
    
    // Aqui você pode customizar o estilo, como adicionar uma imagem ou cor ao "presente"
    presenteErrado.style.backgroundColor = cor; // Pode usar uma cor, imagem, etc.

    caixinha.appendChild(presenteErrado);
}

// Função para atualizar o número de tentativas restantes
function atualizarTentativas() {
    document.getElementById("tentativas").textContent = `Tentativas restantes: ${maxAttempts - currentAttempt}`;
}

// Função para exibir o presente (se não desapareceu)
function mostrarPresente() {
    // Se o presente for um elemento HTML, garanta que ele continue visível
    document.getElementById("presente").style.visibility = "visible";
}

// Função para esconder o presente (caso o jogo termine)
function esconderPresente() {
    document.getElementById("presente").style.visibility = "hidden";
}
