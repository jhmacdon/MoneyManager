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

Router.route('/api/:id/balances', function () {
  var req = this.request;
  var res = this.response;
  var id = req.originalUrl.split("/")[2]
  group = Groups.findOne({_id:id})


  records = Records.find({group:id});
  if(!records.count() || records.count == 0) return false
  data = {}
  records.forEach(function(record){
    index = record.user1._id + ":" + record.user2._id
    if(record.type == "owes"){
      //user1 owes user2
      if(data[index]){
        data[index].amount += Number(record.amount)
      } else {
        data[index] = {}
        data[index].amount = Number(record.amount)
        data[index].user1 = record.user1
        data[index].user2 = record.user2
      }
    } else {
      if(data[index]){
        data[index].amount -= Number(record.amount)
      } else {
        data[index] = {}
        data[index].amount = -Number(record.amount)
        data[index].user1 = record.user1
        data[index].user2 = record.user2
      }
    }
  })

  for (var key in data){
    if (typeof data[key] !== 'function') {
      value = data[key]
      user = key.split(":")
      if(data[user[1]+":"+user[0]]){
        if(data[user[1]+":"+user[0]].amount < value.amount){
          data[key].amount -= Number(data[user[1]+":"+user[0]].amount)
          delete data[user[1]+":"+user[0]]
        } else if (data[user[1]+":"+user[0]].amount > value.amount) {
          data[user[1]+":"+user[0]].amount -= Number(data[key])
          delete data[key]
        }
      }
    }
  }

  /*var array = $.map(data, function(value, index) {
    return [value];
  });*/

  var result = ""

  for(var balance in data){
    if(typeof data[balance] !== 'function'){
      value = data[balance]
      var amount = parseFloat(Math.round(value.amount * 100) / 100).toFixed(2)

      var amounts = amount.toString().split(".")
      var cents = ""
      var dollars = amounts[0] + " dollars"
      if(amount.length > 1){
        cents = " and " + amounts[1] + " cents "
      }

      result += value.user1.profile.name + " owes " + value.user2.profile.name + " " + dollars + " dollars " + cents + ". "

    }
  }

  res.end(result)



  //res.end(Groups.findOne({_id:id}).toString());
}, {where: 'server'});
