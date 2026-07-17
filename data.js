// Données des 12 vidéos — L'Empreinte du Boucher
// status possibles : "a_monter" | "monte" | "planifie" | "poste"

const VIDEOS = [
  {
    id: 1,
    titre: "Présentation de L'Empreinte du Boucher",
    categorie: "Marque",
    date: "2026-07-20",
    status: "a_monter"
  },
  {
    id: 2,
    titre: "La merguez",
    categorie: "Produit",
    date: "2026-07-22",
    status: "a_monter"
  },
  {
    id: 3,
    titre: "On mange quoi pour 50€ ?",
    categorie: "Bon plan",
    date: "2026-07-24",
    status: "a_monter"
  },
  {
    id: 4,
    titre: "Présentation des brochettes",
    categorie: "Produit",
    date: "2026-07-27",
    status: "a_monter"
  },
  {
    id: 5,
    titre: "Ne décongelez pas votre viande comme ça",
    categorie: "Conseil",
    date: "2026-07-29",
    status: "a_monter"
  },
  {
    id: 6,
    titre: "Clean Label — c'est quoi ?",
    categorie: "Info",
    date: "2026-07-31",
    status: "a_monter"
  },
  {
    id: 7,
    titre: "Le Crousty",
    categorie: "Produit",
    date: "2026-08-03",
    status: "a_monter"
  },
  {
    id: 8,
    titre: "3 conseils pour réussir sa viande hachée",
    categorie: "Conseil",
    date: "2026-08-05",
    status: "a_monter"
  },
  {
    id: 9,
    titre: "Nos cordons-bleus maison",
    categorie: "Produit",
    date: "2026-08-07",
    status: "a_monter"
  },
  {
    id: 10,
    titre: "Team viande rouge ou blanche ?",
    categorie: "Produit",
    date: "2026-08-10",
    status: "a_monter"
  },
  {
    id: 11,
    titre: "T'es de Douai, Arras, Lens ou aux alentours ?",
    categorie: "Marque",
    date: "2026-08-12",
    status: "a_monter"
  },
  {
    id: 12,
    titre: "Le bouzelouf, c'est bien... mais",
    categorie: "Comparatif",
    date: "2026-08-14",
    status: "a_monter"
  }
];

const STATUS_META = {
  a_monter: { label: "À monter", order: 0 },
  monte:    { label: "Monté",    order: 1 },
  planifie: { label: "Planifié", order: 2 },
  poste:    { label: "Posté",    order: 3 }
};
