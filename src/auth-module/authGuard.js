import { secureStorage } from "src/utils/secureStorage.js";

export const authGuard = (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (secureStorage.getItem("token") === null) {
      next({
        name: "login",
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      next();
    }
  } else {
    next();
  }
};
