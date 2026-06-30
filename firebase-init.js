// Inicialización de Firebase con el SDK "compat" (scripts clásicos cargados por CDN).
// Se usa compat en vez de los módulos ESM para que funcione sin bundler y también
// abriendo los HTML directamente (file://), donde los módulos y fetch están bloqueados.
//
// Orden de carga requerido en el HTML (antes de este archivo):
//   firebase-app-compat.js  ->  firebase-database-compat.js  ->  firebase-config.js  ->  firebase-init.js
firebase.initializeApp(window.FIREBASE_CONFIG);
const db = firebase.database();
// Helpers genéricos sobre Realtime Database (mismas firmas que utils/firebaseUtils.js).
async function firebaseRead(path) {
  const snapshot = await db.ref(path).once("value");
  return snapshot.val();
}
async function firebaseWrite(path, data) {
  return db.ref(path).set(data);
}
async function firebaseUpdate(path, data) {
  return db.ref(path).update(data);
}
async function firebaseDelete(path) {
  return db.ref(path).remove();
}
// Carga de productos. Hoy lee de Realtime Database (/products).
// Devuelve siempre un array, sea cual sea el formato almacenado.
async function getProducts() {
  try {
    const products = await firebaseRead("products");
    if (Array.isArray(products)) return products.filter(Boolean);
    return products ? Object.values(products) : [];
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
}