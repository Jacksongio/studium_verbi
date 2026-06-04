/**
 * Luther's Small Catechism
 * Content sourced from the public domain text of the 1529 catechism.
 * Reference: https://catechism.cph.org/
 */

export interface CatechismItem {
  title: string;
  text?: string;
  explanation?: string;
  scripture?: string;
}

export interface CatechismSection {
  id: string;
  title: string;
  subtitle?: string;
  introduction?: string;
  items: CatechismItem[];
}

export const CATECHISM_SECTIONS: CatechismSection[] = [
  /* ══════════════════════════════════════════════
     Part I: The Ten Commandments
     ══════════════════════════════════════════════ */
  {
    id: "ten-commandments",
    title: "The Ten Commandments",
    subtitle: "As the head of the family should teach them in a simple way to his household",
    items: [
      {
        title: "The First Commandment",
        text: "You shall have no other gods.",
        explanation:
          "We should fear, love, and trust in God above all things.",
      },
      {
        title: "The Second Commandment",
        text: "You shall not misuse the name of the LORD your God.",
        explanation:
          "We should fear and love God so that we do not curse, swear, use satanic arts, lie, or deceive by His name, but call upon it in every trouble, pray, praise, and give thanks.",
      },
      {
        title: "The Third Commandment",
        text: "Remember the Sabbath day by keeping it holy.",
        explanation:
          "We should fear and love God so that we do not despise preaching and His Word, but hold it sacred and gladly hear and learn it.",
      },
      {
        title: "The Fourth Commandment",
        text: "Honor your father and your mother.",
        explanation:
          "We should fear and love God so that we do not despise or anger our parents and other authorities, but honor them, serve and obey them, love and cherish them.",
      },
      {
        title: "The Fifth Commandment",
        text: "You shall not murder.",
        explanation:
          "We should fear and love God so that we do not hurt or harm our neighbor in his body, but help and support him in every physical need.",
      },
      {
        title: "The Sixth Commandment",
        text: "You shall not commit adultery.",
        explanation:
          "We should fear and love God so that we lead a sexually pure and decent life in what we say and do, and husband and wife love and honor each other.",
      },
      {
        title: "The Seventh Commandment",
        text: "You shall not steal.",
        explanation:
          "We should fear and love God so that we do not take our neighbor\u2019s money or possessions, or get them in any dishonest way, but help him to improve and protect his possessions and income.",
      },
      {
        title: "The Eighth Commandment",
        text: "You shall not give false testimony against your neighbor.",
        explanation:
          "We should fear and love God so that we do not tell lies about our neighbor, betray him, slander him, or hurt his reputation, but defend him, speak well of him, and explain everything in the kindest way.",
      },
      {
        title: "The Ninth Commandment",
        text: "You shall not covet your neighbor\u2019s house.",
        explanation:
          "We should fear and love God so that we do not scheme to get our neighbor\u2019s inheritance or house, or get it in a way which only appears right, but help and be of service to him in keeping it.",
      },
      {
        title: "The Tenth Commandment",
        text: "You shall not covet your neighbor\u2019s wife, or his manservant or maidservant, his ox or donkey, or anything that belongs to your neighbor.",
        explanation:
          "We should fear and love God so that we do not entice or force away our neighbor\u2019s wife, workers, or animals, or turn them against him, but urge them to stay and do their duty.",
      },
      {
        title: "The Close of the Commandments",
        text: "What does God say about all these commandments?",
        explanation:
          "He says: \u201CI, the LORD your God, am a jealous God, punishing the children for the sin of the fathers to the third and fourth generation of those who hate Me, but showing love to a thousand generations of those who love Me and keep My commandments.\u201D (Exodus 20:5\u20136)\n\nGod threatens to punish all who break these commandments. Therefore, we should fear His wrath and not do anything against them. But He promises grace and every blessing to all who keep these commandments. Therefore, we should also love and trust in Him and gladly do what He commands.",
        scripture: "Exodus 20:5\u20136",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part II: The Apostles' Creed
     ══════════════════════════════════════════════ */
  {
    id: "apostles-creed",
    title: "The Apostles\u2019 Creed",
    subtitle: "As the head of the family should teach it in a simple way to his household",
    items: [
      {
        title: "The First Article: Creation",
        text: "I believe in God, the Father Almighty, Maker of heaven and earth.",
        explanation:
          "I believe that God has made me and all creatures; that He has given me my body and soul, eyes, ears, and all my members, my reason and all my senses, and still takes care of them.\n\nHe also gives me clothing and shoes, food and drink, house and home, wife and children, land, animals, and all I have. He richly and daily provides me with all that I need to support this body and life.\n\nHe defends me against all danger and guards and protects me from all evil. All this He does only out of fatherly, divine goodness and mercy, without any merit or worthiness in me. For all this it is my duty to thank and praise, serve and obey Him.\n\nThis is most certainly true.",
      },
      {
        title: "The Second Article: Redemption",
        text: "And in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried. He descended into hell. The third day He rose again from the dead. He ascended into heaven and sits at the right hand of God, the Father Almighty. From thence He will come to judge the living and the dead.",
        explanation:
          "I believe that Jesus Christ, true God, begotten of the Father from eternity, and also true man, born of the Virgin Mary, is my Lord,\n\nwho has redeemed me, a lost and condemned person, purchased and won me from all sins, from death, and from the power of the devil; not with gold or silver, but with His holy, precious blood and with His innocent suffering and death,\n\nthat I may be His own and live under Him in His kingdom and serve Him in everlasting righteousness, innocence, and blessedness,\n\njust as He is risen from the dead, lives and reigns to all eternity.\n\nThis is most certainly true.",
      },
      {
        title: "The Third Article: Sanctification",
        text: "I believe in the Holy Spirit, the holy Christian church, the communion of saints, the forgiveness of sins, the resurrection of the body, and the life everlasting. Amen.",
        explanation:
          "I believe that I cannot by my own reason or strength believe in Jesus Christ, my Lord, or come to Him; but the Holy Spirit has called me by the Gospel, enlightened me with His gifts, sanctified and kept me in the true faith.\n\nIn the same way He calls, gathers, enlightens, and sanctifies the whole Christian church on earth, and keeps it with Jesus Christ in the one true faith.\n\nIn this Christian church He daily and richly forgives all my sins and the sins of all believers.\n\nOn the Last Day He will raise me and all the dead, and give eternal life to me and all believers in Christ.\n\nThis is most certainly true.",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part III: The Lord's Prayer
     ══════════════════════════════════════════════ */
  {
    id: "lords-prayer",
    title: "The Lord\u2019s Prayer",
    subtitle: "As the head of the family should teach it in a simple way to his household",
    introduction:
      "Our Father who art in heaven, hallowed be Thy name, Thy kingdom come, Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. For Thine is the kingdom and the power and the glory forever and ever. Amen.",
    items: [
      {
        title: "Introduction",
        text: "Our Father who art in heaven.",
        explanation:
          "With these words God tenderly invites us to believe that He is our true Father and that we are His true children, so that with all boldness and confidence we may ask Him as dear children ask their dear father.",
      },
      {
        title: "The First Petition",
        text: "Hallowed be Thy name.",
        explanation:
          "God\u2019s name is certainly holy in itself, but we pray in this petition that it may be kept holy among us also.\n\nHow is God\u2019s name kept holy? God\u2019s name is kept holy when the Word of God is taught in its truth and purity, and we, as the children of God, also lead holy lives according to it. Help us to do this, dear Father in heaven! But anyone who teaches or lives contrary to God\u2019s Word profanes the name of God among us. Protect us from this, heavenly Father!",
      },
      {
        title: "The Second Petition",
        text: "Thy kingdom come.",
        explanation:
          "The kingdom of God certainly comes by itself without our prayer, but we pray in this petition that it may come to us also.\n\nHow does God\u2019s kingdom come? God\u2019s kingdom comes when our heavenly Father gives us His Holy Spirit, so that by His grace we believe His holy Word and lead godly lives here in time and there in eternity.",
      },
      {
        title: "The Third Petition",
        text: "Thy will be done on earth as it is in heaven.",
        explanation:
          "The good and gracious will of God is done even without our prayer, but we pray in this petition that it may be done among us also.\n\nHow is God\u2019s will done? God\u2019s will is done when He breaks and hinders every evil plan and purpose of the devil, the world, and our sinful nature, which do not want us to hallow God\u2019s name or let His kingdom come; and when He strengthens and keeps us firm in His Word and faith until we die. This is His good and gracious will.",
      },
      {
        title: "The Fourth Petition",
        text: "Give us this day our daily bread.",
        explanation:
          "God certainly gives daily bread to everyone without our prayers, even to all evil people, but we pray in this petition that God would lead us to realize this and to receive our daily bread with thanksgiving.\n\nWhat is meant by daily bread? Daily bread includes everything that has to do with the support and needs of the body, such as food, drink, clothing, shoes, house, home, land, animals, money, goods, a devout husband or wife, devout children, devout workers, devout and faithful rulers, good government, good weather, peace, health, self-control, good reputation, good friends, faithful neighbors, and the like.",
      },
      {
        title: "The Fifth Petition",
        text: "And forgive us our trespasses as we forgive those who trespass against us.",
        explanation:
          "We pray in this petition that our Father in heaven would not look at our sins, or deny our prayer because of them. We are neither worthy of the things for which we pray, nor have we deserved them, but we ask that He would give them all to us by grace, for we daily sin much and surely deserve nothing but punishment.\n\nSo we too will sincerely forgive and gladly do good to those who sin against us.",
      },
      {
        title: "The Sixth Petition",
        text: "And lead us not into temptation.",
        explanation:
          "God tempts no one. We pray in this petition that God would guard and keep us so that the devil, the world, and our sinful nature may not deceive us or mislead us into false belief, despair, and other great shame and vice. Although we are attacked by these things, we pray that we may finally overcome them and win the victory.",
      },
      {
        title: "The Seventh Petition",
        text: "But deliver us from evil.",
        explanation:
          "We pray in this petition, in summary, that our Father in heaven would rescue us from every evil of body and soul, possessions and reputation, and finally, when our last hour comes, give us a blessed end, and graciously take us from this valley of sorrow to Himself in heaven.",
      },
      {
        title: "Conclusion",
        text: "For Thine is the kingdom and the power and the glory forever and ever. Amen.",
        explanation:
          "This means that I should be certain that these petitions are pleasing to our Father in heaven, and are heard by Him; for He Himself has commanded us to pray in this way and has promised to hear us. Amen, amen means \u201Cyes, yes, it shall be so.\u201D",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part IV: The Sacrament of Holy Baptism
     ══════════════════════════════════════════════ */
  {
    id: "baptism",
    title: "The Sacrament of Holy Baptism",
    subtitle: "As the head of the family should teach it in a simple way to his household",
    items: [
      {
        title: "First: The Nature of Baptism",
        text: "What is Baptism?",
        explanation:
          "Baptism is not just plain water, but it is the water included in God\u2019s command and combined with God\u2019s word.\n\nWhich is that word of God? Christ our Lord says in the last chapter of Matthew: \u201CTherefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.\u201D (Matthew 28:19)",
        scripture: "Matthew 28:19",
      },
      {
        title: "Second: The Benefits of Baptism",
        text: "What benefits does Baptism give?",
        explanation:
          "It works forgiveness of sins, rescues from death and the devil, and gives eternal salvation to all who believe this, as the words and promises of God declare.\n\nWhich are these words and promises of God? Christ our Lord says in the last chapter of Mark: \u201CWhoever believes and is baptized will be saved, but whoever does not believe will be condemned.\u201D (Mark 16:16)",
        scripture: "Mark 16:16",
      },
      {
        title: "Third: The Power of Baptism",
        text: "How can water do such great things?",
        explanation:
          "Certainly not just water, but the word of God in and with the water does these things, along with the faith which trusts this word of God in the water. For without God\u2019s word the water is plain water and no Baptism. But with the word of God it is a Baptism, that is, a life-giving water, rich in grace, and a washing of the new birth in the Holy Spirit, as St. Paul says in Titus, chapter three: \u201CHe saved us through the washing of rebirth and renewal by the Holy Spirit, whom He poured out on us generously through Jesus Christ our Savior, so that, having been justified by His grace, we might become heirs having the hope of eternal life. This is a trustworthy saying.\u201D (Titus 3:5\u20138)",
        scripture: "Titus 3:5\u20138",
      },
      {
        title: "Fourth: The Significance of Baptizing with Water",
        text: "What does such baptizing with water indicate?",
        explanation:
          "It indicates that the Old Adam in us should by daily contrition and repentance be drowned and die with all sins and evil desires, and that a new man should daily emerge and arise to live before God in righteousness and purity forever.\n\nWhere is this written? St. Paul writes in Romans, chapter six: \u201CWe were therefore buried with Him through baptism into death in order that, just as Christ was raised from the dead through the glory of the Father, we too may live a new life.\u201D (Romans 6:4)",
        scripture: "Romans 6:4",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part V: Confession
     ══════════════════════════════════════════════ */
  {
    id: "confession",
    title: "Confession",
    subtitle: "How Christians should be taught to confess",
    items: [
      {
        title: "What is Confession?",
        text: "What is Confession?",
        explanation:
          "Confession has two parts.\n\nFirst, that we confess our sins, and second, that we receive absolution, that is, forgiveness, from the pastor as from God Himself, not doubting, but firmly believing that by it our sins are forgiven before God in heaven.",
      },
      {
        title: "What sins should we confess?",
        text: "What sins should we confess?",
        explanation:
          "Before God we should plead guilty of all sins, even those we are not aware of, as we do in the Lord\u2019s Prayer; but before the pastor we should confess only those sins which we know and feel in our hearts.\n\nWhich are these? Consider your place in life according to the Ten Commandments: Are you a father, mother, son, daughter, husband, wife, or worker? Have you been disobedient, unfaithful, or lazy? Have you been hot-tempered, rude, or quarrelsome? Have you hurt someone by word or deed? Have you stolen, been negligent, wasted anything, or done any harm?",
      },
      {
        title: "The Office of the Keys",
        text: "What is the Office of the Keys?",
        explanation:
          "The Office of the Keys is that special authority which Christ has given to His church on earth to forgive the sins of repentant sinners, but to withhold forgiveness from the unrepentant as long as they do not repent.\n\nWhere is this written? This is what St. John the Evangelist writes in chapter twenty: The Lord Jesus breathed on His disciples and said, \u201CReceive the Holy Spirit. If you forgive anyone his sins, they are forgiven; if you do not forgive them, they are not forgiven.\u201D (John 20:22\u201323)",
        scripture: "John 20:22\u201323",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part VI: The Sacrament of the Altar
     ══════════════════════════════════════════════ */
  {
    id: "sacrament-of-altar",
    title: "The Sacrament of the Altar",
    subtitle: "As the head of the family should teach it in a simple way to his household",
    items: [
      {
        title: "What is the Sacrament of the Altar?",
        text: "What is the Sacrament of the Altar?",
        explanation:
          "It is the true body and blood of our Lord Jesus Christ under the bread and wine, instituted by Christ Himself for us Christians to eat and to drink.\n\nWhere is this written? The holy Evangelists Matthew, Mark, Luke, and St. Paul write: Our Lord Jesus Christ, on the night when He was betrayed, took bread, and when He had given thanks, He broke it and gave it to the disciples and said: \u201CTake, eat; this is My body, which is given for you. This do in remembrance of Me.\u201D\n\nIn the same way also He took the cup after supper, and when He had given thanks, He gave it to them, saying: \u201CDrink of it, all of you; this cup is the new testament in My blood, which is shed for you for the forgiveness of sins. This do, as often as you drink it, in remembrance of Me.\u201D",
      },
      {
        title: "What is the benefit of this eating and drinking?",
        text: "What is the benefit of this eating and drinking?",
        explanation:
          "These words, \u201CGiven and shed for you for the forgiveness of sins,\u201D show us that in the Sacrament forgiveness of sins, life, and salvation are given us through these words. For where there is forgiveness of sins, there is also life and salvation.",
      },
      {
        title: "How can bodily eating and drinking do such great things?",
        text: "How can bodily eating and drinking do such great things?",
        explanation:
          "Certainly not just eating and drinking do these things, but the words written here: \u201CGiven and shed for you for the forgiveness of sins.\u201D These words, along with the bodily eating and drinking, are the main thing in the Sacrament. Whoever believes these words has exactly what they say: \u201Cforgiveness of sins.\u201D",
      },
      {
        title: "Who receives this sacrament worthily?",
        text: "Who receives this sacrament worthily?",
        explanation:
          "Fasting and bodily preparation are certainly fine outward training. But that person is truly worthy and well prepared who has faith in these words: \u201CGiven and shed for you for the forgiveness of sins.\u201D\n\nBut anyone who does not believe these words or doubts them is unworthy and unprepared, for the words \u201Cfor you\u201D require all hearts to believe.",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part VII: Daily Prayers
     ══════════════════════════════════════════════ */
  {
    id: "daily-prayers",
    title: "Daily Prayers",
    subtitle: "How the head of the family should teach his household to pray morning and evening",
    items: [
      {
        title: "Morning Prayer",
        text: "In the name of the Father and of the Son and of the Holy Spirit. Amen.",
        explanation:
          "I thank You, my heavenly Father, through Jesus Christ, Your dear Son, that You have kept me this night from all harm and danger; and I pray that You would keep me this day also from sin and every evil, that all my doings and life may please You. For into Your hands I commend myself, my body and soul, and all things. Let Your holy angel be with me, that the evil foe may have no power over me. Amen.\n\nThen go joyfully to your work, singing a hymn, like that of the Ten Commandments, or whatever your devotion may suggest.",
      },
      {
        title: "Evening Prayer",
        text: "In the name of the Father and of the Son and of the Holy Spirit. Amen.",
        explanation:
          "I thank You, my heavenly Father, through Jesus Christ, Your dear Son, that You have graciously kept me this day; and I pray that You would forgive me all my sins where I have done wrong, and graciously keep me this night. For into Your hands I commend myself, my body and soul, and all things. Let Your holy angel be with me, that the evil foe may have no power over me. Amen.\n\nThen go to sleep at once and in good cheer.",
      },
      {
        title: "Asking a Blessing (Before Meals)",
        text: "The eyes of all look to You, O Lord, and You give them their food at the proper time. You open Your hand and satisfy the desires of every living thing. (Psalm 145:15\u201316)",
        explanation:
          "Lord God, heavenly Father, bless us and these Your gifts which we receive from Your bountiful goodness, through Jesus Christ, our Lord. Amen.",
        scripture: "Psalm 145:15\u201316",
      },
      {
        title: "Returning Thanks (After Meals)",
        text: "Give thanks to the LORD, for He is good. His love endures forever. He gives food to every creature. He provides food for the cattle and for the young ravens when they call. His pleasure is not in the strength of the horse, nor His delight in the legs of a man; the LORD delights in those who fear Him, who put their hope in His unfailing love. (Psalm 136:1, 25; 147:9\u201311)",
        explanation:
          "We thank You, Lord God, heavenly Father, for all Your benefits, through Jesus Christ, our Lord, who lives and reigns with You and the Holy Spirit forever and ever. Amen.",
        scripture: "Psalm 136:1, 25; 147:9\u201311",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part VIII: Table of Duties
     ══════════════════════════════════════════════ */
  {
    id: "table-of-duties",
    title: "Table of Duties",
    subtitle: "Certain passages of Scripture for various holy orders and positions, admonishing them about their duties and responsibilities",
    items: [
      {
        title: "To Bishops, Pastors, and Preachers",
        text: "The overseer must be above reproach, the husband of but one wife, temperate, self-controlled, respectable, hospitable, able to teach, not given to drunkenness, not violent but gentle, not quarrelsome, not a lover of money. He must manage his own family well and see that his children obey him with proper respect.",
        explanation:
          "He must not be a recent convert, or he may become conceited and fall under the same judgment as the devil. (1 Timothy 3:2\u20134, 6)\n\nHe must hold firmly to the trustworthy message as it has been taught, so that he can encourage others by sound doctrine and refute those who oppose it. (Titus 1:9)",
        scripture: "1 Timothy 3:2\u20134, 6; Titus 1:9",
      },
      {
        title: "What the Hearers Owe Their Pastors",
        text: "The Lord has commanded that those who preach the gospel should receive their living from the gospel. (1 Corinthians 9:14)",
        explanation:
          "Anyone who receives instruction in the word must share all good things with his instructor. Do not be deceived: God cannot be mocked. (Galatians 6:6\u20137)\n\nThe elders who direct the affairs of the church well are worthy of double honor, especially those whose work is preaching and teaching. For the Scripture says, \u201CDo not muzzle the ox while it is treading out the grain,\u201D and \u201CThe worker deserves his wages.\u201D (1 Timothy 5:17\u201318)\n\nWe ask you, brothers, to respect those who work hard among you, who are over you in the Lord and who admonish you. Hold them in the highest regard in love because of their work. Live in peace with each other. (1 Thessalonians 5:12\u201313)\n\nObey your leaders and submit to their authority. They keep watch over you as men who must give an account. Obey them so that their work will be a joy, not a burden, for that would be of no advantage to you. (Hebrews 13:17)",
        scripture: "1 Corinthians 9:14; Galatians 6:6\u20137; 1 Timothy 5:17\u201318; 1 Thessalonians 5:12\u201313; Hebrews 13:17",
      },
      {
        title: "Of Civil Government",
        text: "Everyone must submit himself to the governing authorities, for there is no authority except that which God has established. The authorities that exist have been established by God. Consequently, he who rebels against the authority is rebelling against what God has instituted, and those who do so will bring judgment on themselves.",
        explanation:
          "For rulers hold no terror for those who do right, but for those who do wrong. Do you want to be free from fear of the one in authority? Then do what is right and he will commend you. For he is God\u2019s servant to do you good. But if you do wrong, be afraid, for he does not bear the sword for nothing. He is God\u2019s servant, an agent of wrath to bring punishment on the wrongdoer. (Romans 13:1\u20134)",
        scripture: "Romans 13:1\u20134",
      },
      {
        title: "Of Citizens",
        text: "Give to Caesar what is Caesar\u2019s, and to God what is God\u2019s. (Matthew 22:21)",
        explanation:
          "It is necessary to submit to the authorities, not only because of possible punishment but also because of conscience. This is also why you pay taxes, for the authorities are God\u2019s servants, who give their full time to governing. Give everyone what you owe him: If you owe taxes, pay taxes; if revenue, then revenue; if respect, then respect; if honor, then honor. (Romans 13:5\u20137)\n\nI urge, then, first of all, that requests, prayers, intercession and thanksgiving be made for everyone\u2014for kings and all those in authority, that we may live peaceful and quiet lives in all godliness and holiness. This is good, and pleases God our Savior. (1 Timothy 2:1\u20133)\n\nRemind the people to be subject to rulers and authorities, to be obedient, to be ready to do whatever is good. (Titus 3:1)\n\nSubmit yourselves for the Lord\u2019s sake to every authority instituted among men: whether to the king, as the supreme authority, or to governors, who are sent by him to punish those who do wrong and to commend those who do right. (1 Peter 2:13\u201314)",
        scripture: "Matthew 22:21; Romans 13:5\u20137; 1 Timothy 2:1\u20133; Titus 3:1; 1 Peter 2:13\u201314",
      },
      {
        title: "To Husbands",
        text: "Husbands, in the same way be considerate as you live with your wives, and treat them with respect as the weaker partner and as heirs with you of the gracious gift of life, so that nothing will hinder your prayers. (1 Peter 3:7)",
        explanation:
          "Husbands, love your wives and do not be harsh with them. (Colossians 3:19)",
        scripture: "1 Peter 3:7; Colossians 3:19",
      },
      {
        title: "To Wives",
        text: "Wives, submit to your husbands as to the Lord. (Ephesians 5:22)",
        explanation:
          "They were submissive to their own husbands, like Sarah, who obeyed Abraham and called him her master. You are her daughters if you do what is right and do not give way to fear. (1 Peter 3:5\u20136)",
        scripture: "Ephesians 5:22; 1 Peter 3:5\u20136",
      },
      {
        title: "To Parents",
        text: "Fathers, do not exasperate your children; instead, bring them up in the training and instruction of the Lord. (Ephesians 6:4)",
        scripture: "Ephesians 6:4",
      },
      {
        title: "To Children",
        text: "Children, obey your parents in the Lord, for this is right. \u201CHonor your father and your mother\u201D\u2014which is the first commandment with a promise\u2014\u201Cthat it may go well with you and that you may enjoy long life on the earth.\u201D (Ephesians 6:1\u20133)",
        scripture: "Ephesians 6:1\u20133",
      },
      {
        title: "To Workers of All Kinds",
        text: "Slaves, obey your earthly masters with respect and fear, and with sincerity of heart, just as you would obey Christ. Obey them not only to win their favor when their eye is on you, but like slaves of Christ, doing the will of God from your heart.",
        explanation:
          "Serve wholeheartedly, as if you were serving the Lord, not men, because you know that the Lord will reward everyone for whatever good he does, whether he is slave or free. (Ephesians 6:5\u20138)",
        scripture: "Ephesians 6:5\u20138",
      },
      {
        title: "To Employers and Supervisors",
        text: "Masters, treat your slaves in the same way. Do not threaten them, since you know that He who is both their Master and yours is in heaven, and there is no favoritism with Him. (Ephesians 6:9)",
        scripture: "Ephesians 6:9",
      },
      {
        title: "To Youth",
        text: "Young men, in the same way be submissive to those who are older. All of you, clothe yourselves with humility toward one another, because, \u201CGod opposes the proud but gives grace to the humble.\u201D Humble yourselves, therefore, under God\u2019s mighty hand, that He may lift you up in due time. (1 Peter 5:5\u20136)",
        scripture: "1 Peter 5:5\u20136",
      },
      {
        title: "To Widows",
        text: "The widow who is really in need and left all alone puts her hope in God and continues night and day to pray and to ask God for help. But the widow who lives for pleasure is dead even while she lives. (1 Timothy 5:5\u20136)",
        scripture: "1 Timothy 5:5\u20136",
      },
      {
        title: "To Everyone",
        text: "The commandments \u2026 are summed up in this one rule: \u201CLove your neighbor as yourself.\u201D (Romans 13:9)",
        explanation:
          "I urge \u2026 that requests, prayers, intercession and thanksgiving be made for everyone. (1 Timothy 2:1)\n\nLet each his lesson learn with care, and all the household well shall fare.",
        scripture: "Romans 13:9; 1 Timothy 2:1",
      },
    ],
  },
];
