Template.group.rendered = function(){
  groups = Groups.find({_id:Router.current().params.id}).fetch();
}

Template.group.helpers({
  groupName:function(){
    group = Groups.findOne({_id:Router.current().params.id})
    return group.name
  },
  groupId:function(){
    return Router.current().params.id
  },
  userInGroup:function(){
    group = Groups.findOne({_id:Router.current().params.id});
    return group.users
  },
  records:function(){
    records = Records.find({group:Router.current().params.id}, {sort: {date: -1}});
    if(records.count() > 0) return records
    return false
  },
  balances:function(){
    records = Records.find({group:Router.current().params.id});
    if(!records.count() || records.count == 0) return false
    data = {}
    records.forEach(function(record){
      index = record.user1._id + ":" + record.user2._id
      if(record.type == "owes"){
        //user1 owes user2
        if(data[index]){
          data[index].amount += Math.round(Number(record.amount) * 100) / 100
        } else {
          data[index] = {}
          data[index].amount = Math.round(Number(record.amount) * 100) / 100
          data[index].user1 = record.user1
          data[index].user2 = record.user2
        }
      } else {
        if(data[index]){
          data[index].amount -= Math.round(Number(record.amount) * 100) / 100
        } else {
          data[index] = {}
          data[index].amount = -Math.round(Number(record.amount) * 100) / 100
          data[index].user1 = record.user1
          data[index].user2 = record.user2
        }
      }
    })

    $.each( data, function( key, value ) {
      user = key.split(":")
      if(data[user[1]+":"+user[0]]){
        if(data[user[1]+":"+user[0]].amount < value.amount){
          data[key].amount -= Math.round((Number(data[user[1]+":"+user[0]].amount)*100) / 100)
          delete data[user[1]+":"+user[0]]
        } else if (data[user[1]+":"+user[0]].amount > value.amount) {
          data[user[1]+":"+user[0]].amount -= Math.round(Number(data[key]) * 100) / 100
          delete data[key]
        }
      }
    });

    var array = $.map(data, function(value, index) {
      return [value];
    });
    return array
  }
})

Template.group.events({
  'submit #newRecord':function(e){
    e.preventDefault()
    var data = {};
    $("#newRecord").serializeArray().map(function(x){data[x.name] = x.value;});
    if(data.amount == ""){
      alert("Please enter an amount!")
      return;
    }
    if(Number(data.amount) != data.amount){
      alert(data.amount + " is not a valid number. :(")
      return;
    }
    if(data.user1 == data.user2){
      alert("A user cannot owe/pay themselves money!")
      return;
    }
    data.amount = Number(data.amount)
    data.user1 = Meteor.users.findOne({_id:data.user1})
    data.user2 = Meteor.users.findOne({_id:data.user2})

    data.date = Math.floor(Date.now() / 1000)
    data['group'] = Router.current().params.id
    Records.insert(data)
    $("#newRecord")[0].reset()
  },
  'mouseenter .recordItem':function(e){
    $(e.currentTarget).children(".moveToTrash").show()
  },
  'mouseleave .recordItem':function(e){
    $(e.currentTarget).children(".moveToTrash").hide()
  },
  'click .moveToTrash':function(e){
    alert("Functionality not yet available. Notes: http://goo.gl/pJPlvI")
  }
})
