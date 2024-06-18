import { secureStorage } from "src/utils/secureStorage.js";
export default function () {
  return {
    logged: secureStorage.getItem("token") !== null,
    Token: "",
  };
}
