Router.route('/', {
  name: 'home'
});

Router.route('/dashboard', {
  name: 'dashboard',
  controller: 'DashboardController'
});

Router.route('/group/:id', {
  name: 'group',
  controller: 'GroupController'
})

Router.route("/:id/add", {
  name:"addUser",
  controller:"GroupController"
})

Router.plugin('ensureSignedIn', {
  only: ['dashboard']
});
