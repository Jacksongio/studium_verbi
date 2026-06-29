/**
 * Catechism of the Catholic Church — Summary
 * Based on the Catechism of the Catholic Church (CCC), promulgated by
 * Pope St. John Paul II in 1992. Paragraph numbers (e.g., CCC 232) refer
 * to the official text.
 * Reference: https://www.vatican.va/archive/ENG0015/_INDEX.HTM
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
     Part I: The Profession of Faith
     ══════════════════════════════════════════════ */
  {
    id: "profession-of-faith",
    title: "The Profession of Faith",
    subtitle: "The Apostles' Creed and what the Church believes",
    introduction:
      "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
    items: [
      {
        title: "The First Article: God the Father and Creation",
        text: "I believe in God, the Father almighty, Creator of heaven and earth.",
        explanation:
          "God is the infinitely perfect Being who is the source of all that exists. He created the world freely, out of nothing, by His wisdom and love. God creates and sustains all things visible and invisible. He is Father in relation to His only Son, and Father to us through the grace of adoption.\n\nThe mystery of the Most Holy Trinity is the central mystery of Christian faith and life. It is the mystery of God in Himself: one God in three Persons — Father, Son, and Holy Spirit. (CCC 232–267, 279–324)",
        scripture: "Genesis 1:1; John 1:1–3; Romans 8:15",
      },
      {
        title: "The Second Article: Jesus Christ, the Only Son of God",
        text: "And in Jesus Christ, His only Son, our Lord.",
        explanation:
          "Jesus Christ is the eternal Son of God made man. He is true God and true man, possessing two natures — divine and human — united in the one divine Person of the Word. By His Incarnation, the Son of God united Himself in some fashion with every human being.\n\nHe suffered, died, and was buried to redeem us from sin and death. He descended into hell to free the just who had gone before Him, rose from the dead on the third day, and ascended into heaven where He sits at the right hand of the Father. He will come again in glory to judge the living and the dead. (CCC 422–682)",
        scripture: "John 3:16; Philippians 2:6–11; 1 Corinthians 15:3–4",
      },
      {
        title: "The Third Article: The Holy Spirit and the Church",
        text: "I believe in the Holy Spirit, the holy catholic Church.",
        explanation:
          "The Holy Spirit, the third Person of the Trinity, proceeds from the Father and the Son. He is the Lord and Giver of life, who spoke through the prophets and was poured out upon the Church at Pentecost.\n\nThe Church is the Body of Christ and the Temple of the Holy Spirit. She is one, holy, catholic, and apostolic. Christ entrusted His Church to Peter and the Apostles, and their successors — the Pope and bishops — continue to shepherd the faithful in His name. The Church is the universal sacrament of salvation. (CCC 683–975)",
        scripture: "Acts 2:1–4; Matthew 16:18–19; Ephesians 4:4–6",
      },
      {
        title: "The Communion of Saints and the Forgiveness of Sins",
        text: "The communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting.",
        explanation:
          "The communion of saints is the spiritual solidarity which binds the faithful on earth, the souls in purgatory, and the saints in heaven. Through Baptism and the sacraments, we receive the forgiveness of sins. We profess our belief in the resurrection of the body at the last day, when all shall rise in their own bodies, and in life everlasting with God. (CCC 946–1065)",
        scripture: "1 Corinthians 12:26–27; 1 John 1:9; 1 Corinthians 15:42–44",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part II: The Seven Sacraments
     ══════════════════════════════════════════════ */
  {
    id: "seven-sacraments",
    title: "The Seven Sacraments",
    subtitle: "The sacred signs instituted by Christ to give grace",
    items: [
      {
        title: "Baptism",
        text: "The gateway to life in the Spirit and the door to the other sacraments.",
        explanation:
          "Baptism forgives all sin — original and personal — and all punishment due to sin. It imprints an indelible spiritual mark (character) and makes the baptized person a member of Christ’s Body, the Church. Baptism is conferred by pouring water on the head or by immersion, with the words: “I baptize you in the name of the Father, and of the Son, and of the Holy Spirit.” Baptism is necessary for salvation for those who have received the Gospel. (CCC 1213–1284)",
        scripture: "Matthew 28:19; John 3:5; Romans 6:3–4",
      },
      {
        title: "Confirmation",
        text: "The sacrament that completes baptismal grace and strengthens the faithful.",
        explanation:
          "Confirmation perfects Baptism by a special outpouring of the Holy Spirit, as granted to the Apostles at Pentecost. It deepens our incorporation into Christ and the Church, strengthens the gifts of the Holy Spirit within us, and gives us a special strength to spread and defend the faith. The bishop (or delegated priest) anoints the forehead with Sacred Chrism, saying: “Be sealed with the Gift of the Holy Spirit.” (CCC 1285–1321)",
        scripture: "Acts 8:14–17; Acts 2:1–4",
      },
      {
        title: "The Eucharist",
        text: "The source and summit of the Christian life.",
        explanation:
          "In the Eucharist, bread and wine become the Body and Blood, Soul and Divinity of Jesus Christ through transubstantiation. The Eucharist is both a sacrifice — the re-presentation of the sacrifice of the Cross — and a sacred banquet of Holy Communion. Catholics are obliged to attend Mass on Sundays and holy days of obligation. Worthy reception of the Eucharist preserves and increases sanctifying grace, remits venial sin, and preserves us from mortal sin. (CCC 1322–1419)",
        scripture: "Luke 22:19–20; John 6:53–56; 1 Corinthians 11:23–26",
      },
      {
        title: "Penance and Reconciliation",
        text: "The sacrament of conversion, confession, and absolution.",
        explanation:
          "Christ instituted the Sacrament of Penance for the forgiveness of sins committed after Baptism. The penitent must be contrite, confess all mortal sins to a priest, and perform the penance given. The priest, acting in the person of Christ, grants absolution with the words: “I absolve you from your sins in the name of the Father, and of the Son, and of the Holy Spirit.” The seal of confession is inviolable. (CCC 1422–1498)",
        scripture: "John 20:22–23; 2 Corinthians 5:18–20; James 5:16",
      },
      {
        title: "Anointing of the Sick",
        text: "Sacred anointing for those suffering grave illness or the frailties of old age.",
        explanation:
          "Through the Anointing of the Sick, the Church commends those who are seriously ill to the suffering and glorified Lord. The priest anoints the forehead and hands with the Oil of the Sick, praying for the grace of the Holy Spirit. This sacrament confers strength, peace, and courage, unites the sick person’s suffering with Christ’s Passion, contributes to the sanctification of the Church, and prepares for the final journey. (CCC 1499–1532)",
        scripture: "James 5:14–15; Mark 6:13",
      },
      {
        title: "Holy Orders",
        text: "The sacrament through which the mission entrusted by Christ continues in the Church.",
        explanation:
          "Holy Orders confers the power of sacred ministry in three degrees: bishop (fullness of the sacrament), priest, and deacon. Through this sacrament, priests are configured to Christ the Head and empowered to act in His Person (in persona Christi) to teach, sanctify, and govern. Only a baptized man can validly receive ordination. The ministerial priesthood differs in essence from the common priesthood of the faithful. (CCC 1536–1600)",
        scripture: "Hebrews 5:1–10; Luke 22:19; Acts 6:6",
      },
      {
        title: "Matrimony",
        text: "The covenant by which a man and a woman establish a lifelong partnership.",
        explanation:
          "Christian marriage is a sacrament in which the spouses, as ministers of Christ’s grace, mutually confer upon each other the Sacrament of Matrimony. Marriage is ordered to the good of the spouses and the procreation and education of children. A valid, consummated marriage between two baptized persons cannot be dissolved by any human power. Marriage reflects the union of Christ and His Church. (CCC 1601–1666)",
        scripture: "Genesis 2:24; Matthew 19:4–6; Ephesians 5:25–32",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part III: The Ten Commandments
     ══════════════════════════════════════════════ */
  {
    id: "ten-commandments",
    title: "The Ten Commandments",
    subtitle: "The moral law as taught by the Catholic Church",
    items: [
      {
        title: "The First Commandment",
        text: "I am the LORD your God: you shall not have strange gods before me.",
        explanation:
          "The first commandment calls us to believe in God, to hope in Him, and to love Him above all things. It forbids idolatry, superstition, sacrilege, and atheism. We are to adore God alone, fulfilling the duty of offering Him true worship. Faith, hope, and charity — the theological virtues — inform and give life to the moral virtues. (CCC 2083–2141)",
        scripture: "Exodus 20:2–5; Deuteronomy 6:4–5; Matthew 4:10",
      },
      {
        title: "The Second Commandment",
        text: "You shall not take the name of the LORD your God in vain.",
        explanation:
          "The second commandment prescribes respect for the Lord’s name. It forbids every improper use of God’s name, including blasphemy, perjury, and the misuse of the names of Jesus, the Blessed Virgin Mary, and the saints. Christians should begin their day, their prayers, and their activities with the Sign of the Cross. (CCC 2142–2167)",
        scripture: "Exodus 20:7; Matthew 5:33–37",
      },
      {
        title: "The Third Commandment",
        text: "Remember to keep holy the Lord’s Day.",
        explanation:
          "Christians celebrate Sunday, the day of the Lord’s Resurrection, as the principal day of worship. The faithful are obliged to participate in Mass on Sundays and holy days of obligation and to abstain from work or activities that hinder the worship owed to God, the joy proper to the Lord’s Day, or the proper relaxation of mind and body. (CCC 2168–2195)",
        scripture: "Exodus 20:8–11; Mark 2:27–28; Acts 20:7",
      },
      {
        title: "The Fourth Commandment",
        text: "Honor your father and your mother.",
        explanation:
          "This commandment extends to the duties of children toward parents, and of all persons toward legitimate authority. Children owe their parents respect, gratitude, just obedience, and assistance. Parents have the duty to educate their children in the faith and provide for their physical and spiritual needs. Citizens owe their country dutiful love and service. (CCC 2196–2257)",
        scripture: "Exodus 20:12; Ephesians 6:1–4; Colossians 3:20",
      },
      {
        title: "The Fifth Commandment",
        text: "You shall not kill.",
        explanation:
          "Human life is sacred from conception to natural death because every person is made in the image of God. The fifth commandment forbids direct and intentional killing, abortion, euthanasia, and suicide. It also forbids scandal and leading others into sin. Legitimate defense of persons and societies is not an exception to the prohibition against murder. (CCC 2258–2330)",
        scripture: "Exodus 20:13; Genesis 9:5–6; Matthew 5:21–22",
      },
      {
        title: "The Sixth Commandment",
        text: "You shall not commit adultery.",
        explanation:
          "God created man and woman for each other, and the conjugal act is proper only within the bond of marriage. This commandment forbids adultery, fornication, pornography, and all offenses against the dignity of marriage. Chastity is the virtue by which we integrate our sexuality within the whole person according to our state of life. (CCC 2331–2400)",
        scripture: "Exodus 20:14; Matthew 5:27–28; 1 Corinthians 6:18–20",
      },
      {
        title: "The Seventh Commandment",
        text: "You shall not steal.",
        explanation:
          "The seventh commandment requires respect for the universal destination of goods and the right to private property. It forbids theft, fraud, unjust wages, and the exploitation of workers. The Church’s social doctrine calls for justice in economic life, solidarity with the poor, and care for creation. (CCC 2401–2463)",
        scripture: "Exodus 20:15; Leviticus 19:11; James 5:4",
      },
      {
        title: "The Eighth Commandment",
        text: "You shall not bear false witness against your neighbor.",
        explanation:
          "This commandment forbids misrepresenting the truth in relations with others: lying, calumny, detraction, rash judgment, and perjury. Christians are called to live in the truth and to witness to the truth of the Gospel. The seal of sacramental confession may never be broken. (CCC 2464–2513)",
        scripture: "Exodus 20:16; John 8:32; Ephesians 4:25",
      },
      {
        title: "The Ninth Commandment",
        text: "You shall not covet your neighbor’s wife.",
        explanation:
          "The ninth commandment warns against carnal concupiscence and requires purity of heart. Baptism confers the grace of purification from sin, but the baptized must continue to struggle against disordered desires through prayer, the practice of chastity, purity of intention, and purity of vision. The sixth beatitude proclaims: “Blessed are the pure in heart, for they shall see God.” (CCC 2514–2533)",
        scripture: "Exodus 20:17; Matthew 5:8; Matthew 5:28",
      },
      {
        title: "The Tenth Commandment",
        text: "You shall not covet your neighbor’s goods.",
        explanation:
          "The tenth commandment forbids avarice and the desire to amass earthly goods without limit. It calls for detachment from riches, humility, and abandonment to the providence of God. Envy is a capital sin that saddens at the sight of another’s goods and the immoderate desire to acquire them. The remedy is goodwill, humility, and trust in God’s providence. (CCC 2534–2557)",
        scripture: "Exodus 20:17; Matthew 6:21; 1 Timothy 6:10",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part IV: The Lord's Prayer
     ══════════════════════════════════════════════ */
  {
    id: "lords-prayer",
    title: "The Lord’s Prayer",
    subtitle: "The summary of the whole Gospel and the model of all prayer",
    introduction:
      "Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
    items: [
      {
        title: "Our Father, Who Art in Heaven",
        text: "We call upon God as Father, daring to approach Him with filial trust.",
        explanation:
          "By calling God “Father,” we acknowledge that through Baptism we have been incorporated into the Body of His Son, Jesus Christ, and adopted as sons and daughters. “Who art in heaven” does not refer to a place but to God’s majesty and His presence in the hearts of the just. We pray as members of the Church, the Body of Christ, saying “Our” Father, not “My” Father. (CCC 2777–2802)",
        scripture: "Matthew 6:9; Romans 8:15; Galatians 4:6",
      },
      {
        title: "The First Petition: Hallowed Be Thy Name",
        text: "We ask that God’s name be recognized and treated as holy.",
        explanation:
          "To hallow God’s name means to recognize it as holy and to treat it with reverence. This petition asks that we ourselves, and all people, may come to know and glorify God’s holiness. In this petition, we are drawn into God’s plan: that His name be hallowed through us and in us, in every nation and in each person. (CCC 2807–2815)",
        scripture: "Ezekiel 36:20–21; Matthew 6:9",
      },
      {
        title: "The Second Petition: Thy Kingdom Come",
        text: "We pray for the final coming of the Kingdom of God through Christ’s return in glory.",
        explanation:
          "The Kingdom of God has been coming since the Last Supper and, in the Eucharist, is in our midst. This petition looks primarily to Christ’s return and the definitive establishment of God’s reign. It also asks for the growth of the Kingdom through the sanctification of souls and the missionary activity of the Church. (CCC 2816–2821)",
        scripture: "Matthew 6:10; Luke 17:20–21; Revelation 22:20",
      },
      {
        title: "The Third Petition: Thy Will Be Done",
        text: "We ask for the grace to unite our will with the Father’s will.",
        explanation:
          "God’s will is that “all men be saved and come to the knowledge of the truth” (1 Timothy 2:4). Jesus teaches us that one enters the kingdom not by words but by doing “the will of my Father in heaven” (Matthew 7:21). By prayer we can discern what is the will of God and obtain the endurance to do it. United with Christ’s prayer in Gethsemane, we surrender to the Father’s plan. (CCC 2822–2827)",
        scripture: "Matthew 6:10; Matthew 26:39; 1 Timothy 2:3–4",
      },
      {
        title: "The Fourth Petition: Give Us This Day Our Daily Bread",
        text: "We ask for the nourishment necessary for life — both bodily and spiritual.",
        explanation:
          "“Daily bread” refers both to earthly nourishment and to the Bread of Life — the Word of God and the Body of Christ received in the Eucharist. This petition teaches us to trust in God’s providence and to share generously with those in need. It expresses our dependence on God and solidarity with the hungry. (CCC 2828–2837)",
        scripture: "Matthew 6:11; John 6:34–35; Proverbs 30:8",
      },
      {
        title: "The Fifth Petition: Forgive Us Our Trespasses",
        text: "We ask for God’s mercy, acknowledging that we must forgive others as He forgives us.",
        explanation:
          "This petition is striking because our request will not be heard unless we first meet a requirement: that we forgive those who have trespassed against us. This forgiveness does not cancel the demand for justice but transforms the heart so that it can open itself to God’s mercy. In refusing to forgive, we close our hearts to the Father’s merciful love. (CCC 2838–2845)",
        scripture: "Matthew 6:12; Matthew 18:21–22; Colossians 3:13",
      },
      {
        title: "The Sixth Petition: Lead Us Not into Temptation",
        text: "We ask God to preserve us from the path that leads to sin.",
        explanation:
          "This petition asks God not to allow us to take the path that leads to sin. We ask Him to help us discern between trials that strengthen and temptation that leads to sin and death. The Holy Spirit enables us to discern between trial and temptation and to persevere to the end. “No temptation has overtaken you that is not common to man” (1 Corinthians 10:13). (CCC 2846–2849)",
        scripture: "Matthew 6:13; 1 Corinthians 10:13; James 1:13–14",
      },
      {
        title: "The Seventh Petition: Deliver Us from Evil",
        text: "We pray for deliverance from Satan and from every evil, past, present, and to come.",
        explanation:
          "In this petition, the Church brings all the distress of the world before the Father. Along with deliverance from the evils that overwhelm humanity, we implore the precious gift of peace and the grace of perseverance in expectation of Christ’s return. Evil in this petition refers to a person — Satan, the Evil One, the angel who opposes God. (CCC 2850–2854)",
        scripture: "Matthew 6:13; John 17:15; 2 Thessalonians 3:3",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part V: The Holy Mass
     ══════════════════════════════════════════════ */
  {
    id: "prayers-and-mass",
    title: "The Holy Mass",
    subtitle: "Mass responses and prayers from the Roman Missal, Third Edition",
    items: [
      {
        title: "Greeting",
        text: "PRIEST: The Lord be with you.\nPEOPLE: And with your spirit.",
      },
      {
        title: "Penitential Act — Form A (Confiteor)",
        text: "I confess to almighty God\nand to you, my brothers and sisters,\nthat I have greatly sinned,\nin my thoughts and in my words,\nin what I have done and in what I have failed to do,\nthrough my fault, through my fault,\nthrough my most grievous fault;\ntherefore I ask blessed Mary ever-Virgin,\nall the Angels and Saints,\nand you, my brothers and sisters,\nto pray for me to the Lord our God.",
      },
      {
        title: "Penitential Act — Form B",
        text: "PRIEST: Have mercy on us, O Lord.\nPEOPLE: For we have sinned against you.\nPRIEST: Show us, O Lord, your mercy.\nPEOPLE: And grant us your salvation.",
      },
      {
        title: "Gloria",
        text: "Glory to God in the highest,\nand on earth peace to people of good will.\nWe praise you,\nwe bless you,\nwe adore you,\nwe glorify you,\nwe give you thanks for your great glory,\nLord God, heavenly King,\nO God, almighty Father.\nLord Jesus Christ, Only Begotten Son,\nLord God, Lamb of God, Son of the Father,\nyou take away the sins of the world,\nhave mercy on us;\nyou take away the sins of the world,\nreceive our prayer;\nyou are seated at the right hand of the Father,\nhave mercy on us.\nFor you alone are the Holy One,\nyou alone are the Lord,\nyou alone are the Most High,\nJesus Christ,\nwith the Holy Spirit,\nin the glory of God the Father.\nAmen.",
      },
      {
        title: "Gospel Dialogue",
        text: "PRIEST (OR DEACON): The Lord be with you.\nPEOPLE: And with your spirit.\nPRIEST (OR DEACON): A reading from the holy Gospel according to _____.\nPEOPLE: Glory to you, O Lord.",
      },
      {
        title: "Profession of Faith (Nicene Creed)",
        text: "I believe in one God,\nthe Father almighty,\nmaker of heaven and earth,\nof all things visible and invisible.\nI believe in one Lord Jesus Christ,\nthe Only Begotten Son of God,\nborn of the Father before all ages.\nGod from God, Light from Light,\ntrue God from true God,\nbegotten, not made, consubstantial with the Father;\nthrough him all things were made.\nFor us men and for our salvation\nhe came down from heaven,\nand by the Holy Spirit was incarnate\nof the Virgin Mary,\nand became man.\nFor our sake he was crucified under Pontius Pilate,\nhe suffered death and was buried,\nand rose again on the third day\nin accordance with the Scriptures.\nHe ascended into heaven\nand is seated at the right hand of the Father.\nHe will come again in glory\nto judge the living and the dead\nand his kingdom will have no end.\nI believe in the Holy Spirit,\nthe Lord, the giver of life,\nwho proceeds from the Father and the Son,\nwho with the Father and the Son\nis adored and glorified,\nwho has spoken through the prophets.\nI believe in one, holy, catholic and apostolic Church.\nI confess one Baptism for the forgiveness of sins\nand I look forward to the resurrection of the dead\nand the life of the world to come. Amen.",
      },
      {
        title: "Profession of Faith (Apostles' Creed)",
        text: "I believe in God,\nthe Father almighty,\nCreator of heaven and earth,\nand in Jesus Christ, his only Son, our Lord,\nwho was conceived by the Holy Spirit,\nborn of the Virgin Mary,\nsuffered under Pontius Pilate,\nwas crucified, died and was buried;\nhe descended into hell;\non the third day he rose again from the dead;\nhe ascended into heaven,\nand is seated at the right hand of God the Father almighty;\nfrom there he will come to judge the living and the dead.\nI believe in the Holy Spirit,\nthe holy catholic Church,\nthe communion of saints,\nthe forgiveness of sins,\nthe resurrection of the body,\nand life everlasting. Amen.",
      },
      {
        title: "Invitation to Prayer",
        text: "PRIEST: Pray, brethren, that my sacrifice and yours may be acceptable to God, the almighty Father.\nPEOPLE: May the Lord accept the sacrifice at your hands\nfor the praise and glory of his name,\nfor our good\nand the good of all his holy Church.",
      },
      {
        title: "Preface Dialogue",
        text: "PRIEST: The Lord be with you.\nPEOPLE: And with your spirit.\nPRIEST: Lift up your hearts.\nPEOPLE: We lift them up to the Lord.\nPRIEST: Let us give thanks to the Lord our God.\nPEOPLE: It is right and just.",
      },
      {
        title: "Preface Acclamation",
        text: "Holy, Holy, Holy Lord God of hosts.\nHeaven and earth are full of your glory.\nHosanna in the highest.\nBlessed is he who comes in the name of the Lord.\nHosanna in the highest.",
      },
      {
        title: "The Mystery of Faith",
        text: "PRIEST: The mystery of faith.\n\nA — We proclaim your Death, O Lord,\nand profess your Resurrection\nuntil you come again.\n\nB — When we eat this Bread and drink this Cup,\nwe proclaim your Death, O Lord,\nuntil you come again.\n\nC — Save us, Savior of the world,\nfor by your Cross and Resurrection\nyou have set us free.",
      },
      {
        title: "The Lord's Prayer",
        text: "PEOPLE: Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come,\nthy will be done\non earth as it is in heaven.\nGive us this day our daily bread,\nand forgive us our trespasses,\nas we forgive those who trespass against us;\nand lead us not into temptation,\nbut deliver us from evil.\nPRIEST: Deliver us, Lord, we pray, from every evil ... and the coming of our Savior, Jesus Christ.\nPEOPLE: For the kingdom,\nthe power and the glory are yours\nnow and for ever.",
      },
      {
        title: "Sign of Peace",
        text: "PRIEST: The peace of the Lord be with you always.\nPEOPLE: And with your spirit.",
      },
      {
        title: "Invitation to Communion",
        text: "PRIEST: Behold the Lamb of God,\nbehold him who takes away the sins of the world.\nBlessed are those called to the supper of the Lamb.\nALL: Lord, I am not worthy\nthat you should enter under my roof,\nbut only say the word\nand my soul shall be healed.",
      },
      {
        title: "Concluding Rites",
        text: "PRIEST: The Lord be with you.\nPEOPLE: And with your spirit.\n\nPRIEST (OR DEACON):\nGo forth, the Mass is ended.\nOR Go and announce the Gospel of the Lord.\nOR Go in peace, glorifying the Lord by your life.\nOR Go in peace.\n\nPEOPLE: Thanks be to God.",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part VI: The Holy Rosary
     ══════════════════════════════════════════════ */
  {
    id: "holy-rosary",
    title: "The Holy Rosary",
    subtitle: "A Scripture-based meditation on the mysteries of Christ and the Blessed Virgin Mary",
    items: [
      {
        title: "The Sign of the Cross",
        text: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
      },
      {
        title: "The Apostles' Creed",
        text: "I believe in God,\nthe Father almighty,\nCreator of heaven and earth,\nand in Jesus Christ, his only Son, our Lord,\nwho was conceived by the Holy Spirit,\nborn of the Virgin Mary,\nsuffered under Pontius Pilate,\nwas crucified, died and was buried;\nhe descended into hell;\non the third day he rose again from the dead;\nhe ascended into heaven,\nand is seated at the right hand of God the Father almighty;\nfrom there he will come to judge the living and the dead.\nI believe in the Holy Spirit,\nthe holy catholic Church,\nthe communion of saints,\nthe forgiveness of sins,\nthe resurrection of the body,\nand life everlasting. Amen.",
      },
      {
        title: "The Our Father",
        text: "Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come;\nthy will be done\non earth as it is in heaven.\nGive us this day our daily bread,\nand forgive us our trespasses,\nas we forgive those who trespass against us;\nand lead us not into temptation,\nbut deliver us from evil. Amen.",
      },
      {
        title: "The Hail Mary",
        text: "Hail Mary, full of grace,\nthe Lord is with thee.\nBlessed art thou among women,\nand blessed is the fruit of thy womb, Jesus.\nHoly Mary, Mother of God,\npray for us sinners,\nnow and at the hour of our death. Amen.",
        scripture: "Luke 1:28; Luke 1:42",
      },
      {
        title: "The Glory Be",
        text: "Glory be to the Father,\nand to the Son,\nand to the Holy Spirit.\nAs it was in the beginning,\nis now, and ever shall be,\nworld without end. Amen.",
      },
      {
        title: "The Fatima Prayer",
        text: "O my Jesus,\nforgive us our sins,\nsave us from the fires of hell,\nlead all souls to heaven,\nespecially those in most need of thy mercy. Amen.",
      },
      {
        title: "The Hail Holy Queen",
        text: "Hail, Holy Queen, Mother of mercy,\nour life, our sweetness, and our hope.\nTo thee do we cry,\npoor banished children of Eve.\nTo thee do we send up our sighs,\nmourning and weeping in this valley of tears.\nTurn then, most gracious Advocate,\nthine eyes of mercy toward us,\nand after this our exile,\nshow unto us the blessed fruit of thy womb, Jesus.\nO clement, O loving, O sweet Virgin Mary.\nPray for us, O holy Mother of God,\nthat we may be made worthy of the promises of Christ. Amen.",
      },
      {
        title: "How to Pray the Rosary",
        text: "1. Make the Sign of the Cross and pray the Apostles' Creed.\n2. Pray the Our Father.\n3. Pray three Hail Marys for faith, hope, and charity.\n4. Pray the Glory Be.\n5. Announce the first mystery, then pray the Our Father.\n6. Pray ten Hail Marys while meditating on the mystery.\n7. Pray the Glory Be and the Fatima Prayer.\n8. Announce the next mystery and repeat steps 5–7 for each of the five decades.\n9. After all five decades, pray the Hail Holy Queen.",
      },
      {
        title: "The Joyful Mysteries (Monday & Saturday)",
        text: "1. The Annunciation — The Angel Gabriel announces to Mary that she will bear the Son of God. (Luke 1:26–38)\n2. The Visitation — Mary visits her cousin Elizabeth. (Luke 1:39–56)\n3. The Nativity — Jesus is born in Bethlehem. (Luke 2:1–21)\n4. The Presentation — Jesus is presented in the Temple. (Luke 2:22–40)\n5. The Finding in the Temple — The child Jesus is found teaching in the Temple. (Luke 2:41–52)",
      },
      {
        title: "The Luminous Mysteries (Thursday)",
        text: "1. The Baptism of Jesus — Jesus is baptized in the Jordan. (Matthew 3:13–17)\n2. The Wedding at Cana — Jesus performs His first miracle. (John 2:1–12)\n3. The Proclamation of the Kingdom — Jesus calls all to conversion. (Mark 1:14–15)\n4. The Transfiguration — Jesus is transfigured on the mountain. (Matthew 17:1–8)\n5. The Institution of the Eucharist — Jesus gives His Body and Blood at the Last Supper. (Matthew 26:26–28)",
      },
      {
        title: "The Sorrowful Mysteries (Tuesday & Friday)",
        text: "1. The Agony in the Garden — Jesus prays in Gethsemane. (Matthew 26:36–46)\n2. The Scourging at the Pillar — Jesus is scourged by order of Pilate. (John 19:1)\n3. The Crowning with Thorns — Jesus is mocked and crowned with thorns. (Matthew 27:27–31)\n4. The Carrying of the Cross — Jesus carries His Cross to Calvary. (John 19:17)\n5. The Crucifixion — Jesus is nailed to the Cross and dies. (John 19:18–30)",
      },
      {
        title: "The Glorious Mysteries (Wednesday & Sunday)",
        text: "1. The Resurrection — Jesus rises from the dead. (Matthew 28:1–10)\n2. The Ascension — Jesus ascends into heaven. (Acts 1:9–11)\n3. The Descent of the Holy Spirit — The Holy Spirit descends upon the Apostles at Pentecost. (Acts 2:1–4)\n4. The Assumption — Mary is taken body and soul into heaven. (Revelation 12:1)\n5. The Coronation of Mary — Mary is crowned Queen of Heaven and Earth. (Revelation 12:1–6)",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part VII: The Blessed Virgin Mary
     ══════════════════════════════════════════════ */
  {
    id: "blessed-virgin-mary",
    title: "The Blessed Virgin Mary",
    subtitle: "Mother of God, Mother of the Church, and model of faith",
    items: [
      {
        title: "Mother of God (Theotokos)",
        text: "Mary is truly the Mother of God, for she is the Mother of the eternal Son of God made man.",
        explanation:
          "The Council of Ephesus (431 AD) proclaimed Mary “Theotokos” — God-bearer — because the one she conceived as man by the Holy Spirit truly became the Son of God in the unity of His divine Person. In calling Mary “Mother of God,” the Church confesses that Jesus is truly God and truly man, and that Mary’s divine motherhood participates in the mystery of the Incarnation. (CCC 495, 509)",
        scripture: "Luke 1:43; Galatians 4:4",
      },
      {
        title: "The Immaculate Conception",
        text: "Mary was preserved from all stain of original sin from the first moment of her conception.",
        explanation:
          "By the grace of God and in view of the merits of Jesus Christ, the Blessed Virgin Mary was preserved from original sin. Pope Pius IX solemnly defined this dogma in 1854. Mary’s sinlessness was a singular grace and privilege, preparing her to be a worthy dwelling place for the Son of God. At Lourdes in 1858, Mary identified herself to St. Bernadette: “I am the Immaculate Conception.” (CCC 490–493)",
        scripture: "Luke 1:28; Genesis 3:15",
      },
      {
        title: "The Perpetual Virginity of Mary",
        text: "Mary remained a virgin before, during, and after the birth of Christ.",
        explanation:
          "The Church professes that Mary conceived Jesus by the power of the Holy Spirit without the loss of her virginity, which she preserved throughout her life. Her virginity is a sign of her total consecration to God and of the wholly supernatural character of Jesus’ origin. This has been the constant teaching of the Church from the earliest centuries. (CCC 496–507)",
        scripture: "Isaiah 7:14; Luke 1:34–35; Matthew 1:18–25",
      },
      {
        title: "The Assumption of Mary",
        text: "At the end of her earthly life, Mary was assumed body and soul into heavenly glory.",
        explanation:
          "Pope Pius XII solemnly defined in 1950 that when the course of her earthly life was finished, the Blessed Virgin Mary was taken up body and soul into the glory of heaven. The Assumption is a participation in her Son’s Resurrection and an anticipation of the resurrection of all Christians. Mary is the first and most perfect fruit of the redemption won by her Son. (CCC 966, 974)",
        scripture: "Revelation 12:1; 1 Corinthians 15:22–23",
      },
      {
        title: "Mary, Mother of the Church",
        text: "Mary is the spiritual Mother of all the faithful and of the Church herself.",
        explanation:
          "From the Cross, Jesus entrusted His Mother to the beloved disciple, and through him to the whole Church. Mary’s motherhood continues in heaven as she intercedes for all her children. She is invoked as Advocate, Helper, Benefactress, and Mediatrix — titles that take nothing from the one mediation of Christ but show it forth. Her maternal charity cares for the brethren of her Son still on pilgrimage. (CCC 963–972)",
        scripture: "John 19:26–27; Acts 1:14; Revelation 12:17",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part VII: The Moral Life and the Virtues
     ══════════════════════════════════════════════ */
  {
    id: "moral-life",
    title: "The Moral Life",
    subtitle: "Life in Christ: the Beatitudes, virtues, and the call to holiness",
    items: [
      {
        title: "The Beatitudes",
        text: "Blessed are the poor in spirit, for theirs is the kingdom of heaven. (Matthew 5:3)",
        explanation:
          "The Beatitudes are at the heart of Jesus’ preaching and depict the countenance of Christ. They shed light on the actions and attitudes characteristic of the Christian life. They express the vocation of the faithful and sustain hope in tribulation. The Beatitudes respond to the natural desire for happiness that God has placed in the human heart, directing it toward the kingdom of heaven. (CCC 1716–1729)",
        scripture: "Matthew 5:3–12",
      },
      {
        title: "The Theological Virtues: Faith, Hope, and Charity",
        text: "The theological virtues relate directly to God and are infused by Him into the soul.",
        explanation:
          "Faith is the virtue by which we believe in God and all that He has revealed. Hope is the virtue by which we desire the kingdom of heaven and eternal life as our happiness, placing our trust in Christ’s promises. Charity is the virtue by which we love God above all things for His own sake, and our neighbor as ourselves for the love of God. Charity is the greatest of all virtues and the form of all the virtues. (CCC 1812–1829)",
        scripture: "1 Corinthians 13:13; Hebrews 11:1; Romans 5:5",
      },
      {
        title: "The Cardinal Virtues: Prudence, Justice, Fortitude, Temperance",
        text: "The four cardinal virtues are the hinges of the moral life, acquired by human effort and perfected by grace.",
        explanation:
          "Prudence disposes reason to discern the true good and choose the right means. Justice renders to God and neighbor what is due. Fortitude ensures firmness in difficulties and constancy in the pursuit of the good. Temperance moderates the attraction of pleasures and provides balance in the use of created goods. These virtues, aided by grace, form the character of the Christian and dispose the faithful to live well. (CCC 1805–1811)",
        scripture: "Wisdom 8:7; Philippians 4:8",
      },
      {
        title: "Sin and Mercy",
        text: "Sin is an offense against reason, truth, and right conscience; it is a failure in genuine love for God and neighbor.",
        explanation:
          "Mortal sin destroys charity in the heart and turns a person away from God; it requires a new initiative of God’s mercy and conversion through the Sacrament of Reconciliation. Venial sin allows charity to subsist but offends and wounds it. Yet God’s mercy is inexhaustible: “Where sin increased, grace abounded all the more” (Romans 5:20). The Church invites all to trust in God’s merciful love. (CCC 1846–1876)",
        scripture: "Romans 5:20; 1 John 1:8–9; Psalm 51:3–4",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part VIII: Grace and Justification
     ══════════════════════════════════════════════ */
  {
    id: "grace-and-justification",
    title: "Grace and Justification",
    subtitle: "God’s free gift of divine life and the economy of salvation",
    items: [
      {
        title: "The Nature of Grace",
        text: "Grace is the free and undeserved gift of God’s own life infused into the soul by the Holy Spirit.",
        explanation:
          "Grace is participation in the life of God. It introduces us into the intimacy of Trinitarian life. Sanctifying (or habitual) grace is the permanent disposition to live and act in accordance with God’s call. Actual graces refer to God’s interventions at the beginning of conversion or in the course of sanctification. Grace is first and foremost the gift of the Spirit who justifies and sanctifies us. (CCC 1996–2005)",
        scripture: "John 1:12–13; 2 Peter 1:3–4; Ephesians 2:8–9",
      },
      {
        title: "Justification",
        text: "Justification is the most excellent work of God’s love, by which He makes us inwardly just.",
        explanation:
          "Justification includes the remission of sins, sanctification, and the renewal of the inner person. It is merited by the Passion of Christ and is granted through Baptism. Justification conforms us to the righteousness of God, who makes us inwardly just by the power of His mercy. It is not merely the covering over of sin but a true transformation and renewal of the soul. Under the influence of grace, justification establishes cooperation between God’s grace and human freedom. (CCC 1987–1995)",
        scripture: "Romans 3:21–26; Titus 3:5–7; Romans 5:1",
      },
      {
        title: "Merit and Cooperation with Grace",
        text: "We can merit for ourselves and for others the graces needed for sanctification.",
        explanation:
          "Since the initiative belongs to God in the order of grace, no one can merit the initial grace of conversion. Moved by the Holy Spirit and by charity, we can then merit for ourselves and for others the graces needed for sanctification, for the increase of grace and charity, and for the attainment of eternal life. The merits of our good works are gifts of the divine goodness: “Grace has gone before us; now we are given what is due.” (CCC 2006–2011)",
        scripture: "John 15:5; Romans 8:28; Philippians 2:12–13",
      },
      {
        title: "The Church: Universal Sacrament of Salvation",
        text: "Outside the Church there is no salvation.",
        explanation:
          "This ancient teaching means that all salvation comes from Christ the Head through the Church which is His Body. Those who know that the Catholic Church was founded by God through Christ as necessary, and yet refuse to enter or remain in her, cannot be saved. However, those who, through no fault of their own, do not know the Gospel of Christ or His Church but seek God with a sincere heart may also achieve eternal salvation. The Church is sent as a missionary to bring all people to the fullness of truth. (CCC 846–856)",
        scripture: "Acts 4:12; 1 Timothy 2:4–5; Matthew 28:19–20",
      },
    ],
  },

  /* ══════════════════════════════════════════════
     Part IX: The Last Things
     ══════════════════════════════════════════════ */
  {
    id: "last-things",
    title: "The Last Things",
    subtitle: "Death, judgment, purgatory, heaven, and hell",
    items: [
      {
        title: "Death and Particular Judgment",
        text: "Each person receives eternal retribution in his immortal soul at the moment of death.",
        explanation:
          "Death is the end of earthly life and the entrance into eternity. At the moment of death, each soul undergoes a particular judgment before Christ, receiving either entrance into the blessedness of heaven (immediately or through purification in purgatory) or immediate and everlasting damnation. The Church teaches that death is a consequence of sin but has been transformed by Christ’s own death into an entrance to new life. (CCC 1005–1022)",
        scripture: "Hebrews 9:27; 2 Corinthians 5:8; Luke 16:22–26",
      },
      {
        title: "Purgatory",
        text: "Those who die in God’s grace but imperfectly purified undergo purification to achieve the holiness necessary to enter heaven.",
        explanation:
          "The Church’s teaching on purgatory is based on the practice of praying for the dead, attested in Scripture and Tradition. The purification of purgatory is entirely different from the punishment of the damned. The faithful on earth can aid the souls in purgatory by prayers, almsgiving, indulgences, and above all by offering the Holy Sacrifice of the Mass for their intention. (CCC 1030–1032)",
        scripture: "2 Maccabees 12:45–46; 1 Corinthians 3:14–15; Matthew 12:32",
      },
      {
        title: "Heaven",
        text: "Heaven is the state of supreme, definitive happiness — communion with the Most Holy Trinity and all the blessed.",
        explanation:
          "Those who die in God’s grace and friendship and are perfectly purified live forever with Christ. They see God face to face as He truly is — this is called the Beatific Vision. In heaven, the blessed are fully conformed to the will of God and share in His divine life for all eternity. This mystery of blessed communion with God surpasses all understanding and description, yet it is the ultimate end for which man was created. (CCC 1023–1029)",
        scripture: "1 Corinthians 2:9; 1 John 3:2; Revelation 21:3–4",
      },
      {
        title: "Hell",
        text: "Hell is the state of definitive self-exclusion from communion with God and the blessed.",
        explanation:
          "To die in mortal sin without repenting and without accepting God’s merciful love means remaining separated from Him forever by one’s own free choice. Jesus often speaks of “Gehenna” and the “unquenchable fire” reserved for those who refuse to believe and be converted. The chief punishment of hell is eternal separation from God, in whom alone man can possess the life and happiness for which he was created. God predestines no one to hell; it requires a willful turning away from God and persistence in that state. (CCC 1033–1037)",
        scripture: "Matthew 25:41–46; Matthew 13:41–42; 2 Thessalonians 1:9",
      },
      {
        title: "The Resurrection of the Body and the Last Judgment",
        text: "On the last day, all the dead will rise with their own bodies, and Christ will judge the living and the dead.",
        explanation:
          "Christ will come again in glory to judge the living and the dead. At the Last Judgment, each person’s relationship with God will be laid bare, and the full truth of each one’s life will be revealed. The just will reign forever with Christ, glorified in body and soul, while those who have rejected God’s grace will be cast into eternal fire. Then a new heaven and a new earth will appear, and God will be “all in all.” (CCC 1038–1060)",
        scripture: "John 5:28–29; Matthew 25:31–46; Revelation 21:1",
      },
    ],
  },
];
