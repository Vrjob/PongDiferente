//Cores - - - - - - - - - - - - -
let corBola = '#ffffff'; // Cor branca para a bola
let corCampo = '#4A9E53'; // Verde escuro para representar o gramado
let corCampoInicial = corCampo; // Cor inicial do campo (verde escuro)
let corCampoFinal = '#3BADBE';   // Cor final do campo (verde mais claro)
let corCampoAtual;              // Cor atual do campo
let corLinhas = '#ffffff'; // Cor branca para as linhas
let corMarcaBola = '#f9a602'; // Cor amarela para a marcação da bola
let corMoeda = '#f9a602'; // Cor amarela para a moeda
let corPlacarInicial = corCampoFinal;
let corPlacarFinal = corCampoInicial; 
let corPlacarAtual;  

//Variaveis - - - - - - - - - - - - -
let bola;
const alturaRaquete = 100;
const duracaoJogo = 60000; // Tempo de duração do jogo em milissegundos (1 minuto = 60000 milissegundos)
const larguraFaixaCentral = 100; // Largura da faixa central onde as moedas aparecerão
const larguraRaquete = 10;
let jogoIniciado = false; // Variável para controlar se o jogo está em andamento ou se está na tela inicial
let jogoFinalizado = false;
let moedas = [];
let placar = { jogador: 0, computador: 0 };
let pontuacaoFinalComputador = 0;
let pontuacaoFinalJogador = 0;
let pontuacaoMoedasComputador = 0;
let pontuacaoMoedasJogador = 0;
let posicaoComputadorY;
let posicaoJogadorY;
let repeticaoNarrador = 0;
let tempoInicioJogo;
let tamanhoBola = 20;
const tamanhoMoeda = 20;
let velocidadeBolaX;
let velocidadeBolaY;
let velocidadeComputador = 4;
let velocidadeJogador = 1;
let velocidadeMaximaBola = 6;
let jogadorDois = false

function setup() {
  createCanvas(800, 400);
  posicaoJogadorY = height / 2;
  posicaoComputadorY = height / 2;
  resetarBola();
  for (let i = 0; i < 5; i++) {
    criarMoeda();
  }
  tempoInicioJogo = millis();
  corCampoAtual = color(corCampoInicial);
  corPlacarAtual = color(corPlacarInicial);

  // Aumentar a taxa de atualização do jogo para deixá-lo mais dinâmico
  frameRate(60);
}

function draw() {
  if (!jogoIniciado) {
    telaInicial();
      } else {
  if (!jogoFinalizado) {
    // Calcular a porcentagem do tempo decorrido em relação à duração total do jogo
    let tempoDecorrido = millis() - tempoInicioJogo;
    let porcentagemTempo = tempoDecorrido / duracaoJogo;

    // Interpolar entre as cores inicial e final do campo de acordo com a porcentagem do tempo
    corCampoAtual = lerpColor(color(corCampoInicial), color(corCampoFinal), porcentagemTempo);
    corPlacarAtual = lerpColor(color(corPlacarInicial), color(corPlacarFinal), porcentagemTempo);

    // Define a cor de fundo como a cor atual do campo
    background(corCampoAtual);

    desenharLinhasCampo();
    desenharRaquetes();
    desenharBola();
    moverRaqueteJogador();
    if (jogadorDois){
    moverRaqueteJogador2();
    }else{
    moverRaqueteComputador(); 
    }
    moverBola();
    verificarColisoes();
    desenharMoedas();
    mostrarPlacar();
    mostrarPlacarMoedas();
    moverMoedas();
    verificarColisaoMoedas();
    mostrarCronometro();
    verificarFimJogo();
  } else {
    exibirGameOver();
  }
  }
}

function telaInicial() {
  // Preencher a tela com a cor de fundo do campo atual
  background(corCampoAtual);

  // Exibir texto da tela inicial
  fill(255);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Pressione a barra de espaço para jogar sozinho", width / 2, height / 2 - 60);
  textSize(34);
  text("Pressione enter para jogar com um amigo", width / 2, height / 2 + 60);
}

function desenharLinhasCampo() {
  // Linhas brancas do campo
  stroke(corLinhas); // Cor branca
  strokeWeight(3); // Espessura das linhas
  // Linha do meio
  line(width / 2, 0, width / 2, height);

  // Círculo central em verde
  fill(corCampoAtual); // Cor verde para o círculo central
  stroke(corLinhas); // Cor branca
  strokeWeight(3); // Espessura das linhas
  ellipse(width / 2, height / 2, 100, 100);

  // Retângulos das áreas
  noFill();
  rect(0, height / 4, 100, height / 2);
  rect(width - 100, height / 4, 100, height / 2);
}

