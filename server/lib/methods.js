Meteor.methods({

"search" : function(q){
users = Meteor.users.find({$or: [{username: q},{"profile.name": q}]}).fetch();
orgs = Orgs.find({name: q}).fetch();
return {users: users, orgs: orgs};
},

"giveUser" : function(uId,amount){


if(Meteor.user().profile.balance < amount){
	throw new Meteor.Error("insufficient-balance","You have insufficient balance to give this user this amount of time.");
}else{
recipient = Meteor.users.findOne({_id: uId});
amount = (Math.round(amount * 2) / 2).toFixed(2);
recipientNewBalance = parseFloat(recipient.profile.balance) + parseFloat(amount);
myNewBalance = parseFloat(Meteor.user().profile.balance) - parseFloat(amount);

Meteor.users.update({_id: Meteor.userId()},{$set: {"profile.balance": myNewBalance}});
Meteor.users.update({_id: uId},{$set: {"profile.balance": recipientNewBalance}});
Transactions.insert({toUser: uId, fromUser: Meteor.userId(), amount: amount, createdAt: new Date(), completed: true});
return true;
}

},

"giveOrg" : function(oId,amount){


if(Meteor.user().profile.balance < amount){
	throw new Meteor.Error("insufficient-balance","You have insufficient balance to give this org this amount of time.");
}else{
recipient = Orgs.findOne({_id: oId});
amount = (Math.round(amount * 2) / 2).toFixed(2);

recipientNewBalance = parseFloat(recipient.balance) + parseFloat(amount);
myNewBalance = parseFloat(Meteor.user().profile.balance) - parseFloat(amount);

Meteor.users.update({_id: Meteor.userId()},{$set: {"profile.balance": myNewBalance}});
Orgs.update({_id: oId},{$set: {"balance": recipientNewBalance}});
Transactions.insert({toOrg: oId, fromUser: Meteor.userId(), amount: amount, createdAt: new Date(), completed: true});
return true;
}

}

});