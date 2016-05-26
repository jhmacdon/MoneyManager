Template.dashboard.rendered = function() {

};

Template.dashboard.events({
  'click #submitGroupCreate':function(e){
    e.preventDefault()
    Groups.insert({
      name:$("#groupName").val(),
      owner:Meteor.user()
    })
    console.log(Meteor.user())
    $("#groupName").val("")
  }
});
