const personagem = document.getElementById('personagem');
const cenario = document.getElementById('cenario');
const porta = document.getElementById('porta');
const transicao = document.getElementById('transicao');
const balaoFala = document.getElementById('balao-fala');
const fundoVideo = document.getElementById('fundo-video');

const telaStart = document.getElementById('tela-start');
const btnJogar = document.getElementById('btn-jogar');
const telaIntro = document.getElementById('tela-intro');
const videoIntro = document.getElementById('video-intro');
const btnPular = document.getElementById('btn-pular');
const musicaFundo = document.getElementById('musica-fundo');
const cena2 = document.getElementById('cena2');
const textoFala = document.getElementById('texto-fala'); 
//que baguio diabolico;-;

let posX = 100;
const velocidade = 8;
let saiuDoCenario = false;
let naIntroducao = true;
let emDialogo = false;

const teclas = {
    ArrowLeft: false,
    ArrowRight: false, 
    a: false,
    d: false
};

// Clique único e limpo para iniciar vídeo e música
btnJogar.addEventListener('click', () => {
    telaStart.style.display = 'none';

    // Inicia a música de fundo mais baixa durante a introdução
    if (musicaFundo) {
        musicaFundo.volume = 0.2; 
        musicaFundo.play().catch(() => {});
    }

    // Inicia o vídeo de introdução do zero e com som
    videoIntro.currentTime = 0;
    videoIntro.muted = false;
    videoIntro.play().catch((erro) => {
        console.log("Vídeo não pôde iniciar, indo para o laboratório:", erro);
        finalizarIntro();
    });
});

function finalizarIntro() {
    if (!naIntroducao) return;
    naIntroducao = false;
    videoIntro.pause();
    telaIntro.style.display = 'none';
    
    // Aumenta o volume da música quando o jogo começa
    if (musicaFundo) {
        musicaFundo.volume = 0.1;
    }
    
    balaoFala.style.display = 'block';
    emDialogo = true;
}

videoIntro.addEventListener('ended', finalizarIntro);
btnPular.addEventListener('click', finalizarIntro);

function fecharDialogo() {
    if (!emDialogo) return;
    emDialogo = false;
    balaoFala.style.display = 'none';
}

balaoFala.addEventListener('click', fecharDialogo);

window.addEventListener('keydown', (event) => {
    if (naIntroducao) {
        if (event.key === 'Escape') finalizarIntro();
        return;
    }

    if (emDialogo) {
        if (event.key === ' ' || event.key === 'Enter') {
            fecharDialogo();
        }
        return;
    }

    if (event.key in teclas) {
        teclas[event.key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key in teclas) {
        teclas[event.key] = false;
    }
});

function verificarColisaoPorta() {
    if (saiuDoCenario) return;

    const rectPersonagem = personagem.getBoundingClientRect();
    const rectPorta = porta.getBoundingClientRect();

    if (
        rectPersonagem.right >= rectPorta.left &&
        rectPersonagem.left <= rectPorta.right &&
        rectPersonagem.bottom >= rectPorta.top &&
        rectPersonagem.top <= rectPorta.bottom
    ) {
        saiuDoCenario = true;
        transicao.style.opacity = '1'; // Escurece a tela

        setTimeout(() => {
            // Troca os cenários
            fundoVideo.style.display = 'none';
            porta.style.display = 'none';
            cena2.style.display = 'block';

            // personagem no canto esquerdo da nova cena
            posX = 100;
            personagem.style.left = posX + 'px';
            personagem.style.transform = 'scaleX(1)'; // Garante que ela olhe para a direita
            personagem.style.display = 'block';

            //Clareia a tela e abre o novo balão de fala
            transicao.style.opacity = '0';
            
            textoFala.innerText = "Que....lugar é esse??";
            balaoFala.style.left = "150px"; // Posição do balão na nova cena
            balaoFala.style.display = 'block';
            emDialogo = true; //Trava a personagem até o jogador fechar o balão
        }, 800);
    }
}

function atualizarJogo() {
    //andar no Cenário 2 também!
    if (!naIntroducao && !emDialogo) {
        const limiteEsquerdo = 0;
        const limiteDireito = cenario.clientWidth - personagem.clientWidth;

        if ((teclas.ArrowLeft || teclas.a) && posX > limiteEsquerdo) {
            posX -= velocidade;
            personagem.style.transform = 'scaleX(-1)';
        }

        if ((teclas.ArrowRight || teclas.d) && posX < limiteDireito) {
            posX += velocidade;
            personagem.style.transform = 'scaleX(1)';
        }

        personagem.style.left = posX + 'px';

        // verifica a colisão com a porta enquanto ainda estiver no laboratório
        if (!saiuDoCenario) {
            verificarColisaoPorta();
        }
    }

    requestAnimationFrame(atualizarJogo);
}
atualizarJogo();
