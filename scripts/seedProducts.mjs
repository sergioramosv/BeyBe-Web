// Seed de productos en Realtime Database.
// Uso:  node scripts/seedProducts.mjs
// Lee la config web de ../.env y escribe el array en /products.
// Requiere que las reglas de RTDB permitan escritura (modo test) al ejecutarlo.
import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
// --- Cargar variables de ../.env (parser simple, sin dependencias) ---
const envText = readFileSync(new URL("../.env", import.meta.url), "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    })
);
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  databaseURL: env.FIREBASE_DATABASE_URL,
};
// --- Datos de los productos (fuente de verdad del seed) ---
const products = [
  {
    id: "bloody-mary",
    cartId: "bloody-mary",
    title: "Bloody Mary",
    pageTitle: "Bloody Mary | Be&Be Drinks Spain",
    tag: "Bebida combinada en lata",
    flavor: "Tomate · Vodka · Especias",
    meta: ["33cl", "19% vol", "Listo para servir"],
    price: 3.3,
    priceUnit: "por lata",
    mainImage: "images/BOODY.jpeg",
    thumbs: [
      { src: "images/BOODY.jpeg", alt: "Vista principal de Bloody Mary" },
      { src: "images/Bloody - Marketing.png", alt: "Imagen promocional de Bloody Mary" },
      { src: "images/Bloody - pack 12.png", alt: "Pack de 12 Bloody Mary" },
      { src: "images/Bloody - pack 24.png", alt: "Pack de 24 Bloody Mary" },
    ],
    packOptions: [6, 12, 24],
    buyNote: "Tómalo bien frío y sírvelo como prefieras.",
    description: [
      "Combinado Bloody Mary se elabora siguiendo la tradicional receta transmitida por generaciones entre los más refinados caballeros británicos.",
      "NO APTO para: vegetarianos, celiacos, pánfilos y menores de 18.",
      "2 MEJOR QUE 1, Aunque... 3 MEJOR QUE 2",
      "Contiene zumo de tomate natural 100% premium, vodka triple destilado, amontillado de Jerez, jugo de limón fresco, salsa Worcestershire Lea & Perrins, la legendaria salsa de Tabasco (r), sal, pimienta negra recién molida. Todo ello combinado en sus medidas exactas para ofrecerte el comienzo de un día perfecto y refrescante.",
    ],
    details: [
      {
        heading: "Ingredientes y cantidades",
        paragraphs: ["Licopeno, vitamina C, potasio, fibra y otros carotenoides, compuestos fenólicos, alcohol, azúcares residuales, antioxidantes, minerales, ácido cítrico, flavonoides, cloruro de sodio, piperina, compuestos aromáticos, aminoácidos, vinagre, especias, conservantes y capsaicina."],
      },
      { heading: "Aviso de alérgenos", paragraphs: ["Anchoa, gluten y cebada."] },
      { heading: "Información nutricional", paragraphs: ["<strong>Por 33cl:</strong>", "Información pendiente de confirmar."] },
      { heading: "Extra", paragraphs: ["Servir muy frío.", "Perfecto para un aperitivo intenso y especiado."] },
    ],
    card: {
      title: "Bloody Mary",
      subtitle: "Tomate · Vodka · Especias",
      text: "Un denso y picante elixir texturizado de manufactura artesanal, donde cada botella se mezcla a mano según el manual británico: tomate premium, Amontillado de Jerez, vodka y un golpe de Tabasco®. Una sofisticación canalla embotellada para quienes exigen un trasplante de actitud desde el primer trago",
    },
  },
  {
    id: "carajillo",
    cartId: "carajillo",
    title: "Carajillo del Tío Pío",
    pageTitle: "Carajillo del Tío Pío | Be&Be Drinks Spain",
    tag: "Bebida combinada en lata",
    flavor: "Coñac quemado · Café · Limón",
    meta: ["33cl", "8% vol", "Listo para servir"],
    price: 3.3,
    priceUnit: "por lata",
    mainImage: "images/CARAJILLO.jpeg",
    thumbs: [
      { src: "images/CARAJILLO.jpeg", alt: "Vista principal de Carajillo del Tío Pío" },
      { src: "images/carajillo - pack 6.jpeg", alt: "Pack de 6 Carajillo del Tío Pío" },
      { src: "images/carajillo - pack 12.jpeg", alt: "Pack de 12 Carajillo del Tío Pío" },
      { src: "images/carajillo - pack 24.jpeg", alt: "Pack de 24 Carajillo del Tío Pío" },
    ],
    packOptions: [6, 12, 24],
    buyNote: "Tómalo ardiento o a tope de hielos, pero siempre con una cáscara de limón.",
    description: [
      "Bebida mixta elaborada con café expreso natural y brandy flambeado.",
      "Auténtico carajillo elaborada de forma tradicional según la receta del mítico Tío Pío de Almazora.",
      "NO APTO para: vegetarianos, celiacos, pánfilos y menores de 18.",
      "2 MEJOR QUE 1, Aunque... 3 MEJOR QUE 2",
    ],
    details: [
      { heading: "Ingredientes y cantidades", paragraphs: ["<strong>Por cada lata de 33 cl:</strong>", "50% café", "50% brandy", "Azúcar 100g", "2 granos de café (físicos)", "Piel de limón (física)"] },
      { heading: "Aviso de alérgenos", paragraphs: ["Limón, Gluten, Alcohol."] },
      { heading: "Información nutricional", paragraphs: ["<strong>Por 33cl:</strong>", "312kj / 75 kcal", "Grasas: 0g", "Hidratos: 7.5g, de los cuales azúcares 7.5g", "Proteína: 0g", "Sal: 0.01g", "Alcohol: 6.8g", "Graduación alcohólica: 8.0% vol"] },
      { heading: "Extra", paragraphs: ["Despierta y activa al instante.", "RECUERDA: FRÍO O CALIENTE"] },
    ],
    card: {
      title: "Carajillo del Tío Pío",
      subtitle: "Coñac quemado · Café · Limón",
      text: "Artesanía pura y fuego: la alquimia perfecta entre la oscuridad de un espresso recién extraído y el abrazo piromaníaco del brandy flambeado artesanalmente con limón. Un choque eléctrico de cafeína y hoguera que rescata del letargo y le devuelve el orgullo al paladar.",
    },
  },
  {
    id: "hangover",
    cartId: "hangover-killer",
    title: "FU*NG HANGOVER KILLER",
    pageTitle: "FU*NG HANGOVER KILLER | Be&Be Drinks Spain",
    tag: "Bebida combinada en lata",
    flavor: "Receta matutina · Fría · Revitalizante",
    meta: ["33cl", "Listo para servir", "Tómalo bien frío"],
    price: 3.3,
    priceUnit: "por lata",
    mainImage: "images/HANGOVER.jpeg",
    thumbs: [
      { src: "images/HANGOVER.jpeg", alt: "Vista principal de FU*NG HANGOVER KILLER" },
      { src: "images/hangover - pack 12.jpeg", alt: "Pack de 12 FU*NG HANGOVER KILLER" },
      { src: "images/hangover - pack 6.png", alt: "Pack de 6 FU*NG HANGOVER KILLER" },
      { src: "images/hangover - pack 24.jpeg", alt: "Pack de 24 FU*NG HANGOVER KILLER" },
    ],
    packOptions: [6, 12, 24],
    buyNote: "Agítese y sírvase bien fría.",
    description: [
      "FU*NG HANGOVER KILLER se elabora siguiendo antiguas recetas utilizadas por los chamanes de Siberia y Mongolia para aliviar las terribles resacas de los cosacos.",
      "En tus manos podrías tener el mismo tónico matutino contra la resaca que el legendario mayordomo Jeeves servía a Sir Bertram Wooster.",
      "Bebida permitida únicamente para personas de entre 18 y 108 años.",
      "Agítese y sírvase bien fría.",
    ],
    details: [
      { heading: "Ingredientes y cantidades", paragraphs: ["33cl. Azúcar 2,5g. Calcio 0,036g. Grasas 0,46g. Carbohidratos 7,7g. Hierro 0,012g. Magnesio 0,00003mg. Potasio 0,138g. Proteína 2,32g. Zinc 0,00182g."] },
      { heading: "Aviso de alérgenos", paragraphs: ["Gluten."] },
      { heading: "Información nutricional", paragraphs: ["<strong>Por 33cl:</strong>", "Azúcar 2,5g", "Calcio 0,036g", "Grasas 0,46g", "Carbohidratos 7,7g", "Hierro 0,012g", "Magnesio 0,00003mg", "Potasio 0,138g", "Proteína 2,32g", "Zinc 0,00182g"] },
      { heading: "Extra", paragraphs: ["Tónico pensado para servirse muy frío.", "Agitar antes de abrir."] },
    ],
    card: {
      title: "Hangover Killer",
      subtitle: "Cítricos · Hierbabuena · Ron",
      text: "El botón de reinicio del alma elaborado artesanalmente: un pacto gélido con pócimas e ingredientes seleccionados a mano que extirpa la culpa de la noche anterior. Un tónico ultra-revitalizante de producción limitada diseñado para fulminar el malestar y transformar un despojo humano en un aristócrata.",
    },
  },
];
// --- Escritura ---
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
try {
  await set(ref(db, "products"), products);
  console.log(`✅ Seed completado: ${products.length} productos escritos en /products`);
  process.exit(0);
} catch (error) {
  console.error("❌ Error al escribir en RTDB:", error.message);
  console.error("   Comprueba que las reglas de Realtime Database permiten escritura (modo test).");
  process.exit(1);
}