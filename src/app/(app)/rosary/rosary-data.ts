export type MysterySetId = "joyful" | "luminous" | "sorrowful" | "glorious";

export interface Mystery {
  title: string;
  meditation: string;
  reference: string;
  fruit: string;
}

export interface MysterySet {
  id: MysterySetId;
  name: string;
  shortName: string;
  days: string;
  mysteries: Mystery[];
}

export type BeadMarker =
  | { type: "crucifix" }
  | { type: "chain" }
  | { type: "beads"; count: number; index: number; size: "small" | "large" };

export interface RosaryStep {
  id: string;
  kicker: string;
  title: string;
  phase: string;
  bead: string;
  text: string;
  note?: string;
  reference?: string;
  mystery?: Mystery;
  showMysteryBanner: boolean;
  marker: BeadMarker;
}

const SET_BY_WEEKDAY: MysterySetId[] = [
  "glorious",
  "joyful",
  "sorrowful",
  "glorious",
  "luminous",
  "sorrowful",
  "joyful",
];

export function mysterySetForWeekday(day: number): MysterySetId {
  return SET_BY_WEEKDAY[day] ?? "glorious";
}

export function mysterySetForDate(date: Date): MysterySetId {
  return mysterySetForWeekday(date.getDay());
}

export function isMysterySetId(value: unknown): value is MysterySetId {
  return (
    value === "joyful" ||
    value === "luminous" ||
    value === "sorrowful" ||
    value === "glorious"
  );
}

export const PRAYERS = {
  signOfTheCross:
    "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
  apostlesCreed:
    "I believe in God,\nthe Father almighty,\nCreator of heaven and earth,\nand in Jesus Christ, his only Son, our Lord,\nwho was conceived by the Holy Spirit,\nborn of the Virgin Mary,\nsuffered under Pontius Pilate,\nwas crucified, died and was buried;\nhe descended into hell;\non the third day he rose again from the dead;\nhe ascended into heaven,\nand is seated at the right hand of God the Father almighty;\nfrom there he will come to judge the living and the dead.\nI believe in the Holy Spirit,\nthe holy catholic Church,\nthe communion of saints,\nthe forgiveness of sins,\nthe resurrection of the body,\nand life everlasting. Amen.",
  ourFather:
    "Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come;\nthy will be done\non earth as it is in heaven.\nGive us this day our daily bread,\nand forgive us our trespasses,\nas we forgive those who trespass against us;\nand lead us not into temptation,\nbut deliver us from evil. Amen.",
  hailMary:
    "Hail Mary, full of grace,\nthe Lord is with thee.\nBlessed art thou among women,\nand blessed is the fruit of thy womb, Jesus.\nHoly Mary, Mother of God,\npray for us sinners,\nnow and at the hour of our death. Amen.",
  gloryBe:
    "Glory be to the Father,\nand to the Son,\nand to the Holy Spirit.\nAs it was in the beginning,\nis now, and ever shall be,\nworld without end. Amen.",
  fatima:
    "O my Jesus,\nforgive us our sins,\nsave us from the fires of hell,\nlead all souls to heaven,\nespecially those in most need of thy mercy. Amen.",
  hailHolyQueen:
    "Hail, Holy Queen, Mother of mercy,\nour life, our sweetness, and our hope.\nTo thee do we cry,\npoor banished children of Eve.\nTo thee do we send up our sighs,\nmourning and weeping in this valley of tears.\nTurn then, most gracious Advocate,\nthine eyes of mercy toward us,\nand after this our exile,\nshow unto us the blessed fruit of thy womb, Jesus.\nO clement, O loving, O sweet Virgin Mary.",
  verse:
    "V. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.",
  closing:
    "O God, whose Only Begotten Son,\nby his life, Death, and Resurrection,\nhas purchased for us the rewards of eternal life,\ngrant, we beseech thee,\nthat while meditating on these mysteries\nof the most holy Rosary\nof the Blessed Virgin Mary,\nwe may imitate what they contain\nand obtain what they promise,\nthrough the same Christ our Lord.\nAmen.",
} as const;

