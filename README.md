# Desafio-Projeto-Inovacao-do-Programa-de-Estagio-YouShop-

YouShop Prisma — cockpit de auditoria preventiva e explicável.

## Execução (Etapa 5)

```bash
./build.sh   # Angular -> backend/src/main/resources/static/ -> JAR unico
./run.sh     # java -Xmx350m -jar backend/target/youshop-prisma-0.0.1-SNAPSHOT.jar
```

A aplicação completa (UI + API + MCP Server) fica disponível em `http://localhost:8080/`.
Os deep links `/campanha/:id` e `/campanha/:id/evidencias` são encaminhados para o `index.html`
da SPA, sem CORS e sem servidor de desenvolvimento.

Sem `OPENAI_API_KEY`, o orquestrador usa o fallback determinístico sobre os dados das ferramentas
MCP; com a chave, usa `ChatClient` multimodal com Structured Outputs.
