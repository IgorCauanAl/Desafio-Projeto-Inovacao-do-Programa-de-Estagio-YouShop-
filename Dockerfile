# syntax=docker/dockerfile:1

# Frontend: SPA Angular
FROM node:24-bookworm-slim AS frontend-build

WORKDIR /workspace/frontend

# Versao fixada em package.json.
RUN npm install -g npm@12.1.0

# Manifests primeiro para aproveitar o cache de camadas.
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Backend: bundle embutido no JAR
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /workspace/backend

COPY backend/pom.xml ./
COPY backend/src ./src
COPY --from=frontend-build /workspace/frontend/dist/youshop-prisma/browser ./src/main/resources/static

RUN mvn -B clean package -DskipTests

# Runtime: JRE 21 + usuario nao-root
FROM eclipse-temurin:21-jre-jammy AS runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system youshop \
    && useradd --system --gid youshop --home-dir /app --create-home youshop

WORKDIR /app

COPY --from=backend-build /workspace/backend/target/youshop-prisma-0.0.1-SNAPSHOT.jar /app/youshop-prisma.jar
RUN chown -R youshop:youshop /app

USER youshop

ENV SERVER_PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=5 \
  CMD curl --fail --silent --show-error --output /dev/null http://localhost:8080/ || exit 1

# -Xmx350m definido no desafio; variaveis Spring via -e.
ENTRYPOINT ["java", "-Xmx350m", "-jar", "/app/youshop-prisma.jar"]