function desenharRaquetes() {
  // Detalhes visuais das raquetes
  fill(corPlacarAtual); // Cor turquesa para as raquetes
  stroke(corBola); // Cor branca para a borda das raquetes
  strokeWeight(2); // Espessura da borda
  rect(10, posicaoJogadorY - alturaRaquete / 2, larguraRaquete, alturaRaquete, 5); // Raquete do jogador com bordas arredondadas e borda branca
  rect(width - 10 - larguraRaquete, posicaoComputadorY - alturaRaquete / 2, larguraRaquete, alturaRaquete, 5); // Raquete do computador com bordas arredondadas e borda branca
}

function desenharBola() {
  // Efeito de animação para a bola (oscilação de tamanho)
  let tamanhoAnimado = tamanhoBola + sin(frameCount * 0.1) * 5;
  fill(corBola); // Cor branca
  noStroke();
  ellipse(bola.x, bola.y, tamanhoAnimado); // Desenha uma bola branca
  fill(corMarcaBola); // Cor amarela para a marcação de uma bola de tênis
  ellipse(bola.x, bola.y, tamanhoAnimado / 1.2); // Desenha a marcação amarela na bola
}

function moverRaqueteComputador() {
  // IA simples: Computador segue a posição vertical da bola continuamente
  if (posicaoComputadorY < bola.y) {
    posicaoComputadorY += velocidadeComputador;
  } else if (posicaoComputadorY > bola.y) {
    posicaoComputadorY -= velocidadeComputador;
  }

  // Garantir que a raquete do computador não saia da tela
  posicaoComputadorY = constrain(posicaoComputadorY, alturaRaquete / 2, height - alturaRaquete / 2);
}

function moverBola() {
  bola.x += velocidadeBolaX;
  bola.y += velocidadeBolaY;

  // Verificar colisões com as paredes
  if (bola.y - tamanhoBola / 2 < 0 || bola.y + tamanhoBola / 2 > height) {
    velocidadeBolaY *= -1;
    bola.y = constrain(bola.y, tamanhoBola / 2, height - tamanhoBola / 2); // Garantir que a bola não saia da tela
  }

  // Verificar colisões com as raquetes
  if (bola.x - tamanhoBola / 2 < 10 + larguraRaquete && // Bola toca na raquete do jogador
    bola.y + tamanhoBola / 2 >= posicaoJogadorY - alturaRaquete / 2 &&
    bola.y - tamanhoBola / 2 <= posicaoJogadorY + alturaRaquete / 2) {
    velocidadeBolaX *= -1;
    let deltaY = bola.y - posicaoJogadorY;
    velocidadeBolaY = map(deltaY, -alturaRaquete / 2, alturaRaquete / 2, -5, 5); // Ajustar a velocidade vertical da bola com base na posição da raquete do jogador
    let dir = (velocidadeBolaY > 0) ? 1 : -1; // Direção da bola após o rebote (cima ou baixo)
    velocidadeBolaY = abs(velocidadeBolaY) * dir; // Tornar a velocidade vertical positiva após o rebote
    velocidadeBolaX *= 1.2; // Aumentar a velocidade horizontal da bola em 20% após colisão
    bola.x = 10 + larguraRaquete + tamanhoBola / 2 + 1; // Reposicionar ligeiramente fora da raquete para evitar colisão contínua
  } else if (bola.x + tamanhoBola / 2 > width - 10 - larguraRaquete && // Bola toca na raquete do computador
    bola.y + tamanhoBola / 2 >= posicaoComputadorY - alturaRaquete / 2 &&
    bola.y - tamanhoBola / 2 <= posicaoComputadorY + alturaRaquete / 2) {
    velocidadeBolaX *= -1;
    let deltaY = bola.y - posicaoComputadorY;
    velocidadeBolaY = map(deltaY, -alturaRaquete / 2, alturaRaquete / 2, -5, 5); // Ajustar a velocidade vertical da bola com base na posição da raquete do computador
    let dir = (velocidadeBolaY > 0) ? 1 : -1; // Direção da bola após o rebote (cima ou baixo)
    velocidadeBolaY = abs(velocidadeBolaY) * dir; // Tornar a velocidade vertical positiva após o rebote
    velocidadeBolaX *= 1.06; // Aumentar a velocidade horizontal da bola em 6% após colisão
    bola.x = width - 10 - larguraRaquete - tamanhoBola / 2 - 1; // Reposicionar ligeiramente fora da raquete para evitar colisão contínua
  }

  // Verificar gols
  // Verificar gols
  if (bola.x < 0) {
    placar.computador++;
    velocidadeJogador++;
    pontuacaoMoedasJogador = 0;
    resetarBola();
    narrarPlacar(); // Narrar o placar atual após o gol
  } else if (bola.x > width) {
    placar.jogador++;
    velocidadeComputador++;
    pontuacaoMoedasComputador = 0;

    resetarBola();
    narrarPlacar(); // Narrar o placar atual após o gol
  }
}

