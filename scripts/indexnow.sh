#!/usr/bin/env bash
# Ping IndexNow (Bing, Yandex) avec toutes les URL du sitemap, après chaque déploiement (RECETTE §13).
# La clé est celle de site-config.ts (INDEXNOW_KEY), servie à la racine : /<clé>.txt
# Usage : scripts/indexnow.sh [https://tempodemain.fr]
set -euo pipefail
SITE="${1:-https://tempodemain.fr}"
KEY=$(grep -oE "INDEXNOW_KEY = '[a-f0-9]+'" "$(dirname "$0")/../src/data/site-config.ts" | grep -oE "[a-f0-9]{32}")
URLS=$(curl -s "$SITE/sitemap-0.xml" | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g' | jq -R . | jq -s .)
HOST=$(echo "$SITE" | sed -E 's#https?://##')
curl -s -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"$SITE/$KEY.txt\",\"urlList\":$URLS}" -w "\nHTTP %{http_code}\n"
