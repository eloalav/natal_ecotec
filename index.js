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
        
        // Exibe o presente, mesmo que o jogador tenha errado
        mostrarPresente();
        
        // Atualiza o número de tentativas restantes na interface
        atualizarTentativas();
    }
}

// Função para exibir o presente (se não desapareceu)
function mostrarPresente() {
    // Asegura que o presente seja visível
    const presente = document.getElementById("presente");
    if (presente) {
        presente.style.visibility = "visible"; // Torna o presente visível
    }
}

// Função para esconder o presente (caso o jogo termine)
function esconderPresente() {
    const presente = document.getElementById("presente");
    if (presente) {
        presente.style.visibility = "hidden"; // Torna o presente invisível ao término
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