function resetarBola() {
  bola = createVector(width / 2, height / 2);
  velocidadeBolaX = random([-5, 5]);
  velocidadeBolaY = random([-5, 5]);
}

function verificarColisoes() {
  // Garantir que as raquetes não saiam da tela
  posicaoJogadorY = constrain(posicaoJogadorY, alturaRaquete / 2, height - alturaRaquete / 2);
  posicaoComputadorY = constrain(posicaoComputadorY, alturaRaquete / 2, height - alturaRaquete / 2);
}

function mostrarPlacar() {
  // Fundo da pontuação
  fill(corPlacarAtual ); // Cor verde escuro para o fundo da pontuação
  stroke(corLinhas ); // Cor branca para a borda do fundo da pontuação
  strokeWeight(2); // Espessura da borda
  rect(width / 2 - 50, 10, 100, 40, 5); // Fundo retangular para a pontuação
  
  // Texto da pontuação
  fill(corLinhas ); // Cor branca para o texto da pontuação
  textSize(24);
  textAlign(CENTER, CENTER); // Centralizar o texto horizontal e verticalmente
  text(placar.jogador + " - " + placar.computador, width / 2, 30); // Pontuação (posição vertical ajustada para 30)
}

function mostrarPlacarMoedas() {
  // Fundo da pontuação
  let fundoLargura = 100;
  let fundoAltura = 40;
  let fundoX = width / 2 - fundoLargura / 2; // Posição horizontal centralizada
  let fundoY = height - 50; // Posição vertical na parte de baixo da tela

  fill(corPlacarAtual); // Cor verde escuro para o fundo da pontuação
  stroke(corLinhas); // Cor branca para a borda do fundo da pontuação
  strokeWeight(2); // Espessura da borda
  rect(fundoX, fundoY, fundoLargura, fundoAltura, 5); // Fundo retangular para a pontuação

  // Texto da pontuação
  fill(corLinhas); // Cor branca para o texto da pontuação
  textSize(24);
  textAlign(CENTER, CENTER); // Centralizar o texto horizontal e verticalmente
  text("😡" + pontuacaoMoedasJogador+"😡" + pontuacaoMoedasComputador, width / 2, height - 30); // Pontuação (posição centralizada na parte de baixo da tela)
}

function moverRaqueteJogador() {
  // Mover o jogador para cima quando a tecla de seta para cima estiver pressionada
  if (keyIsDown(87)) {
    posicaoJogadorY -= velocidadeJogador;
  }

  // Mover o jogador para baixo quando a tecla de seta para baixo estiver pressionada
  if (keyIsDown(83)) {
    posicaoJogadorY += velocidadeJogador;
  }
}

function moverRaqueteJogador2() {
  // Mover o jogador para cima quando a tecla de seta para cima estiver pressionada
  if (keyIsDown(UP_ARROW)) {
    posicaoComputadorY -= velocidadeComputador;
  }

  // Mover o jogador para baixo quando a tecla de seta para baixo estiver pressionada
  if (keyIsDown(DOWN_ARROW)) {
    posicaoComputadorY += velocidadeComputador;
  }
}

function criarMoeda() {
  // Cria uma moeda na faixa central do campo
  let x = random(width - larguraFaixaCentral) + larguraFaixaCentral / 2;
  let y = random(height);
  let moeda = createVector(x, y);
  moedas.push(moeda);
}

function desenharMoedas() {
  textAlign(CENTER, CENTER); // Centralizar o texto do emoji
  textSize(tamanhoMoeda+4); // Tamanho do emoji igual ao tamanho da moeda
  for (let moeda of moedas) {
    
    // Desenhar o emoji de raiva no local da moeda
    fill(corMoeda); // Cor da moeda (amarela)
    text("⚪", moeda.x, moeda.y);
  }
    textSize(tamanhoMoeda); // Tamanho do emoji igual ao tamanho da moeda
  for (let moeda of moedas) {
    
    // Desenhar o emoji de raiva no local da moeda
    fill(corMoeda); // Cor da moeda (amarela)
    text("😡", moeda.x, moeda.y);
  }
}

function moverMoedas() {
  // Move as moedas para a esquerda
  for (let moeda of moedas) {
    moeda.x -= 0;
  }
}

function verificarColisaoMoedas() {
  // Verifica colisões entre a bola e as moedas
  for (let i = moedas.length - 1; i >= 0; i--) {
    let moeda = moedas[i];
    if (dist(bola.x, bola.y, moeda.x, moeda.y) < tamanhoBola / 2 + tamanhoMoeda / 2) {
      // Bola colidiu com a moeda
      velocidadeBolaX *= -1.2;

      moedas.splice(i, 1); // Remove a moeda após a colisão
      if (velocidadeBolaX >= 0){
       pontuacaoMoedasComputador++;
      }
      else{
       pontuacaoMoedasJogador++;

      }

      criarMoeda(); // Cria uma nova moeda na faixa central
    }
  }
}

