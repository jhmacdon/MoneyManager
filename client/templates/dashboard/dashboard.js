Template.dashboard.rendered = function() {

};

Template.dashboard.events({
  'click #submitGroupCreate':function(e){
    e.preventDefault()
    if($("#groupName").val() != ""){
      Groups.insert({
        name:$("#groupName").val(),
        owner:Meteor.user(),
        users:[Meteor.user()]
      })
    } else {
      alert("No group name entered!")
    }

    console.log(Meteor.user())
    $("#groupName").val("")
  }
});

Template.dashboard.helpers({
  owned: function(){
    return Groups.find({owner : Meteor.user()})
  },

  size: function(users){
    try{
      return users.length
    } catch(e) {
      return 0
    }
  }
})
