/**
 * Cotton collection: 9 cotton types and origins.
 * Protected names (Supima®, Egyptian cotton marks) and organic claims are described, not claimed:
 * certified or licensed yarn is offered only with valid documents from the supply chain.
 */
import type { L, LL } from '@/i18n/config';

export type Cotton = {
  slug: string;
  name: L;
  nameEn: string;
  staple: L;
  origin: L;
  fibre: L;
  character: L;
  quality: LL;
  uses: LL;
  difference: L;
  note?: L;
};

export const cottons: Cotton[] = [
  {
    slug: 'american-cotton',
    name: { en: 'American Cotton', tr: 'Amerikan Pamuğu' },
    nameEn: 'American Cotton',
    staple: { en: 'Medium staple', tr: 'Orta elyaf' },
    origin: { en: 'United States, mainly the Cotton Belt from Texas to the Southeast.', tr: 'Amerika Birleşik Devletleri; başta Teksas’tan güneydoğuya uzanan Pamuk Kuşağı.' },
    fibre: { en: 'Mostly Upland cotton (Gossypium hirsutum), a medium-staple fibre.', tr: 'Çoğunlukla Upland pamuğu (Gossypium hirsutum); orta elyaflı bir lif.' },
    character: { en: 'The most common cotton type in the world: consistent, versatile and widely available.', tr: 'Dünyada en yaygın pamuk tipi: tutarlı, çok yönlü ve kolay bulunur.' },
    quality: {
      en: ['Classed by the USDA (length, strength, micronaire, colour)', 'Good uniformity across large lots', 'Suits ring and open-end spinning'],
      tr: ['USDA tarafından sınıflandırılır (uzunluk, mukavemet, mikroner, renk)', 'Büyük partilerde iyi homojenlik', 'Ring ve open-end eğirmeye uygun'],
    },
    uses: { en: ['Everyday knits', 'Denim', 'Home textiles', 'Blends with polyester'], tr: ['Günlük örme ürünler', 'Denim', 'Ev tekstili', 'Polyesterle karışımlar'] },
    difference: { en: 'A reliable all-round cotton. For extra-long staple American cotton, see Pima and Supima.', tr: 'Her işe uygun, güvenilir bir pamuk. Ekstra uzun elyaflı Amerikan pamuğu için Pima ve Supima’ya bakın.' },
  },
  {
    slug: 'egyptian-cotton',
    name: { en: 'Egyptian Cotton', tr: 'Mısır Pamuğu' },
    nameEn: 'Egyptian Cotton',
    staple: { en: 'Long and extra-long staple', tr: 'Uzun ve ekstra uzun elyaf' },
    origin: { en: 'Egypt, mainly the Nile Delta and Nile Valley.', tr: 'Mısır; başta Nil Deltası ve Nil Vadisi.' },
    fibre: { en: 'Mainly Gossypium barbadense varieties with long or extra-long staple; fine and strong.', tr: 'Ağırlıklı olarak uzun veya ekstra uzun elyaflı Gossypium barbadense çeşitleri; ince ve güçlü.' },
    character: { en: 'Known for fine, smooth and lustrous yarns with a soft hand.', tr: 'İnce, pürüzsüz, parlak ve yumuşak tutumlu iplikleriyle bilinir.' },
    quality: {
      en: ['Allows fine counts with good strength', 'Smooth surface, low hairiness', 'Origin can be verified through the Cotton Egypt Association’s programme'],
      tr: ['İyi mukavemetle ince numaralara olanak tanır', 'Pürüzsüz yüzey, düşük tüylülük', 'Menşe, Cotton Egypt Association programıyla doğrulanabilir'],
    },
    uses: { en: ['Fine shirting', 'Bed linen', 'Premium knitwear'], tr: ['İnce gömleklik', 'Nevresim ve çarşaf', 'Premium triko'] },
    difference: { en: '"Egyptian cotton" is an origin. Giza is the name of the individual varieties grown there.', tr: '"Mısır pamuğu" bir menşe adıdır. Giza ise orada yetiştirilen tekil çeşitlerin adıdır.' },
    note: { en: 'Yarn is offered as Egyptian cotton only with origin documents.', tr: 'İplik, yalnızca menşe belgeleriyle Mısır pamuğu olarak sunulur.' },
  },
  {
    slug: 'turkish-cotton',
    name: { en: 'Turkish Cotton', tr: 'Türk Pamuğu' },
    nameEn: 'Turkish Cotton',
    staple: { en: 'Medium to long staple', tr: 'Orta ve uzun elyaf' },
    origin: { en: 'Türkiye: the Aegean region, Çukurova and Southeastern Anatolia.', tr: 'Türkiye: Ege Bölgesi, Çukurova ve Güneydoğu Anadolu.' },
    fibre: { en: 'Mainly Upland cotton (Gossypium hirsutum), with medium to long staple depending on region and variety.', tr: 'Çoğunlukla Upland pamuğu (Gossypium hirsutum); bölge ve çeşide göre orta ile uzun elyaf.' },
    character: { en: 'A cotton with good length and absorbency, spun by Türkiye’s large yarn industry close to European markets.', tr: 'İyi lif uzunluğu ve emiciliği olan, Avrupa pazarına yakın güçlü Türk iplik sanayisinde eğrilen pamuk.' },
    quality: {
      en: ['Suitable for combed, carded and open-end yarns', 'Good absorbency, valued for towels', 'Short supply chain from field to spinner'],
      tr: ['Penye, karde ve open-end ipliklere uygun', 'İyi emicilik; havluda tercih edilir', 'Tarladan iplikçiye kısa tedarik zinciri'],
    },
    uses: { en: ['Towels and bathrobes', 'Knitwear and jersey', 'Denim', 'Home textiles'], tr: ['Havlu ve bornoz', 'Triko ve süprem', 'Denim', 'Ev tekstili'] },
    difference: { en: 'Grown and spun in the same country, which keeps lead times to Europe short.', tr: 'Aynı ülkede yetiştirilip eğrilir; bu da Avrupa’ya teslim sürelerini kısa tutar.' },
  },
  {
    slug: 'pima-cotton',
    name: { en: 'Pima Cotton', tr: 'Pima Pamuğu' },
    nameEn: 'Pima Cotton',
    staple: { en: 'Extra-long staple', tr: 'Ekstra uzun elyaf' },
    origin: { en: 'Developed in the southwestern United States; also grown in Peru and other countries.', tr: 'ABD’nin güneybatısında geliştirildi; Peru ve başka ülkelerde de yetiştirilir.' },
    fibre: { en: 'Extra-long staple Gossypium barbadense: long, fine and strong fibres.', tr: 'Ekstra uzun elyaflı Gossypium barbadense: uzun, ince ve güçlü lifler.' },
    character: { en: 'Soft, smooth and durable, with less pilling than shorter cottons.', tr: 'Yumuşak, pürüzsüz ve dayanıklı; kısa elyaflı pamuklara göre daha az boncuklanır.' },
    quality: {
      en: ['Fine counts with high strength', 'Smooth, lustrous yarn surface', 'Good colour depth after dyeing'],
      tr: ['Yüksek mukavemetle ince numaralar', 'Pürüzsüz ve parlak iplik yüzeyi', 'Boyamada iyi renk derinliği'],
    },
    uses: { en: ['Premium T-shirts and polos', 'Fine knitwear', 'Shirting', 'Bed linen'], tr: ['Premium tişört ve polo', 'İnce triko', 'Gömleklik', 'Nevresim'] },
    difference: { en: 'Pima is a cotton type. Supima® is the trademark for 100% American-grown Pima.', tr: 'Pima bir pamuk tipidir. Supima® ise %100 ABD’de yetiştirilen Pima için ticari markadır.' },
  },
  {
    slug: 'supima-cotton',
    name: { en: 'Supima Cotton', tr: 'Supima Pamuğu' },
    nameEn: 'Supima Cotton',
    staple: { en: 'Extra-long staple', tr: 'Ekstra uzun elyaf' },
    origin: { en: 'United States: 100% American-grown Pima cotton.', tr: 'Amerika Birleşik Devletleri: %100 ABD’de yetiştirilen Pima pamuğu.' },
    fibre: { en: 'Extra-long staple Gossypium barbadense, the same species as other Pima cotton.', tr: 'Diğer Pima pamukları ile aynı tür; ekstra uzun elyaflı Gossypium barbadense.' },
    character: { en: 'A protected brand for American Pima, used for premium products where traceable origin matters.', tr: 'Amerikan Pima’sı için korunan bir marka; izlenebilir menşenin önemli olduğu premium ürünlerde kullanılır.' },
    quality: {
      en: ['Extra-long, strong and fine fibres', 'Licensing programme run by the Supima association', 'Origin can be verified'],
      tr: ['Ekstra uzun, güçlü ve ince lifler', 'Supima birliğinin yürüttüğü lisans programı', 'Menşe doğrulanabilir'],
    },
    uses: { en: ['Luxury knitwear', 'Premium shirting', 'Bed linen and towels'], tr: ['Lüks triko', 'Premium gömleklik', 'Nevresim ve havlu'] },
    difference: { en: 'Same species as Pima, but limited to US-grown cotton and sold under a licensed trademark.', tr: 'Pima ile aynı türdür, ancak yalnızca ABD’de yetişen pamuğu kapsar ve lisanslı bir marka altında satılır.' },
    note: {
      en: 'SUPIMA® is a trademark of the Supima association. We offer Supima yarn only from licensed spinners with the related documents.',
      tr: 'SUPIMA®, Supima birliğinin ticari markasıdır. Supima ipliğini yalnızca lisanslı iplikçilerden, ilgili belgelerle sunuyoruz.',
    },
  },
  {
    slug: 'giza-cotton',
    name: { en: 'Giza Cotton', tr: 'Giza Pamuğu' },
    nameEn: 'Giza Cotton',
    staple: { en: 'Long and extra-long staple', tr: 'Uzun ve ekstra uzun elyaf' },
    origin: { en: 'Egypt. Giza varieties are bred by Egypt’s Cotton Research Institute.', tr: 'Mısır. Giza çeşitleri Mısır Pamuk Araştırma Enstitüsü tarafından geliştirilir.' },
    fibre: { en: 'Each variety has a number (for example Giza 86 or Giza 94) and its own fibre properties; some are long staple, others extra-long staple.', tr: 'Her çeşidin bir numarası (örneğin Giza 86 veya Giza 94) ve kendine özgü lif özellikleri vardır; bazıları uzun, bazıları ekstra uzun elyaflıdır.' },
    character: { en: 'Prized for fine, strong and lustrous yarns, especially in the extra-long staple varieties.', tr: 'Özellikle ekstra uzun elyaflı çeşitlerde ince, güçlü ve parlak iplikleriyle değerlidir.' },
    quality: {
      en: ['Variety number tells you the fibre class', 'Very fine counts possible in ELS varieties', 'Origin documents available through Egyptian programmes'],
      tr: ['Çeşit numarası lif sınıfını gösterir', 'ELS çeşitlerde çok ince numaralar mümkün', 'Menşe belgeleri Mısır programları üzerinden sağlanabilir'],
    },
    uses: { en: ['Fine shirting', 'Luxury bed linen', 'Premium knitwear'], tr: ['İnce gömleklik', 'Lüks nevresim', 'Premium triko'] },
    difference: { en: 'More specific than "Egyptian cotton": the Giza number names the exact variety.', tr: '"Mısır pamuğu"ndan daha belirgindir: Giza numarası tam çeşidi belirtir.' },
    note: { en: 'Please state the Giza variety you need; availability changes by season.', tr: 'Lütfen ihtiyaç duyduğunuz Giza çeşidini belirtin; bulunabilirlik sezona göre değişir.' },
  },
  {
    slug: 'organic-cotton',
    name: { en: 'Organic Cotton', tr: 'Organik Pamuk' },
    nameEn: 'Organic Cotton',
    staple: { en: 'Depends on the variety', tr: 'Çeşide bağlıdır' },
    origin: { en: 'Grown in several countries, including Türkiye, under organic farming rules.', tr: 'Türkiye dahil birçok ülkede, organik tarım kurallarına göre yetiştirilir.' },
    fibre: { en: 'Any cotton variety can be organic: the difference is how it is grown, not the fibre itself.', tr: 'Her pamuk çeşidi organik olabilir: fark lifin kendisinde değil, nasıl yetiştirildiğindedir.' },
    character: { en: 'Grown without synthetic pesticides and fertilisers and without genetically modified seed.', tr: 'Sentetik pestisit ve gübre kullanılmadan, genetiği değiştirilmemiş tohumla yetiştirilir.' },
    quality: {
      en: ['Fibre quality depends on variety and crop', 'Organic content is verified through certification of the supply chain', 'Certificates are checked per order'],
      tr: ['Lif kalitesi çeşide ve hasada bağlıdır', 'Organik içerik, tedarik zincirinin sertifikasyonuyla doğrulanır', 'Sertifikalar sipariş bazında kontrol edilir'],
    },
    uses: { en: ['Baby clothing', 'Basics and underwear', 'Home textiles', 'Collections with sustainability targets'], tr: ['Bebek giyimi', 'Basic ürünler ve iç giyim', 'Ev tekstili', 'Sürdürülebilirlik hedefli koleksiyonlar'] },
    difference: { en: 'Defined by farming method and certification, not by variety or staple length.', tr: 'Çeşit veya elyaf uzunluğuyla değil, tarım yöntemi ve sertifikasyonla tanımlanır.' },
    note: {
      en: 'We offer yarn as organic only when the spinner provides valid certificates for that yarn. SNTURCO itself does not hold an organic certificate.',
      tr: 'İpliği yalnızca iplikçi o iplik için geçerli sertifikalar sunduğunda organik olarak öneriyoruz. SNTURCO’nun kendisinin organik sertifikası yoktur.',
    },
  },
  {
    slug: 'anatolian-cotton',
    name: { en: 'Anatolian Cotton', tr: 'Anadolu Pamuğu' },
    nameEn: 'Anatolian Cotton',
    staple: { en: 'Medium to long staple', tr: 'Orta ve uzun elyaf' },
    origin: { en: 'Cotton grown across the Anatolian peninsula, for example in the Aegean, Çukurova and Harran plains.', tr: 'Anadolu yarımadasında, örneğin Ege, Çukurova ve Harran ovalarında yetiştirilen pamuk.' },
    fibre: { en: 'Mainly Upland cotton; fibre length and fineness depend on region and variety.', tr: 'Çoğunlukla Upland pamuğu; lif uzunluğu ve inceliği bölgeye ve çeşide göre değişir.' },
    character: { en: 'A regional origin term with a long tradition in Turkish spinning and weaving.', tr: 'Türk iplik ve dokuma geleneğinde köklü bir yeri olan bölgesel menşe tanımı.' },
    quality: {
      en: ['Ask for the region and fibre test data (HVI) with the offer', 'Suitable for a wide range of counts', 'Regional differences in colour and length'],
      tr: ['Teklifle birlikte bölge ve lif test verilerini (HVI) isteyin', 'Geniş bir numara aralığına uygun', 'Renk ve uzunlukta bölgesel farklar'],
    },
    uses: { en: ['Knitting yarns', 'Weaving yarns', 'Towels and home textiles'], tr: ['Örme iplikleri', 'Dokuma iplikleri', 'Havlu ve ev tekstili'] },
    difference: { en: 'An origin description, not a variety or certified standard. Regional names (Aegean, Çukurova, Harran) say more.', tr: 'Bir çeşit veya sertifikalı standart değil, menşe tanımıdır. Bölge adları (Ege, Çukurova, Harran) daha fazla bilgi verir.' },
  },
  {
    slug: 'sea-island-cotton',
    name: { en: 'Sea Island Cotton', tr: 'Sea Island Pamuğu' },
    nameEn: 'Sea Island Cotton',
    staple: { en: 'Extra-long staple', tr: 'Ekstra uzun elyaf' },
    origin: { en: 'Originally the Sea Islands off the US coast; today grown in small quantities in the Caribbean.', tr: 'Aslen ABD kıyısındaki Sea Islands; bugün Karayipler’de küçük miktarlarda yetiştirilir.' },
    fibre: { en: 'Extra-long staple Gossypium barbadense, among the finest and longest cotton fibres.', tr: 'Ekstra uzun elyaflı Gossypium barbadense; en ince ve en uzun pamuk lifleri arasındadır.' },
    character: { en: 'Silky, very fine and rare. Produced in very small volumes.', tr: 'İpeksi, çok ince ve nadir. Çok küçük hacimlerde üretilir.' },
    quality: {
      en: ['Exceptionally fine and long fibres', 'Very smooth, lustrous yarns', 'Limited availability'],
      tr: ['Olağanüstü ince ve uzun lifler', 'Çok pürüzsüz, parlak iplikler', 'Sınırlı bulunabilirlik'],
    },
    uses: { en: ['Luxury shirting', 'Fine knitwear'], tr: ['Lüks gömleklik', 'İnce triko'] },
    difference: { en: 'The rarest cotton in this list. Availability and price are confirmed per request.', tr: 'Bu listedeki en nadir pamuk. Bulunabilirlik ve fiyat talebe göre teyit edilir.' },
  },
];

export const cottonBySlug = Object.fromEntries(cottons.map((c) => [c.slug, c])) as Record<string, Cotton>;

export function cottonImages(slug: string) {
  const base = `/images/cotton/${slug}`;
  return {
    main: `${base}/macro.webp`,
    mainSmall: `${base}/macro-800.webp`,
    gallery: [`${base}/macro.webp`, `${base}/fibres.webp`],
    gallerySmall: [`${base}/macro-800.webp`, `${base}/fibres-800.webp`],
  };
}
