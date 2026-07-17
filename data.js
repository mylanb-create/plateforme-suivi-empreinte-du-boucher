// Données des 12 vidéos — L'Empreinte du Boucher
// status possibles : "a_monter" | "monte" | "planifie" | "poste"

const VIDEOS = [
  {
    id: 1,
    titre: "Présentation de L'Empreinte du Boucher",
    categorie: "Marque",
    date: "2026-07-20",
    status: "a_monter",
    accroche: "Tu connais toujours pas L'Empreinte du Boucher ?",
    script: `Attends, attends — tu connais toujours pas L'Empreinte du Boucher ? Reste là, tu vas savoir tout de suite.

Chez nous, tu vas retrouver tout ce qu'il faut pour un barbecue réussi : poulet, brochettes, merguez, saucisses... et bien d'autres produits. Mais aussi des boulettes, des cordons-bleus, du bœuf, et notre coin épicerie pour bien accompagner les viandes !

On se situe à l'Auchan Hypermarché de Douai, à Sin-le-Noble.`
  },
  {
    id: 2,
    titre: "La merguez",
    categorie: "Produit",
    date: "2026-07-22",
    status: "a_monter",
    accroche: "Ça, c'est un cadeau du ciel...",
    script: `Ça, c'est un cadeau du ciel. Je ne vous l'ai pas encore présentée, mais vous allez la connaître.

Quelques indices : elle ne réduit pas à la cuisson, surtout ne la piquez pas, et elle est faite de 100% de bœuf — chez nous, en tout cas.

Voici la merguez ! Tendre et juteuse, c'est la viande qui se démarque dans votre barbecue. Mais où la choisir ? Chez L'Empreinte du Boucher !`
  },
  {
    id: 3,
    titre: "On mange quoi pour 50€ ?",
    categorie: "Bon plan",
    date: "2026-07-24",
    status: "a_monter",
    accroche: "J'ai 50€, on va manger un truc ?",
    script: `Eh [prénom], j'ai 50€, on va manger un truc ?

Pour 50€ ? J'ai mieux pour toi ! Chez L'Empreinte du Boucher à Sin-le-Noble, tu peux trouver : 1 kg de merguez (allez voir notre vidéo dessus !), 1 kg de saucisses de poulet, 1 kg de brochettes de poulet et 1 kg de brochettes de bœuf.

On se fait un barbecue ?`
  },
  {
    id: 4,
    titre: "Présentation des brochettes",
    categorie: "Produit",
    date: "2026-07-27",
    status: "a_monter",
    accroche: "C'est l'été, et qui dit été dit barbecue !",
    script: `Bonjour les amis, ça y est, c'est l'été ! Et qui dit été, dit barbecue. Et qui dit barbecue, dit brochettes !

Elles sont préparées avec de la viande fraîche, certifiée clean label. Voici ce qu'on a :
• Brochette de poulet provençale
• Brochette de poulet curry
• Brochette de poulet marinée
• Brochette de poulet à piquer
• Brochette de bœuf à piquer

Venez les déguster chez L'Empreinte du Boucher à Sin-le-Noble !`
  },
  {
    id: 5,
    titre: "Ne décongelez pas votre viande comme ça",
    categorie: "Conseil",
    date: "2026-07-29",
    status: "a_monter",
    accroche: "Ne décongelez jamais votre viande comme ça...",
    script: `Par pitié, ne décongelez pas votre viande au micro-ondes, avec de l'eau chaude ou, encore pire, à l'air libre. C'est une source de microbes et de contamination, c'est dangereux — et en plus, ça lui fait perdre toute sa saveur.

Alors, comment décongeler correctement la viande ? Simple : laissez-la au réfrigérateur entre 12h et 24h. Ça préserve la chaîne du froid et la qualité de votre viande.`
  },
  {
    id: 6,
    titre: "Clean Label — c'est quoi ?",
    categorie: "Info",
    date: "2026-07-31",
    status: "a_monter",
    accroche: "Tu sais que nos viandes sont clean label ?",
    script: `P1 : Eh, attends, viens voir ici ! Tu sais que nos viandes sont clean label ?
P2 : C'est quoi le clean label ?
P1 : C'est simple, bouge pas. Ça veut dire :
• Sans huile de palme
• Sans additifs
• Sans colorants artificiels
• Sans huiles hydrogénées

Alors t'inquiète pas : quand tu vas cuire ta merguez, elle ne va pas rétrécir !`
  },
  {
    id: 7,
    titre: "T'aimes la viande ? Les ribs d'agneau",
    categorie: "Produit",
    date: "2026-08-03",
    status: "a_monter",
    accroche: "T'es amateur de viande ou tu kiffes juste la viande ?",
    script: `T'es amateur de viande ou tu kiffes juste la viande ? Dans tous les cas, j'ai quelque chose pour toi.

Les ribs d'agneau ! Tu les poses sur le grill, à feu doux et à température lente, et je t'assure que tu vas obtenir les ribs les plus gourmands du monde.

Retrouve-nous à l'Auchan Hypermarché de Douai, à Sin-le-Noble !`
  },
  {
    id: 8,
    titre: "3 conseils pour réussir sa viande hachée",
    categorie: "Conseil",
    date: "2026-08-05",
    status: "a_monter",
    accroche: "3 conseils pour réussir sa viande hachée.",
    script: `La viande hachée, vous pouvez la mettre partout : dans les burgers, les pâtes bolognaise, et bien d'autres plats. Voici 3 conseils pour la réussir :

1. Respectez la chaîne du froid. Ne décongelez jamais votre viande au micro-ondes ou à l'air libre — mettez-la au réfrigérateur 12h à 24h avant utilisation.
2. Faites hacher votre viande sur place par un professionnel, dans une machine réfrigérée entre 2 et 4°C.
3. Gardez un peu de gras sur la viande. C'est ce qui va lui apporter de la tendreté et du jus.

Et dites-moi : c'est quoi votre plat préféré avec de la viande hachée ?`
  },
  {
    id: 9,
    titre: "Nos cordons-bleus maison",
    categorie: "Produit",
    date: "2026-08-07",
    status: "a_monter",
    accroche: "Nos cordons-bleus maison, lequel tu choisis ?",
    script: `Je vais vous présenter nos cordons-bleus maison.

Le premier : le cordon-bleu cheddar-emmental, préparé avec de la viande fraîche certifiée clean label.

Le deuxième, l'un de nos best-sellers : le cordon-bleu au fromage de Boursin.

Et toi, tu choisirais lequel ?`
  },
  {
    id: 10,
    titre: "Team viande rouge ou blanche ?",
    categorie: "Produit",
    date: "2026-08-10",
    status: "a_monter",
    accroche: "Team viande rouge ou team viande blanche ?",
    script: `T'es team viande rouge ou blanche ? Aujourd'hui on parle viande rouge. Voici ce que vous retrouverez chez nous :

Bœuf : steak, viande hachée

Agneau :
• Ribs d'agneau barbecue
• Ribs d'agneau maître d'hôtel

Veau :
• Saucisse de veau
• Farce de veau (dans les galettes de pommes de terre)`
  },
  {
    id: 11,
    titre: "T'es de Douai, Arras, Lens ou aux alentours ?",
    categorie: "Marque",
    date: "2026-08-12",
    status: "a_monter",
    accroche: "T'es de Douai, Arras, Lens ou dans le coin ?",
    script: `T'es de Douai, Arras, Lens ou des alentours ? J'ai le bon plan pour toi.

L'Empreinte du Boucher ! Située à l'Auchan Hypermarché de Douai, à Sin-le-Noble, on vous propose de quoi faire du barbecue de votre vie. On a aussi un coin épicerie pour sublimer vos viandes.

On vous attend chez L'Empreinte du Boucher !`
  },
  {
    id: 12,
    titre: "Le bouzelouf, c'est bien... mais",
    categorie: "Comparatif",
    date: "2026-08-14",
    status: "a_monter",
    accroche: "Le bouzelouf c'est bien... mais on a mieux.",
    script: `Alors oui, le bouzelouf c'est très bon ! Mais pour vos barbecues, j'ai de quoi les sublimer encore plus.

Nos merguez fraîches (à ne surtout pas piquer !), nos brochettes de toutes sortes — marinées, provençales, etc. — nos saucisses de poulet, les pilons de poulet, les émincés de poulet... et encore beaucoup d'autres produits.

Alors ? T'en es à ton combientième barbecue depuis 2026 ?`
  }
];

const STATUS_META = {
  a_monter: { label: "À monter", order: 0 },
  monte:    { label: "Monté",    order: 1 },
  planifie: { label: "Planifié", order: 2 },
  poste:    { label: "Posté",    order: 3 }
};