function mostrarCronometro() {
  let tempoDecorrido = millis() - tempoInicioJogo;
  let tempoRestante = duracaoJogo - tempoDecorrido;
  
  if (tempoRestante < 0) {
    tempoRestante = 0;
  }

  let segundos = Math.floor(tempoRestante / 1000);
  let minutos = Math.floor(segundos / 60);
  segundos %= 60;
  
  fill(corLinhas);
  textSize(24);
  textAlign(LEFT, TOP);
  text( nf(minutos, 2) + ":" + nf(segundos, 2), 10, 10);
}

function exibirGameOver() {
  stroke(corCampoAtual); // Cor verde para a borda
  strokeWeight(6); // Espessura da borda
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height/2 +20);
  bola.x = width / 2;
  bola.y = height / 2;
  if (repeticaoNarrador<1){
      fimDoJogo();
    repeticaoNarrador++;
  }
  pontuacaoFinalJogador = placar.jogador + pontuacaoMoedasJogador;
  pontuacaoFinalComputador = placar.computador + pontuacaoMoedasComputador;
  if (pontuacaoFinalJogador > pontuacaoFinalComputador){
      text("Jogador Venceu!", width / 2, height/2 - 30);
  }
  if (pontuacaoFinalJogador < pontuacaoFinalComputador){
      text("Computador Venceu!", width / 2, height/2 - 30);
  }
  if (pontuacaoFinalJogador == pontuacaoFinalComputador){
      text("Empate!", width / 2, height/2 - 30);
  }
  textSize(25);
  text(pontuacaoFinalJogador + " - " + pontuacaoFinalComputador, width / 2, height/2 - 80);
    textSize(20);
  
  text("Pressione a barra de espaço para jogar sozinho", width / 2, height / 2 + 113);
  text("Pressione enter para jogar com um amigo", width / 2, height / 2 + 135);
}

function verificarFimJogo() {
  let tempoDecorrido = millis() - tempoInicioJogo;
  if (tempoDecorrido >= duracaoJogo) {
    jogoFinalizado = true;
  }
}

function narrarPlacar() {
  let msg;
  if (placar.jogador > placar.computador) {
    msg = new SpeechSynthesisUtterance(` ${placar.jogador} a ${placar.computador}`);
  } else if (placar.jogador < placar.computador) {
    msg = new SpeechSynthesisUtterance(`${placar.jogador} a ${placar.computador}`);
  } else {
    msg = new SpeechSynthesisUtterance(`Empate!`);
  }
  window.speechSynthesis.speak(msg);
}

function fimDoJogo() {
  let msg;
    msg = new SpeechSynthesisUtterance(`Alguem Venceu!`);
  window.speechSynthesis.speak(msg);
}

function keyPressed() {
  // Verificar se a tecla pressionada é a barra de espaço (código 32)
  if (keyCode === 32) {
    // Iniciar ou reiniciar o jogo
    if (!jogoIniciado || jogoFinalizado) {
      jogoIniciado = true; // Marcar o jogo como iniciado
      jogoFinalizado = false;
      placar.jogador = 0;
      placar.computador = 0;
      velocidadeJogador = 4;
      if (jogadorDois){
      velocidadeComputador = 4;        
      } else {
      velocidadeComputador = 1;        
      }
      pontuacaoMoedasJogador = 0;
      pontuacaoMoedasComputador = 0;
      repeticaoNarrador = 0;

      // Criar moedas novamente
      moedas = [];
      for (let i = 0; i < 5; i++) {
        criarMoeda();
      }

      // Reiniciar o cronômetro
      tempoInicioJogo = millis();
    }
  } else if (keyCode === ENTER) {
        // Iniciar ou reiniciar o jogo
    if (!jogoIniciado || jogoFinalizado) {
      jogoIniciado = true; // Marcar o jogo como iniciado
      jogoFinalizado = false;
      jogadorDois = true
      placar.jogador = 0;
      placar.computador = 0;
      velocidadeJogador = 4;
      if (jogadorDois){
      velocidadeComputador = 4;        
      } else {
      velocidadeComputador = 1;        
      }
      pontuacaoMoedasJogador = 0;
      pontuacaoMoedasComputador = 0;
      repeticaoNarrador = 0;

      // Criar moedas novamente
      moedas = [];
      for (let i = 0; i < 5; i++) {
        criarMoeda();
      }

      // Reiniciar o cronômetro
      tempoInicioJogo = millis();
    }
  }
}