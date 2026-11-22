# Sistema Demo YouShop Prisma

YouShop Prisma é um **cockpit de auditoria preventiva e explicável** para campanhas de marketing e afiliados. A aplicação cruza a promessa feita pelo Creator na mídia, as regras oficiais cadastradas pelo Produtor e os sinais de suporte dos compradores para apontar divergências **antes** de uma oferta chegar ao checkout.

Os dados deste repositório são **sintéticos e de demonstração**: um seed com métricas agregadas (45 campanhas) e 3 campanhas detalhadas com evidências completas.

## O que o sistema faz

- **Dashboard:** mostra o ICO médio (índice de alinhamento da oferta, 0–100), variação, contagem de campanhas críticas/atencão/alinhadas, relatos do dia e uma fila de inspeção ordenada pelo menor ICO.
- **Diagnóstico da campanha:** explica a causa-raiz com o timestamp da promessa, classifica os pilares **escopo**, **prazo** e **preço** como `Alinhado` ou `Divergente` e registra o nível de confiança.
- **Evidências:** apresenta lado a lado a transcrição segmentada do Creator, o SKU/formato/prazo/garantia/valor do Produtor e os tickets de suporte já anonimizados dos compradores.
- **Reauditoria sob demanda:** o usuário pode pedir uma nova análise da campanha; o resultado informa explicitamente se veio do modelo de IA ou do modo determinístico.
- **Ação operacional:** registra a decisão do auditor (por exemplo, notificar Creator/Produtor) e muda o status da campanha para `RESOLVIDO`.
- **MCP Server embutido:** expõe as consultas de evidências como ferramentas MCP auditáveis, consumíveis por clientes externos via SSE.

## Como funciona

1. **Ingestão sanitizada (LGPD).** No boot, `SeedDataLoader` lê `data/campanhas.json`. Antes de qualquer ferramenta ou modelo, `SanitizadorLgpd` substitui nome, CPF, e-mail e telefone por tokens (`[NOME]`, `[CPF]`, `[EMAIL]`, `[TELEFONE]`) e **omite estruturalmente** esses campos do DTO público `Ticket`. O resultado fica em um repositório em memória (`CampanhaRepository`). A sanitização é determinística: a mesma entrada sempre gera a mesma saída.
2. **Leitura no front.** A SPA Angular consome `/api/dashboard` e `/api/campanhas/{id}` via `HttpClient`. As rotas `/campanha/:id` e `/campanha/:id/evidencias` são encaminhadas pelo Spring ao `index.html`, então não há CORS nem servidor de desenvolvimento em produção.
3. **Ferramentas MCP.** `FerramentasMcp` publica três `@Tool` com contratos em `records` imutáveis:
   - `consultarPromessaMidia` — transcrição segmentada, promessas extraídas e timestamp;
   - `consultarRegrasProduto` — formato, prazo de acesso, garantia e valor oficial a partir do SKU;
   - `consultarSinaisSuporte` — volume de chamados, tickets sanitizados e T.M.R.
4. **Orquestração da reauditoria.** `POST /api/auditoria/{id}/reprocessar` chama o `OrquestradorAuditoriaService`, que executa as três ferramentas, monta um prompt somente com evidências sanitizadas e, quando há chave de API, envia texto + mídia (`image/jpeg`) ao `ChatClient` com `temperature=0`, tool callbacks e **Structured Outputs** no formato `DiagnosticoICOResult` (JSON Schema).
5. **Fallback determinístico.** Se `OPENAI_API_KEY` não estiver definida — ou se a chamada ao modelo falhar — o orquestrador cruza os mesmos dados MCP com regras fixas e preserva o ICO do seed. O campo `origem` da resposta diz `chatclient-multimodal-openai` ou `fallback-deterministico`, garantindo rastreabilidade.
6. **Decisão.** `POST /api/auditoria/{id}/acao` registra a ação com evidência, timestamp e novo status; a interface exibe a notificação correspondente.

