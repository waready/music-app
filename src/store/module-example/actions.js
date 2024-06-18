export async function login({ commit }) {
  await commit("loginSuccess");
}

export function logout({ commit }) {
  return new Promise((resolve) => {
    commit("logout");
    resolve();
  });
}
