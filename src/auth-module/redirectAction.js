function redirectAction(vm, homePageName = "home") {
  if (vm.$route.query.redirect) {
    vm.$router.push(vm.$route.query.redirect);
  } else {
    vm.$router.push({
      name: homePageName,
    });
  }
}

export default redirectAction;
