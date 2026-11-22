#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND="$ROOT/frontend"
BACKEND="$ROOT/backend"
STATIC="$BACKEND/src/main/resources/static"
BUNDLE="$FRONTEND/dist/youshop-prisma/browser"

if [ -d "$HOME/.local/jdk-21" ]; then
  export JAVA_HOME="$HOME/.local/jdk-21"
  export PATH="$JAVA_HOME/bin:$PATH"
fi

echo "[build] 1/3 compilando Angular..."
(cd "$FRONTEND" && npm run build)

echo "[build] 2/3 copiando bundle para static/..."
rm -rf "$STATIC"
mkdir -p "$STATIC"
cp -R "$BUNDLE"/. "$STATIC"/
find "$STATIC" -maxdepth 1 -type f -printf '  %f\n' | sort

echo "[build] 3/3 empacotando JAR Spring Boot..."
(cd "$BACKEND" && mvn -B clean package)

JAR=$(find "$BACKEND/target" -maxdepth 1 -name 'youshop-prisma-*.jar' ! -name '*.original' | head -1)
if [ -z "$JAR" ]; then
  echo "[build] ERRO: JAR nao encontrado em $BACKEND/target" >&2
  exit 1
fi

echo "[build] concluido: $JAR"
