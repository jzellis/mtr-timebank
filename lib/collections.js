Orgs = new Mongo.Collection("orgs");
Roles = new Mongo.Collection("roles");
Transactions = new Mongo.Collection("transactions");

if(Meteor.isServer){

Orgs._ensureIndex({name: "text"});
Meteor.users._ensureIndex({username: "text","profile.name": "text"});
}


Meteor.users.helpers({
	canGive: function(){
		return this.profile.balance > 0
	},
    transactions: function(type) {
        type = type || "all";
        switch (type) {
            case "all":
                return Transactions.find({
                    $or: [{
                        toUser: this._id
                    }, {
                        fromUser: this._id
                    }]
                });
                break;
            case "to":
            return Transactions.find({
                toUser: this._id
            });
            break;
            case "from":
                return Transactions.find({
                    fromUser: this._id
                });
                break;
        }
    },
    roles: function(){
    	return Roles.find({userId: this._id});
    }
});