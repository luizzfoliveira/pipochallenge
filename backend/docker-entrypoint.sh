#!/bin/sh

# Abort on any error (including if wait-for-it fails).
set -e

# Wait for the backend to be up, if we know where it is.
if [ -n "$DB_HOST" ]; then
  /backend/wait-for-it.sh -t 0 "$DB_HOST:${27017:-27017}"
fi

# Criar o banco de dados de planos, com os planos já informados
python3 /backend/init_db.py
# Inicializar o servidor
uvicorn main:app --host 0.0.0.0