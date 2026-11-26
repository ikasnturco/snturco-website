/**
 * The 14 yarn types shown on the website.
 *
 * To add a product: copy one entry, give it a new `slug`, fill in the texts (en + tr required),
 * add a visual look in src/components/3d/looks.ts and render its images with
 * `npm run render:products -- <slug>` (or put your own photos in public/images/yarns/<slug>/).
 *
 * Texts describe general fibre characteristics. They are not test values: actual properties depend
 * on fibre quality, yarn count, spinning method and finishing.
 */
import type { L, LL } from '@/i18n/config';

export type Category = 'natural' | 'synthetic' | 'regenerated';
/** 1 very low · 2 low · 3 medium · 4 high · 5 very high (general fibre behaviour) */
export type Level = 1 | 2 | 3 | 4 | 5;

export type Product = {
  slug: string;
  name: L;
  nameEn: string;
  category: Category;
  specialty?: boolean;
  tagline: L;
  intro: L;
  source: L;
  structure: L;
  classification: L;
  properties: LL;
  texture: L;
  advantages: LL;
  uses: LL;
  products: LL;
  care: LL;
  note?: L;
  related: string[];
  compare: { moisture: Level; elasticity: Level; durability: Level; texture: L; source: L };
};

export const products: Product[] = [
  {
    slug: 'cotton',
    name: { en: 'Cotton', tr: 'Pamuk' },
    nameEn: 'Cotton',
    category: 'natural',
    tagline: { en: 'Soft, breathable, natural.', tr: 'Yumuşak, nefes alan, doğal.' },
    intro: {
      en: 'The most widely used natural fibre in textiles. Cotton yarn is soft, breathable and comfortable on the skin, and it takes dye well.',
      tr: 'Tekstilde en yaygın kullanılan doğal lif. Pamuk ipliği yumuşaktır, nefes alır, tende rahattır ve boyayı iyi alır.',
    },
    source: { en: 'Seed hairs of the cotton plant (Gossypium).', tr: 'Pamuk bitkisinin (Gossypium) tohum lifleri.' },
    structure: {
      en: 'A cellulose staple fibre with a flat, ribbon-like shape and natural twists (convolutions) that help the fibres hold together in spinning. Staple length ranges from short to extra-long, depending on the variety.',
      tr: 'Yassı, şerit benzeri yapıda ve doğal kıvrımlara sahip selülozik kesikli lif. Bu kıvrımlar eğirmede liflerin birbirine tutunmasını sağlar. Lif uzunluğu çeşide göre kısadan ekstra uzuna kadar değişir.',
    },
    classification: { en: 'Natural · cellulosic (plant)', tr: 'Doğal · selülozik (bitkisel)' },
    properties: {
      en: ['High moisture absorption', 'Good strength, which increases when wet', 'Low elasticity: creases easily', 'Withstands high washing temperatures, depending on dye and finish'],
      tr: ['Yüksek nem emicilik', 'İyi mukavemet; ıslandığında artar', 'Düşük esneklik: kolay kırışır', 'Boya ve apreye bağlı olarak yüksek yıkama sıcaklıklarına dayanır'],
    },
    texture: {
      en: 'Soft and matt. Combed and compact yarns are smooth and clean; carded and open-end yarns are fuller and more rustic.',
      tr: 'Yumuşak ve mat. Penye ve kompakt iplikler pürüzsüz ve temizdir; karde ve open-end iplikler daha dolgun ve rustiktir.',
    },
    advantages: {
      en: ['Comfortable and breathable', 'Absorbs moisture', 'Easy to dye', 'Blends well with polyester, elastane and viscose'],
      tr: ['Rahat ve nefes alır', 'Nemi emer', 'Kolay boyanır', 'Polyester, elastan ve viskonla iyi karışır'],
    },
    uses: { en: ['Apparel', 'Home textiles', 'Workwear', 'Medical and hygiene textiles'], tr: ['Giyim', 'Ev tekstili', 'İş kıyafetleri', 'Medikal ve hijyen tekstilleri'] },
    products: {
      en: ['T-shirts and jersey', 'Underwear', 'Denim', 'Towels and bed linen', 'Shirting'],
      tr: ['Tişört ve süprem', 'İç giyim', 'Denim', 'Havlu ve nevresim', 'Gömleklik kumaş'],
    },
    care: {
      en: ['Usually machine washable', 'May shrink unless pre-shrunk', 'Follow the care label of the finished product'],
      tr: ['Genellikle makinede yıkanabilir', 'Ön çekmezlik yapılmadıysa çekebilir', 'Bitmiş ürünün bakım etiketine uyun'],
    },
    related: ['linen', 'viscose', 'polyester', 'bamboo'],
    compare: {
      moisture: 4,
      elasticity: 2,
      durability: 3,
      texture: { en: 'Soft, matt', tr: 'Yumuşak, mat' },
      source: { en: 'Plant (seed fibre)', tr: 'Bitki (tohum lifi)' },
    },
  },
  {
    slug: 'polyester',
    name: { en: 'Polyester', tr: 'Polyester' },
    nameEn: 'Polyester',
    category: 'synthetic',
    tagline: { en: 'Strong, stable, quick-drying.', tr: 'Dayanıklı, formunu koruyan, hızlı kuruyan.' },
    intro: {
      en: 'The most produced synthetic fibre. Polyester yarn is strong, keeps its shape and dries quickly, on its own or blended with cotton and viscose.',
      tr: 'En çok üretilen sentetik lif. Polyester iplik dayanıklıdır, formunu korur ve hızlı kurur; tek başına veya pamuk ve viskonla karışım halinde kullanılır.',
    },
    source: {
      en: 'Synthetic polymer, mainly polyethylene terephthalate (PET). Recycled polyester is made from PET bottles or textile waste.',
      tr: 'Başta polietilen tereftalat (PET) olmak üzere sentetik polimer. Geri dönüştürülmüş polyester, PET şişelerden veya tekstil atıklarından üretilir.',
    },
    structure: {
      en: 'Produced as continuous filament (flat or textured) or cut into staple fibre for spun yarns. Cross-section and lustre can be engineered: round or trilobal, bright, semi-dull or full dull.',
      tr: 'Sürekli filament (düz veya tekstüre) olarak üretilir ya da eğirme için kesikli life kesilir. Kesit ve parlaklık ayarlanabilir: yuvarlak veya trilobal; parlak, yarı mat veya tam mat.',
    },
    classification: { en: 'Synthetic', tr: 'Sentetik' },
    properties: {
      en: ['High strength and abrasion resistance', 'Low moisture absorption, dries quickly', 'Keeps its shape, resists creasing', 'Can be heat-set; sensitive to very hot ironing'],
      tr: ['Yüksek mukavemet ve aşınma direnci', 'Düşük nem emicilik, hızlı kuruma', 'Formunu korur, kırışmaya dirençlidir', 'Isıyla fikse edilebilir; çok sıcak ütüye duyarlıdır'],
    },
    texture: { en: 'From smooth and bright (filament) to soft and cotton-like (spun or textured).', tr: 'Pürüzsüz ve parlaktan (filament) yumuşak ve pamuksu görünüme (eğrilmiş veya tekstüre) kadar.' },
    advantages: {
      en: ['Durable', 'Easy care', 'Dimensional stability', 'Good value', 'Available as recycled polyester'],
      tr: ['Dayanıklı', 'Kolay bakım', 'Boyutsal stabilite', 'Uygun maliyet', 'Geri dönüştürülmüş seçenekleri mevcut'],
    },
    uses: { en: ['Sportswear', 'Everyday apparel', 'Home textiles', 'Technical textiles', 'Sewing threads'], tr: ['Spor giyim', 'Günlük giyim', 'Ev tekstili', 'Teknik tekstiller', 'Dikiş iplikleri'] },
    products: {
      en: ['Sports and functional garments', 'Linings', 'Curtains and upholstery', 'Polyester/cotton blends', 'Sewing thread'],
      tr: ['Spor ve fonksiyonel giysiler', 'Astarlar', 'Perde ve döşemelik', 'Polyester/pamuk karışımları', 'Dikiş ipliği'],
    },
    care: {
      en: ['Machine washable at moderate temperatures', 'Dries quickly', 'Iron at low temperature'],
      tr: ['Orta sıcaklıkta makinede yıkanabilir', 'Hızlı kurur', 'Düşük ısıda ütülenir'],
    },
    related: ['polyamide', 'cotton', 'viscose', 'acrylic'],
    compare: { moisture: 2, elasticity: 2, durability: 5, texture: { en: 'Smooth to soft', tr: 'Pürüzsüzden yumuşağa' }, source: { en: 'Synthetic polymer (PET)', tr: 'Sentetik polimer (PET)' } },
  },
  {
    slug: 'viscose',
    name: { en: 'Viscose', tr: 'Viskon' },
    nameEn: 'Viscose',
    category: 'regenerated',
    tagline: { en: 'Fluid drape, natural sheen.', tr: 'Akıcı dökümlülük, doğal parlaklık.' },
    intro: {
      en: 'A regenerated cellulose fibre known for its softness, drape and lustre. It feels close to natural fibres and takes colour brilliantly.',
      tr: 'Yumuşaklığı, dökümlülüğü ve parlaklığıyla bilinen rejenere selülozik lif. Doğal liflere yakın bir tutumu vardır ve renkleri canlı alır.',
    },
    source: {
      en: 'Cellulose from wood pulp (for example beech, eucalyptus or pine), dissolved and regenerated into fibre.',
      tr: 'Odun hamurundan (örneğin kayın, okaliptüs veya çam) elde edilen selülozun çözülüp yeniden life dönüştürülmesiyle üretilir.',
    },
    structure: {
      en: 'Regenerated cellulose, produced as filament or as staple fibre. Standard viscose has a serrated cross-section.',
      tr: 'Rejenere selüloz; filament veya kesikli lif olarak üretilir. Standart viskonun kesiti tırtıklıdır.',
    },
    classification: { en: 'Regenerated · man-made cellulosic', tr: 'Rejenere · insan yapımı selülozik' },
    properties: {
      en: ['Very high moisture absorption', 'Lower strength when wet: handle gently in washing', 'Low elasticity', 'Deep, bright colours'],
      tr: ['Çok yüksek nem emicilik', 'Islakken mukavemeti düşer: yıkamada nazik davranılmalı', 'Düşük esneklik', 'Derin ve canlı renkler'],
    },
    texture: { en: 'Smooth, soft and fluid, with a natural sheen (bright or dull versions).', tr: 'Pürüzsüz, yumuşak ve akıcı; doğal bir parlaklığa sahiptir (parlak veya mat versiyonlar).' },
    advantages: {
      en: ['Silky hand at an accessible cost', 'Excellent drape', 'Breathable and cool', 'Rich colours'],
      tr: ['Uygun maliyetle ipeksi tutum', 'Mükemmel dökümlülük', 'Nefes alır, serin tutar', 'Zengin renkler'],
    },
    uses: { en: ['Fashion', 'Apparel', 'Linings', 'Home textiles'], tr: ['Moda', 'Giyim', 'Astarlar', 'Ev tekstili'] },
    products: { en: ['Dresses and blouses', 'Jersey and knitwear', 'Linings', 'Scarves'], tr: ['Elbise ve bluzlar', 'Süprem ve triko', 'Astarlar', 'Eşarplar'] },
    care: {
      en: ['Gentle wash or as labelled', 'Can shrink', 'Do not wring when wet'],
      tr: ['Nazik yıkama veya etikete göre', 'Çekebilir', 'Islakken sıkmayın'],
    },
    related: ['bamboo', 'silk', 'cotton', 'polyester'],
    compare: { moisture: 5, elasticity: 2, durability: 2, texture: { en: 'Smooth, lustrous', tr: 'Pürüzsüz, parlak' }, source: { en: 'Wood pulp cellulose', tr: 'Odun hamuru selülozu' } },
  },
  {
    slug: 'acrylic',
    name: { en: 'Acrylic', tr: 'Akrilik' },
    nameEn: 'Acrylic',
    category: 'synthetic',
    tagline: { en: 'Light warmth, lasting colour.', tr: 'Hafif sıcaklık, kalıcı renk.' },
    intro: {
      en: 'A synthetic fibre developed as a light, warm alternative to wool. Acrylic yarns are bulky, soft and hold bright colours.',
      tr: 'Yüne hafif ve sıcak bir alternatif olarak geliştirilmiş sentetik lif. Akrilik iplikler hacimli, yumuşaktır ve canlı renkleri korur.',
    },
    source: { en: 'Synthetic polymer based on acrylonitrile.', tr: 'Akrilonitril bazlı sentetik polimer.' },
    structure: {
      en: 'Mostly staple fibre spun into yarn. High-bulk acrylic combines shrinkable and non-shrinkable fibres to create a lofty yarn.',
      tr: 'Çoğunlukla kesikli lif olarak eğrilir. Yüksek hacimli (high-bulk) akrilikte çeken ve çekmeyen lifler birlikte kullanılarak kabarık bir iplik elde edilir.',
    },
    classification: { en: 'Synthetic', tr: 'Sentetik' },
    properties: {
      en: ['Low moisture absorption', 'Good bulk and warmth for its weight', 'Good resistance to sunlight', 'May pill, depending on yarn and fabric'],
      tr: ['Düşük nem emicilik', 'Ağırlığına göre iyi hacim ve sıcaklık', 'Güneş ışığına iyi direnç', 'İplik ve kumaşa bağlı olarak boncuklanabilir'],
    },
    texture: { en: 'Soft, warm and wool-like; fluffy or smooth.', tr: 'Yumuşak, sıcak ve yün benzeri; kabarık veya düzgün.' },
    advantages: {
      en: ['Lightweight warmth', 'Bright, lasting colours', 'Easy care', 'Cost-effective alternative and blend partner for wool'],
      tr: ['Hafif ama sıcak', 'Canlı ve kalıcı renkler', 'Kolay bakım', 'Yüne ekonomik alternatif ve karışım partneri'],
    },
    uses: { en: ['Knitwear', 'Hosiery', 'Home textiles', 'Outdoor textiles'], tr: ['Triko', 'Çorap', 'Ev tekstili', 'Dış mekân tekstilleri'] },
    products: {
      en: ['Sweaters and cardigans', 'Socks', 'Blankets and throws', 'Beanies and scarves', 'Awning fabric (solution-dyed)'],
      tr: ['Kazak ve hırkalar', 'Çoraplar', 'Battaniye ve şallar', 'Bere ve atkılar', 'Tente kumaşı (çözeltide boyalı)'],
    },
    care: { en: ['Usually machine washable', 'Low heat', 'Avoid hot tumble drying'], tr: ['Genellikle makinede yıkanabilir', 'Düşük ısı', 'Yüksek ısıda kurutmadan kaçının'] },
    related: ['wool', 'polyester', 'cotton'],
    compare: { moisture: 2, elasticity: 3, durability: 3, texture: { en: 'Soft, warm, bulky', tr: 'Yumuşak, sıcak, hacimli' }, source: { en: 'Synthetic polymer (acrylonitrile)', tr: 'Sentetik polimer (akrilonitril)' } },
  },
  {
    slug: 'nylon',
    name: { en: 'Nylon', tr: 'Naylon' },
    nameEn: 'Nylon',
    category: 'synthetic',
    tagline: { en: 'Light, elastic, abrasion-resistant.', tr: 'Hafif, esnek, aşınmaya dayanıklı.' },
    intro: {
      en: 'Nylon is the common name for a family of synthetic polyamides. It was the first fully synthetic fibre and is known for strong, elastic and abrasion-resistant yarns.',
      tr: 'Naylon, sentetik poliamid ailesinin yaygın adıdır. İlk tamamen sentetik liftir; güçlü, esnek ve aşınmaya dayanıklı iplikleriyle bilinir.',
    },
    source: { en: 'Synthetic polyamide, mainly polyamide 6 (PA 6) and polyamide 6.6 (PA 6.6).', tr: 'Sentetik poliamid; başlıca poliamid 6 (PA 6) ve poliamid 6.6 (PA 6.6).' },
    structure: {
      en: 'Mostly continuous filament, flat or textured, and also staple fibre. Smooth, usually round fibres.',
      tr: 'Çoğunlukla düz veya tekstüre sürekli filament, ayrıca kesikli lif. Pürüzsüz, genellikle yuvarlak kesitli lifler.',
    },
    classification: { en: 'Synthetic · polyamide', tr: 'Sentetik · poliamid' },
    note: {
      en: 'Nylon and polyamide: every nylon is a polyamide. "Nylon" is the everyday name for the synthetic polyamides PA 6 and PA 6.6. In EU fibre labelling these fibres are named "polyamide".',
      tr: 'Naylon ve poliamid: her naylon bir poliamiddir. "Naylon", sentetik poliamidler PA 6 ve PA 6.6 için kullanılan gündelik addır. AB lif etiketlemesinde bu lifler "poliamid" olarak adlandırılır.',
    },
    properties: {
      en: ['Very high abrasion resistance and strength', 'Good elasticity and recovery', 'Low moisture absorption, dries quickly', 'Lightweight'],
      tr: ['Çok yüksek aşınma direnci ve mukavemet', 'İyi esneklik ve geri dönüş', 'Düşük nem emicilik, hızlı kuruma', 'Hafif'],
    },
    texture: { en: 'Smooth, from glossy to matt; soft when textured.', tr: 'Pürüzsüz; parlaktan mata; tekstüre edildiğinde yumuşak.' },
    advantages: {
      en: ['Durability at low weight', 'Elastic recovery', 'Very fine, sheer yarns are possible', 'Quick drying'],
      tr: ['Düşük ağırlıkta yüksek dayanım', 'Elastik geri dönüş', 'Çok ince, transparan iplikler mümkün', 'Hızlı kuruma'],
    },
    uses: { en: ['Hosiery and lingerie', 'Sportswear and swimwear', 'Outdoor', 'Technical textiles'], tr: ['Çorap ve iç çamaşırı', 'Spor ve mayo', 'Outdoor', 'Teknik tekstiller'] },
    products: { en: ['Tights and socks', 'Swimwear', 'Activewear', 'Windbreakers and bags', 'Cord and webbing'], tr: ['Külotlu çorap ve çoraplar', 'Mayo', 'Aktif giyim', 'Rüzgârlık ve çantalar', 'Kordon ve dokuma şerit'] },
    care: { en: ['Machine wash at low to moderate temperature', 'Iron at low temperature'], tr: ['Düşük-orta sıcaklıkta makinede yıkama', 'Düşük ısıda ütü'] },
    related: ['polyamide', 'elastane', 'polyester'],
    compare: { moisture: 2, elasticity: 4, durability: 5, texture: { en: 'Smooth, glossy to matt', tr: 'Pürüzsüz, parlak-mat' }, source: { en: 'Synthetic polyamide', tr: 'Sentetik poliamid' } },
  },
  {
    slug: 'wool',
    name: { en: 'Wool', tr: 'Yün' },
    nameEn: 'Wool',
    category: 'natural',
    tagline: { en: 'Warm, elastic, naturally crimped.', tr: 'Sıcak, esnek, doğal kıvrımlı.' },
    intro: {
      en: 'An animal fibre, mainly from sheep, valued for its warmth, natural elasticity and the way it handles moisture.',
      tr: 'Başta koyun olmak üzere hayvansal kökenli lif; sıcaklığı, doğal esnekliği ve nemi yönetme biçimiyle değerlidir.',
    },
    source: { en: 'Fleece of sheep. Merino is the best-known fine wool.', tr: 'Koyun yapağısı. Merinos en bilinen ince yündür.' },
    structure: {
      en: 'A protein fibre (keratin) with a scaly surface and natural crimp. Fineness ranges from very fine merino to coarse carpet wool.',
      tr: 'Pullu bir yüzeye ve doğal kıvırcıklığa sahip protein lif (keratin). İncelik, çok ince merinostan kalın halı yününe kadar değişir.',
    },
    classification: { en: 'Natural · protein (animal)', tr: 'Doğal · protein (hayvansal)' },
    properties: {
      en: ['Very high moisture absorption while still feeling dry', 'Elastic, recovers from creasing', 'Good insulation', 'Can felt and shrink with heat, moisture and agitation unless treated'],
      tr: ['Kuru hissettirirken çok yüksek nem emicilik', 'Esnek, kırışıklıktan toparlanır', 'İyi ısı yalıtımı', 'İşlem görmemişse ısı, nem ve sürtünmeyle keçeleşip çekebilir'],
    },
    texture: { en: 'From soft and fine to crisp and coarse, with natural bulk.', tr: 'Yumuşak ve inceden sert ve kalına kadar; doğal hacimli.' },
    advantages: {
      en: ['Warmth', 'Comfort across temperatures', 'Elastic recovery', 'Renewable natural fibre'],
      tr: ['Sıcaklık', 'Farklı sıcaklıklarda konfor', 'Elastik toparlanma', 'Yenilenebilir doğal lif'],
    },
    uses: { en: ['Knitwear', 'Suiting', 'Outerwear', 'Carpets and interiors'], tr: ['Triko', 'Takım elbiselik', 'Dış giyim', 'Halı ve iç mekân'] },
    products: { en: ['Sweaters', 'Suits and coats', 'Socks', 'Blankets', 'Carpets'], tr: ['Kazaklar', 'Takım elbise ve paltolar', 'Çoraplar', 'Battaniyeler', 'Halılar'] },
    care: { en: ['Hand wash or wool cycle in cool water', 'Dry flat', 'Machine washable only if treated'], tr: ['Elde veya yün programında soğuk suda yıkama', 'Sererek kurutun', 'Yalnızca işlem görmüşse makinede yıkanır'] },
    related: ['acrylic', 'silk', 'cotton'],
    compare: { moisture: 5, elasticity: 4, durability: 3, texture: { en: 'Crimped, warm, soft to coarse', tr: 'Kıvırcık, sıcak, yumuşaktan serte' }, source: { en: 'Animal (sheep fleece)', tr: 'Hayvansal (koyun yapağısı)' } },
  },
  {
    slug: 'silk',
    name: { en: 'Silk', tr: 'İpek' },
    nameEn: 'Silk',
    category: 'natural',
    specialty: true,
    tagline: { en: 'Lustre, smoothness, fine drape.', tr: 'Parlaklık, pürüzsüzlük, zarif döküm.' },
    intro: {
      en: 'A natural protein filament produced by silkworms, prized for its lustre, smoothness and fine drape.',
      tr: 'İpek böceklerinin ürettiği doğal protein filament; parlaklığı, pürüzsüzlüğü ve zarif dökümüyle değerlidir.',
    },
    source: {
      en: 'Cocoons of the cultivated silkworm (mainly Bombyx mori). Wild silks such as tussah also exist.',
      tr: 'Kültür ipek böceğinin (başlıca Bombyx mori) kozaları. Tussah gibi yabani ipekler de vardır.',
    },
    structure: {
      en: 'A very fine continuous protein filament (fibroin) with a roughly triangular cross-section that reflects light. Spun silk is made from shorter fibres.',
      tr: 'Işığı yansıtan, yaklaşık üçgen kesitli, çok ince sürekli protein filament (fibroin). Şappe ipeği daha kısa liflerden eğrilir.',
    },
    classification: { en: 'Natural · protein (animal) filament', tr: 'Doğal · protein (hayvansal) filament' },
    properties: {
      en: ['Strong for its fineness', 'Good moisture absorption', 'Moderate elasticity', 'Sensitive to strong light, perspiration and harsh detergents'],
      tr: ['İnceliğine göre güçlü', 'İyi nem emicilik', 'Orta düzeyde esneklik', 'Güçlü ışık, ter ve sert deterjanlara duyarlı'],
    },
    texture: { en: 'Smooth, lustrous and fluid. Spun silk is softer and less shiny.', tr: 'Pürüzsüz, parlak ve akıcı. Şappe ipeği daha yumuşak ve daha az parlaktır.' },
    advantages: { en: ['Unique lustre', 'Light, smooth hand', 'Comfortable to wear', 'Rich colours'], tr: ['Eşsiz parlaklık', 'Hafif, pürüzsüz tutum', 'Giyim konforu', 'Zengin renkler'] },
    uses: { en: ['Luxury apparel', 'Accessories', 'Interiors'], tr: ['Lüks giyim', 'Aksesuar', 'İç mekân'] },
    products: { en: ['Blouses and dresses', 'Ties and scarves', 'Lingerie', 'Embroidery thread', 'Upholstery'], tr: ['Bluz ve elbiseler', 'Kravat ve eşarplar', 'İç çamaşırı', 'Nakış ipliği', 'Döşemelik'] },
    care: { en: ['Hand wash or dry clean', 'Use a mild detergent', 'Dry away from direct sunlight'], tr: ['Elde yıkama veya kuru temizleme', 'Hafif deterjan kullanın', 'Doğrudan güneş ışığından uzakta kurutun'] },
    related: ['viscose', 'wool', 'linen'],
    compare: { moisture: 4, elasticity: 3, durability: 4, texture: { en: 'Smooth, lustrous', tr: 'Pürüzsüz, parlak' }, source: { en: 'Animal (silkworm cocoon)', tr: 'Hayvansal (ipek böceği kozası)' } },
  },
  {
    slug: 'linen',
    name: { en: 'Linen', tr: 'Keten' },
    nameEn: 'Linen',
    category: 'natural',
    specialty: true,
    tagline: { en: 'Cool, strong, characterful.', tr: 'Serin, güçlü, karakterli.' },
    intro: {
      en: 'Linen comes from the flax plant. It is one of the oldest textile fibres: cool, strong and with a characteristic natural texture.',
      tr: 'Keten, keten bitkisinden elde edilir. En eski tekstil liflerinden biridir: serin, güçlü ve kendine özgü doğal bir dokuya sahiptir.',
    },
    source: { en: 'Bast fibres from the stem of the flax plant (Linum usitatissimum).', tr: 'Keten bitkisinin (Linum usitatissimum) gövdesinden elde edilen sap lifleri.' },
    structure: {
      en: 'Long cellulose bast fibres in bundles, with nodes along the fibre. Linen yarns show natural thick and thin places (slubs).',
      tr: 'Demetler halinde, boyunca boğumlar bulunan uzun selülozik sap lifleri. Keten ipliklerinde doğal kalın-ince yerler (flamlar) görülür.',
    },
    classification: { en: 'Natural · cellulosic (bast)', tr: 'Doğal · selülozik (sap lifi)' },
    properties: {
      en: ['Very strong, and stronger when wet', 'High moisture absorption, dries quickly', 'Low elasticity: creases easily', 'Conducts heat well, so it feels cool'],
      tr: ['Çok güçlü; ıslakken daha da güçlü', 'Yüksek nem emicilik, hızlı kuruma', 'Düşük esneklik: kolay kırışır', 'Isıyı iyi iletir, serin hissettirir'],
    },
    texture: { en: 'Crisp, dry hand with natural slubs and a subtle sheen. Softens with washing.', tr: 'Doğal flamlı, hafif parlak, kuru ve diri bir tutum. Yıkandıkça yumuşar.' },
    advantages: { en: ['Cool and breathable', 'Strong and durable', 'Natural character', 'Blends well with cotton and viscose'], tr: ['Serin ve nefes alır', 'Güçlü ve dayanıklı', 'Doğal karakter', 'Pamuk ve viskonla iyi karışır'] },
    uses: { en: ['Summer apparel', 'Home textiles', 'Table and bed linen'], tr: ['Yazlık giyim', 'Ev tekstili', 'Masa ve yatak örtüleri'] },
    products: { en: ['Shirts and trousers', 'Dresses', 'Tablecloths and napkins', 'Bed linen', 'Curtains'], tr: ['Gömlek ve pantolonlar', 'Elbiseler', 'Masa örtüsü ve peçeteler', 'Nevresim', 'Perdeler'] },
    care: { en: ['Machine or hand wash as labelled', 'Iron while damp', 'Creasing is part of its character'], tr: ['Etikete göre makinede veya elde yıkama', 'Nemliyken ütüleyin', 'Kırışıklık doğasının bir parçasıdır'] },
    related: ['hemp', 'cotton', 'viscose'],
    compare: { moisture: 4, elasticity: 1, durability: 4, texture: { en: 'Crisp, slubby, cool', tr: 'Diri, flamlı, serin' }, source: { en: 'Plant (flax stem)', tr: 'Bitki (keten sapı)' } },
  },
  {
    slug: 'bamboo',
    name: { en: 'Bamboo', tr: 'Bambu' },
    nameEn: 'Bamboo',
    category: 'regenerated',
    specialty: true,
    tagline: { en: 'Silky softness from bamboo cellulose.', tr: 'Bambu selülozundan ipeksi yumuşaklık.' },
    intro: {
      en: 'Bamboo yarn is made from the bamboo plant, but the way it is made matters. Most bamboo yarn on the market is a regenerated fibre (bamboo viscose or lyocell); mechanically processed bamboo fibre is much rarer.',
      tr: 'Bambu ipliği bambu bitkisinden üretilir, ancak üretim yöntemi belirleyicidir. Piyasadaki bambu ipliklerinin çoğu rejenere liftir (bambu viskon veya liyosel); mekanik yöntemle elde edilen bambu lifi çok daha nadirdir.',
    },
    source: { en: 'Cellulose from bamboo.', tr: 'Bambu selülozu.' },
    structure: {
      en: 'Regenerated route: bamboo pulp is dissolved and spun like viscose or lyocell. Mechanical route: bast-like fibres are separated from the plant, similar to linen.',
      tr: 'Rejenere yöntem: bambu hamuru çözülür ve viskon veya liyosel gibi lif çekilir. Mekanik yöntem: bitkiden, ketene benzer sap lifleri ayrıştırılır.',
    },
    classification: { en: 'Usually regenerated (viscose or lyocell); natural when mechanically processed', tr: 'Genellikle rejenere (viskon veya liyosel); mekanik işlenmişse doğal' },
    note: {
      en: 'Production method matters. Regenerated bamboo behaves like viscose or lyocell, and in the EU it is labelled with the fibre name (for example viscose) rather than just "bamboo".',
      tr: 'Üretim yöntemi önemlidir. Rejenere bambu, viskon veya liyosel gibi davranır ve AB’de yalnızca "bambu" olarak değil, lif adıyla (örneğin viskon) etiketlenir.',
    },
    properties: {
      en: ['Very high moisture absorption (regenerated)', 'Soft and smooth', 'Lower strength when wet', 'Low elasticity'],
      tr: ['Çok yüksek nem emicilik (rejenere)', 'Yumuşak ve pürüzsüz', 'Islakken mukavemeti düşer', 'Düşük esneklik'],
    },
    texture: { en: 'Smooth, soft and cool, with a light sheen.', tr: 'Pürüzsüz, yumuşak ve serin; hafif parlak.' },
    advantages: { en: ['Silky softness', 'Good drape', 'Breathable', 'Blends with cotton and elastane'], tr: ['İpeksi yumuşaklık', 'İyi dökümlülük', 'Nefes alır', 'Pamuk ve elastanla karışır'] },
    uses: { en: ['Apparel', 'Underwear', 'Baby textiles', 'Home textiles'], tr: ['Giyim', 'İç giyim', 'Bebek tekstili', 'Ev tekstili'] },
    products: { en: ['T-shirts', 'Socks and underwear', 'Baby clothing', 'Towels and bedding'], tr: ['Tişörtler', 'Çorap ve iç çamaşırı', 'Bebek giyimi', 'Havlu ve yatak tekstili'] },
    care: { en: ['Gentle wash at low temperature', 'Avoid hot tumble drying'], tr: ['Düşük sıcaklıkta nazik yıkama', 'Yüksek ısıda kurutmadan kaçının'] },
    related: ['viscose', 'cotton', 'linen'],
    compare: { moisture: 5, elasticity: 2, durability: 2, texture: { en: 'Smooth, soft, light sheen', tr: 'Pürüzsüz, yumuşak, hafif parlak' }, source: { en: 'Bamboo cellulose', tr: 'Bambu selülozu' } },
  },
  {
    slug: 'elastane',
    name: { en: 'Elastane', tr: 'Elastan' },
    nameEn: 'Elastane',
    category: 'synthetic',
    tagline: { en: 'Stretch and recovery.', tr: 'Esneme ve geri dönüş.' },
    intro: {
      en: 'A synthetic fibre that stretches to several times its length and springs back. It is almost always used in small amounts together with other fibres.',
      tr: 'Boyunun birkaç katına kadar uzayıp eski haline dönebilen sentetik lif. Neredeyse her zaman diğer liflerle birlikte, küçük oranlarda kullanılır.',
    },
    source: { en: 'Synthetic segmented polyurethane.', tr: 'Sentetik segmentli poliüretan.' },
    structure: {
      en: 'Continuous elastic filament, usually coalesced multifilament. Used bare, covered by another yarn, or as the core of core-spun yarns.',
      tr: 'Sürekli elastik filament; genellikle birleşik çok filamentli. Çıplak, başka bir iplikle sarılmış (kaplanmış) veya core-spun ipliklerin özü olarak kullanılır.',
    },
    classification: { en: 'Synthetic · known as spandex in North America', tr: 'Sentetik · Kuzey Amerika’da spandeks olarak bilinir' },
    properties: {
      en: ['Very high elasticity and recovery', 'Lightweight', 'Low moisture absorption', 'Sensitive to chlorine and high heat'],
      tr: ['Çok yüksek esneklik ve geri dönüş', 'Hafif', 'Düşük nem emicilik', 'Klor ve yüksek ısıya duyarlı'],
    },
    texture: { en: 'Not felt on its own: it gives fabrics stretch, fit and recovery.', tr: 'Tek başına hissedilmez; kumaşa esneklik, oturuş ve geri dönüş kazandırır.' },
    advantages: { en: ['Comfort stretch and fit', 'Shape recovery', 'Freedom of movement', 'Effective in small percentages'], tr: ['Konforlu esneme ve oturuş', 'Formuna dönme', 'Hareket özgürlüğü', 'Düşük oranlarda bile etkili'] },
    uses: { en: ['Stretch apparel', 'Sportswear', 'Hosiery', 'Medical textiles'], tr: ['Esnek giyim', 'Spor giyim', 'Çorap', 'Medikal tekstiller'] },
    products: { en: ['Stretch denim', 'Leggings and activewear', 'Swimwear', 'Socks and hosiery', 'Underwear'], tr: ['Esnek denim', 'Tayt ve aktif giyim', 'Mayo', 'Çorap ve külotlu çorap', 'İç çamaşırı'] },
    care: { en: ['Wash at low temperature', 'No chlorine bleach', 'Low dryer heat'], tr: ['Düşük sıcaklıkta yıkayın', 'Klorlu ağartıcı kullanmayın', 'Düşük ısıda kurutun'] },
    related: ['lycra', 'polyamide', 'cotton'],
    compare: { moisture: 1, elasticity: 5, durability: 3, texture: { en: 'Smooth (used in blends)', tr: 'Pürüzsüz (karışımda kullanılır)' }, source: { en: 'Synthetic polyurethane', tr: 'Sentetik poliüretan' } },
  },
  {
    slug: 'lycra',
    name: { en: 'Lycra', tr: 'Likra' },
    nameEn: 'Lycra',
    category: 'synthetic',
    tagline: { en: 'A brand name for elastane.', tr: 'Elastan için bir marka adı.' },
    intro: {
      en: 'LYCRA® is a registered trademark of The LYCRA Company for its elastane fibres. It is not a separate fibre type: LYCRA® fibre is a branded elastane.',
      tr: 'LYCRA®, The LYCRA Company’nin elastan lifleri için tescilli markasıdır. Ayrı bir lif türü değildir: LYCRA® lifi markalı bir elastandır.',
    },
    source: { en: 'Branded elastane (segmented polyurethane).', tr: 'Markalı elastan (segmentli poliüretan).' },
    structure: {
      en: 'Like other elastane: a continuous elastic filament used bare, covered or core-spun.',
      tr: 'Diğer elastanlar gibi: çıplak, kaplanmış veya core-spun olarak kullanılan sürekli elastik filament.',
    },
    classification: { en: 'Synthetic · elastane (trademark)', tr: 'Sentetik · elastan (ticari marka)' },
    note: {
      en: 'Trademark: in everyday language "lycra" is often used for any stretch fibre. Fabric labels give the generic fibre name, elastane. SNTURCO is not affiliated with The LYCRA Company; branded fibre is available only through producers authorised by the brand owner.',
      tr: 'Ticari marka: günlük dilde "likra" her türlü esnek lif için kullanılır. Kumaş etiketlerinde genel lif adı olan elastan yazılır. SNTURCO’nun The LYCRA Company ile bir bağlantısı yoktur; markalı lif yalnızca marka sahibinin yetkilendirdiği üreticiler üzerinden temin edilebilir.',
    },
    properties: {
      en: ['Very high elasticity and recovery', 'Lightweight', 'Sensitive to chlorine and high heat', 'Supplied to the brand owner’s specifications'],
      tr: ['Çok yüksek esneklik ve geri dönüş', 'Hafif', 'Klor ve yüksek ısıya duyarlı', 'Marka sahibinin spesifikasyonlarına göre üretilir'],
    },
    texture: { en: 'Not felt on its own: gives fabrics stretch and shape retention.', tr: 'Tek başına hissedilmez; kumaşa esneklik ve form koruma sağlar.' },
    advantages: { en: ['Recognised brand for stretch', 'Consistent elastic performance', 'Comfort and fit', 'Effective in small percentages'], tr: ['Esneklikte tanınan marka', 'Tutarlı elastik performans', 'Konfor ve oturuş', 'Düşük oranlarda etkili'] },
    uses: { en: ['Shapewear', 'Activewear', 'Swimwear', 'Denim', 'Hosiery'], tr: ['Korse ve şekillendirici giyim', 'Aktif giyim', 'Mayo', 'Denim', 'Çorap'] },
    products: { en: ['Shapewear', 'Leggings', 'Swimsuits', 'Stretch jeans', 'Tights'], tr: ['Şekillendirici iç giyim', 'Taytlar', 'Mayolar', 'Esnek kot pantolon', 'Külotlu çoraplar'] },
    care: { en: ['Wash at low temperature', 'No chlorine bleach', 'Low dryer heat'], tr: ['Düşük sıcaklıkta yıkayın', 'Klorlu ağartıcı kullanmayın', 'Düşük ısıda kurutun'] },
    related: ['elastane', 'polyamide', 'nylon'],
    compare: { moisture: 1, elasticity: 5, durability: 3, texture: { en: 'Smooth (used in blends)', tr: 'Pürüzsüz (karışımda kullanılır)' }, source: { en: 'Branded elastane', tr: 'Markalı elastan' } },
  },
  {
    slug: 'polyamide',
    name: { en: 'Polyamide', tr: 'Poliamid' },
    nameEn: 'Polyamide',
    category: 'synthetic',
    tagline: { en: 'Fine, strong and soft.', tr: 'İnce, güçlü ve yumuşak.' },
    intro: {
      en: 'Polyamide is the chemical family name of nylon fibres and the standard term in European fibre labelling. Polyamide yarns are strong, light and elastic.',
      tr: 'Poliamid, naylon liflerinin kimyasal aile adıdır ve Avrupa lif etiketlemesinde standart terimdir. Poliamid iplikler güçlü, hafif ve esnektir.',
    },
    source: {
      en: 'Synthetic polymers with amide links, mainly PA 6 and PA 6.6. Recycled polyamide from industrial and post-consumer waste is also available.',
      tr: 'Amid bağlı sentetik polimerler, başlıca PA 6 ve PA 6.6. Endüstriyel ve tüketici sonrası atıklardan geri dönüştürülmüş poliamid de mevcuttur.',
    },
    structure: {
      en: 'Continuous filament (flat, textured or air-covered with elastane) and staple fibre.',
      tr: 'Sürekli filament (düz, tekstüre veya elastanla hava jetiyle kaplanmış) ve kesikli lif.',
    },
    classification: { en: 'Synthetic', tr: 'Sentetik' },
    note: {
      en: 'Polyamide and nylon describe the same family of fibres: "nylon" is the everyday name, "polyamide" the generic name used on EU labels.',
      tr: 'Poliamid ve naylon aynı lif ailesini tanımlar: "naylon" gündelik ad, "poliamid" ise AB etiketlerinde kullanılan genel addır.',
    },
    properties: {
      en: ['Very high abrasion resistance', 'Good elasticity and recovery', 'Low moisture absorption, dries quickly', 'Light and fine'],
      tr: ['Çok yüksek aşınma direnci', 'İyi esneklik ve geri dönüş', 'Düşük nem emicilik, hızlı kuruma', 'Hafif ve ince'],
    },
    texture: { en: 'Smooth and soft; very fine and sheer, or matt and cotton-like.', tr: 'Pürüzsüz ve yumuşak; çok ince ve transparan ya da mat ve pamuksu.' },
    advantages: { en: ['Durable at low weight', 'Combines well with elastane for stretch', 'Quick drying', 'Soft hand in fine counts'], tr: ['Düşük ağırlıkta dayanıklı', 'Esneklik için elastanla iyi birleşir', 'Hızlı kuruma', 'İnce numaralarda yumuşak tutum'] },
    uses: { en: ['Hosiery', 'Lingerie', 'Sportswear', 'Technical textiles'], tr: ['Çorap', 'İç çamaşırı', 'Spor giyim', 'Teknik tekstiller'] },
    products: { en: ['Seamless garments', 'Lingerie', 'Hosiery', 'Sportswear', 'Outdoor clothing'], tr: ['Dikişsiz giysiler', 'İç çamaşırı', 'Çorap', 'Spor giyim', 'Outdoor giyim'] },
    care: { en: ['Machine wash at low to moderate temperature', 'Iron at low temperature'], tr: ['Düşük-orta sıcaklıkta makinede yıkama', 'Düşük ısıda ütü'] },
    related: ['nylon', 'elastane', 'polyester'],
    compare: { moisture: 2, elasticity: 4, durability: 5, texture: { en: 'Smooth, soft', tr: 'Pürüzsüz, yumuşak' }, source: { en: 'Synthetic polyamide', tr: 'Sentetik poliamid' } },
  },
  {
    slug: 'polypropylene',
    name: { en: 'Polypropylene', tr: 'Polipropilen' },
    nameEn: 'Polypropylene',
    category: 'synthetic',
    tagline: { en: 'The lightest textile fibre.', tr: 'En hafif tekstil lifi.' },
    intro: {
      en: 'The lightest of the common textile fibres. Polypropylene floats on water, absorbs almost no moisture and resists many chemicals.',
      tr: 'Yaygın tekstil lifleri arasında en hafifi. Polipropilen suda yüzer, neredeyse hiç nem emmez ve birçok kimyasala dayanır.',
    },
    source: { en: 'Synthetic polyolefin made from propylene.', tr: 'Propilenden üretilen sentetik poliolefin.' },
    structure: {
      en: 'Multifilament, monofilament, staple or flat tape yarns. Usually solution-dyed: the colour is added before spinning.',
      tr: 'Çok filamentli, tek filamentli, kesikli lif veya yassı bant iplikler. Genellikle çözeltide boyanır: renk, lif çekiminden önce eklenir.',
    },
    classification: { en: 'Synthetic · polyolefin', tr: 'Sentetik · poliolefin' },
    properties: {
      en: ['Very low density', 'Absorbs almost no moisture; moves moisture away', 'Good chemical resistance', 'Low melting point: sensitive to heat', 'Needs UV stabilisation for outdoor use'],
      tr: ['Çok düşük yoğunluk', 'Neredeyse hiç nem emmez; nemi uzaklaştırır', 'İyi kimyasal direnç', 'Düşük erime noktası: ısıya duyarlı', 'Dış mekân için UV stabilizasyonu gerekir'],
    },
    texture: { en: 'Smooth to waxy, light.', tr: 'Pürüzsüzden mumsuya; hafif.' },
    advantages: { en: ['Very light', 'Quick drying', 'Stain and chemical resistant', 'Colourfast when solution-dyed'], tr: ['Çok hafif', 'Hızlı kuruma', 'Leke ve kimyasallara dayanıklı', 'Çözeltide boyandığında renk haslığı yüksek'] },
    uses: { en: ['Technical textiles', 'Base layers', 'Carpets and upholstery', 'Packaging', 'Ropes'], tr: ['Teknik tekstiller', 'İçlik (base layer)', 'Halı ve döşemelik', 'Ambalaj', 'Halatlar'] },
    products: { en: ['Thermal underwear', 'Big bags (FIBC)', 'Carpets', 'Ropes and nets', 'Nonwovens'], tr: ['Termal içlik', 'Big bag (FIBC)', 'Halılar', 'Halat ve ağlar', 'Dokusuz yüzeyler'] },
    care: { en: ['Wash at low temperature', 'Do not iron hot', 'Avoid high-heat drying'], tr: ['Düşük sıcaklıkta yıkayın', 'Sıcak ütü yapmayın', 'Yüksek ısıda kurutmayın'] },
    related: ['polyester', 'polyamide', 'acrylic'],
    compare: { moisture: 1, elasticity: 2, durability: 4, texture: { en: 'Smooth, waxy, light', tr: 'Pürüzsüz, mumsu, hafif' }, source: { en: 'Synthetic polyolefin', tr: 'Sentetik poliolefin' } },
  },
  {
    slug: 'hemp',
    name: { en: 'Hemp', tr: 'Kenevir' },
    nameEn: 'Hemp',
    category: 'natural',
    specialty: true,
    tagline: { en: 'Strong, rustic, long-lasting.', tr: 'Güçlü, rustik, uzun ömürlü.' },
    intro: {
      en: 'A strong bast fibre from the stem of the hemp plant. Hemp yarns have a natural, rustic character and become softer with use.',
      tr: 'Kenevir bitkisinin sapından elde edilen güçlü bir sap lifi. Kenevir ipliklerinin doğal, rustik bir karakteri vardır ve kullandıkça yumuşar.',
    },
    source: { en: 'Bast fibres of industrial hemp (Cannabis sativa) grown for fibre.', tr: 'Lif için yetiştirilen endüstriyel kenevirin (Cannabis sativa) sap lifleri.' },
    structure: {
      en: 'Long, coarse cellulose bast fibres in bundles. Often blended with cotton to make softer yarns.',
      tr: 'Demetler halinde uzun ve kalın selülozik sap lifleri. Daha yumuşak iplikler için sıklıkla pamukla karıştırılır.',
    },
    classification: { en: 'Natural · cellulosic (bast)', tr: 'Doğal · selülozik (sap lifi)' },
    properties: {
      en: ['Very high strength', 'High moisture absorption', 'Very low elasticity', 'Durable in use'],
      tr: ['Çok yüksek mukavemet', 'Yüksek nem emicilik', 'Çok düşük esneklik', 'Kullanımda dayanıklı'],
    },
    texture: { en: 'Coarse and firm, similar to linen; softens with washing.', tr: 'Kalın ve sıkı, ketene benzer; yıkandıkça yumuşar.' },
    advantages: { en: ['Durable', 'Breathable', 'Natural textured look', 'Good blend partner for cotton'], tr: ['Dayanıklı', 'Nefes alır', 'Doğal dokulu görünüm', 'Pamukla iyi karışım partneri'] },
    uses: { en: ['Apparel', 'Home textiles', 'Bags and accessories', 'Technical uses'], tr: ['Giyim', 'Ev tekstili', 'Çanta ve aksesuar', 'Teknik kullanımlar'] },
    products: { en: ['Shirts and trousers', 'Denim blends', 'Bags', 'Rugs', 'Home textiles'], tr: ['Gömlek ve pantolonlar', 'Denim karışımları', 'Çantalar', 'Kilim ve halılar', 'Ev tekstili'] },
    care: { en: ['Machine washable as labelled', 'Iron while damp'], tr: ['Etikete göre makinede yıkanabilir', 'Nemliyken ütüleyin'] },
    related: ['linen', 'cotton'],
    compare: { moisture: 4, elasticity: 1, durability: 5, texture: { en: 'Coarse, firm, rustic', tr: 'Kalın, sıkı, rustik' }, source: { en: 'Plant (hemp stem)', tr: 'Bitki (kenevir sapı)' } },
  },
];

export const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>;

export function productImages(slug: string) {
  const base = `/images/yarns/${slug}`;
  return {
    main: `${base}/macro.webp`,
    mainSmall: `${base}/macro-800.webp`,
    gallery: [`${base}/macro.webp`, `${base}/cone.webp`, `${base}/fibres.webp`],
    gallerySmall: [`${base}/macro-800.webp`, `${base}/cone-800.webp`, `${base}/fibres-800.webp`],
  };
}
