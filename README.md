# BETFREE IA

Plataforma de apoio para pessoas que desejam vencer o vício em apostas esportivas e cassinos online, construída em HTML, CSS e JavaScript puro — sem backend.

## Estrutura

```
betfree-ia/
├── index.html     → Landing page + área logada (dashboard, chat, diário, planos, conquistas, relatórios, configurações, emergência)
├── style.css       → Design system (tema escuro, glassmorphism, azul + verde)
├── script.js       → Toda a lógica da aplicação (estado, navegação, motor de respostas da IA, gráficos)
├── data.js         → Conteúdo estático (FAQ, depoimentos, planos, conquistas, base de respostas da IA)
└── README.md
```

## Como funciona

- **Sem servidor**: todo o progresso do usuário (avaliação, histórico, plano, chat) é salvo no `localStorage` do próprio navegador. Nada é enviado para a internet.
- **IA por regras**: o chat usa um motor de respostas baseado em palavras-chave (arquivo `data.js`, objeto `chatRegras`), pensado especificamente para apoio em recuperação de vício em apostas — sem depender de nenhuma API paga.
- **Gráficos**: feitos com [Chart.js](https://www.chartjs.org/), carregado via CDN.

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex: `betfree-ia`).
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. No GitHub, vá em **Settings → Pages**.
4. Em "Source", selecione a branch `main` e a pasta `/ (root)`.
5. Salve. Em alguns minutos o site estará disponível em:
   `https://SEU-USUARIO.github.io/betfree-ia/`

Não é necessário nenhum passo de build — os arquivos já estão prontos para produção.

## Integrações futuras (estrutura preparada)

O código foi organizado para facilitar a evolução futura sem reescrever a base:

- **IA real (OpenAI / Claude / Gemini)**: substitua a função `gerarRespostaIA()` em `script.js` por uma chamada `fetch` a um backend leve que faça a ponte com a API escolhida (nunca exponha chaves de API diretamente no front-end).
- **Persistência em nuvem (Supabase / Firebase)**: troque as funções `carregarEstado()` e `salvarEstado()` por chamadas ao SDK escolhido, mantendo a mesma assinatura para não precisar alterar o restante do app.
- **Pagamentos (Stripe / Mercado Pago)**: crie uma nova view (`view-assinatura`) seguindo o mesmo padrão das demais e adicione os botões de checkout apontando para os links de pagamento.

## Aviso importante

O BETFREE IA é uma ferramenta de **apoio e acompanhamento**, não um tratamento médico, psicológico ou substituto de terapia. Não faz e não deve fazer promessas de cura. Em casos de sofrimento intenso ou risco à vida, a orientação é procurar ajuda profissional imediatamente (psicólogo, psiquiatra, CAPS, Jogadores Anônimos ou o CVV — 188).
