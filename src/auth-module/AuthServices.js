import http from "../utils/http.js";
import { secureStorage } from "../utils/secureStorage.js";

class AuthServices {
  constructor() {}

  static checkIfHasToken() {
    return secureStorage.getItem("token") !== null;
  }

  static async login(email = "", password = "") {
    let user = {
      email,
      password,
      grant_type: process.env.VUE_APP_GRANT_TYPE,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
      scope: process.env.VUE_APP_SCOPE,
    };
    var res = await http.post("login", { user });
    AuthServices.saveAccessToken(res.data);
  }

  static async register(email = "", password = "", fullname = "", name = "") {
    let user = {
      email,
      password,
      fullname,
      name,
      grant_type: process.env.VUE_APP_GRANT_TYPE,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
      scope: process.env.VUE_APP_SCOPE,
    };
    var res = await http.post("register", { user });
    AuthServices.saveAccessToken(res.data);
  }

  static saveAccessToken(tokenResponse) {
    secureStorage.setItem(
      "token",
      `${tokenResponse.type} ${tokenResponse.token}`
    );
    http.defaults.headers["Authorization"] = secureStorage.getItem("token");
  }

  static removeToken() {
    localStorage.clear();
    sessionStorage.clear();
  }

  static logout() {
    AuthServices.removeToken();
  }
}

export default AuthServices;
export { AuthServices };
