#!/bin/bash

# Vérifier que l'argument est fourni
if [ -z "$1" ]; then
  echo "Veuillez fournir un argument pour le nom du dossier."
  exit 1
fi

# Exécuter les commandes NestJS
nest g module "$1" 
nest g controller "$1" --no-spec
nest g service "$1" --no-spec