export const MYSTERY_SETS: MysterySet[] = [
  {
    id: "joyful",
    name: "The Joyful Mysteries",
    shortName: "Joyful",
    days: "Monday and Saturday",
    mysteries: [
      {
        title: "The Annunciation",
        meditation:
          "The angel Gabriel announces that Mary will conceive the Son of God by the Holy Spirit. Mary gives her yes: she is the handmaid of the Lord.",
        reference: "Luke 1:26–38",
        fruit: "Humility",
      },
      {
        title: "The Visitation",
        meditation:
          "Mary goes in haste to her cousin Elizabeth. Elizabeth blesses her, and Mary praises God in the Magnificat.",
        reference: "Luke 1:39–56",
        fruit: "Love of neighbor",
      },
      {
        title: "The Nativity",
        meditation:
          "Jesus is born in Bethlehem and laid in a manger. Mary keeps these things and ponders them in her heart.",
        reference: "Luke 2:1–20",
        fruit: "Poverty of spirit",
      },
      {
        title: "The Presentation",
        meditation:
          "Mary and Joseph present Jesus in the Temple and offer the sacrifice of the poor. Simeon takes the child in his arms and blesses God.",
        reference: "Luke 2:22–35",
        fruit: "Obedience",
      },
      {
        title: "The Finding in the Temple",
        meditation:
          "After three days of searching, Mary and Joseph find the boy Jesus in the Temple, among the teachers.",
        reference: "Luke 2:41–52",
        fruit: "Joy in finding Jesus",
      },
    ],
  },
  {
    id: "luminous",
    name: "The Luminous Mysteries",
    shortName: "Luminous",
    days: "Thursday",
    mysteries: [
      {
        title: "The Baptism of the Lord",
        meditation:
          "Jesus is baptized by John in the Jordan. The Spirit descends upon him, and the Father names him his beloved Son.",
        reference: "Matthew 3:13–17",
        fruit: "Openness to the Holy Spirit",
      },
      {
        title: "The Wedding at Cana",
        meditation:
          "At a wedding in Cana, Mary tells the servants to do whatever Jesus says. He turns water into wine, the first of his signs.",
        reference: "John 2:1–11",
        fruit: "To Jesus through Mary",
      },
      {
        title: "The Proclamation of the Kingdom",
        meditation:
          "Jesus proclaims that the kingdom of God is at hand, and he calls the people to repent and believe.",
        reference: "Mark 1:14–15",
        fruit: "Conversion of heart",
      },
      {
        title: "The Transfiguration",
        meditation:
          "On the mountain, Jesus is transfigured before Peter, James, and John. The Father tells them to listen to his Son.",
        reference: "Matthew 17:1–8",
        fruit: "Desire for holiness",
      },
      {
        title: "The Institution of the Eucharist",
        meditation:
          "At the Last Supper, Jesus gives the Apostles his Body and Blood under the appearances of bread and wine.",
        reference: "Matthew 26:26–28",
        fruit: "Love of the Eucharist",
      },
    ],
  },
  {
    id: "sorrowful",
    name: "The Sorrowful Mysteries",
    shortName: "Sorrowful",
    days: "Tuesday and Friday",
    mysteries: [
      {
        title: "The Agony in the Garden",
        meditation:
          "In Gethsemane, Jesus prays that the Father’s will be done. His sweat becomes as drops of blood falling to the ground.",
        reference: "Luke 22:39–46",
        fruit: "Sorrow for sin",
      },
      {
        title: "The Scourging at the Pillar",
        meditation: "Pilate takes Jesus and has him scourged.",
        reference: "John 19:1",
        fruit: "Purity",
      },
      {
        title: "The Crowning with Thorns",
        meditation:
          "The soldiers press a crown of thorns on Jesus’ head and mock him as king.",
        reference: "Matthew 27:27–31",
        fruit: "Courage",
      },
      {
        title: "The Carrying of the Cross",
        meditation:
          "Jesus carries his Cross to the place of the Skull. Simon of Cyrene is made to carry it behind him.",
        reference: "John 19:17; Luke 23:26",
        fruit: "Patience",
      },
      {
        title: "The Crucifixion",
        meditation:
          "Jesus is crucified between two thieves. He entrusts his Mother to the beloved disciple, and he gives up his spirit.",
        reference: "John 19:18–30",
        fruit: "Perseverance",
      },
    ],
  },
  {
    id: "glorious",
    name: "The Glorious Mysteries",
    shortName: "Glorious",
    days: "Wednesday and Sunday",
    mysteries: [
      {
        title: "The Resurrection",
        meditation:
          "On the first day of the week the tomb is empty. The risen Jesus meets the women and sends them to tell the disciples.",
        reference: "Matthew 28:1–10",
        fruit: "Faith",
      },
      {
        title: "The Ascension",
        meditation:
          "Jesus is taken up into heaven as the Apostles look on. He will come again as they saw him go.",
        reference: "Acts 1:9–11",
        fruit: "Hope",
      },
      {
        title: "The Descent of the Holy Spirit",
        meditation:
          "Mary and the Apostles are gathered in prayer. The Holy Spirit comes upon them, and they proclaim the mighty works of God.",
        reference: "Acts 1:14; 2:1–11",
        fruit: "The gifts of the Holy Spirit",
      },
      {
        title: "The Assumption",
        meditation:
          "At the end of her earthly life, Mary is assumed body and soul into heavenly glory. She already shares, in her whole person, in her Son’s resurrection.",
        reference: "CCC 966",
        fruit: "A holy death",
      },
      {
        title: "The Coronation of Mary",
        meditation:
          "The Lord exalts Mary as Queen over all things, so that she might be more fully conformed to her Son. From heaven she intercedes for the Church on earth.",
        reference: "CCC 966, 969",
        fruit: "Trust in Mary’s intercession",
      },
    ],
  },
];

export function getMysterySet(id: MysterySetId): MysterySet {
  const set = MYSTERY_SETS.find((item) => item.id === id);
  if (!set) throw new Error(`Unknown mystery set: ${id}`);
  return set;
}

