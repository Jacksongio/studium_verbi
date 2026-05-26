export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  crossReferences?: string[];
}

export interface Commentary {
  reference: string;
  title: string;
  author: string;
  era: string;
  content: string;
  tags: string[];
}

export interface SearchResult {
  verses: Verse[];
  commentaries: Commentary[];
  analysis: string;
}

export const BIBLE_BOOKS = [
  { name: "Genesis", test: "OT" },
  { name: "Psalms", test: "OT" },
  { name: "Isaiah", test: "OT" },
  { name: "Matthew", test: "NT" },
  { name: "John", test: "NT" },
  { name: "Romans", test: "NT" },
  { name: "Revelation", test: "NT" }
];

export const BIBLE_VERSES: Verse[] = [
  // Genesis 1
  { book: "Genesis", chapter: 1, verse: 1, text: "In the beginning God created the heaven and the earth.", crossReferences: ["John 1:1", "Hebrews 11:3", "Revelation 4:11"] },
  { book: "Genesis", chapter: 1, verse: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.", crossReferences: ["Jeremiah 4:23", "Psalm 104:30"] },
  { book: "Genesis", chapter: 1, verse: 3, text: "And God said, Let there be light: and there was light.", crossReferences: ["2 Corinthians 4:6", "Psalm 33:9"] },
  { book: "Genesis", chapter: 1, verse: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness.", crossReferences: ["Psalm 136:7"] },
  { book: "Genesis", chapter: 1, verse: 5, text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.", crossReferences: ["Psalm 74:16"] },

  // Psalms 23
  { book: "Psalms", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want.", crossReferences: ["John 10:11", "Isaiah 40:11", "1 Peter 2:25"] },
  { book: "Psalms", chapter: 23, verse: 2, text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.", crossReferences: ["Revelation 7:17", "Ezekiel 34:14"] },
  { book: "Psalms", chapter: 23, verse: 3, text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.", crossReferences: ["Psalm 5:8", "Proverbs 8:20"] },
  { book: "Psalms", chapter: 23, verse: 4, text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.", crossReferences: ["Isaiah 43:2", "Psalm 3:6", "Psalm 118:6"] },
  { book: "Psalms", chapter: 23, verse: 5, text: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.", crossReferences: ["Psalm 92:10", "Psalm 16:5"] },
  { book: "Psalms", chapter: 23, verse: 6, text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.", crossReferences: ["Psalm 27:4", "2 Corinthians 5:1"] },

  // Isaiah 9
  { book: "Isaiah", chapter: 9, verse: 2, text: "The people that walked in darkness have seen a great light: they that dwell in the land of the shadow of death, upon them hath the light shined.", crossReferences: ["Matthew 4:16", "Ephesians 5:8"] },
  { book: "Isaiah", chapter: 9, verse: 6, text: "For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.", crossReferences: ["Luke 2:11", "John 3:16", "Judges 13:18", "Ephesians 2:14"] },
  { book: "Isaiah", chapter: 9, verse: 7, text: "Of the increase of his government and peace there shall be no end, upon the throne of David, and upon his kingdom, to order it, and to establish it with judgment and with justice from henceforth even for ever. The zeal of the LORD of hosts will perform this.", crossReferences: ["Daniel 2:44", "Luke 1:32-33"] },

  // Matthew 5
  { book: "Matthew", chapter: 5, verse: 3, text: "Blessed are the poor in spirit: for theirs is the kingdom of heaven.", crossReferences: ["Luke 6:20", "Isaiah 57:15", "James 2:5"] },
  { book: "Matthew", chapter: 5, verse: 4, text: "Blessed are they that mourn: for they shall be comforted.", crossReferences: ["Isaiah 61:2", "John 16:20", "Revelation 21:4"] },
  { book: "Matthew", chapter: 5, verse: 5, text: "Blessed are the meek: for they shall inherit the earth.", crossReferences: ["Psalm 37:11", "1 Peter 3:4"] },
  { book: "Matthew", chapter: 5, verse: 6, text: "Blessed are they which do hunger and thirst after righteousness: for they shall be filled.", crossReferences: ["Isaiah 55:1", "John 6:35"] },
  { book: "Matthew", chapter: 5, verse: 7, text: "Blessed are the merciful: for they shall obtain mercy.", crossReferences: ["Psalm 18:25", "Matthew 6:14", "James 2:13"] },
  { book: "Matthew", chapter: 5, verse: 8, text: "Blessed are the pure in heart: for they shall see God.", crossReferences: ["Psalm 24:3-4", "Hebrews 12:14", "1 John 3:2"] },
  { book: "Matthew", chapter: 5, verse: 9, text: "Blessed are the peacemakers: for they shall be called the children of God.", crossReferences: ["Romans 12:18", "Hebrews 12:14"] },

  // John 1
  { book: "John", chapter: 1, verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God.", crossReferences: ["Genesis 1:1", "1 John 1:1", "Revelation 19:13"] },
  { book: "John", chapter: 1, verse: 2, text: "The same was in the beginning with God.", crossReferences: ["John 17:5"] },
  { book: "John", chapter: 1, verse: 3, text: "All things were made by him; and without him was not any thing made that was made.", crossReferences: ["Genesis 1:3", "Colossians 1:16", "Hebrews 1:2"] },
  { book: "John", chapter: 1, verse: 4, text: "In him was life; and the life was the light of men.", crossReferences: ["John 5:26", "John 11:25", "John 8:12"] },
  { book: "John", chapter: 1, verse: 5, text: "And the light shineth in darkness; and the darkness comprehended it not.", crossReferences: ["John 3:19", "John 12:35"] },
  { book: "John", chapter: 1, verse: 14, text: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.", crossReferences: ["Galatians 4:4", "Philippians 2:7", "Luke 9:32", "Colossians 1:19"] },

  // Romans 8
  { book: "Romans", chapter: 8, verse: 1, text: "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.", crossReferences: ["Galatians 5:16", "Romans 8:39"] },
  { book: "Romans", chapter: 8, verse: 28, text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", crossReferences: ["Genesis 50:20", "Ephesians 1:11", "2 Timothy 1:9"] },
  { book: "Romans", chapter: 8, verse: 31, text: "What shall we then say to these things? If God be for us, who can be against us?", crossReferences: ["Psalm 118:6", "Numbers 14:9"] },
  { book: "Romans", chapter: 8, verse: 37, text: "Nay, in all these things we are more than conquerors through him that loved us.", crossReferences: ["1 Corinthians 15:57", "1 John 5:4", "Revelation 12:11"] },
  { book: "Romans", chapter: 8, verse: 38, text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,", crossReferences: ["Ephesians 1:21", "Colossians 2:15"] },
  { book: "Romans", chapter: 8, verse: 39, text: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.", crossReferences: ["John 10:28", "Romans 5:8"] },

  // Revelation 21
  { book: "Revelation", chapter: 21, verse: 1, text: "And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea.", crossReferences: ["Isaiah 65:17", "2 Peter 3:13"] },
  { book: "Revelation", chapter: 21, verse: 2, text: "And I John saw the holy city, new Jerusalem, coming down from God out of heaven, prepared as a bride adorned for her husband.", crossReferences: ["Isaiah 52:1", "Galatians 4:26", "Hebrews 11:10", "Revelation 19:7"] },
  { book: "Revelation", chapter: 21, verse: 3, text: "And I heard a great voice out of heaven saying, Behold, the tabernacle of God is with men, and he will dwell with them, and they shall be his people, and God himself shall be with them, and be their God.", crossReferences: ["Leviticus 26:11-12", "Ezekiel 37:27", "2 Corinthians 6:16"] },
  { book: "Revelation", chapter: 21, verse: 4, text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.", crossReferences: ["Isaiah 25:8", "Isaiah 35:10", "1 Corinthians 15:26", "Revelation 20:14"] }
];

export const COMMENTARIES: Commentary[] = [
  {
    reference: "Genesis 1:1",
    title: "On the Origin of the Universe",
    author: "St. Augustine of Hippo",
    era: "c. 408 AD",
    content: "God created all things not in time, but simultaneously with time. The 'beginning' represents the Eternal Word, through whom the temporal framework itself was established. Matter itself was brought out of nothingness (ex nihilo), demonstrating supreme sovereignty.",
    tags: ["creation", "time", "beginning", "philosophy"]
  },
  {
    reference: "Psalms 23:1",
    title: "The Good Shepherd's Provision",
    author: "Charles Spurgeon",
    era: "1869 AD (The Treasury of David)",
    content: "He does not say, 'The Lord is my feeder,' but 'my shepherd.' A shepherd is more than a provider; he is a guide, a defender, a companion. The assertion 'I shall not want' is not merely about physical lack, but spiritual contentment and the abundance of divine grace.",
    tags: ["comfort", "provision", "trust", "peace"]
  },
  {
    reference: "Isaiah 9:6",
    title: "The Fivefold Name of the Messiah",
    author: "Matthew Henry",
    era: "1710 AD",
    content: "The titles given to the Messiah represent the completeness of His redemptive work. As 'Wonderful,' He transcends human understanding. As 'Counsellor,' He acts as our advocate. As 'Mighty God,' He wields absolute power. As 'Everlasting Father,' He cares for us with eternal affection. As 'Prince of Peace,' He reconciles man to God.",
    tags: ["prophecy", "messiah", "peace", "theology"]
  },
  {
    reference: "John 1:1",
    title: "The Logos Doctrine",
    author: "St. John Chrysostom",
    era: "c. 390 AD",
    content: "The word 'Logos' was used to counter the errors of both Sabellianism and Arianism. St. John declares the Logos to be co-eternal and consubstantial with the Father. The Logos is not a created force, but God Himself, existing in dynamic relationship with the Father before the foundation of the world.",
    tags: ["logos", "divinity", "word", "trinity"]
  },
  {
    reference: "Romans 8:28",
    title: "Providence and Sovereign Purpose",
    author: "John Calvin",
    era: "1540 AD",
    content: "The Apostle does not say that all things are pleasant in themselves, but that they *work together* (synergei) under the guiding hand of God for the ultimate good of the elect. This 'good' is our conformity to the image of Christ. The adversity we face is not chaotic, but calibrated by grace.",
    tags: ["providence", "suffering", "sovereignty", "purpose"]
  },
  {
    reference: "Romans 8:37",
    title: "Hyper-Conquerors through Love",
    author: "St. Thomas Aquinas",
    era: "c. 1270 AD",
    content: "We are 'more than conquerors' because the trial does not diminish our charity, but perfects it. In standard conquests, the victor suffers loss. In Christian spiritual combat, our tribulations themselves become instruments of greater merit and union with Christ, making defeat completely impossible.",
    tags: ["victory", "love", "perseverance", "suffering"]
  },
  {
    reference: "Revelation 21:4",
    title: "The Cessation of Mortality",
    author: "Venerable Bede",
    era: "c. 715 AD",
    content: "The wiping away of tears signifies the final healing of the memory. The former things pass away because the corruption of the temporal state is swallowed up by the unchangeable light of eternity. There is no more sea because the restless, turbulent state of human history is stilled into divine stability.",
    tags: ["eternity", "hope", "comfort", "heaven"]
  }
];

// Curated RAG responses based on key semantic domains.
// This allows the mock RAG engine to return extremely rich, deep answers that resemble high-quality theological study output.
export const THEOLOGY_KB = [
  {
    keywords: ["grace", "salvation", "condemnation", "faith", "romans"],
    title: "Theology of Grace and Justification",
    synthesis: "In the New Testament, particularly in Romans 8, grace (charis) represents the unmerited, empowering favor of God. It stands in contrast to legalistic condemnation. St. Paul highlights that those 'in Christ Jesus' are set free from the law of sin and death by the Spirit of life. Commentary from St. Augustine and St. Thomas Aquinas emphasizes that grace operates to heal the human will, drawing it into fellowship with the divine. Spurgeon adds that this grace guarantees provision and total security under the Good Shepherd's care.",
    verses: ["Romans 8:1", "Romans 8:28", "Romans 8:39", "Psalms 23:1"],
    commentaries: ["Romans 8:28", "Psalms 23:1"]
  },
  {
    keywords: ["creation", "beginning", "genesis", "made", "logos", "word"],
    title: "Cosmology and the Eternal Word (Logos)",
    synthesis: "The scriptures link the act of creation in Genesis 1 with the person of Christ in John 1. Creation is not a mechanical accident but a speaking-into-existence through the 'Word' (Logos). St. Augustine asserts that creation occurs *with* time, meaning the physical universe has a definite point of origin (ex nihilo). St. John Chrysostom connects this Word directly to the Godhead, clarifying that Jesus is the agent of creation, meaning 'all things were made by him' and in Him is the light that conquers all darkness.",
    verses: ["Genesis 1:1", "Genesis 1:3", "John 1:1", "John 1:3", "John 1:14"],
    commentaries: ["Genesis 1:1", "John 1:1"]
  },
  {
    keywords: ["suffering", "trial", "pain", "comfort", "valley", "evil", "conqueror"],
    title: "Theology of Suffering and Sovereign Comfort",
    synthesis: "Scripture does not ignore suffering; instead, it reframes it. In Psalm 23, the 'valley of the shadow of death' is traversed with confidence because of the Shepherd's presence and comfort. In Romans 8, St. Paul argues that current sufferings are outweighed by future glory, and that all trials are woven by divine providence for our ultimate good (Calvin). Through Christ, believers are 'more than conquerors' (Aquinas) because tribulations serve to strengthen faith rather than destroy it. Revelation 21 points to the ultimate resolution where all tears, pain, and death are eternally abolished (Bede).",
    verses: ["Psalms 23:4", "Romans 8:28", "Romans 8:37", "Revelation 21:4"],
    commentaries: ["Romans 8:28", "Romans 8:37", "Revelation 21:4"]
  },
  {
    keywords: ["jesus", "messiah", "prophecy", "prince of peace", "born", "son"],
    title: "Messianic Prophecy and Incarnation",
    synthesis: "Isaiah 9 delivers one of the most powerful messianic prophecies, foretelling a child born to carry the government of God. Matthew Henry reflects on this 'Fivefold Name,' demonstrating how Jesus fulfills each title. This prophecy is realized in John 1:14, where 'the Word was made flesh and dwelt among us.' The incarnation represents the bridge between transcendent divinity and the physical cosmos, bringing light into human darkness and securing eternal peace.",
    verses: ["Isaiah 9:6", "John 1:1", "John 1:14", "Matthew 5:9"],
    commentaries: ["Isaiah 9:6", "John 1:1"]
  },
  {
    keywords: ["blessed", "beatitude", "meek", "merciful", "pure in heart", "peacemaker"],
    title: "The Beatitudes and the Kingdom of Heaven",
    synthesis: "Matthew 5 contains the Beatitudes, representing the core ethics of the Kingdom of Heaven. These descriptions—poor in spirit, meek, pure in heart, peacemakers—invert worldly standards of success and power. Those who are pure in heart are promised the vision of God (1 John 3:2), while peacemakers are called children of God. Augustine and other commentators view the Beatitudes as a ladder of spiritual ascent, moving from humility (poor in spirit) to perfect contemplation and peacemaking.",
    verses: ["Matthew 5:3", "Matthew 5:8", "Matthew 5:9", "Isaiah 9:6"],
    commentaries: ["Isaiah 9:6"]
  }
];

export function getChapters(bookName: string): number[] {
  const versesForBook = BIBLE_VERSES.filter(v => v.book.toLowerCase() === bookName.toLowerCase());
  const chapters = Array.from(new Set(versesForBook.map(v => v.chapter)));
  return chapters.sort((a, b) => a - b);
}

export function getVerses(bookName: string, chapter: number): Verse[] {
  return BIBLE_VERSES.filter(
    v => v.book.toLowerCase() === bookName.toLowerCase() && v.chapter === chapter
  ).sort((a, b) => a.verse - b.verse);
}

export function searchBible(query: string): SearchResult {
  const lowerQuery = query.toLowerCase();
  
  // RAG Matching process:
  // 1. Search the structured Knowledge Base (THEOLOGY_KB) using keyword intersections
  let bestKb = THEOLOGY_KB[0]; // fallback default
  let maxMatches = -1;

  for (const kb of THEOLOGY_KB) {
    let matches = 0;
    for (const kw of kb.keywords) {
      if (lowerQuery.includes(kw)) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestKb = kb;
    }
  }

  // 2. Fetch specific matching verses
  const matchedVerseTexts: Verse[] = [];
  
  // Always include verses from matched KB
  if (maxMatches > 0) {
    for (const ref of bestKb.verses) {
      const parts = ref.split(" ");
      const book = parts[0];
      const chv = parts[1].split(":");
      const ch = parseInt(chv[0]);
      const v = parseInt(chv[1]);
      
      const found = BIBLE_VERSES.find(bv => bv.book === book && bv.chapter === ch && bv.verse === v);
      if (found && !matchedVerseTexts.some(x => x.book === found.book && x.chapter === found.chapter && x.verse === found.verse)) {
        matchedVerseTexts.push(found);
      }
    }
  }

  // Also scan literal matches in text
  for (const bv of BIBLE_VERSES) {
    if (bv.text.toLowerCase().includes(lowerQuery) || bv.book.toLowerCase().includes(lowerQuery)) {
      if (!matchedVerseTexts.some(x => x.book === bv.book && x.chapter === bv.chapter && x.verse === bv.verse)) {
        matchedVerseTexts.push(bv);
      }
    }
  }

  // Limit matched verses
  const finalVerses = matchedVerseTexts.slice(0, 5);

  // 3. Fetch commentaries
  const finalCommentaries: Commentary[] = [];
  if (maxMatches > 0) {
    for (const ref of bestKb.commentaries) {
      const found = COMMENTARIES.find(c => c.reference === ref);
      if (found) {
        finalCommentaries.push(found);
      }
    }
  }

  // Scan literal matches in commentaries
  for (const c of COMMENTARIES) {
    if (c.content.toLowerCase().includes(lowerQuery) || c.reference.toLowerCase().includes(lowerQuery)) {
      if (!finalCommentaries.some(x => x.reference === c.reference)) {
        finalCommentaries.push(c);
      }
    }
  }

  // 4. Synthesize final answer based on whether matches were found
  let analysis = "";
  if (maxMatches > 0) {
    analysis = bestKb.synthesis;
  } else {
    // Generative fallback
    analysis = `Your query regarding "${query}" touches on profound themes of scriptural exegesis. While this specific phrasing isn't explicitly defined in our historical patristic RAG repository, the word of God frequently guides us in seeking wisdom, understanding, and prayerful reflection. 
    
    In studying the Word, historical theologians advise looking to the foundation of creation (Genesis 1, John 1) and the comforting shepherdhood of the Lord (Psalm 23) to understand the broader narrative of scripture. We encourage you to select a verse in the reader or try asking about 'grace in Romans', 'creation in Genesis', or 'messianic prophecy in Isaiah' to unlock deeper theological records.`;
  }

  return {
    verses: finalVerses.length > 0 ? finalVerses : BIBLE_VERSES.slice(5, 8), // fallback some scriptures
    commentaries: finalCommentaries.slice(0, 3),
    analysis
  };
}
