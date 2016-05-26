Meteor.publishComposite("groups", function() {
  return {
    find: function() {
      return Groups.find({});
    }
  }
});

Groups.allow({
   'insert': function (userId,doc) {
     return true;
   }
 });
