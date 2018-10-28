#!/bin/bash

spinner()
{
    local PID=$!
    local DELAY=0.75
    local SPINSTR='|/-\'
    while [ "$(ps a | awk '{print $1}' | grep $PID)" ]; do
        local temp=${SPINSTR#?}
        printf "Seeding database... [%c] " "$SPINSTR"
        local SPINSTR=$temp${SPINSTR%"$temp"}
        sleep $DELAY
        printf "\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b"
    done
    printf "                        "
    printf "\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b"
}

DB_LOGIN="root"
DB_PASSWORD="gjrf123"

MATCHA_DB_DUMP="./scripts/seed_db/matcha.sql"
LOG_FILE="./scripts/seed_db/seed.log"


~/Library/Containers/MAMP/mysql/bin/mysql -u$DB_LOGIN -p$DB_PASSWORD < $MATCHA_DB_DUMP > $LOG_FILE 2>&1 &
spinner

echo "${GREEN_COLOR}"

tail -f -n 2 $LOG_FILE &

sleep 1

kill $!

echo "${NC}"

