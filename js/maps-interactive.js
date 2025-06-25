// Trade Route data for detailed information

const tradeRouteData = {
    'west-africa-caribbean': {
        name: 'West Africa → Caribbean',
        period: '1500-1850',
        volume: '3.2 Million',
        description: 'The largest route from West Africa to the Caribbean sugar islands, carrying enslaved peoples primarily from modern-day Ghana, Nigeria, and Benin to work on sugar plantations.',
        source: 'Gold Coast, Bight of Benin, Bight of Biafra',
        destination: 'Jamaica, Barbados, Haiti, Cuba',
        economicDrivers: ['Sugar', 'Rum', 'Molasses', 'Tobacco'],
        culturalImpact: 'Yoruba, Akan, and Igbo cultures deeply influenced Caribbean societies, including religious practices like Santería, Vodou, and Rastafarianism.',
        peakPeriod: '1700-1800',
        mortality: '15-20%',
        legacyConnections: 'Modern Caribbean nations maintain strong cultural ties to West African traditions'
    },
    'central-africa-brazil': {
        name: 'Central Africa → Brazil',
        period: '1500-1850',
        volume: '5.6 Million',
        description: 'The largest single route of the transatlantic slave trade, carrying more enslaved Africans than any other route. Primarily from Angola and Congo regions to Brazilian sugar, gold, and coffee plantations.',
        source: 'Angola, Congo, Cabinda',
        destination: 'Bahia, Rio de Janeiro, Pernambuco',
        economicDrivers: ['Sugar', 'Gold', 'Coffee', 'Diamonds'],
        culturalImpact: 'Bantu languages, Capoeira martial arts, Candomblé religion, and Carnival traditions created the foundation of Afro-Brazilian culture.',
        peakPeriod: '1650-1750',
        mortality: '12-18%',
        legacyConnections: 'Brazil has the largest African diaspora population outside of Africa'
    },
    'west-africa-north-america': {
        name: 'West Africa → North America',
        period: '1619-1860',
        volume: '400,000',
        description: 'Though smaller in volume, this route had profound impact on North American culture. Enslaved peoples from various West African regions were brought to work on tobacco, rice, and cotton plantations.',
        source: 'Senegambia, Sierra Leone, Gold Coast',
        destination: 'Virginia, South Carolina, Georgia, Louisiana',
        economicDrivers: ['Tobacco', 'Rice', 'Cotton', 'Indigo'],
        culturalImpact: 'Foundation of African American culture, including spirituals, jazz, blues, and civil rights movements that influenced global freedom struggles.',
        peakPeriod: '1720-1780',
        mortality: '10-15%',
        legacyConnections: 'African American cultural exports have global influence through music, sports, and social movements'
    },
    'senegambia-caribbean': {
        name: 'Senegambia → Caribbean',
        period: '1500-1850',
        volume: '1.2 Million',
        description: 'Enslaved peoples from Senegal and Gambia, including Wolof, Mandinka, and Fulani peoples, were transported to work primarily on sugar plantations in the Caribbean.',
        source: 'Gorée Island, Saint-Louis, James Island',
        destination: 'Saint-Domingue (Haiti), Martinique, Guadeloupe',
        economicDrivers: ['Sugar', 'Coffee', 'Indigo', 'Cotton'],
        culturalImpact: 'Wolof and Mandinka languages influenced Caribbean Creole languages. Islamic traditions blended with Caribbean religious practices.',
        peakPeriod: '1650-1750',
        mortality: '18-25%',
        legacyConnections: 'Haitian Revolution leaders included many of Senegambian origin'
    },
    'angola-spanish-america': {
        name: 'Angola → Spanish America',
        period: '1520-1850',
        volume: '1.3 Million',
        description: 'Enslaved Africans from Angola were transported to Spanish colonies for mining operations and plantation agriculture, particularly in Colombia, Venezuela, and Peru.',
        source: 'Luanda, Benguela, Cabinda',
        destination: 'Cartagena, Veracruz, Lima, Buenos Aires',
        economicDrivers: ['Silver', 'Gold', 'Sugar', 'Cacao'],
        culturalImpact: 'Bantu cultural elements merged with indigenous and Spanish cultures, creating unique Afro-Latino traditions across Latin America.',
        peakPeriod: '1580-1650',
        mortality: '20-30%',
        legacyConnections: 'Significant Afro-descendant populations throughout Latin America with varying recognition'
    },
    'east-africa-indian-ocean': {
        name: 'East Africa → Indian Ocean',
        period: '1500-1900',
        volume: '500,000',
        description: 'The Indian Ocean slave trade connected East Africa to the Middle East, India, and Indian Ocean islands. This trade operated alongside the Atlantic routes.',
        source: 'Kilwa, Mozambique, Madagascar',
        destination: 'Arabia, Persia, India, Mauritius',
        economicDrivers: ['Cloves', 'Sugar', 'Pearls', 'Domestic Labor'],
        culturalImpact: 'Swahili cultural influences spread across the Indian Ocean, with African communities established in Arabia and India.',
        peakPeriod: '1750-1850',
        mortality: '15-25%',
        legacyConnections: 'African communities in Gulf states and India trace origins to this trade'
    },
    'trans-saharan-north': {
        name: 'Trans-Saharan Routes',
        period: '700-1900',
        volume: '1.2 Million',
        description: 'Ancient trade routes across the Sahara Desert connected sub-Saharan Africa with North Africa and the Middle East, predating Atlantic routes by centuries.',
        source: 'Mali, Songhai, Hausa states',
        destination: 'Morocco, Tunisia, Egypt, Ottoman Empire',
        economicDrivers: ['Gold', 'Salt', 'Ivory', 'Slaves'],
        culturalImpact: 'Islamic culture and Arabic language spread southward, while African influences moved north. Created cosmopolitan trading cities.',
        peakPeriod: '1000-1500',
        mortality: '30-40%',
        legacyConnections: 'North African populations include significant sub-Saharan ancestry'
    }
};