> A chave da IA **não** fica no `application.properties`. Ela é lida da variável de ambiente `OPENAI_API_KEY` em `AiChatClientConfiguration`; sem ela, o bean `ChatClient` sequer é criado. Veja a seção [Configuração da IA](#configuração-da-ia).

## Arquitetura: monolito modular em camadas

O sistema é um **monolito modular em camadas**: uma única aplicação Spring Boot gera um **JAR único** que serve a SPA, a API REST e o MCP Server no mesmo processo e na mesma origem (`http://localhost:8080`). Não há microsserviços nem chamadas de rede entre os módulos internos; a modularização é feita por pacotes Java com dependências unidirecionais.

```text
frontend/                         SPA Angular (camada de apresentação)
  src/app/features/               dashboard, diagnostico, evidencias (lazy loading)
  src/app/core/                   models, service HttpClient, estado com Signals
  src/app/shared/                 componentes reutilizáveis (badges)

backend/src/main/java/com/youshop/prisma/
  web/                            camada de interface: controllers REST + fallback SPA + CORS
  orchestrator/                   camada de aplicação: orquestrador + configuração do ChatClient
  mcp/                            camada de integração: @Tool e ToolCallbackProvider (SSE)
  domain/                         contratos imutáveis (records) do domínio
  ingestion/                      seed JSON + repositório em memória
  lgpd/                           sanitização determinística de dados pessoais
  config/                         configuração web
backend/src/main/resources/       application.properties, data/campanhas.json, static/ (bundle)
```

Camadas e responsabilidades:

| Camada | Papel no monolito |
| --- | --- |
| Apresentação | Componentes standalone Angular, roteamento com `loadComponent`, `signals` para estado reativo, Tailwind CSS para o visual. |
| Web / API | `DashboardController`, `CampanhaController`, `AuditoriaController` e `SpaController`; `CorsConfig` libera apenas origens de desenvolvimento/túneis. |
| Aplicação | `OrquestradorAuditoriaService` coordena ingestão → ferramentas MCP → modelo → ICO; `AiChatClientConfiguration` cria o `ChatClient` condicionalmente. |
| Integração MCP | `FerramentasMcp` expõe consultas isoladas por domínio (Creator, Produtor, Comprador); `McpToolsConfiguration` registra os callbacks; o servidor WebMVC/SSE publica `/sse` e `/mcp/message`. |
| Domínio | `Campanha`, `Diagnostico`, `Evidencias`, `Ticket`, `ReprocessamentoResult` etc., todos como `records` imutáveis. |
| Dados e conformidade | `SeedDataLoader` + `SanitizadorLgpd` + repositório em memória — sem banco de dados externo, ideal para a demo. |

## Ferramentas utilizadas

| Categoria | Ferramenta | Uso |
| --- | --- | --- |
| Backend | Java 21, Spring Boot 3.5.16, Spring Web MVC | API REST, servidor embutido, injeção de dependências. |
| IA / MCP | Spring AI 1.1.8 — MCP Server WebMVC/SSE, `ChatClient`, Tool Calling, Structured Outputs | Ferramentas auditáveis, chamada multimodal e resposta validada por JSON Schema. |
| Modelo | OpenAI `gpt-4o-mini` (opcional) | Consolidação do diagnóstico quando a chave está disponível. |
| Serialização | Jackson | Leitura do seed e JSON da API. |
| Build backend | Maven 3.9, Spring Boot Maven Plugin | Empacotamento do JAR executável. |
| Frontend | Angular 22.2, TypeScript 6.0, RxJS 7.8 | SPA standalone, lazy loading, reatividade com Signals. |
| UI | Tailwind CSS 3.4, PostCSS, Autoprefixer | Estilização e design system visual. |
| Build frontend | Angular CLI / `@angular/build`, npm 12.1.0 | Geração do bundle estático. |
| Testes | JUnit 5 e Mockito (`spring-boot-starter-test`) | Testes unitários e de integração dos gates, endpoints e LGPD. |
| Infraestrutura | Docker (build multi-stage), Docker Compose v2, JRE 21 | Execução reproduzível em qualquer máquina, healthcheck e limite de memória. |

## Rotas e endpoints

| Método | Caminho | Descrição |
| --- | --- | --- |
| `GET` | `/` | SPA (dashboard). |
| `GET` | `/campanha/{id}` | Tela de diagnóstico (fallback para `index.html`). |
| `GET` | `/campanha/{id}/evidencias` | Tela de evidências (fallback para `index.html`). |
| `GET` | `/api/dashboard` | Métricas e resumo das campanhas. |
| `GET` | `/api/campanhas/{id}` | Detalhe completo de uma campanha. |
| `POST` | `/api/auditoria/{id}/reprocessar` | Nova auditoria (IA ou fallback) com relatório de origem. |
| `POST` | `/api/auditoria/{id}/acao` | Registro de ação operacional e mudança de status. |
| `GET` | `/sse` | Canal SSE do MCP Server. |
| `POST` | `/mcp/message` | Canal de mensagens do MCP Server (ferramentas `consultarPromessaMidia`, `consultarRegrasProduto`, `consultarSinaisSuporte`). |

## Execução com Docker (recomendado em outras máquinas)

Requer apenas Docker com Compose v2. O build é autocontido: Node 24, Maven e JDK 21 ficam nas camadas de build da imagem — nada precisa ser instalado no host.

```bash
docker compose up -d --build     # build + start em segundo plano
# ou, sem Compose:
docker build -t youshop-prisma:local .
docker run --rm -p 8080:8080 youshop-prisma:local
```

Acesse `http://localhost:8080/`. Para usar outra porta no host, defina `HOST_PORT=9090` (ou copie `.env.example` para `.env` e ajuste). O container sempre escuta na porta 8080, roda como usuário não-root, aplica `-Xmx350m` e possui healthcheck em `/`.

Comandos úteis:

```bash
docker compose ps                 # status + healthcheck
docker compose logs -f            # acompanhar logs
docker compose down               # parar e remover o container
docker compose up -d --build      # rebuild após alterar código
```

## Execução local (Etapa 5)

```bash
./build.sh   # Angular -> backend/src/main/resources/static/ -> JAR unico
./run.sh     # java -Xmx350m -jar backend/target/youshop-prisma-0.0.1-SNAPSHOT.jar
```

Requer Node/npm, Maven e JDK 21 instalados. Para rodar os testes: `cd backend && mvn test`.

## Configuração da IA

A credencial é fornecida apenas por variável de ambiente:

```bash
# Docker Compose
cp .env.example .env
# descomente e preencha: OPENAI_API_KEY=sk-...
docker compose up -d --build

# Docker puro
docker run --rm -p 8080:8080 -e OPENAI_API_KEY='sk-...' youshop-prisma:local

# Execução local
export OPENAI_API_KEY='sk-...'
./run.sh
```

Variáveis disponíveis:

| Variável | Padrão | Finalidade |
| --- | --- | --- |
| `OPENAI_API_KEY` | vazia | Habilita o `ChatClient`; sem ela, usa o fallback determinístico. |
| `YOUSHOP_AI_OPENAI_MODEL` | `gpt-4o-mini` | Modelo usado quando a chave está definida. |
| `HOST_PORT` | `8080` | Porta publicada no host pelo Compose. |
| `TZ` | `UTC` | Fuso horário do container. |

> Nunca commite a chave: `.env` está no `.gitignore`. O MCP Server funciona sem credencial, pois suas ferramentas consultam apenas os dados locais sanitizados.
