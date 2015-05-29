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
    transactions: function(type,num) {
        type = type || "all";
        options = {skip: 0, sort: {createdAt: -1}};
        if(num) options.limit = num;
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
                },options);
                break;
        }
    },
    roles: function(){
    	return Roles.find({userId: this._id});
    }
});

Transactions.helpers({
	fromMe: function(){
		return this.fromUser === Meteor.userId();
	},
	toMe: function(){
		return this.toUser === Meteor.userId();
	},
	toTheUser: function(){
		return Meteor.users.findOne({_id: this.toUser});
	},
		fromTheUser: function(){
		return Meteor.users.findOne({_id: this.fromUser});
	},
		toTheOrg: function(){
		return Orgs.findOne({_id: this.toOrg});
	},
		fromTheOrg: function(){
		return Orgs.findOne({_id: this.fromOrg});
	},
	iCanApprove: function(){
		return this.fromUser === Meteor.userId() && this.completedAt === null;
	}

});