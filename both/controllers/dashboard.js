DashboardController = AppController.extend({
  waitOn: function() {

    return this.subscribe('groups');
  },
  data: {
    groups: Groups.find({}),

  },
  onAfterAction: function () {
    Meta.setTitle('Dashboard');
  }
});

GroupController = AppController.extend({
  waitOn: function() {
    console.log("params are "+this.params)
    return this.subscribe('groups');
  },
  onAfterAction: function () {
    Meta.setTitle('Group');
  }
});

DashboardController.events({
  'click [data-action=doSomething]': function (event, template) {
    event.preventDefault();
  }
});
