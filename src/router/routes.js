import Store from "src/store/index.js";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "Productos",
        component: () => import("pages/ahorroProgramado/ObtenerProductos.vue"),
      },
      {
        path: "Agrupadores",
        component: () => import("pages/indicadores/Agrupadores.vue"),
      },
      {
        path: "/indicador/:id",
        name: "indicador",
        component: () => import("pages/indicadores/Indicadores.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("pages/Login.vue"),
    meta: { requiresAuth: false },
    beforeEnter: (to, from, next) => {
      console.log("hola -> ", Store.state.app.logged);
      if (Store.state.app.logged) {
        next({ path: "/" });
      } else {
        next();
      }
    },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
