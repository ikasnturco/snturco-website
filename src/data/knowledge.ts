/** Textile Knowledge: short, practical explanations for buyers and newcomers. */
import type { L } from '@/i18n/config';

export type Topic = {
  slug: string;
  title: L;
  text: L;
  example: L;
  /** Diagram shown with the topic (see components/knowledge/Diagram.tsx). */
  visual: 'families' | 'regenerated' | 'process' | 'ring' | 'openend' | 'filament' | 'twist' | 'count' | 'nenm' | 'quality' | 'choose' | 'uses';
  related: string[];
};

export const topics: Topic[] = [
  {
    slug: 'natural-and-synthetic-fibres',
    title: { en: 'Natural and synthetic fibres', tr: 'Doğal ve sentetik lifler' },
    text: {
      en: 'Natural fibres come from plants (cotton, linen, hemp) or animals (wool, silk). Synthetic fibres are made from polymers produced by the chemical industry, such as polyester, polyamide, acrylic, polypropylene and elastane. Natural fibres are usually more absorbent; synthetics are usually stronger, lighter and quicker to dry.',
      tr: 'Doğal lifler bitkilerden (pamuk, keten, kenevir) veya hayvanlardan (yün, ipek) elde edilir. Sentetik lifler ise kimya sanayisinin ürettiği polimerlerden yapılır: polyester, poliamid, akrilik, polipropilen ve elastan gibi. Doğal lifler genellikle daha emicidir; sentetikler ise genellikle daha güçlü, hafif ve hızlı kurur.',
    },
    example: {
      en: 'A 60/40 cotton/polyester T-shirt combines the comfort of cotton with the shape retention of polyester.',
      tr: '%60 pamuk / %40 polyester bir tişört, pamuğun konforunu polyesterin form korumasıyla birleştirir.',
    },
    visual: 'families',
    related: ['cotton', 'wool', 'polyester', 'polyamide'],
  },
  {
    slug: 'regenerated-fibres',
    title: { en: 'Regenerated fibres', tr: 'Rejenere lifler' },
    text: {
      en: 'Regenerated fibres are made from natural raw material, usually cellulose from wood or bamboo, that is dissolved and formed again into a fibre. They sit between natural and synthetic: the raw material is natural, the fibre is made in a factory. Viscose, modal and lyocell are the best-known examples.',
      tr: 'Rejenere lifler, genellikle odun veya bambudan elde edilen selüloz gibi doğal bir hammaddenin çözülüp yeniden life dönüştürülmesiyle üretilir. Doğal ile sentetik arasında yer alırlar: hammadde doğaldır, lif ise fabrikada üretilir. Viskon, modal ve liyosel en bilinen örneklerdir.',
    },
    example: { en: 'Most "bamboo" yarn is bamboo viscose: bamboo cellulose regenerated into a soft, lustrous fibre.', tr: '"Bambu" ipliklerinin çoğu bambu viskondur: yumuşak ve parlak bir life dönüştürülmüş bambu selülozu.' },
    visual: 'regenerated',
    related: ['viscose', 'bamboo'],
  },
  {
    slug: 'how-yarn-is-made',
    title: { en: 'How is yarn made?', tr: 'İplik nasıl üretilir?' },
    text: {
      en: 'Spinning turns loose fibres into a continuous yarn. For cotton, bales are opened and cleaned, then carded so that the fibres lie in a web and become a sliver. Combing removes short fibres for finer yarns. Drawing makes the sliver even, and spinning draws it thinner and inserts twist. Finally the yarn is wound onto cones.',
      tr: 'Eğirme, serbest lifleri sürekli bir ipliğe dönüştürür. Pamukta balyalar açılır ve temizlenir, ardından taranarak (karde) lifler tülbent haline getirilip şerit oluşturulur. İnce iplikler için penye işlemi kısa lifleri ayırır. Cer şeridi düzgünleştirir; eğirme ise şeridi inceltip büküm verir. Son olarak iplik bobinlere sarılır.',
    },
    example: { en: 'Combed yarn skips none of these steps and adds combing; carded yarn skips combing and is fuller and less even.', tr: 'Penye iplikte bu adımlara tarama eklenir; karde iplikte tarama yoktur, iplik daha dolgun ve daha az düzgündür.' },
    visual: 'process',
    related: ['cotton'],
  },
  {
    slug: 'ring-spun-yarn',
    title: { en: 'What is ring-spun yarn?', tr: 'Ring iplik nedir?' },
    text: {
      en: 'In ring spinning, the drafted fibre strand is twisted by a traveller running around a ring while the yarn winds onto a bobbin. Fibres lie well aligned, so ring yarns are strong, smooth and soft. Compact spinning is a ring method that condenses the fibres before twisting, giving even less hairiness.',
      tr: 'Ring eğirmede, inceltilmiş lif demeti bir bilezik (ring) üzerinde dönen kopçayla bükülür ve iplik masuraya sarılır. Lifler düzgün paralellendiği için ring iplikler güçlü, pürüzsüz ve yumuşaktır. Kompakt eğirme, lifleri bükümden önce yoğunlaştıran bir ring yöntemidir ve tüylülüğü daha da azaltır.',
    },
    example: { en: 'Premium T-shirts are often knitted from combed or compact ring-spun cotton.', tr: 'Premium tişörtler çoğunlukla penye veya kompakt ring pamuk iplikten örülür.' },
    visual: 'ring',
    related: ['cotton'],
  },
  {
    slug: 'open-end-yarn',
    title: { en: 'What is open-end yarn?', tr: 'Open-end iplik nedir?' },
    text: {
      en: 'Open-end (rotor) spinning separates the sliver into individual fibres and collects them in a fast-turning rotor, where they are twisted into yarn. It is very productive and suits coarser counts. Open-end yarns are more even but less strong and slightly harsher than ring yarns.',
      tr: 'Open-end (rotor) eğirmede şerit tek tek liflere ayrılır ve hızla dönen bir rotorda toplanarak ipliğe bükülür. Çok verimlidir ve kalın numaralara uygundur. Open-end iplikler daha düzgündür ancak ring ipliklere göre mukavemeti daha düşük ve tutumu biraz daha serttir.',
    },
    example: { en: 'Denim, towels and workwear often use open-end cotton yarn.', tr: 'Denim, havlu ve iş kıyafetlerinde sıklıkla open-end pamuk iplik kullanılır.' },
    visual: 'openend',
    related: ['cotton'],
  },
  {
    slug: 'filament-and-staple',
    title: { en: 'Filament and staple fibre', tr: 'Filament ve kesikli lif' },
    text: {
      en: 'A filament is a continuous fibre of practically unlimited length: silk, and synthetics as they come from the spinneret. Staple fibres are short, from a few millimetres to several centimetres, like cotton and wool, or synthetics cut to length. Staple fibres must be twisted together to make a yarn; filaments can be used with little or no twist.',
      tr: 'Filament, pratikte sınırsız uzunlukta sürekli bir liftir: ipek ve düzeden çıktığı haliyle sentetikler. Kesikli (stapel) lifler ise pamuk ve yün gibi birkaç milimetreden birkaç santimetreye kadar kısa liflerdir; sentetikler de belirli boyda kesilebilir. Kesikli lifler iplik olmak için birbirine bükülmelidir; filamentler az bükümle veya bükümsüz kullanılabilir.',
    },
    example: { en: 'Polyester filament gives smooth, shiny linings; polyester staple spun with cotton gives a soft, matt yarn.', tr: 'Polyester filament pürüzsüz, parlak astarlar verir; pamukla eğrilmiş kesikli polyester ise yumuşak, mat bir iplik verir.' },
    visual: 'filament',
    related: ['silk', 'polyester', 'cotton', 'wool'],
  },
  {
    slug: 'twist',
    title: { en: 'What is twist?', tr: 'Büküm (twist) nedir?' },
    text: {
      en: 'Twist is the number of turns given to a yarn per unit length, for example turns per metre. It holds staple fibres together and changes the yarn’s character: more twist makes a yarn stronger and harder, less twist makes it softer and bulkier. The direction is S or Z, after the slope of the fibres.',
      tr: 'Büküm, ipliğe birim uzunlukta verilen tur sayısıdır; örneğin metre başına tur. Kesikli lifleri bir arada tutar ve ipliğin karakterini değiştirir: fazla büküm ipliği daha güçlü ve sert, az büküm daha yumuşak ve hacimli yapar. Yönü, liflerin eğimine göre S veya Z olarak belirtilir.',
    },
    example: { en: 'Two Z-twisted singles plied together with S twist make a balanced two-ply yarn.', tr: 'Z bükümlü iki tek kat iplik S bükümle katlandığında dengeli bir iki katlı iplik elde edilir.' },
    visual: 'twist',
    related: ['cotton', 'wool'],
  },
  {
    slug: 'yarn-count',
    title: { en: 'What is yarn count?', tr: 'İplik numarası nedir?' },
    text: {
      en: 'Yarn count expresses how fine or coarse a yarn is, as a relation between length and weight. Indirect systems (Ne, Nm) give length per weight: the higher the number, the finer the yarn. Direct systems (tex, dtex, denier) give weight per length: the higher the number, the coarser the yarn.',
      tr: 'İplik numarası, ipliğin ne kadar ince veya kalın olduğunu uzunluk ile ağırlık arasındaki ilişkiyle ifade eder. Dolaylı sistemler (Ne, Nm) ağırlık başına uzunluğu verir: sayı büyüdükçe iplik incelir. Dolaysız sistemler (tex, dtex, denye) uzunluk başına ağırlığı verir: sayı büyüdükçe iplik kalınlaşır.',
    },
    example: { en: 'Ne 40 is finer than Ne 20; 150 denier is coarser than 75 denier.', tr: 'Ne 40, Ne 20’den incedir; 150 denye, 75 denyeden kalındır.' },
    visual: 'count',
    related: ['cotton', 'polyester'],
  },
  {
    slug: 'ne-and-nm',
    title: { en: 'Ne and Nm', tr: 'Ne ve Nm sistemleri' },
    text: {
      en: 'Ne (English cotton count) is the number of 840-yard hanks in one pound. Nm (metric count) is the number of kilometres in one kilogram. They convert with a fixed factor: Nm ≈ 1.693 × Ne. In the direct system, tex = 1000 ÷ Nm.',
      tr: 'Ne (İngiliz pamuk numarası), bir librede kaç adet 840 yardalık çile olduğunu gösterir. Nm (metrik numara), bir kilogramda kaç kilometre iplik olduğunu gösterir. Sabit bir katsayıyla birbirine çevrilir: Nm ≈ 1,693 × Ne. Dolaysız sistemde tex = 1000 ÷ Nm.',
    },
    example: { en: 'Ne 30 ≈ Nm 50.8 ≈ 19.7 tex.', tr: 'Ne 30 ≈ Nm 50,8 ≈ 19,7 tex.' },
    visual: 'nenm',
    related: ['cotton', 'wool'],
  },
  {
    slug: 'yarn-quality',
    title: { en: 'How is yarn quality evaluated?', tr: 'İplik kalitesi nasıl değerlendirilir?' },
    text: {
      en: 'Laboratories test a yarn for count and count variation, evenness (mass variation along the yarn), imperfections (thin places, thick places and neps), hairiness, strength and elongation, and twist. Raw material quality, spinning method and machine settings all show up in these results.',
      tr: 'Laboratuvarlar ipliği numara ve numara sapması, düzgünsüzlük (iplik boyunca kütle değişimi), hatalar (ince yer, kalın yer ve neps), tüylülük, mukavemet ve uzama ile büküm açısından test eder. Hammadde kalitesi, eğirme yöntemi ve makine ayarları bu sonuçlara yansır.',
    },
    example: { en: 'Ask for a test report with the offer and compare it with the yarn you use today.', tr: 'Teklifle birlikte test raporu isteyin ve bugün kullandığınız iplikle karşılaştırın.' },
    visual: 'quality',
    related: ['cotton', 'polyester'],
  },
  {
    slug: 'choosing-yarn',
    title: { en: 'What to consider when choosing yarn', tr: 'İplik seçiminde nelere dikkat edilmeli?' },
    text: {
      en: 'Start from the end product: knitting or weaving, fabric weight and the hand you want. Then decide the fibre or blend, count, spinning method (ring, compact, open-end), twist, and any certificates the buyer requires. Quantity, colour (raw white, dyed or melange) and delivery time complete the request.',
      tr: 'Bitmiş üründen başlayın: örme mi dokuma mı, kumaş gramajı ve istediğiniz tutum. Ardından lif veya karışımı, numarayı, eğirme yöntemini (ring, kompakt, open-end), bükümü ve alıcının istediği sertifikaları belirleyin. Miktar, renk (ham beyaz, boyalı veya melanj) ve teslim süresi talebi tamamlar.',
    },
    example: { en: 'Single jersey T-shirt: Ne 30/1 combed compact cotton, raw white, for circular knitting.', tr: 'Süprem tişört: Ne 30/1 penye kompakt pamuk, ham beyaz, yuvarlak örme için.' },
    visual: 'choose',
    related: ['cotton', 'viscose', 'polyester'],
  },
  {
    slug: 'uses-of-yarn',
    title: { en: 'Where yarns are used', tr: 'İpliklerin kullanım alanları' },
    text: {
      en: 'Apparel is the largest use: knits such as T-shirts and knitwear, and wovens such as shirts and denim. Home textiles include towels, bed linen, curtains and upholstery. Technical textiles use yarns for strength, filtration, safety or medical purposes.',
      tr: 'En büyük kullanım alanı giyimdir: tişört ve triko gibi örme ürünler, gömlek ve denim gibi dokuma ürünler. Ev tekstili havlu, nevresim, perde ve döşemeliği kapsar. Teknik tekstiller ise iplikleri mukavemet, filtrasyon, güvenlik veya medikal amaçlarla kullanır.',
    },
    example: { en: 'The same cotton can become a towel (open-end, low twist) or a fine shirt (combed, compact, higher twist).', tr: 'Aynı pamuk bir havluya (open-end, düşük büküm) veya ince bir gömleğe (penye, kompakt, daha yüksek büküm) dönüşebilir.' },
    visual: 'uses',
    related: ['cotton', 'polyester', 'linen', 'polypropylene'],
  },
];
