/* ============================================================
   BETFREE IA — data.js
   Conteúdo estático da aplicação: textos, planos, conquistas,
   perguntas da avaliação e a "base de conhecimento" da IA de
   apoio (motor de respostas por regras/palavras-chave).

   Nenhuma informação pessoal é enviada a servidores externos.
   Tudo roda 100% no navegador do usuário.
   ============================================================ */

const BETFREE_DATA = {

  /* ---------- Frases motivacionais (rotativas por dia) ---------- */
  frasesMotivacionais: [
    "Cada dia sem apostar é uma vitória que ninguém pode tirar de você.",
    "Você não está tentando parar. Você já está parando, um dia de cada vez.",
    "A vontade é temporária. O orgulho de resistir a ela é permanente.",
    "Recuperação não é uma linha reta — é uma direção. E você está indo pra frente.",
    "O dinheiro que você não apostou hoje já é uma conquista real.",
    "Você é mais forte do que a última recaída e mais sábio do que a última aposta.",
    "Pedir ajuda é a decisão mais corajosa que alguém pode tomar.",
    "Seu eu de amanhã agradece pelo que você está resistindo hoje.",
    "Não é sobre nunca sentir vontade. É sobre o que você faz com ela.",
    "Cada 'não' que você diz para uma aposta é um 'sim' para a sua vida.",
    "O controle está voltando para as suas mãos, um dia de cada vez.",
    "Você já proyou que consegue recomeçar. Isso já é força.",
    "Progresso, não perfeição. Continue.",
    "A liberdade financeira começa com uma decisão: hoje eu não aposto.",
    "Você não perdeu tempo — você está ganhando um futuro diferente.",
    "Sentir-se ansioso não significa que você vai falhar. Significa que você é humano.",
    "Cada dia limpo reconstrói um pouco da confiança que o vício tirou de você.",
    "Ninguém aqui vai te julgar. Só te apoiar.",
    "Sua história não termina na recaída. Ela continua a partir dela.",
    "Você está reescrevendo sua relação com o dinheiro e com o tempo.",
  ],

  /* ---------- Perguntas Frequentes (landing) ---------- */
  faq: [
    {
      pergunta: "O BETFREE IA substitui terapia ou tratamento profissional?",
      resposta: "Não. O BETFREE IA é uma ferramenta de apoio diário e acompanhamento de progresso. Em casos de sofrimento intenso, pensamentos de autolesão ou vício severo, procure um psicólogo, psiquiatra ou um grupo de apoio como Jogadores Anônimos."
    },
    {
      pergunta: "Meus dados ficam salvos em algum servidor?",
      resposta: "Não. Todo o seu progresso é salvo apenas no seu próprio navegador (LocalStorage). Nada é enviado para a internet."
    },
    {
      pergunta: "A IA do BETFREE IA promete me curar do vício?",
      resposta: "Não. Nenhuma ferramenta pode prometer cura. O BETFREE IA existe para apoiar, organizar seu progresso e te acompanhar nos momentos difíceis — a jornada é sua."
    },
    {
      pergunta: "É gratuito?",
      resposta: "Sim, essa versão é totalmente gratuita e funciona direto no navegador, sem necessidade de cadastro em servidores externos."
    },
    {
      pergunta: "O que faço se sentir muita vontade de apostar agora?",
      resposta: "Use o botão vermelho de emergência 'Estou com vontade de apostar', disponível em qualquer tela do painel. Ele foi feito exatamente para esse momento."
    },
  ],

  /* ---------- Depoimentos fictícios ---------- */
  depoimentos: [
    { nome: "M.S.", dias: 214, texto: "Os primeiros 15 dias foram os mais difíceis. O check-in diário me fez perceber que eu apostava mais quando estava ansioso, não quando estava feliz." },
    { nome: "R.A.", dias: 87, texto: "O botão de emergência já me salvou de umas 3 recaídas. Só de esperar os 5 minutos, a vontade já mudava." },
    { nome: "T.O.", dias: 30, texto: "Nunca tinha visto quanto dinheiro eu realmente perdia por mês até ver o número somado aqui. Isso mudou minha cabeça." },
    { nome: "L.F.", dias: 365, texto: "Um ano. Ainda uso o app quase todo dia, mesmo sem apostar há muito tempo. Virou parte da minha rotina de me cuidar." },
  ],

  /* ---------- Avaliação inicial ---------- */
  avaliacao: [
    {
      id: "tempo",
      pergunta: "Há quanto tempo você aposta?",
      opcoes: [
        { texto: "Menos de 6 meses", pontos: 1 },
        { texto: "Entre 6 meses e 2 anos", pontos: 2 },
        { texto: "Entre 2 e 5 anos", pontos: 3 },
        { texto: "Mais de 5 anos", pontos: 4 },
      ]
    },
    {
      id: "frequencia",
      pergunta: "Quantas vezes por semana você costuma apostar?",
      opcoes: [
        { texto: "Raramente / às vezes", pontos: 1 },
        { texto: "1 a 2 vezes", pontos: 2 },
        { texto: "3 a 5 vezes", pontos: 3 },
        { texto: "Todos os dias", pontos: 4 },
      ]
    },
    {
      id: "perda",
      pergunta: "Em média, quanto você perde por mês com apostas?",
      opcoes: [
        { texto: "Até R$ 100", pontos: 1 },
        { texto: "R$ 100 a R$ 500", pontos: 2 },
        { texto: "R$ 500 a R$ 2.000", pontos: 3 },
        { texto: "Mais de R$ 2.000", pontos: 4 },
      ]
    },
    {
      id: "tentativas",
      pergunta: "Você já tentou parar antes?",
      opcoes: [
        { texto: "Nunca precisei tentar até agora", pontos: 1 },
        { texto: "Já tentei uma vez", pontos: 2 },
        { texto: "Já tentei várias vezes", pontos: 3 },
        { texto: "Tento e recaio com frequência", pontos: 4 },
      ]
    },
    {
      id: "sentimento",
      pergunta: "Como você geralmente se sente depois de perder uma aposta?",
      opcoes: [
        { texto: "Frustrado, mas esqueço rápido", pontos: 1 },
        { texto: "Incomodado por um tempo", pontos: 2 },
        { texto: "Ansioso e com vontade de recuperar o prejuízo", pontos: 3 },
        { texto: "Desesperado, culpado ou em pânico", pontos: 4 },
      ]
    },
  ],

  /* ---------- Planos por nível de risco ---------- */
  planos: {
    base7: [
      "Escreva os 3 motivos mais fortes para você querer parar.",
      "Desinstale ou bloqueie os apps de apostas do seu celular.",
      "Identifique 1 gatilho (hora do dia, lugar, sentimento) que te leva a apostar.",
      "Avise uma pessoa de confiança sobre sua decisão.",
      "Pratique 5 minutos de respiração guiada quando sentir vontade.",
      "Faça uma lista de 5 atividades para substituir o tempo que ia gastar apostando.",
      "Registre como foi essa primeira semana no diário.",
    ],
    base30: [
      "Semana 1: foco em identificar gatilhos e remover acessos fáceis às plataformas.",
      "Semana 2: construir uma rotina diária com horários ocupados nos momentos de risco.",
      "Semana 3: organizar as finanças — anote dívidas e crie um plano simples de reorganização.",
      "Semana 4: revisar o progresso, comemorar as vitórias e ajustar o que não funcionou.",
    ],
    base90: [
      "Mês 1: estabilização — controlar impulsos, remover acessos, criar rotina.",
      "Mês 2: reconstrução — cuidar das finanças, retomar relações afetadas, buscar apoio (grupo ou terapia).",
      "Mês 3: consolidação — transformar a abstinência em estilo de vida, revisar metas de longo prazo.",
    ],
  },

  /* ---------- Conquistas / badges ---------- */
  conquistas: [
    { dias: 1, titulo: "Primeiro Passo", desc: "Seu primeiro dia sem apostar.", icone: "sprout" },
    { dias: 7, titulo: "Uma Semana", desc: "7 dias seguidos sem apostar.", icone: "leaf" },
    { dias: 15, titulo: "Meio Mês", desc: "15 dias de recuperação.", icone: "wind" },
    { dias: 30, titulo: "Um Mês", desc: "30 dias sem apostar.", icone: "moon" },
    { dias: 60, titulo: "Dois Meses", desc: "60 dias de constância.", icone: "sun" },
    { dias: 90, titulo: "Três Meses", desc: "90 dias — um trimestre novo.", icone: "mountain" },
    { dias: 180, titulo: "Meio Ano", desc: "180 dias de recuperação.", icone: "compass" },
    { dias: 365, titulo: "Um Ano", desc: "365 dias sem apostar. Uma nova vida.", icone: "star" },
  ],

  /* ---------- Sugestões para tela de emergência ---------- */
  atividadesEmergencia: [
    "Beba um copo de água devagar, prestando atenção em cada gole.",
    "Ligue para alguém de confiança agora, mesmo que só para conversar sobre outro assunto.",
    "Saia para caminhar por 5 minutos, mesmo que seja só até a porta e volta.",
    "Lave o rosto com água fria.",
    "Escreva em uma folha o que você está sentindo agora, sem filtro.",
    "Assista a um vídeo curto e engraçado — mude o estímulo do seu cérebro.",
    "Arrume algo pequeno ao seu redor: uma gaveta, uma mesa, um cômodo.",
    "Abra o histórico de gastos com apostas e releia — lembre por que você começou essa jornada.",
  ],

  /* ============================================================
     MOTOR DE RESPOSTAS DA IA (baseado em regras/palavras-chave)
     Não depende de internet nem de API externa.
     ============================================================ */
  chatRegras: [
    {
      chave: ["quero apostar", "vontade de apostar", "quase apostei", "vou apostar", "não aguento"],
      respostas: [
        "Percebo que a vontade está forte agora — e tudo bem sentir isso, ela não define o que você vai fazer a seguir. Que tal usarmos o botão vermelho de emergência juntos? Ele tem um exercício de respiração e uma contagem de 5 minutos que ajuda a vontade passar.",
        "Essa vontade costuma ter um pico e depois diminuir, mesmo que pareça insuportável agora. Você consegue me contar o que aconteceu nos últimos minutos antes dessa vontade aparecer? Isso pode ser um gatilho importante para anotarmos.",
      ]
    },
    {
      chave: ["apostei", "recaí", "recaida", "recaída", "voltei a apostar", "perdi de novo"],
      respostas: [
        "Obrigado por me contar isso — não é fácil admitir uma recaída, e isso já mostra coragem. Uma recaída não apaga os dias que você já conquistou antes dela. O que importa agora é o próximo passo: quer registrar como isso aconteceu para entendermos o gatilho?",
        "Recaídas fazem parte do processo de recuperação para muita gente, e não significam que você fracassou. O que você está sentindo agora — culpa, vergonha, alívio? Estou aqui para ouvir, sem julgamento nenhum.",
      ]
    },
    {
      chave: ["ansioso", "ansiedade", "nervoso", "agoniado", "sufocado"],
      respostas: [
        "A ansiedade costuma ser um gatilho forte para apostar, porque a aposta prometia um alívio rápido. Vamos tentar uma respiração juntos: inspire em 4 segundos, segure por 4, solte em 6. Quer repetir isso comigo umas 3 vezes enquanto conversamos?",
        "Sinto muito que você esteja se sentindo assim. Me conta: essa ansiedade está ligada a alguma situação específica (dinheiro, trabalho, relação) ou é uma sensação mais geral hoje?",
      ]
    },
    {
      chave: ["triste", "tristeza", "deprimido", "sem esperança", "desanimado"],
      respostas: [
        "Sinto muito que você esteja se sentindo assim. Tristeza é uma emoção válida, especialmente reconstruindo hábitos e finanças. Você quer me contar mais sobre o que está pesando hoje?",
        "Está tudo bem não estar bem o tempo todo. Recuperação também é sobre aceitar dias difíceis sem usar a aposta como fuga. Tem alguma coisa pequena que costuma te trazer um pouco de conforto?",
      ]
    },
    {
      chave: ["feliz", "motivado", "bem hoje", "orgulhoso", "consegui"],
      respostas: [
        "Que ótimo ler isso! Guarde esse sentimento — ele é combustível para os dias mais difíceis. O que você acha que contribuiu para se sentir assim hoje?",
        "Fico feliz por você! Esse tipo de dia vale a pena ser registrado no seu diário, para você poder olhar para trás nos momentos difíceis e lembrar que eles existem.",
      ]
    },
    {
      chave: ["dinheiro", "dívida", "dívidas", "endividado", "sem grana"],
      respostas: [
        "Questões financeiras costumam pesar muito nessa jornada, e é normal se sentir sobrecarregado. Organizar as dívidas passo a passo — mesmo que devagar — costuma trazer mais controle do que evitar olhar para elas. Você já tem uma lista do que deve, mesmo que aproximada?",
        "Entendo a preocupação. Uma sugestão comum é separar as dívidas por urgência e conversar com credores sobre parcelamento. Isso não resolve tudo, mas tira o peso de carregar sozinho. Quer que eu te ajude a pensar num plano simples?",
      ]
    },
    {
      chave: ["meta", "objetivo", "desafio"],
      respostas: [
        "Ótimo pensar em metas! Que tal começarmos pequeno: uma meta para as próximas 24 horas? Pode ser 'não abrir nenhum app de apostas hoje' ou 'fazer uma caminhada quando sentir vontade'.",
        "Definir metas ajuda muito. Prefere uma meta ligada a dias sem apostar, a economia de dinheiro, ou a um novo hábito saudável?",
      ]
    },
    {
      chave: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite"],
      respostas: [
        "Olá! Que bom te ver por aqui de novo. Como você está se sentindo agora, nesse exato momento?",
        "Oi! Estou aqui para te ouvir e te apoiar hoje. Quer me contar como está o seu dia?",
      ]
    },
    {
      chave: ["obrigado", "obrigada", "valeu", "agradeço"],
      respostas: [
        "Fico feliz em poder ajudar. Estarei aqui sempre que precisar, sem hora marcada.",
        "Disponha! Cuidar de si mesmo assim, dia após dia, é um baita ato de coragem.",
      ]
    },
  ],

  respostaPadrao: [
    "Entendo. Me conta um pouco mais sobre isso — quanto mais eu entender o que você está vivendo, melhor posso te apoiar.",
    "Obrigado por compartilhar isso comigo. Como isso está afetando o seu dia hoje?",
    "Estou aqui, ouvindo. Quer me contar mais sobre o que está passando pela sua cabeça agora?",
  ],

  /* Palavras que acionam o aviso de ajuda profissional imediata */
  chaveCrise: ["suicídio", "suicidio", "me matar", "acabar com tudo", "não aguento mais viver", "quero morrer"],

  mensagemCrise: "O que você está sentindo agora é muito sério, e eu quero que você receba um cuidado que vai além do que eu posso oferecer aqui. Por favor, entre em contato agora com o CVV (Centro de Valorização da Vida) pelo telefone 188, disponível 24h e gratuito, ou pelo chat em www.cvv.org.br. Você não precisa passar por isso sozinho.",
};