const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth"] as const;

const OPENING_INTENTIONS = [
  "For an increase of faith.",
  "For an increase of hope.",
  "For an increase of charity.",
] as const;

export function buildSteps(setId: MysterySetId): RosaryStep[] {
  const set = getMysterySet(setId);
  const steps: RosaryStep[] = [
    {
      id: "open-cross",
      kicker: "Pray",
      title: "The Sign of the Cross",
      phase: "Opening",
      bead: "On the crucifix",
      text: PRAYERS.signOfTheCross,
      showMysteryBanner: false,
      marker: { type: "crucifix" },
    },
    {
      id: "open-creed",
      kicker: "Pray",
      title: "The Apostles’ Creed",
      phase: "Opening",
      bead: "Holding the crucifix",
      text: PRAYERS.apostlesCreed,
      showMysteryBanner: false,
      marker: { type: "crucifix" },
    },
    {
      id: "open-our-father",
      kicker: "Pray",
      title: "Our Father",
      phase: "Opening",
      bead: "The single bead above the crucifix",
      text: PRAYERS.ourFather,
      showMysteryBanner: false,
      marker: { type: "beads", count: 1, index: 0, size: "large" },
    },
  ];

  OPENING_INTENTIONS.forEach((note, index) => {
    steps.push({
      id: `open-hail-${index + 1}`,
      kicker: "Pray",
      title: "Hail Mary",
      phase: "Opening",
      bead: `Small bead ${index + 1} of 3`,
      text: PRAYERS.hailMary,
      note,
      showMysteryBanner: false,
      marker: { type: "beads", count: 3, index, size: "small" },
    });
  });

  steps.push({
    id: "open-glory",
    kicker: "Pray",
    title: "Glory Be",
    phase: "Opening",
    bead: "On the chain, before the centerpiece",
    text: PRAYERS.gloryBe,
    showMysteryBanner: false,
    marker: { type: "chain" },
  });

  set.mysteries.forEach((mystery, index) => {
    const n = index + 1;
    const phase = `Decade ${n} of 5`;
    steps.push({
      id: `d${n}-announce`,
      kicker: `${ORDINALS[index]} mystery`,
      title: mystery.title,
      phase,
      bead: n === 1 ? "At the centerpiece" : "Before the next large bead",
      text: mystery.meditation,
      note: `Grace to ask: ${mystery.fruit}`,
      reference: mystery.reference,
      mystery,
      showMysteryBanner: false,
      marker: { type: "chain" },
    });
    steps.push({
      id: `d${n}-our-father`,
      kicker: "Pray",
      title: "Our Father",
      phase,
      bead: "Large bead",
      text: PRAYERS.ourFather,
      mystery,
      showMysteryBanner: true,
      marker: { type: "beads", count: 1, index: 0, size: "large" },
    });
    for (let hail = 1; hail <= 10; hail++) {
      steps.push({
        id: `d${n}-hail-${hail}`,
        kicker: "Pray",
        title: "Hail Mary",
        phase,
        bead: `Bead ${hail} of 10`,
        text: PRAYERS.hailMary,
        mystery,
        showMysteryBanner: true,
        marker: { type: "beads", count: 10, index: hail - 1, size: "small" },
      });
    }
    steps.push({
      id: `d${n}-glory`,
      kicker: "Pray",
      title: "Glory Be",
      phase,
      bead: "On the chain after the ten beads",
      text: PRAYERS.gloryBe,
      mystery,
      showMysteryBanner: true,
      marker: { type: "chain" },
    });
    // The Fatima prayer follows each decade, not the three opening Hail Marys.
    steps.push({
      id: `d${n}-fatima`,
      kicker: "Pray",
      title: "The Fatima Prayer",
      phase,
      bead: "On the same chain",
      text: PRAYERS.fatima,
      mystery,
      showMysteryBanner: true,
      marker: { type: "chain" },
    });
  });

  steps.push(
    {
      id: "close-queen",
      kicker: "Pray",
      title: "Hail, Holy Queen",
      phase: "Closing",
      bead: "After the five decades",
      text: PRAYERS.hailHolyQueen,
      showMysteryBanner: false,
      marker: { type: "chain" },
    },
    {
      id: "close-verse",
      kicker: "Pray",
      title: "Pray for us",
      phase: "Closing",
      bead: "After the Hail, Holy Queen",
      text: PRAYERS.verse,
      showMysteryBanner: false,
      marker: { type: "chain" },
    },
    {
      id: "close-prayer",
      kicker: "Let us pray",
      title: "Closing prayer",
      phase: "Closing",
      bead: "After the response",
      text: PRAYERS.closing,
      showMysteryBanner: false,
      marker: { type: "chain" },
    },
    {
      id: "close-cross",
      kicker: "Pray",
      title: "The Sign of the Cross",
      phase: "Closing",
      bead: "At the end",
      text: PRAYERS.signOfTheCross,
      showMysteryBanner: false,
      marker: { type: "crucifix" },
    }
  );

  return steps;
}
