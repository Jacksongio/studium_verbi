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

// Scripture selections and spiritual fruits: USCCB, "How to Pray the Rosary".
// https://www.usccb.org/how-to-pray-the-rosary
// Readings use the public-domain Douay–Rheims American Edition (1899),
// sourced from https://ebible.org/engDRA/ (not the guide's modern translation).
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
          "And in the sixth month, the angel Gabriel was sent from God into a city of Galilee, called Nazareth, To a virgin espoused to a man whose name was Joseph, of the house of David; and the virgin’s name was Mary.",
        reference: "Luke 1:26–27",
        fruit: "Humility",
      },
      {
        title: "The Visitation",
        meditation:
          "And Mary rising up in those days, went into the hill country with haste into a city of Juda. And she entered into the house of Zachary, and saluted Elizabeth. And it came to pass, that when Elizabeth heard the salutation of Mary, the infant leaped in her womb. And Elizabeth was filled with the Holy Ghost: And she cried out with a loud voice, and said: Blessed art thou among women, and blessed is the fruit of thy womb.",
        reference: "Luke 1:39–42",
        fruit: "Love of Neighbor",
      },
      {
        title: "The Nativity",
        meditation:
          "And it came to pass, that in those days there went out a decree from Caesar Augustus, that the whole world should be enrolled. This enrolling was first made by Cyrinus, the governor of Syria. And all went to be enrolled, every one into his own city. And Joseph also went up from Galilee, out of the city of Nazareth into Judea, to the city of David, which is called Bethlehem: because he was of the house and family of David, To be enrolled with Mary his espoused wife, who was with child. And it came to pass, that when they were there, her days were accomplished, that she should be delivered. And she brought forth her firstborn son, and wrapped him up in swaddling clothes, and laid him in a manger; because there was no room for them in the inn.",
        reference: "Luke 2:1–7",
        fruit: "Poverty",
      },
      {
        title: "The Presentation",
        meditation:
          "And after eight days were accomplished, that the child should be circumcised, his name was called JESUS, which was called by the angel, before he was conceived in the womb. And after the days of her purification, according to the law of Moses, were accomplished, they carried him to Jerusalem, to present him to the Lord: As it is written in the law of the Lord: Every male opening the womb shall be called holy to the Lord: And to offer a sacrifice, according as it is written in the law of the Lord, a pair of turtledoves, or two young pigeons:",
        reference: "Luke 2:21–24",
        fruit: "Purity of Heart and Body",
      },
      {
        title: "The Finding in the Temple",
        meditation:
          "And his parents went every year to Jerusalem, at the solemn day of the pasch, And when he was twelve years old, they going up into Jerusalem, according to the custom of the feast, And having fulfilled the days, when they returned, the child Jesus remained in Jerusalem; and his parents knew it not. And thinking that he was in the company, they came a day’s journey, and sought him among their kinsfolks and acquaintance. And not finding him, they returned into Jerusalem, seeking him. And it came to pass, that, after three days, they found him in the temple, sitting in the midst of the doctors, hearing them, and asking them questions. And all that heard him were astonished at his wisdom and his answers.",
        reference: "Luke 2:41–47",
        fruit: "Devotion to Jesus",
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
          "And Jesus being baptized, forthwith came out of the water: and lo, the heavens were opened to him: and he saw the Spirit of God descending as a dove, and coming upon him. And behold a voice from heaven, saying: This is my beloved Son, in whom I am well pleased.",
        reference: "Matthew 3:16–17",
        fruit: "Openness to the Holy Spirit",
      },
      {
        title: "The Wedding at Cana",
        meditation:
          "And the third day, there was a marriage in Cana of Galilee: and the mother of Jesus was there. And Jesus also was invited, and his disciples, to the marriage. And the wine failing, the mother of Jesus saith to him: They have no wine. And Jesus saith to her: Woman, what is that to me and to thee? my hour is not yet come. His mother saith to the waiters: Whatsoever he shall say to you, do ye.",
        reference: "John 2:1–5",
        fruit: "To Jesus through Mary",
      },
      {
        title: "The Proclamation of the Kingdom",
        meditation:
          "And saying: The time is accomplished, and the kingdom of God is at hand: repent, and believe the gospel.",
        reference: "Mark 1:15",
        fruit: "Conversion",
      },
      {
        title: "The Transfiguration",
        meditation:
          "And after six days Jesus taketh unto him Peter and James, and John his brother, and bringeth them up into a high mountain apart: And he was transfigured before them. And his face did shine as the sun: and his garments became white as snow.",
        reference: "Matthew 17:1–2",
        fruit: "Desire for holiness",
      },
      {
        title: "The Institution of the Eucharist",
        meditation:
          "And whilst they were at supper, Jesus took bread, and blessed, and broke: and gave to his disciples, and said: Take ye, and eat. This is my body.",
        reference: "Matthew 26:26",
        fruit: "Adoration",
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
          "Then Jesus came with them into a country place which is called Gethsemani; and he said to his disciples: Sit you here, till I go yonder and pray. And taking with him Peter and the two sons of Zebedee, he began to grow sorrowful and to be sad. Then he saith to them: My soul is sorrowful even unto death: stay you here, and watch with me. And going a little further, he fell upon his face, praying, and saying: My Father, if it be possible, let this chalice pass from me. Nevertheless not as I will, but as thou wilt.",
        reference: "Matthew 26:36–39",
        fruit: "Obedience to God’s Will",
      },
      {
        title: "The Scourging at the Pillar",
        meditation:
          "Then he released to them Barabbas, and having scourged Jesus, delivered him unto them to be crucified.",
        reference: "Matthew 27:26",
        fruit: "Mortification",
      },
      {
        title: "The Crowning with Thorns",
        meditation:
          "Then the soldiers of the governor taking Jesus into the hall, gathered together unto him the whole band; And stripping him, they put a scarlet cloak about him. And platting a crown of thorns, they put it upon his head, and a reed in his right hand. And bowing the knee before him, they mocked him, saying: Hail, king of the Jews.",
        reference: "Matthew 27:27–29",
        fruit: "Courage",
      },
      {
        title: "The Carrying of the Cross",
        meditation:
          "And they forced one Simon a Cyrenian who passed by, coming out of the country, the father of Alexander and of Rufus, to take up his cross. And they bring him into the place called Golgotha, which being interpreted is, The place of Calvary.",
        reference: "Mark 15:21–22",
        fruit: "Patience",
      },
      {
        title: "The Crucifixion",
        meditation:
          "And when they were come to the place which is called Calvary, they crucified him there; and the robbers, one on the right hand, and the other on the left. And Jesus said: Father, forgive them, for they know not what they do. But they, dividing his garments, cast lots. And the people stood beholding, and the rulers with them derided him, saying: He saved others; let him save himself, if he be Christ, the elect of God. And the soldiers also mocked him, coming to him, and offering him vinegar, And saying: If thou be the king of the Jews, save thyself. And there was also a superscription written over him in letters of Greek, and Latin, and Hebrew: THIS IS THE KING OF THE JEWS. And one of those robbers who were hanged, blasphemed him, saying: If thou be Christ, save thyself and us. But the other answering, rebuked him, saying: Neither dost thou fear God, seeing thou art condemned under the same condemnation? And we indeed justly, for we receive the due reward of our deeds; but this man hath done no evil. And he said to Jesus: Lord, remember me when thou shalt come into thy kingdom. And Jesus said to him: Amen I say to thee, this day thou shalt be with me in paradise. And it was almost the sixth hour; and there was darkness over all the earth until the ninth hour. And the sun was darkened, and the veil of the temple was rent in the midst. And Jesus crying out with a loud voice, said: Father, into thy hands I commend my spirit. And saying this, he gave up the ghost.",
        reference: "Luke 23:33–46",
        fruit: "Sorrow for our Sins",
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
          "And on the first day of the week, very early in the morning, they came to the sepulchre, bringing the spices which they had prepared. And they found the stone rolled back from the sepulchre. And going in, they found not the body of the Lord Jesus. And it came to pass, as they were astonished in their mind at this, behold, two men stood by them, in shining apparel. And as they were afraid, and bowed down their countenance towards the ground, they said unto them: Why seek you the living with the dead?",
        reference: "Luke 24:1–5",
        fruit: "Faith",
      },
      {
        title: "The Ascension",
        meditation:
          "And the Lord Jesus, after he had spoken to them, was taken up into heaven, and sitteth on the right hand of God.",
        reference: "Mark 16:19",
        fruit: "Hope",
      },
      {
        title: "The Descent of the Holy Spirit",
        meditation:
          "And when the days of the Pentecost were accomplished, they were all together in one place: And suddenly there came a sound from heaven, as of a mighty wind coming, and it filled the whole house where they were sitting. And there appeared to them parted tongues as it were of fire, and it sat upon every one of them: And they were all filled with the Holy Ghost, and they began to speak with divers tongues, according as the Holy Ghost gave them to speak.",
        reference: "Acts 2:1–4",
        fruit: "Wisdom",
      },
      {
        title: "The Assumption",
        meditation:
          "Because he hath regarded the humility of his handmaid; for behold from henceforth all generations shall call me blessed. Because he that is mighty, hath done great things to me; and holy is his name.",
        reference: "Luke 1:48–49",
        fruit: "Devotion to Mary",
      },
      {
        title: "The Coronation of Mary",
        meditation:
          "And a great sign appeared in heaven: A woman clothed with the sun, and the moon under her feet, and on her head a crown of twelve stars:",
        reference: "Revelation 12:1",
        fruit: "Grace of a happy death",
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
