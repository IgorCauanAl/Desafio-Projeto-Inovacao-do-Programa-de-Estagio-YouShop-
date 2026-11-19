#!/usr/bin/env bash
# Etapa 5 - executa o JAR unico com o limite de memoria definido no desafio.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JAR=$(find "$ROOT/backend/target" -maxdepth 1 -name 'youshop-prisma-*.jar' ! -name '*.original' | head -1)

if [ -z "$JAR" ]; then
  echo "[run] ERRO: execute ./build.sh primeiro." >&2
  exit 1
fi

echo "[run] java -Xmx350m -jar $JAR"
exec java -Xmx350m -jar "$JAR" "$@"
