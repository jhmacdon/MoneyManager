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
   }, 'update':function(u,d){return true}
 });

 Records.allow({
   'insert':function(u,d){return true;}
 })

 Meteor.publishComposite("users", function() {
   return {
     find: function() {
       return Meteor.users.find({});
     }
   }
 });

 Meteor.publishComposite("records", function() {
   return {
     find: function() {
       return Records.find({});
     }
   }
 });
