#!/bin/bash

# Vérifier si l'alias existe dans le fichier ~/.zshrc
if ! grep -q "alias ngen" ~/.zshrc; then
    # Ajouter l'alias s'il n'existe pas
    echo "alias ngen=next_generate.sh" >> ~/.zshrc
    echo "Alias 'ngen' ajouté à ~/.zshrc."
fi

# Vérifier si le chemin du répertoire est déjà dans la variable PATH
if [[ ":$PATH:" != *":$PWD/env_scripts:"* ]]; then
    echo "export PATH=\":$PWD/env_scripts:$PATH\"" >> ~/.zshrc
    echo "Chemin 'env_scripts' ajouté à la variable PATH dans ~/.zshrc."
fi

echo "Pour que les changements soit effectif, relancer votre terminal"