/* ============================================================
   BETFREE IA — script.js
   Toda a lógica da aplicação. Sem backend: o estado do usuário
   é lido/gravado inteiramente em localStorage.
   ============================================================ */

const Betfree = (() => {

  const STORAGE_KEY = "betfree_ia_state_v1";
  const MS_DIA = 86400000;

  /* ---------- Estado padrão ---------- */
  function estadoPadrao(){
    return {
      nome: "",
      meta: 30,
      valorDia: 50,
      avaliacaoFeita: false,
      riskLevel: null,       // 'baixo' | 'medio' | 'alto'
      streakStart: null,     // ISO date do início da sequência atual
      historico: [],         // [{data, apostou, humor, texto}]
      planoAtivo: "7",
      planoProgresso: { "7": [], "30": [], "90": [] },
      chatHistorico: [],     // [{de:'ai'|'user', texto}]
      prefs: { dark:true, notif:true, frase:true },
      criadoEm: new Date().toISOString(),
    };
  }

  let state = carregarEstado();

  function carregarEstado(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return estadoPadrao();
      const parsed = JSON.parse(raw);
      return Object.assign(estadoPadrao(), parsed);
    }catch(e){
      console.warn("Não foi possível carregar o estado salvo, iniciando um novo.", e);
      return estadoPadrao();
    }
  }

  function salvarEstado(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  /* ---------- Utilidades ---------- */
  function diasEntre(dataIso, ate = new Date()){
    if(!dataIso) return 0;
    const d1 = new Date(dataIso);
    const diff = ate.setHours ? ate : new Date(ate);
    const ms = new Date(diff.toDateString()) - new Date(d1.toDateString());
    return Math.max(0, Math.floor(ms / MS_DIA));
  }

  function diasSemApostar(){
    if(!state.streakStart) return 0;
    return diasEntre(state.streakStart);
  }

  function nivelRecuperacao(dias){
    if(dias >= 180) return 5;
    if(dias >= 90) return 4;
    if(dias >= 30) return 3;
    if(dias >= 7) return 2;
    return 1;
  }

  function formatBRL(v){
    return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL', maximumFractionDigits:0 });
  }

  function toast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(()=> t.classList.remove('show'), 2600);
  }

  function escapeHtml(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ============================================================
     NAVEGAÇÃO ENTRE LANDING E APP
     ============================================================ */
  function abrirApp(){
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    if(!state.avaliacaoFeita){
      irPara('onboarding');
    } else {
      irPara('dashboard');
    }
  }

  function iniciarJornada(){
    abrirApp();
  }

  const VIEWS = ['onboarding','resultado','dashboard','chat','diario','planos','conquistas','relatorios','config','emergencia'];

  function irPara(viewId){
    VIEWS.forEach(v=>{
      const el = document.getElementById('view-' + v);
      if(el) el.classList.toggle('active', v === viewId);
    });
    document.querySelectorAll('.side-link').forEach(l=>{
      l.classList.toggle('active', l.dataset.view === viewId);
    });
    fecharSidebar();

    if(viewId === 'dashboard') renderDashboard();
    if(viewId === 'chat') renderChat();
    if(viewId === 'planos') renderPlanos();
    if(viewId === 'conquistas') renderConquistas();
    if(viewId === 'relatorios') renderRelatorios();
    if(viewId === 'config') renderConfig();
    if(viewId === 'emergencia') iniciarEmergencia();
    if(viewId === 'diario') renderDiario();
  }

  function toggleSidebar(){
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-backdrop').classList.toggle('open');
  }

  function fecharSidebar(){
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-backdrop').classList.remove('open');
  }

  /* ============================================================
     ONBOARDING / AVALIAÇÃO
     ============================================================ */
  let onbIndex = 0;
  let onbRespostas = [];

  function renderOnboarding(){
    onbIndex = 0;
    onbRespostas = [];
    renderOnbPergunta();
  }

  function renderOnbDots(){
    const wrap = document.getElementById('onb-dots');
    wrap.innerHTML = BETFREE_DATA.avaliacao.map((_,i)=>
      `<span class="${i < onbIndex ? 'done':''}"></span>`
    ).join('');
  }

  function renderOnbPergunta(){
    renderOnbDots();
    const q = BETFREE_DATA.avaliacao[onbIndex];
    const box = document.getElementById('onb-question');
    box.innerHTML = `
      <div class="field">
        <label style="font-size:17px;color:var(--text-hi);margin-bottom:16px;">${escapeHtml(q.pergunta)}</label>
        <div class="option-grid" style="grid-template-columns:1fr;">
          ${q.opcoes.map((op,i)=>`<button class="option-btn" data-i="${i}">${escapeHtml(op.texto)}</button>`).join('')}
        </div>
      </div>
    `;
    box.querySelectorAll('.option-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const opcao = q.opcoes[Number(btn.dataset.i)];
        onbRespostas.push(opcao.pontos);
        onbIndex++;
        if(onbIndex < BETFREE_DATA.avaliacao.length){
          renderOnbPergunta();
        } else {
          finalizarAvaliacao();
        }
      });
    });
  }

  function finalizarAvaliacao(){
    const total = onbRespostas.reduce((a,b)=>a+b,0);
    // pontuação vai de 5 a 20
    let nivel, titulo, desc, metaSugerida;
    if(total <= 9){
      nivel = 'baixo'; titulo = 'Risco Baixo';
      desc = 'Seu padrão atual indica um risco mais baixo, mas buscar apoio agora é uma escolha inteligente para prevenir que o hábito avance. Vamos montar uma rotina leve de acompanhamento.';
      metaSugerida = 30;
    } else if(total <= 14){
      nivel = 'medio'; titulo = 'Risco Médio';
      desc = 'Seu padrão mostra sinais de que as apostas já ocupam um espaço importante na sua vida. Um plano estruturado, com check-ins diários, vai te ajudar a recuperar o controle.';
      metaSugerida = 60;
    } else {
      nivel = 'alto'; titulo = 'Risco Alto';
      desc = 'Seu padrão indica um risco alto, com sinais importantes de dependência. O BETFREE IA pode te apoiar todos os dias, mas recomendamos fortemente somar isso a um acompanhamento profissional (psicólogo, psiquiatra ou grupos como Jogadores Anônimos).';
      metaSugerida = 90;
    }

    state.avaliacaoFeita = true;
    state.riskLevel = nivel;
    state.streakStart = new Date().toISOString();
    state.meta = metaSugerida;
    salvarEstado();

    const wrap = document.getElementById('risk-badge-wrap');
    wrap.innerHTML = `<div class="risk-badge risk-${nivel}">${titulo.toUpperCase()}</div>`;
    document.getElementById('risk-titulo').textContent = 'Seu plano de ' + metaSugerida + ' dias está pronto';
    document.getElementById('risk-desc').textContent = desc;

    irPara('resultado');
  }

  /* ============================================================
     DASHBOARD
     ============================================================ */
  function iconePorNome(nome, cor){
    const icones = {
      sprout: '<path d="M12 20V12M12 12C12 8 9 6 5 6c0 4 3 7 7 7Z M12 12c0-3 2-5 6-5 0 3-2 6-6 6"/>',
      leaf: '<path d="M12 21c8-2 9-9 9-16-7 0-14 1-16 9-1 4 2 7 7 7Z M5 14c4 0 8-2 10-6"/>',
      wind: '<path d="M3 8h11a3 3 0 1 0-3-3 M3 12h15a3 3 0 1 1-3 3 M3 16h9a2 2 0 1 1-2 2"/>',
      moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5Z"/>',
      sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
      mountain: '<path d="m3 20 6-11 4 6 3-4 5 9Z"/>',
      compass: '<circle cx="12" cy="12" r="9"/><path d="m14.5 9.5-2 5-5 2 2-5Z"/>',
      star: '<path d="M12 2l2.9 6.3 6.9.9-5 4.9 1.2 6.9-6-3.2-6 3.2 1.2-6.9-5-4.9 6.9-.9z"/>',
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="${cor||'currentColor'}" stroke-width="1.8">${icones[nome]||icones.star}</svg>`;
  }

  function renderRingProgresso(dias){
    const proxima = BETFREE_DATA.conquistas.find(c => c.dias > dias);
    const wrap = document.getElementById('ring-svg-wrap');
    const sub = document.getElementById('ring-sub');
    const R = 66, C = 2*Math.PI*R;
    let pct, label;
    if(!proxima){
      pct = 100; label = 'todas as conquistas desbloqueadas';
    } else {
      const anterior = [...BETFREE_DATA.conquistas].reverse().find(c => c.dias <= dias);
      const base = anterior ? anterior.dias : 0;
      pct = Math.round(((dias - base) / (proxima.dias - base)) * 100);
      label = proxima.dias + ' dias · ' + proxima.titulo;
    }
    const offset = C - (C * pct/100);
    wrap.innerHTML = `
      <div style="position:relative;width:160px;height:160px;">
        <svg viewBox="0 0 160 160" width="160" height="160">
          <circle cx="80" cy="80" r="${R}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="10"/>
          <circle cx="80" cy="80" r="${R}" fill="none" stroke="url(#ringGrad)" stroke-width="10" stroke-linecap="round"
            stroke-dasharray="${C}" stroke-dashoffset="${offset}" transform="rotate(-90 80 80)" style="transition:stroke-dashoffset .8s cubic-bezier(.22,.9,.32,1)"/>
          <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3E8EF7"/><stop offset="100%" stop-color="#16C79A"/></linearGradient></defs>
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <div class="mono" style="font-size:26px;font-weight:700;">${pct}%</div>
        </div>
      </div>`;
    sub.textContent = proxima ? ('Faltam ' + (proxima.dias - dias) + ' dias para: ' + proxima.titulo) : 'Você desbloqueou todas as conquistas 🎉';
  }

  function renderDashboard(){
    const dias = diasSemApostar();
    const economia = dias * Number(state.valorDia || 0);
    const nivel = nivelRecuperacao(dias);

    document.getElementById('dash-nome').textContent = state.nome || 'amigo(a)';
    document.getElementById('dash-boasvindas').textContent = (state.nome ? `Bem-vindo(a) de volta, ${state.nome} 👋` : 'Bem-vindo(a) de volta 👋');
    document.getElementById('metric-dias').textContent = dias;
    document.getElementById('metric-economia').textContent = formatBRL(economia);
    document.getElementById('metric-nivel').textContent = 'Nível ' + nivel;

    const metaPct = Math.min(100, Math.round((dias / (state.meta||30)) * 100));
    document.getElementById('goal-sub').textContent = `Chegar a ${state.meta || 30} dias sem apostar`;
    document.getElementById('goal-pct').textContent = metaPct + '%';
    document.getElementById('goal-bar-fill').style.width = metaPct + '%';

    renderRingProgresso(dias);

    const diaAno = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / MS_DIA);
    document.getElementById('frase-do-dia').textContent = BETFREE_DATA.frasesMotivacionais[diaAno % BETFREE_DATA.frasesMotivacionais.length];

    const list = document.getElementById('history-list');
    const recentes = [...state.historico].slice(-6).reverse();
    if(recentes.length === 0){
      list.innerHTML = '<div class="history-empty">Nenhum registro ainda. Faça seu primeiro check-in no Registro diário.</div>';
    } else {
      list.innerHTML = recentes.map(h=>`
        <div class="history-item">
          <span>${new Date(h.data).toLocaleDateString('pt-BR')} — ${h.apostou==='sim' ? 'Apostou' : 'Não apostou'}</span>
          <span class="h-mood">${capitalize(h.humor||'-')}</span>
        </div>`).join('');
    }
  }

  function capitalize(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }

  /* ============================================================
     REGISTRO DIÁRIO
     ============================================================ */
  let diarioSel = { apostou: null, humor: null };

  function renderDiario(){
    diarioSel = { apostou: null, humor: null };
    document.querySelectorAll('#diario-apostou .option-btn').forEach(b=>{
      b.classList.remove('selected');
      b.onclick = ()=>{
        document.querySelectorAll('#diario-apostou .option-btn').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
        diarioSel.apostou = b.dataset.val;
      };
    });
    document.querySelectorAll('#diario-humor .mood-btn').forEach(b=>{
      b.classList.remove('selected');
      b.onclick = ()=>{
        document.querySelectorAll('#diario-humor .mood-btn').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
        diarioSel.humor = b.dataset.val;
      };
    });
    document.getElementById('diario-texto').value = '';
  }

  function salvarRegistroDiario(){
    if(!diarioSel.apostou){
      toast('Conte pra gente: você apostou hoje ou não?');
      return;
    }
    const texto = document.getElementById('diario-texto').value.trim();
    state.historico.push({
      data: new Date().toISOString(),
      apostou: diarioSel.apostou,
      humor: diarioSel.humor,
      texto,
    });

    if(diarioSel.apostou === 'sim'){
      // reinicia a sequência a partir de hoje
      state.streakStart = new Date().toISOString();
      toast('Registro salvo. Sem julgamentos — amanhã é um novo dia. Considere conversar com a IA agora.');
    } else {
      toast('Registro salvo! Mais um dia conquistado. 🎉');
    }
    salvarEstado();
    irPara('dashboard');
  }

  /* ============================================================
     CHAT
     ============================================================ */
  function renderChat(){
    const scroll = document.getElementById('chat-scroll');
    if(state.chatHistorico.length === 0){
      const nome = state.nome ? state.nome : '';
      state.chatHistorico.push({ de:'ai', texto: `Olá${nome ? ', ' + nome : ''}! Sou a IA de apoio do BETFREE. Este é um espaço seguro, sem julgamentos. Como você está se sentindo agora?` });
      salvarEstado();
    }
    scroll.innerHTML = state.chatHistorico.map(m=>
      `<div class="msg ${m.de === 'ai' ? 'ai':'user'}${m.crise ? ' crisis':''}">${escapeHtml(m.texto)}</div>`
    ).join('');
    scroll.scrollTop = scroll.scrollHeight;
  }

  function gerarRespostaIA(texto){
    const t = texto.toLowerCase();

    for(const chaveCrise of BETFREE_DATA.chaveCrise){
      if(t.includes(chaveCrise)){
        return { texto: BETFREE_DATA.mensagemCrise, crise:true };
      }
    }
    for(const regra of BETFREE_DATA.chatRegras){
      if(regra.chave.some(k => t.includes(k))){
        const r = regra.respostas[Math.floor(Math.random()*regra.respostas.length)];
        return { texto: r };
      }
    }
    const padrao = BETFREE_DATA.respostaPadrao[Math.floor(Math.random()*BETFREE_DATA.respostaPadrao.length)];
    return { texto: padrao };
  }

  function enviarMensagem(){
    const input = document.getElementById('chat-input');
    const texto = input.value.trim();
    if(!texto) return;
    state.chatHistorico.push({ de:'user', texto });
    salvarEstado();
    renderChat();
    input.value = '';

    const scroll = document.getElementById('chat-scroll');
    const typing = document.createElement('div');
    typing.className = 'msg-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    scroll.appendChild(typing);
    scroll.scrollTop = scroll.scrollHeight;

    setTimeout(()=>{
      typing.remove();
      const resp = gerarRespostaIA(texto);
      state.chatHistorico.push({ de:'ai', texto: resp.texto, crise: resp.crise });
      salvarEstado();
      renderChat();
    }, 900 + Math.random()*500);
  }

  /* ============================================================
     PLANOS
     ============================================================ */
  function renderPlanos(){
    document.querySelectorAll('.plan-tab').forEach(t=>t.classList.toggle('active', t.dataset.plano === state.planoAtivo));
    const key = 'base' + state.planoAtivo;
    const tarefas = BETFREE_DATA.planos[key];
    if(!state.planoProgresso[state.planoAtivo] || state.planoProgresso[state.planoAtivo].length !== tarefas.length){
      state.planoProgresso[state.planoAtivo] = tarefas.map(()=>false);
      salvarEstado();
    }
    const list = document.getElementById('plan-list');
    list.innerHTML = tarefas.map((t,i)=>`
      <div class="plan-item ${state.planoProgresso[state.planoAtivo][i] ? 'done':''}" data-i="${i}">
        <div class="plan-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg></div>
        <p>${escapeHtml(t)}</p>
      </div>`).join('');
    list.querySelectorAll('.plan-item').forEach(item=>{
      item.onclick = ()=>{
        const i = Number(item.dataset.i);
        state.planoProgresso[state.planoAtivo][i] = !state.planoProgresso[state.planoAtivo][i];
        salvarEstado();
        renderPlanos();
      };
    });
  }

  function trocarPlano(p){
    state.planoAtivo = p;
    salvarEstado();
    renderPlanos();
  }

  /* ============================================================
     CONQUISTAS
     ============================================================ */
  function renderConquistas(){
    const dias = diasSemApostar();
    const grid = document.getElementById('badge-grid');
    grid.innerHTML = BETFREE_DATA.conquistas.map(c=>{
      const unlocked = dias >= c.dias;
      return `
        <div class="card badge-card ${unlocked ? 'unlocked':''}">
          <div class="badge-icon">${iconePorNome(c.icone, '#fff')}</div>
          <h4>${escapeHtml(c.titulo)}</h4>
          <p style="font-size:12px;color:var(--text-mid);">${escapeHtml(c.desc)}</p>
          <div class="b-days">${c.dias} dia${c.dias>1?'s':''}</div>
        </div>`;
    }).join('');
  }

  /* ============================================================
     RELATÓRIOS
     ============================================================ */
  let charts = {};

  function renderRelatorios(){
    const dias14 = [];
    for(let i=13;i>=0;i--){
      const d = new Date();
      d.setDate(d.getDate()-i);
      dias14.push(d);
    }
    const labels = dias14.map(d => d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}));

    // dias sem apostar acumulados dentro da streak atual, aproximação simples por data
    const streakStartDate = state.streakStart ? new Date(state.streakStart) : new Date();
    const diasSemData = dias14.map(d => {
      const diff = Math.floor((new Date(d.toDateString()) - new Date(streakStartDate.toDateString())) / MS_DIA);
      return diff >= 0 ? diff : 0;
    });
    const economiaData = diasSemData.map(d => d * Number(state.valorDia||0));

    const humorCount = { ansioso:0, triste:0, feliz:0, estressado:0, motivado:0 };
    state.historico.forEach(h=>{ if(h.humor && humorCount.hasOwnProperty(h.humor)) humorCount[h.humor]++; });

    const apostouCount = state.historico.filter(h=>h.apostou==='sim').length;
    const naoApostouCount = state.historico.filter(h=>h.apostou==='nao').length;

    const cfg = {
      color: '#A9B4CB',
      grid: 'rgba(255,255,255,0.06)',
    };
    Chart.defaults.color = cfg.color;
    Chart.defaults.borderColor = cfg.grid;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;

    destruirGraficos();

    charts.dias = new Chart(document.getElementById('chart-dias'), {
      type:'line',
      data:{ labels, datasets:[{ label:'Dias sem apostar', data:diasSemData, borderColor:'#16C79A', backgroundColor:'rgba(22,199,154,0.15)', fill:true, tension:.35, pointRadius:0 }] },
      options:{ plugins:{legend:{display:false}}, scales:{ y:{ beginAtZero:true, grid:{color:cfg.grid} }, x:{ grid:{display:false} } } }
    });

    charts.economia = new Chart(document.getElementById('chart-economia'), {
      type:'line',
      data:{ labels, datasets:[{ label:'Economia (R$)', data:economiaData, borderColor:'#3E8EF7', backgroundColor:'rgba(62,142,247,0.15)', fill:true, tension:.35, pointRadius:0 }] },
      options:{ plugins:{legend:{display:false}}, scales:{ y:{ beginAtZero:true, grid:{color:cfg.grid} }, x:{ grid:{display:false} } } }
    });

    charts.humor = new Chart(document.getElementById('chart-humor'), {
      type:'doughnut',
      data:{ labels:['Ansioso','Triste','Feliz','Estressado','Motivado'], datasets:[{ data:Object.values(humorCount), backgroundColor:['#3E8EF7','#8FC0FF','#16C79A','#FF6B6F','#E8B85C'], borderWidth:0 }] },
      options:{ plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:14 } } } }
    });

    charts.evolucao = new Chart(document.getElementById('chart-evolucao'), {
      type:'bar',
      data:{ labels:['Não apostou','Apostou'], datasets:[{ data:[naoApostouCount, apostouCount], backgroundColor:['#16C79A','#FF6B6F'], borderRadius:8 }] },
      options:{ plugins:{legend:{display:false}}, scales:{ y:{ beginAtZero:true, ticks:{ precision:0 }, grid:{color:cfg.grid} }, x:{ grid:{display:false} } } }
    });
  }

  function destruirGraficos(){
    Object.values(charts).forEach(c => c && c.destroy());
    charts = {};
  }

  /* ============================================================
     CONFIGURAÇÕES
     ============================================================ */
  function renderConfig(){
    document.getElementById('cfg-nome').value = state.nome || '';
    document.getElementById('cfg-meta').value = state.meta || 30;
    document.getElementById('cfg-valor').value = state.valorDia || 0;
    document.getElementById('switch-dark').classList.toggle('on', state.prefs.dark);
    document.getElementById('switch-notif').classList.toggle('on', state.prefs.notif);
    document.getElementById('switch-frase').classList.toggle('on', state.prefs.frase);
  }

  function toggleSwitch(el){
    el.classList.toggle('on');
    const map = { 'switch-dark':'dark', 'switch-notif':'notif', 'switch-frase':'frase' };
    const key = map[el.id];
    if(key){ state.prefs[key] = el.classList.contains('on'); salvarEstado(); }
  }

  function salvarConfig(){
    state.nome = document.getElementById('cfg-nome').value.trim();
    state.meta = Number(document.getElementById('cfg-meta').value) || 30;
    state.valorDia = Number(document.getElementById('cfg-valor').value) || 0;
    salvarEstado();
    toast('Configurações salvas.');
  }

  function exportarProgresso(){
    const blob = new Blob([JSON.stringify(state, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'betfree-ia-progresso.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Progresso exportado.');
  }

  function limparDados(){
    if(confirm('Tem certeza que deseja apagar todos os seus dados salvos? Essa ação não pode ser desfeita.')){
      localStorage.removeItem(STORAGE_KEY);
      state = estadoPadrao();
      toast('Dados apagados.');
      document.getElementById('app-shell').classList.add('hidden');
      document.getElementById('landing-page').classList.remove('hidden');
      window.scrollTo(0,0);
    }
  }

  /* ============================================================
     EMERGÊNCIA
     ============================================================ */
  let emergencyTimerId = null;

  function iniciarEmergencia(){
    document.getElementById('emergency-frase').textContent =
      BETFREE_DATA.frasesMotivacionais[Math.floor(Math.random()*BETFREE_DATA.frasesMotivacionais.length)];

    const tips = [...BETFREE_DATA.atividadesEmergencia].sort(()=>0.5-Math.random()).slice(0,4);
    document.getElementById('emergency-tips').innerHTML = tips.map(t=>`<div class="emergency-tip">${escapeHtml(t)}</div>`).join('');

    clearInterval(emergencyTimerId);
    let segundos = 5*60;
    const display = document.getElementById('emergency-timer');
    const breathText = document.getElementById('breath-text');
    const fases = ['Inspire','Segure','Solte'];
    let faseIdx = 0;

    function tick(){
      const m = String(Math.floor(segundos/60)).padStart(2,'0');
      const s = String(segundos%60).padStart(2,'0');
      display.textContent = `${m}:${s}`;
      if(segundos % 4 === 0){
        breathText.textContent = fases[faseIdx % fases.length];
        faseIdx++;
      }
      if(segundos <= 0){
        clearInterval(emergencyTimerId);
        display.textContent = '00:00';
        breathText.textContent = 'Você conseguiu';
        return;
      }
      segundos--;
    }
    tick();
    emergencyTimerId = setInterval(tick, 1000);
  }

  /* ============================================================
     LANDING PAGE — conteúdo dinâmico
     ============================================================ */
  function renderLanding(){
    const testiTrack = document.getElementById('testi-track');
    testiTrack.innerHTML = BETFREE_DATA.depoimentos.map(d=>`
      <div class="card testi-card">
        <p class="testi-quote">"${escapeHtml(d.texto)}"</p>
        <div class="testi-foot">
          <div><div class="testi-name">${escapeHtml(d.nome)}</div><div class="testi-fict">Depoimento fictício</div></div>
          <div class="testi-days">${d.dias} dias</div>
        </div>
      </div>`).join('');

    const faqList = document.getElementById('faq-list');
    faqList.innerHTML = BETFREE_DATA.faq.map((f,i)=>`
      <div class="card faq-item" data-i="${i}">
        <div class="faq-q">${escapeHtml(f.pergunta)}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        </div>
        <div class="faq-a"><p>${escapeHtml(f.resposta)}</p></div>
      </div>`).join('');
    faqList.querySelectorAll('.faq-item').forEach(item=>{
      item.querySelector('.faq-q').addEventListener('click', ()=> item.classList.toggle('open'));
    });
  }

  /* ============================================================
     INICIALIZAÇÃO
     ============================================================ */
  function init(){
    renderLanding();
    if(state.avaliacaoFeita){
      // usuário recorrente detectado localmente — ainda assim começa pela landing,
      // "Já tenho conta" ou "Começar Agora" levam direto ao painel.
    } else {
      // garante que o onboarding será exibido corretamente quando solicitado
      document.getElementById('view-onboarding').addEventListener('transitionend', ()=>{});
    }
    // prepara a primeira pergunta do onboarding antecipadamente
    renderOnboarding();
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    abrirApp, iniciarJornada, irPara, toggleSidebar,
    enviarMensagem, salvarRegistroDiario, trocarPlano,
    salvarConfig, toggleSwitch, exportarProgresso, limparDados,
  };
})();
