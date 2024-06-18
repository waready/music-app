import { store } from "quasar/wrappers";
import { createStore } from "vuex";

import app from "./module-example";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

// export default store(function (/* { ssrContext } */) {
//   const Store = createStore({
//     modules: {
//       example
//     },

//     // enable strict mode (adds overhead!)
//     // for dev mode and --debug builds only
//     strict: process.env.DEBUGGING
//   })

//   return Store
// })
// Define los módulos que quieres incluir en el store
const modules = {
  app, // Importa tus módulos aquí si es necesario
  // ... otros módulos ...
};

// Configura el store Vuex
const Store = createStore({
  modules,
  strict: process.env.DEBUGGING,
});

export default Store;
