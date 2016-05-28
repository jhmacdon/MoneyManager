Template.group.rendered = function(){
  groups = Groups.find({_id:Router.current().params.id}).fetch();
  console.log(Meteor.users.find({}).fetch())
  console.log(groups)
}

Template.group.helpers({
  groupId:function(){
    group = Groups.findOne({_id:Router.current().params.id})
    return group.name
  }
})