// Complete region data combining all sources
const regionData = {
    ...tradeRouteData,
    
    // Pre-Slavery African Kingdoms & Civilizations
    'mali': {
        name: 'Mali Empire',
        period: '1230-1600 CE',
        capital: 'Niani',
        peakPopulation: '40-45 million',
        description: 'The Mali Empire was one of the richest and most powerful empires in medieval Africa, controlling trans-Saharan trade routes and vast gold mines. Famous for Mansa Musa, considered the wealthiest person in history.',
        achievements: [
            'Controlled trans-Saharan gold and salt trade',
            'Home to the University of Timbuktu',
            'Advanced Islamic scholarship and architecture',
            'Sophisticated administrative system'
        ],
        modernLegacy: 'Modern Mali, parts of Senegal, Niger, Burkina Faso, Guinea, Gambia, and Mauritania'
    },
    'nok': {
        name: 'Nok Culture',
        period: '1500 BCE - 500 CE',
        capital: 'Various settlements',
        peakPopulation: '100,000+',
        description: 'One of Africa\'s earliest iron-age civilizations, famous for sophisticated terracotta sculptures and advanced metallurgy.',
        achievements: [
            'Earliest known iron production in West Africa',
            'Sophisticated terracotta sculpture',
            'Advanced agricultural techniques',
            'Foundational to later Nigerian civilizations'
        ],
        modernLegacy: 'Central Nigeria - influenced later Yoruba and Hausa cultures'
    },
    'benin-kingdom': {
        name: 'Kingdom of Benin',
        period: '1180-1897 CE',
        capital: 'Benin City',
        peakPopulation: '500,000',
        description: 'Famous for its bronze plaques and sophisticated artistic traditions, the Kingdom of Benin was one of West Africa\'s most advanced civilizations.',
        achievements: [
            'World-renowned bronze and ivory art',
            'Advanced urban planning (Benin City)',
            'Sophisticated guild system',
            'Complex political hierarchy'
        ],
        modernLegacy: 'Modern Edo State, Nigeria'
    },
    'hausa': {
        name: 'Hausa City-States',
        period: '1000-1800 CE',
        capital: 'Various (Kano, Katsina, Zaria)',
        peakPopulation: '2-3 million',
        description: 'The Hausa city-states were major centers of trade and Islamic learning, connecting sub-Saharan Africa with North Africa and the Middle East.',
        achievements: [
            'Major trans-Saharan trading centers',
            'Advanced Islamic scholarship',
            'Sophisticated urban architecture',
            'Complex federal political structure'
        ],
        modernLegacy: 'Northern Nigeria and southern Niger'
    },
    'kangaba': {
        name: 'Kingdom of Kangaba',
        period: '1100-1235 CE',
        capital: 'Kangaba',
        peakPopulation: '500,000',
        description: 'The Kingdom of Kangaba was the predecessor state to the Mali Empire, controlling important gold trade routes along the Niger River.',
        achievements: [
            'Precursor to the mighty Mali Empire',
            'Early control of gold trade routes',
            'Foundation of Mandinka political traditions',
            'Strategic location on Niger River'
        ],
        modernLegacy: 'Foundation for later Mali Empire expansion'
    },
    'ethiopia': {
        name: 'Christian Ethiopia',
        period: '1270-1974 CE',
        capital: 'Various (Gondar, Addis Ababa)',
        peakPopulation: '12-15 million (by 1900)',
        description: 'The Ethiopian Empire was one of the few African nations to resist European colonization, maintaining independence and preserving ancient Christian traditions.',
        achievements: [
            'Successfully resisted European colonization',
            'Ancient Christian civilization',
            'Unique calendar and writing system',
            'Original home of coffee cultivation'
        ],
        modernLegacy: 'Modern Ethiopia and Eritrea'
    },
    'songhai': {
        name: 'Songhai Empire',
        period: '1464-1591 CE',
        capital: 'Gao',
        peakPopulation: '20-25 million',
        description: 'The Songhai Empire was the largest empire in African history, known for its advanced military organization and the famous centers of learning in Timbuktu and Gao.',
        achievements: [
            'Largest empire in African history',
            'Advanced military and administrative systems',
            'Major centers of Islamic learning',
            'Controlled Niger River trade routes'
        ],
        modernLegacy: 'Modern Mali, Niger, and parts of Burkina Faso'
    },
    'ghana-empire': {
        name: 'Empire of Ghana',
        period: '300-1200 CE',
        capital: 'Koumbi Saleh',
        peakPopulation: '1-2 million',
        description: 'The Ghana Empire was the first of the great West African trading empires, controlling gold and salt trade routes across the Sahara.',
        achievements: [
            'First major West African empire',
            'Controlled trans-Saharan gold trade',
            'Advanced iron working',
            'Sophisticated taxation system'
        ],
        modernLegacy: 'Inspired the name of modern Ghana'
    },
    'wolof': {
        name: 'Wolof Kingdoms',
        period: '1350-1549 CE',
        capital: 'Linguère',
        peakPopulation: '500,000-1 million',
        description: 'A Wolof confederation controlling much of Senegal and parts of the Gambia, known for its sophisticated political system.',
        achievements: [
            'Complex federal political structure',
            'Advanced oral tradition and literature',
            'Sophisticated military organization',
            'Cultural influence throughout West Africa'
        ],
        modernLegacy: 'Modern Senegal and parts of Gambia'
    },
    'kanem-bornu': {
        name: 'Empire of Kanem',
        period: '700-1900 CE',
        capital: 'Njimi, later Ngazargamu',
        peakPopulation: '3-5 million',
        description: 'One of the longest-lasting empires in African history, controlling trade around Lake Chad for over 1000 years.',
        achievements: [
            'Longest-lasting African empire (1200+ years)',
            'Controlled trans-Saharan trade routes',
            'Early adoption of Islam',
            'Advanced cavalry warfare'
        ],
        modernLegacy: 'Modern Chad, Niger, Nigeria, and Cameroon'
    },
    'fatimid': {
        name: 'Fatimid Caliphate',
        period: '909-1171 CE',
        capital: 'Cairo',
        peakPopulation: '2-3 million',
        description: 'The Fatimid Caliphate was an Ismaili Shia Islamic caliphate that spanned a large area of North Africa and the Middle East.',
        achievements: [
            'Major Islamic scholarly center',
            'Advanced architecture and arts',
            'Sophisticated naval power',
            'Religious tolerance and diversity'
        ],
        modernLegacy: 'Influenced Islamic architecture and scholarship in North Africa'
    },
    'ayyubid': {
        name: 'Ayyubid Dynasty',
        period: '1171-1260 CE',
        capital: 'Cairo',
        peakPopulation: '2-4 million',
        description: 'Founded by Saladin, the Ayyubid dynasty was a Kurdish-led sultanate that ruled over Egypt, Syria, and parts of Arabia.',
        achievements: [
            'Defeated Crusader states',
            'Advanced military organization',
            'Architectural and cultural achievements',
            'Trade and diplomatic relations'
        ],
        modernLegacy: 'Influenced Middle Eastern and North African politics'
    },
    'umayyad': {
        name: 'Umayyad Caliphate',
        period: '661-750 CE',
        capital: 'Damascus',
        peakPopulation: '15-20 million',
        description: 'The Umayyad Caliphate was the first Muslim dynasty, ruling the Islamic world from Damascus with territories in North Africa.',
        achievements: [
            'First major Islamic dynasty',
            'Rapid territorial expansion',
            'Advanced administrative system',
            'Cultural and architectural achievements'
        ],
        modernLegacy: 'Foundation of Islamic civilization in North Africa'
    },
    'yoruba': {
        name: 'Yoruba Kingdoms',
        period: '500-1900 CE',
        capital: 'Various (Ife, Oyo)',
        peakPopulation: '3-4 million',
        description: 'The Yoruba peoples formed several powerful kingdoms, including Ife and Oyo, known for their sophisticated art, religion, and political systems.',
        achievements: [
            'Advanced bronze and terracotta art',
            'Complex religious and philosophical systems',
            'Sophisticated urban planning',
            'Rich oral literature and traditions'
        ],
        modernLegacy: 'Modern Yoruba people in Nigeria, Benin, and global diaspora'
    },
    'igbo': {
        name: 'Igbo Communities',
        period: '900-1900 CE',
        capital: 'Decentralized settlements',
        peakPopulation: '2-3 million',
        description: 'The Igbo people developed sophisticated decentralized societies with democratic councils, advanced trade networks, and rich cultural traditions.',
        achievements: [
            'Democratic council systems',
            'Advanced metalworking and art',
            'Sophisticated trade networks',
            'Rich cultural and religious traditions'
        ],
        modernLegacy: 'Modern Igbo people in southeastern Nigeria and global diaspora'
    },
    'kongo': {
        name: 'Kongo Kingdom',
        period: '1390-1914 CE',
        capital: 'Mbanza-Kongo',
        peakPopulation: '2.5-3 million',
        description: 'The Kingdom of Kongo was a sophisticated Central African state with advanced metalworking, agriculture, and complex political systems.',
        achievements: [
            'Sophisticated political confederation',
            'Advanced copper and iron working',
            'Complex agricultural innovations',
            'Early diplomatic contact with Europe'
        ],
        modernLegacy: 'Modern Angola, Democratic Republic of Congo, Republic of Congo'
    },
    'kitara': {
        name: 'Kitara Empire',
        period: '1000-1500 CE',
        capital: 'Various',
        peakPopulation: '1-2 million',
        description: 'The Kitara Empire was a legendary kingdom in the Great Lakes region, considered the predecessor to later kingdoms like Buganda and Rwanda.',
        achievements: [
            'Foundation for Great Lakes kingdoms',
            'Advanced cattle culture',
            'Sophisticated political systems',
            'Rich oral historical traditions'
        ],
        modernLegacy: 'Influenced development of Uganda, Rwanda, and Tanzania kingdoms'
    },
    'lunda': {
        name: 'Lunda State',
        period: '1665-1887 CE',
        capital: 'Musumba',
        peakPopulation: '1-2 million',
        description: 'A major Central African trading empire controlling copper and ivory trade routes across the region.',
        achievements: [
            'Extensive trading networks',
            'Advanced copper mining',
            'Sophisticated administrative system',
            'Cultural influence across Central Africa'
        ],
        modernLegacy: 'Parts of Angola, DRC, and Zambia'
    },
    'luba': {
        name: 'Luba State',
        period: '1585-1889 CE',
        capital: 'Mwibele',
        peakPopulation: '1 million',
        description: 'Known for its divine kingship tradition and sophisticated political philosophy that influenced many Central African societies.',
        achievements: [
            'Complex divine kingship system',
            'Advanced metallurgy and woodcarving',
            'Sophisticated oral traditions',
            'Influential political concepts'
        ],
        modernLegacy: 'Democratic Republic of Congo'
    },
    'zimbabwe': {
        name: 'Great Zimbabwe Empire',
        period: '1220-1450 CE',
        capital: 'Great Zimbabwe',
        peakPopulation: '18,000-20,000',
        description: 'Great Zimbabwe was a medieval city known for its impressive stone architecture and control of gold trade routes between the interior and Indian Ocean coast.',
        achievements: [
            'Massive stone architecture without mortar',
            'Controlled Indian Ocean gold trade',
            'Advanced cattle domestication',
            'Sophisticated urban planning'
        ],
        modernLegacy: 'Modern Zimbabwe'
    },
    'axum': {
        name: 'Kingdom of Aksum',
        period: '100-960 CE',
        capital: 'Axum',
        peakPopulation: '1-2 million',
        description: 'A major trading empire connecting Africa with Arabia and the Mediterranean, famous for its giant stone obelisks and early adoption of Christianity.',
        achievements: [
            'Major international trading power',
            'Impressive stone obelisks and architecture',
            'Early adoption of Christianity',
            'Advanced currency system'
        ],
        modernLegacy: 'Northern Ethiopia and Eritrea'
    },
    'carthage': {
        name: 'Carthaginian Empire',
        period: '814-146 BCE',
        capital: 'Carthage',
        peakPopulation: '400,000-500,000',
        description: 'Carthage was a powerful maritime trading empire that dominated the western Mediterranean and challenged Roman expansion.',
        achievements: [
            'Major Mediterranean naval power',
            'Advanced shipbuilding and navigation',
            'Extensive trading networks',
            'Sophisticated urban planning'
        ],
        modernLegacy: 'Influenced Mediterranean trade and culture'
    },
    'persia': {
        name: 'Persian Achaemenid Empire',
        period: '550-330 BCE',
        capital: 'Persepolis',
        peakPopulation: '35-50 million',
        description: 'The Persian Achaemenid Empire extended into North Africa and was one of the largest empires in ancient history.',
        achievements: [
            'Largest empire in ancient world',
            'Advanced administrative system',
            'Religious tolerance and diversity',
            'Sophisticated infrastructure'
        ],
        modernLegacy: 'Influenced governance systems across the ancient world'
    },
    'ptolemaic': {
        name: 'Ptolemaic Egypt',
        period: '305-30 BCE',
        capital: 'Alexandria',
        peakPopulation: '4-5 million',
        description: 'The Ptolemaic Kingdom was a Hellenistic kingdom based in Egypt, founded by Ptolemy I following Alexander the Great\'s conquest.',
        achievements: [
            'Great Library of Alexandria',
            'Advanced mathematics and astronomy',
            'Sophisticated agricultural systems',
            'Cultural fusion of Greek and Egyptian traditions'
        ],
        modernLegacy: 'Legacy of Hellenistic learning and culture'
    },
    'fulani': {
        name: 'Fulani Societies',
        period: '1000-1900 CE',
        capital: 'Various pastoral communities',
        peakPopulation: '2-3 million',
        description: 'The Fulani people developed sophisticated pastoral societies across West Africa, known for their cattle herding and Islamic scholarship.',
        achievements: [
            'Advanced pastoral techniques',
            'Islamic scholarship and education',
            'Extensive trade networks',
            'Cultural influence across West Africa'
        ],
        modernLegacy: 'Modern Fulani people across West and Central Africa'
    },
    'akan': {
        name: 'Akan Peoples',
        period: '1200-1900 CE',
        capital: 'Various (including Kumasi)',
        peakPopulation: '1-2 million',
        description: 'The Akan peoples, including the Ashanti, developed sophisticated kingdoms in the Gold Coast region, known for their gold trade and artistic traditions.',
        achievements: [
            'Advanced gold mining and trade',
            'Sophisticated artistic traditions',
            'Complex political systems',
            'Rich cultural ceremonies and festivals'
        ],
        modernLegacy: 'Modern Ghana and parts of Côte d\'Ivoire'
    },

    // Slave Trade Routes - African Departure Points
    'senegambia': {
        name: 'Senegambia Region',
        period: '1500-1850',
        enslavedNumbers: '1.2 million',
        description: 'The Senegambia region, including modern Senegal and Gambia, was a major departure point for the transatlantic slave trade. The region included the important ports of Gorée Island and Saint-Louis.',
        majorPorts: ['Gorée Island', 'Saint-Louis', 'James Island (Gambia)'],
        destinations: ['Caribbean', 'North America', 'South America'],
        culturalImpact: 'Wolof, Mandinka, and Fulani cultural influences spread throughout the Americas, particularly in Louisiana and the Caribbean.',
        routes: 'Primary routes to the Caribbean sugar islands and North American mainland colonies'
    },
    'sierra-leone': {
        name: 'Sierra Leone Region',
        period: '1562-1850',
        enslavedNumbers: '388,000',
        description: 'Sierra Leone served as an important departure point, later becoming a colony for freed slaves. The region was known for rice cultivation knowledge that proved valuable in the Americas.',
        majorPorts: ['Freetown', 'Bunce Island'],
        destinations: ['South Carolina', 'Georgia', 'Caribbean'],
        culturalImpact: 'Rice cultivation techniques and Gullah culture in South Carolina and Georgia',
        routes: 'Significant route to rice-growing regions of North America'
    },
    'gold-coast': {
        name: 'Gold Coast (Ghana)',
        period: '1471-1850',
        enslavedNumbers: '1.2 million',
        description: 'The Gold Coast saw the construction of numerous slave castles and became a major hub for the transatlantic slave trade. Cape Coast Castle and Elmina Castle were central to the trade.',
        majorPorts: ['Cape Coast Castle', 'Elmina Castle', 'Fort James'],
        destinations: ['Caribbean', 'Brazil', 'North America'],
        culturalImpact: 'Akan cultural traditions, languages, and naming practices preserved throughout the Caribbean and Americas',
        routes: 'Major routes to Caribbean sugar colonies and Brazilian gold mines'
    },
    'bight-benin': {
        name: 'Bight of Benin (Slave Coast)',
        period: '1640-1850',
        enslavedNumbers: '1.8 million',
        description: 'The Bight of Benin, including modern Nigeria and Benin, was known as the "Slave Coast" during the peak of the trade. Ouidah was one of the most important departure points.',
        majorPorts: ['Ouidah', 'Lagos', 'Porto-Novo', 'Badagry'],
        destinations: ['Haiti', 'Brazil', 'Cuba', 'Jamaica'],
        culturalImpact: 'Yoruba religious practices (Santería, Vodou, Candomblé) and cultural traditions survived and evolved throughout the Americas',
        routes: 'Heavy concentration to Caribbean and Brazilian sugar plantations'
    },
    'bight-biafra': {
        name: 'Bight of Biafra',
        period: '1650-1850',
        enslavedNumbers: '1.5 million',
        description: 'The Bight of Biafra region contributed significantly to the enslaved population in North America. The Igbo people from this region were particularly noted for their resistance.',
        majorPorts: ['Bonny', 'Calabar', 'New Calabar', 'Old Calabar'],
        destinations: ['Virginia', 'South Carolina', 'Caribbean', 'Barbados'],
        culturalImpact: 'Igbo cultural influences, resistance traditions, and the documented history of Igbo Landing mass suicide in Georgia',
        routes: 'Important source for North American mainland colonies'
    },
    'west-central-africa': {
        name: 'West Central Africa (Angola)',
        period: '1500-1850',
        enslavedNumbers: '5.6 million',
        description: 'West Central Africa, primarily Angola and the Congo region, was the largest source of enslaved Africans. Luanda was the most important slave port in Africa.',
        majorPorts: ['Luanda', 'Benguela', 'Cabinda', 'Loango'],
        destinations: ['Brazil (primary)', 'Caribbean', 'Spanish Americas'],
        culturalImpact: 'Bantu languages, Capoeira martial arts, Candomblé religion, and countless cultural practices heavily influenced Brazilian and Caribbean cultures',
        routes: 'Massive direct route to Brazil, secondary routes to Caribbean'
    },

    // American Destinations
    'brazil': {
        name: 'Brazil',
        period: '1500-1850',
        receivedNumbers: '4.9 million (40% of all enslaved Africans)',
        description: 'Brazil received the largest number of enslaved Africans and developed the largest Afro-descendant population outside Africa. Different regions specialized in sugar, gold, and coffee production.',
        majorRegions: ['Bahia (Salvador)', 'Rio de Janeiro', 'Pernambuco (Recife)', 'Maranhão'],
        culturalLegacy: 'Rich Afro-Brazilian culture including Capoeira, Candomblé, Carnival, Samba, and the largest African diaspora population globally',
        modernImpact: 'Over 100 million Afro-descendants, vibrant cultural traditions, and ongoing struggles for equality'
    },
    'caribbean': {
        name: 'Caribbean Islands',
        period: '1500-1850',
        receivedNumbers: '2.3 million',
        description: 'The Caribbean islands became centers of brutal sugar plantation systems. Haiti became the first independent black republic after a successful slave revolution.',
        majorRegions: ['Jamaica', 'Haiti (Saint-Domingue)', 'Cuba', 'Barbados', 'Trinidad'],
        culturalLegacy: 'Maroon communities, Haitian Revolution, Reggae, Calypso, Steel Pan, and vibrant Caribbean cultures',
        modernImpact: 'Independent nations with rich African cultural heritage and ongoing diaspora connections'
    },
    'north-america': {
        name: 'North America',
        period: '1619-1860',
        receivedNumbers: '400,000 (3.5% of total)',
        description: 'Though North America received a smaller percentage, the population grew significantly due to natural increase, becoming the foundation of African American culture.',
        majorRegions: ['Virginia (Jamestown)', 'South Carolina (Charleston)', 'Georgia (Savannah)', 'Louisiana (New Orleans)'],
        culturalLegacy: 'African American culture, spirituals, jazz, blues, hip-hop, Civil Rights movement, and ongoing struggle for equality',
        modernImpact: '47 million African Americans, significant cultural and political influence globally'
    },
    'spanish-america': {
        name: 'Spanish America',
        period: '1502-1850',
        receivedNumbers: '1.3 million',
        description: 'Spanish colonies throughout the Americas received enslaved Africans for mining, agriculture, and urban labor. The Spanish colonial system included complex racial hierarchies.',
        majorRegions: ['Mexico', 'Colombia', 'Venezuela', 'Peru', 'Argentina'],
        culturalLegacy: 'Afro-Latino cultures, religious syncretism, musical traditions, and diverse forms of resistance',
        modernImpact: 'Significant Afro-descendant populations throughout Latin America with varying degrees of recognition'
    },

    // Modern Countries
    'nigeria': {
        name: 'Nigeria',
        population: '220 million',
        diaspora: '17 million+',
        description: 'Nigeria has the largest diaspora of any African country, with significant communities worldwide contributing to global culture and innovation.',
        diasporaCountries: ['United States', 'United Kingdom', 'Canada', 'Germany', 'South Africa'],
        culturalExports: ['Nollywood films', 'Afrobeats music', 'Literature', 'Fashion', 'Cuisine'],
        modernContributions: 'Technology innovation, entertainment industry, academic excellence, entrepreneurship'
    },
    'ghana': {
        name: 'Ghana',
        population: '32 million',
        diaspora: '3 million+',
        description: 'Ghana is a symbol of African independence and Pan-Africanism, with strong cultural ties to its diaspora.',
        diasporaCountries: ['United States', 'United Kingdom', 'Canada', 'Germany'],
        culturalExports: ['Kente cloth', 'Highlife music', 'Year of Return initiative', 'Traditional crafts'],
        modernContributions: 'Pan-African leadership, democratic governance, cultural tourism, gold mining'
    },
    'senegal': {
        name: 'Senegal',
        population: '17 million',
        diaspora: '1 million+',
        description: 'Senegal maintains strong cultural ties with its diaspora and is known for its vibrant arts scene and democratic stability.',
        diasporaCountries: ['France', 'Italy', 'United States', 'Spain'],
        culturalExports: ['Teranga hospitality', 'Mbalax music', 'Wrestling (Laamb)', 'Visual arts'],
        modernContributions: 'Democratic stability, cultural diplomacy, fishing industry, renewable energy'
    },
    'kenya': {
        name: 'Kenya',
        population: '54 million',
        diaspora: '1.5 million+',
        description: 'Kenya has a rapidly growing diaspora, particularly in North America and Europe, known for innovation and athletics.',
        diasporaCountries: ['United States', 'United Kingdom', 'Canada', 'Australia'],
        culturalExports: ['Safari tourism', 'Athletics', 'Tea and coffee', 'Maasai culture'],
        modernContributions: 'Technology hub (Silicon Savannah), conservation leadership, mobile banking innovation'
    },
    'south-africa': {
        name: 'South Africa',
        population: '60 million',
        diaspora: '2.5 million+',
        description: 'South Africa has a complex history and significant diaspora communities worldwide, known for its transition to democracy.',
        diasporaCountries: ['United Kingdom', 'Australia', 'United States', 'Canada'],
        culturalExports: ['Anti-apartheid legacy', 'Wine industry', 'Mining expertise', 'Rainbow Nation concept'],
        modernContributions: 'Human rights leadership, mineral resources, democratic transition model, sports excellence'
    }
};

