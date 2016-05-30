Template.addUser.rendered = function(){
  groups = Groups.find({_id:Router.current().params.id}).fetch();
  Session.set("results", [])
}

Template.addUser.helpers({
  groupName:function(){
    group = Groups.findOne({_id:Router.current().params.id})
    console.log(group)
    return group.name
  },
  results:function(){
    return Session.get("results")
  }
})

Template.addUser.events({
  'input #query': function (event, template) {
    q = event.currentTarget.value
    if(q != "")
      Session.set("results", Meteor.users.find({"emails":{$elemMatch:{address:{$regex:q}}}}).fetch())
    else
      Session.set("results", [])
  },
  'click .addUser':function(e){
    id = $(e.currentTarget).attr("id")
    group = Groups.findOne({_id:Router.current().params.id})
    if(group.users.indexOf(id) == -1){
      group.users.push(Meteor.users.findOne({_id:id}))
      Groups.update({_id:group._id}, {$set:{users:group.users}})
      console.log(Groups.findOne({_id:Router.current().params.id}))
    } else {
      alert("User already in the group!")
    }

  }
})
