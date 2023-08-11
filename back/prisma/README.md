### Utilisation de Prisma

# Générer le client Prisma
La commande suivante génère le client Prisma en fonction de votre schéma :
<code>npx prisma generate</code>

# Appliquer les migrations
Lorsque vous clonez votre repo, il vous faut faire cette commande dans le container back
( je vais cree un script un peu plus tard pour automatiser cette tache )
Pour appliquer les migrations à votre base de données de développement, utilisez :
<code>npx prisma migrate dev</code>

# Push le schéma dans la base de données
Dans le cas ou vous avez déja votre migration, il faut directement push le schéma dans la base de données, utilisez :
<code>npx prisma NOM_DE_LA_BDD push</code>

# Insérer les données initiales
Pour lancer la seed initiale dans la base de données afin de la remplir de nos données par défaut, utilisez :
<code>npx prisma NOM_DE_LA_BDD NOM_DU_FICHER_SEED</code>

# Ouvrir Prisma Studio
Prisma Studio est une interface graphique pour explorer et gérer vos données. Pour l'ouvrir, utilisez :
<code>npx prisma studio</code>