// Current state
let currentMap = 'pre-slavery';
let sidebarOpen = false;

// Initialize interactive maps
function initializeInteractiveMaps() {
    console.log('Initializing interactive maps...');
    setupMapTabs();
    setupMarkers();
    setupTradeRoutes();
    setupSidebar();
    
    // Show initial map
    showMap('pre-slavery');
}

// Setup map tab functionality
function setupMapTabs() {
    const tabs = document.querySelectorAll('.map-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const mapType = this.getAttribute('data-map');
            if (mapType && mapType !== currentMap) {
                showMap(mapType);
            }
        });
    });
}

// Show specific map
function showMap(mapType) {
    console.log('Switching to map:', mapType);
    currentMap = mapType;
    
    // Update tab states
    document.querySelectorAll('.map-tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[data-map="${mapType}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update map views
    document.querySelectorAll('.map-view').forEach(view => {
        view.classList.remove('active');
    });
    
    const activeMap = document.getElementById(`${mapType}-map`);
    if (activeMap) {
        activeMap.classList.add('active');
    }
    
    // Update legend
    document.querySelectorAll('.legend-items').forEach(legend => {
        legend.classList.remove('active');
    });
    
    const activeLegend = document.querySelector(`.${mapType}-legend`);
    if (activeLegend) {
        activeLegend.classList.add('active');
    }
    
    // Close sidebar when switching maps
    closeSidebar();
}

// Setup marker interactions
function setupMarkers() {
    const markers = document.querySelectorAll('.marker');
    
    markers.forEach(marker => {
        // Click handler
        marker.addEventListener('click', function(e) {
            e.stopPropagation();
            handleMarkerClick(this);
        });
        
        // Make markers keyboard accessible
        marker.setAttribute('tabindex', '0');
        marker.setAttribute('role', 'button');
        
        // Keyboard handler
        marker.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMarkerClick(this);
            }
        });
        
        // Add tooltip data attribute for accessibility
        const tooltip = marker.getAttribute('data-tooltip');
        if (tooltip) {
            marker.setAttribute('aria-label', tooltip);
        }
    });
}

