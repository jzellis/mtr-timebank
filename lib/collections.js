Orgs = new Mongo.Collection("orgs");
Roles = new Mongo.Collection("roles");
Transactions = new Mongo.Collection("transactions");
siteConfig = new Mongo.Collection("siteconfig");

if(Meteor.isServer){

Orgs._ensureIndex({name: "text"});
Meteor.users._ensureIndex({username: "text","profile.name": "text"});
}


if(Meteor.isServer){
Meteor.publish("users", function(){
    return Meteor.users.find();
})
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
    },
    orgs: function(){
        roles = Roles.find({userId: this._id});
        myOrgIds = [];
        roles.forEach(function(role){
            myOrgIds.push(role.orgId);
        });
        return Orgs.find({_id: {$in: myOrgIds}});
    },
    isMyOrg: function(id){
        return Roles.find({orgId: id, userId: this._id}).count() > 0
    },
        isOrgAdmin: function(id){
        return Roles.find({orgId: id, userId: this._id, admin:true}).count() > 0
    },
        isOrgContact: function(id){
        return Roles.find({orgId: id, userId: this._id, contact:true}).count() > 0
    },
    isSiteAdmin: function(){
        return Roles.findOne({orgId: "system", userId: this._id, admin: true});
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

Orgs.helpers({

    users: function(){
    users = [];
    Roles.find({orgId: this._id, accepted: true}).map(function(d,i){
        users.push(d.userId);
    });
    return users;
    },

    usersFull: function(){
    users = [];
    Roles.find({orgId: this._id, accepted: true}).map(function(d,i){
        users.push(Meteor.users.findOne({_id: d.userId}));
    });
    return users;
    },    

admins: function(){
    admins = [];
    Roles.find({orgId: this._id, admin:true, accepted: true}).map(function(d,i){
        admins.push(d.userId);
    });
    return admins;
},
contacts: function(){
    contacts = [];
    Roles.find({orgId: this._id, contact:true, accepted: true}).map(function(d,i){
        contacts.push(d.userId);
    });
    return contacts;
},
creator: function(){
    return Meteor.users.findOne({_id: this.creatorId});
},
amIAdmin: function(){
    return Roles.find({orgId: this._id, userId: Meteor.userId(), admin:true}).count() > 0;
},
amIContact: function(){
    return Roles.find({orgId: this._id, userId: Meteor.userId(), contact:true}).count() > 0;
}

});