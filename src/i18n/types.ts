export interface Messages {
  /* ── existing sections ── */
  nav: {
    buy: string;
    rent: string;
    sell: string;
    newDevelopments: string;
    agents: string;
    blog: string;
  };
  auth: {
    login: string;
    register: string;
    logout: string;
    profile: string;
    myFavourites: string;
    myRequests: string;
    myAlerts: string;
    myReviews: string;
  };
  hero: {
    tagline: string;
    heading: string;
    subheading: string;
    searchPlaceholder: string;
    buy: string;
    rent: string;
    sell: string;
    newDevelopments: string;
  };
  footer: {
    tagline: string;
    copyright: string;
  };
  common: {
    search: string;
    loading: string;
    error: string;
    noResults: string;
    seeMore: string;
    close: string;
    save: string;
    cancel: string;
    confirm: string;
    back: string;
    next: string;
    submit: string;
  };

  /* ── new sections ── */
  home: {
    discover: {
      heading: string;
      tabBuy: string;
      tabRent: string;
      tabSell: string;
      /* buying cards */
      buyCard1Title: string;
      buyCard1Desc: string;
      buyCard1Cta: string;
      buyCard2Title: string;
      buyCard2Desc: string;
      buyCard2Cta: string;
      buyCard3Title: string;
      buyCard3Desc: string;
      buyCard3Cta: string;
      /* renting cards */
      rentCard1Title: string;
      rentCard1Desc: string;
      rentCard1Cta: string;
      rentCard2Title: string;
      rentCard2Desc: string;
      rentCard2Cta: string;
      rentCard3Title: string;
      rentCard3Desc: string;
      rentCard3Cta: string;
      /* selling cards */
      sellCard1Title: string;
      sellCard1Desc: string;
      sellCard1Cta: string;
      sellCard2Title: string;
      sellCard2Desc: string;
      sellCard2Cta: string;
      sellCard3Title: string;
      sellCard3Desc: string;
      sellCard3Cta: string;
    };
    about: {
      badge: string;
      heading: string;
      para1: string;
      para2: string;
      learnMore: string;
      networkBadge: string;
      networkHeading: string;
      networkPara: string;
      findAgent: string;
    };
    content: {
      journal: string;
      heading: string;
      card1Title: string;
      card1Excerpt: string;
      card2Title: string;
      card2Excerpt: string;
    };
    mobileApp: {
      badge: string;
      heading: string;
      body: string;
      downloadOn: string;
      availableOn: string;
    };
  };

  listing: {
    foundWithFilters: string;
    noResults: string;
    noResultsHint: string;
  };

  filters: {
    searchPlaceholder: string;
    searchBtn: string;
    typePlaceholder: string;
    allTypes: string;
    bedsPlaceholder: string;
    allBeds: string;
    pricePlaceholder: string;
    allPrices: string;
    offPlan: string;
    ready: string;
    map: string;
    clearAll: string;
    priceFrom: string;
    priceUpTo: string;
    ariaSortBtn: string;
    ariaAlertsBtn: string;
    /* bed labels */
    bed1: string;
    bed2: string;
    bed3: string;
    bed4: string;
    bed5: string;
    /* property types */
    apartment: string;
    villa: string;
    townhouse: string;
    studio: string;
    land: string;
    penthouse: string;
    duplex: string;
    office: string;
    retail: string;
    warehouse: string;
    /* buy price ranges */
    buyPrice1: string;
    buyPrice2: string;
    buyPrice3: string;
    buyPrice4: string;
    buyPrice5: string;
    /* sale price ranges */
    salePrice1: string;
    salePrice2: string;
    salePrice3: string;
    salePrice4: string;
    /* rent price ranges */
    rentPrice1: string;
    rentPrice2: string;
    rentPrice3: string;
    rentPrice4: string;
    /* commercial price ranges */
    commPrice1: string;
    commPrice2: string;
    commPrice3: string;
    commPrice4: string;
    commPrice5: string;
  };

  cards: {
    addFavourite: string;
    removeFavourite: string;
    call: string;
    whatsapp: string;
    whatsappMsg: string;
    /* agent card */
    nationality: string;
    languages: string;
    forSale: string;
    forRent: string;
    /* agency card */
    since: string;
    agent: string;
    agents: string;
    transactions: string;
  };

  agentsPage: {
    heroHeading: string;
    heroSubtitle: string;
    tabAgents: string;
    tabAgencies: string;
    agentSearchPlaceholder: string;
    agencySearchPlaceholder: string;
    filterTransaction: string;
    filterLanguage: string;
    filterNationality: string;
    filterAll: string;
    searchBtn: string;
    resetFilters: string;
    superAgentBadge: string;
    superAgentHeading: string;
    superAgentSubtitle: string;
    findSuperAgent: string;
    agentCount: string;
    sortBy: string;
    sortRelevance: string;
    sortByTitle: string;
    loadingAgents: string;
    noAgents: string;
    agencyCount: string;
    loadingAgencies: string;
    noAgencies: string;
    transactionSale: string;
    transactionRent: string;
    transactionAll: string;
  };

  agenciesPage: {
    heroBadge: string;
    heroHeading: string;
    heroSubtitle: string;
    findAgent: string;
    seeAgencies: string;
    statPartners: string;
    statAgents: string;
    statTransactions: string;
    searchPlaceholder: string;
    filterLanguage: string;
    filterAll: string;
    reset: string;
    allAgencies: string;
    agencyCount: string;
    loading: string;
    noAgencies: string;
    ctaHeading: string;
    ctaBody: string;
    ctaBtn: string;
  };

  blog: {
    allCategories: string;
    readTime: string;
    readArticle: string;
    noArticles: string;
    loadMore: string;
  };

  pages: {
    conseils: {
      breadHome: string;
      breadConseils: string;
      availableBadge: string;
      heading: string;
      subtitle: string;
      readGuide: string;
      guide1Label: string;
      guide1Desc: string;
      guide1Tag: string;
      guide2Label: string;
      guide2Desc: string;
      guide2Tag: string;
      guide3Label: string;
      guide3Desc: string;
      guide3Tag: string;
      guide4Label: string;
      guide4Desc: string;
      guide4Tag: string;
      guide5Label: string;
      guide5Desc: string;
      guide5Tag: string;
      guide6Label: string;
      guide6Desc: string;
      guide6Tag: string;
      guide7Label: string;
      guide7Desc: string;
      guide7Tag: string;
      ctaHeading: string;
      ctaBody: string;
      ctaContact: string;
      ctaBrowse: string;
    };
    about: {
      badge: string;
      heading: string;
      subtitle: string;
      stat1Label: string;
      stat1Value: string;
      stat2Label: string;
      stat2Value: string;
      stat3Label: string;
      stat3Value: string;
      stat4Label: string;
      stat4Value: string;
      missionBadge: string;
      missionHeading: string;
      missionPara1: string;
      missionPara2: string;
      contactUs: string;
      valuesBadge: string;
      valuesHeading: string;
      value1Title: string;
      value1Body: string;
      value2Title: string;
      value2Body: string;
      value3Title: string;
      value3Body: string;
      value4Title: string;
      value4Body: string;
      ctaHeading: string;
      ctaBody: string;
      ctaCreate: string;
      ctaJoin: string;
    };
    contact: {
      badge: string;
      heading: string;
      subtitle: string;
      infoHeading: string;
      formHeading: string;
      labelAddress: string;
      labelPhone: string;
      labelEmail: string;
      labelHours: string;
      fieldName: string;
      fieldEmail: string;
      fieldSubject: string;
      fieldMessage: string;
      placeholderName: string;
      placeholderEmail: string;
      placeholderSubject: string;
      placeholderMessage: string;
      validationName: string;
      validationEmail: string;
      validationSubject: string;
      validationMessage: string;
      successTitle: string;
      successBody: string;
      sendAnother: string;
      sending: string;
      send: string;
    };
    carrieres: {
      heroBadge: string;
      heroHeading: string;
      heroSubtitle: string;
      heroBtn: string;
      whyHeading: string;
      perk1Title: string;
      perk1Body: string;
      perk2Title: string;
      perk2Body: string;
      perk3Title: string;
      perk3Body: string;
      perk4Title: string;
      perk4Body: string;
      openingsBadge: string;
      openingsHeading: string;
      applyBtn: string;
      noRoleText: string;
      noRoleLink: string;
      job1Title: string;
      job1Team: string;
      job2Title: string;
      job2Team: string;
      job3Title: string;
      job3Team: string;
      job4Title: string;
      job4Team: string;
      job5Title: string;
      job5Team: string;
      job6Title: string;
      job6Team: string;
    };
    terms: {
      badge: string;
      heading: string;
      lastUpdated: string;
      contactText: string;
      s1Title: string;
      s1Body: string;
      s2Title: string;
      s2Body: string;
      s3Title: string;
      s3Body: string;
      s4Title: string;
      s4Body: string;
      s5Title: string;
      s5Body: string;
      s6Title: string;
      s6Body: string;
      s7Title: string;
      s7Body: string;
      s8Title: string;
      s8Body: string;
    };
    privacy: {
      badge: string;
      heading: string;
      lastUpdated: string;
      contactText: string;
      s1Title: string;
      s1Body: string;
      s2Title: string;
      s2Body: string;
      s3Title: string;
      s3Body: string;
      s4Title: string;
      s4Body: string;
      s5Title: string;
      s5Body: string;
      s6Title: string;
      s6Body: string;
      s7Title: string;
      s7Body: string;
      s8Title: string;
      s8Body: string;
    };
  };
}