// Setup trade route interactions
function setupTradeRoutes() {
    const routes = document.querySelectorAll('.trade-route');
    
    routes.forEach(route => {
        // Click handler
        route.addEventListener('click', function(e) {
            e.stopPropagation();
            handleTradeRouteClick(this);
        });
        
        // Make routes keyboard accessible
        route.setAttribute('tabindex', '0');
        route.setAttribute('role', 'button');
        
        // Keyboard handler
        route.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTradeRouteClick(this);
            }
        });
        
        // Add tooltip data attribute for accessibility
        const tooltip = route.getAttribute('data-tooltip');
        if (tooltip) {
            route.setAttribute('aria-label', tooltip);
        }
    });
}

// Handle marker clicks
function handleMarkerClick(marker) {
    const regionKey = marker.getAttribute('data-region');
    const regionInfo = regionData[regionKey];
    
    if (regionInfo) {
        // Remove selection from other elements
        document.querySelectorAll('.marker, .trade-route').forEach(element => {
            element.classList.remove('selected');
        });
        
        // Select current marker
        marker.classList.add('selected');
        
        // Show information in sidebar
        showRegionInfo(regionInfo);
        
        // Track analytics if available
        if (window.DiasporaHub && window.DiasporaHub.Analytics) {
            window.DiasporaHub.Analytics.track('marker_click', {
                region: regionKey,
                map: currentMap,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Handle trade route clicks
function handleTradeRouteClick(route) {
    const routeKey = route.getAttribute('data-route');
    const routeInfo = tradeRouteData[routeKey];
    
    if (routeInfo) {
        // Remove selection from other elements
        document.querySelectorAll('.marker, .trade-route').forEach(element => {
            element.classList.remove('selected');
        });
        
        // Select current route
        route.classList.add('selected');
        
        // Show route information in sidebar
        showTradeRouteInfo(routeInfo);
        
        // Track analytics if available
        if (window.DiasporaHub && window.DiasporaHub.Analytics) {
            window.DiasporaHub.Analytics.track('trade_route_click', {
                route: routeKey,
                map: currentMap,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Show region information in sidebar
function showRegionInfo(regionInfo) {
    const sidebar = document.getElementById('info-sidebar');
    const title = document.getElementById('sidebar-title');
    const content = document.getElementById('sidebar-content');
    
    if (!sidebar || !title || !content) return;
    
    title.textContent = regionInfo.name;
    content.innerHTML = generateRegionContent(regionInfo);
    
    // Show sidebar (especially important for mobile)
    sidebar.classList.add('active');
    sidebarOpen = true;
}

// Show trade route information in sidebar
function showTradeRouteInfo(routeInfo) {
    const sidebar = document.getElementById('info-sidebar');
    const title = document.getElementById('sidebar-title');
    const content = document.getElementById('sidebar-content');
    
    if (!sidebar || !title || !content) return;
    
    title.textContent = routeInfo.name;
    content.innerHTML = generateTradeRouteContent(routeInfo);
    
    // Show sidebar (especially important for mobile)
    sidebar.classList.add('active');
    sidebarOpen = true;
}

// Generate content for trade routes
function generateTradeRouteContent(info) {
    let html = '<div class="route-info">';
    
    // Header with period
    html += `
        <div class="route-header">
            <div class="route-title">${info.name}</div>
            <div class="route-period">${info.period}</div>
        </div>
    `;
    
    // Volume highlight
    html += `
        <div class="route-volume">
            <div class="volume-number">${info.volume}</div>
            <div class="volume-label">People Enslaved</div>
        </div>
    `;
    
    // Description
    html += `<div class="region-description">${info.description}</div>`;
    
    // Economic drivers
    if (info.economicDrivers) {
        html += `
            <div class="economic-drivers">
                <h4><i class="fas fa-seedling"></i> Economic Drivers</h4>
                <div class="driver-list">
        `;
        info.economicDrivers.forEach(driver => {
            html += `<span class="driver-tag">${driver}</span>`;
        });
        html += '</div></div>';
    }
    
    // Stats section
    html += '<div class="region-stats"><h4>Route Details</h4>';
    
    if (info.source) {
        html += `<div class="stat-row"><span class="stat-label">Source Regions:</span><span class="stat-value">${info.source}</span></div>`;
    }
    
    if (info.destination) {
        html += `<div class="stat-row"><span class="stat-label">Destinations:</span><span class="stat-value">${info.destination}</span></div>`;
    }
    
    if (info.peakPeriod) {
        html += `<div class="stat-row"><span class="stat-label">Peak Period:</span><span class="stat-value">${info.peakPeriod}</span></div>`;
    }
    
    if (info.mortality) {
        html += `<div class="stat-row"><span class="stat-label">Mortality Rate:</span><span class="stat-value">${info.mortality}</span></div>`;
    }
    
    html += '</div>';
    
    // Cultural impact
    if (info.culturalImpact) {
        html += `<div class="impact-section"><h4>Cultural Impact</h4><p>${info.culturalImpact}</p></div>`;
    }
    
    // Legacy connections
    if (info.legacyConnections) {
        html += `<div class="legacy-section"><h4>Modern Legacy</h4><p>${info.legacyConnections}</p></div>`;
    }
    
    html += '</div>';
    
    return html;
}

// Generate content based on region type
function generateRegionContent(info) {
    let html = '<div class="region-info">';
    
    // Header with period/timeframe
    if (info.period) {
        html += `
            <div class="region-header">
                <div class="region-title">${info.name}</div>
                <div class="region-period">${info.period}</div>
            </div>
        `;
    } else {
        html += `
            <div class="region-header">
                <div class="region-title">${info.name}</div>
            </div>
        `;
    }
    
    // Description
    html += `<div class="region-description">${info.description}</div>`;
    
    // Stats section
    html += '<div class="region-stats"><h4>Key Information</h4>';
    
    if (info.capital) {
        html += `<div class="stat-row"><span class="stat-label">Capital:</span><span class="stat-value">${info.capital}</span></div>`;
    }
    
    if (info.peakPopulation) {
        html += `<div class="stat-row"><span class="stat-label">Peak Population:</span><span class="stat-value">${info.peakPopulation}</span></div>`;
    }
    
    if (info.population) {
        html += `<div class="stat-row"><span class="stat-label">Population:</span><span class="stat-value">${info.population}</span></div>`;
    }
    
    if (info.diaspora) {
        html += `<div class="stat-row"><span class="stat-label">Global Diaspora:</span><span class="stat-value">${info.diaspora}</span></div>`;
    }
    
    if (info.enslavedNumbers) {
        html += `<div class="stat-row"><span class="stat-label">People Enslaved:</span><span class="stat-value">${info.enslavedNumbers}</span></div>`;
    }
    
    if (info.receivedNumbers) {
        html += `<div class="stat-row"><span class="stat-label">People Received:</span><span class="stat-value">${info.receivedNumbers}</span></div>`;
    }
    
    html += '</div>';
    
    // Additional sections based on data type
    if (info.achievements) {
        html += '<div class="achievements-section"><h4>Major Achievements</h4><ul>';
        info.achievements.forEach(achievement => {
            html += `<li>${achievement}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (info.majorPorts) {
        html += '<div class="ports-section"><h4>Major Ports</h4>';
        info.majorPorts.forEach(port => {
            html += `<p style="margin: 5px 0;"><strong>${port}</strong></p>`;
        });
        html += '</div>';
    }
    
    if (info.destinations) {
        html += '<div class="destinations-section"><h4>Primary Destinations</h4>';
        info.destinations.forEach(destination => {
            html += `<p style="margin: 5px 0;">${destination}</p>`;
        });
        html += '</div>';
    }
    
    if (info.routes) {
        html += `<div class="routes-section"><h4>Trade Routes</h4><p>${info.routes}</p></div>`;
    }
    
    if (info.culturalExports) {
        html += '<div class="cultural-section"><h4>Cultural Exports</h4><ul>';
        info.culturalExports.forEach(item => {
            html += `<li>${item}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (info.modernLegacy) {
        html += `<div class="legacy-section"><h4>Modern Legacy</h4><p>${info.modernLegacy}</p></div>`;
    }
    
    if (info.culturalImpact) {
        html += `<div class="impact-section"><h4>Cultural Impact</h4><p>${info.culturalImpact}</p></div>`;
    }
    
    if (info.modernContributions) {
        html += `<div class="contributions-section"><h4>Modern Contributions</h4><p>${info.modernContributions}</p></div>`;
    }
    
    if (info.modernImpact) {
        html += `<div class="modern-impact-section"><h4>Modern Impact</h4><p>${info.modernImpact}</p></div>`;
    }
    
    html += '</div>';
    
    return html;
}

// Setup sidebar functionality
function setupSidebar() {
    const closeBtn = document.querySelector('.sidebar-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }
    
    // Close sidebar when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('info-sidebar');
        if (sidebarOpen && sidebar && !sidebar.contains(e.target) && 
            !e.target.closest('.marker') && !e.target.closest('.trade-route')) {
            closeSidebar();
        }
    });
    
    // Close sidebar with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebarOpen) {
            closeSidebar();
        }
    });
}

// Close sidebar and reset
function closeSidebar() {
    const sidebar = document.getElementById('info-sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    
    // Clear selected markers and routes
    document.querySelectorAll('.marker, .trade-route').forEach(element => {
        element.classList.remove('selected');
    });
    
    // Reset sidebar content
    const title = document.getElementById('sidebar-title');
    const content = document.getElementById('sidebar-content');
    
    if (title) title.textContent = 'Select a Region';
    if (content) {
        content.innerHTML = `
            <div class="default-content">
                <div class="instruction-icon">
                    <i class="fas fa-hand-pointer"></i>
                </div>
                <p>Click on any marker or trade route to explore detailed information about African heritage and diaspora connections.</p>
            </div>
        `;
    }
    
    sidebarOpen = false;
}

// Legacy function support for backward compatibility
function switchMap(mapType) {
    showMap(mapType);
}

function loadCountryProfile(countryName) {
    const regionKey = countryName.toLowerCase();
    const regionInfo = regionData[regionKey];
    if (regionInfo) {
        showRegionInfo(regionInfo);
    }
}

function closeCountryProfile() {
    closeSidebar();
}

function filterMap(type) {
    const mapping = {
        'migration': 'modern-borders',
        'cultural': 'modern-borders',
        'historical': 'pre-slavery',
        'trade': 'slave-trade'
    };
    showMap(mapping[type] || 'modern-borders');
}

// Utility function to handle window resize (maintain marker positions)
function handleResize() {
    // This function can be used for additional responsive adjustments if needed
    console.log('Window resized - markers maintain relative positions');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.interactive-map-container')) {
        initializeInteractiveMaps();
        
        // Add resize listener for potential future enhancements
        window.addEventListener('resize', handleResize);
    }
});

// Global exports for legacy compatibility
window.MapsInteractive = {
    showMap,
    closeSidebar,
    switchMap,
    loadCountryProfile,
    closeCountryProfile,
    filterMap,
    handleResize,
    handleTradeRouteClick,
    showTradeRouteInfo
};

// Additional helper functions for potential AI integration
function generateAIInsights(regionKey) {
    // Check if AI service is available
    if (window.AIService && window.AIService.isConfigured && window.AIService.isConfigured()) {
        const regionInfo = regionData[regionKey];
        if (regionInfo) {
            const prompt = `Provide additional historical insights about ${regionInfo.name}. Focus on lesser-known facts and cultural significance.`;
            
            window.AIService.generateCountrySummary(regionInfo.name, prompt)
                .then(insights => {
                    // Add AI insights to sidebar if currently open
                    const content = document.getElementById('sidebar-content');
                    if (content && sidebarOpen) {
                        const aiSection = document.createElement('div');
                        aiSection.className = 'ai-insights-section';
                        aiSection.innerHTML = `
                            <h4><i class="fas fa-robot"></i> AI Insights</h4>
                            <p>${insights}</p>
                        `;
                        content.appendChild(aiSection);
                    }
                })
                .catch(error => {
                    console.warn('AI insights not available:', error);
                });
        }
    }
}

// Export AI function for potential use
window.MapsInteractive.generateAIInsights = generateAIInsights;