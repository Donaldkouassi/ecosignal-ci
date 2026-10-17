// Liste des localités proposées dans le formulaire de signalement.
// Les 13 communes du District autonome d'Abidjan, puis les principales villes de l'intérieur.
export const COMMUNES = [
  {
    groupe: "District d'Abidjan",
    localites: [
      "Abobo",
      "Adjamé",
      "Anyama",
      "Attécoubé",
      "Bingerville",
      "Cocody",
      "Koumassi",
      "Marcory",
      "Plateau",
      "Port-Bouët",
      "Songon",
      "Treichville",
      "Yopougon",
    ],
  },
  {
    groupe: "Intérieur du pays",
    localites: [
      "Abengourou",
      "Bondoukou",
      "Bouaké",
      "Daloa",
      "Divo",
      "Gagnoa",
      "Grand-Bassam",
      "Korhogo",
      "Man",
      "San-Pédro",
      "Yamoussoukro",
    ],
  },
];

export const TOUTES_LES_COMMUNES = COMMUNES.flatMap((groupe) => groupe.localites);
