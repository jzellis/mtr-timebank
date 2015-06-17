Orgs = new Mongo.Collection("orgs");
Roles = new Mongo.Collection("roles");
Transactions = new Mongo.Collection("transactions");
Opportunities = new Mongo.Collection("opportunities");
siteConfig = new Mongo.Collection("siteconfig");

if(Meteor.isServer){

Orgs._ensureIndex({name: "text"});
Meteor.users._ensureIndex({username: "text","profile.name": "text", "profile.tags": "text"});
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
    },
    favoriteUsers: function(){
        return Meteor.users.find({_id: {$in: this.profile.favorites.users}});
    }

});

Transactions.helpers({
	fromMe: function(){
		return this.fromUser === Meteor.userId();
	},
    fromMyOrg: function(){
        return typeof Roles.findOne({orgId: this.fromOrg, userId: Meteor.userId()}) == undefined
    },
	toMe: function(){
		return this.toUser === Meteor.userId();
	},
    toMyOrg: function(){
        return typeof Roles.findOne({orgId: this.toOrg, userId: Meteor.userId()}) == undefined
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

    userIds: function(){
    users = [];
    Roles.find({orgId: this._id}).map(function(d,i){
        users.push(d.userId);
    });
    return users;
    },

    users: function(){
    users = [];
    Roles.find({orgId: this._id}).map(function(d,i){
        users.push(Meteor.users.findOne({_id: d.userId}));
    });
    return users;
    },    

admins: function(){
    admins = [];
    Roles.find({orgId: this._id, admin:true}).map(function(d,i){
        admins.push(d.userId);
    });
    return admins;
},
contacts: function(){
    contacts = [];
    Roles.find({orgId: this._id, contact:true}).map(function(d,i){
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


// Publish functions

if(Meteor.isServer){

    Meteor.publish('myFavorites', function(){
        me = Meteor.users.findOne({_id: this.userId});
        if(me){ return [
        Meteor.users.find({_id: {$in: me.profile.favorites.users}}), 
        Orgs.find({_id: {$in: me.profile.favorites.orgs}})
        ]}else{
            return []
        }
    });

    Meteor.publish("userByUsername", function(username){
        return Meteor.users.find({username: username});
    });
    Meteor.publish("recentTransactions", function(limit){

        limit == limit || 25;

    return Transactions.find({},{skip: 0, limit: limit});


    });

    Meteor.publish("userById", function(id){
        return Meteor.users.find({_id: id});
    });

    Meteor.publish("orgById", function(id){
        org = Orgs.findOne({_id:id});
        userIds = [];
        Roles.find({orgId: org._id}).map(function(doc){
            userIds.push(doc._id);
        });

        return [
        Orgs.find({Iid: id}),
        Meteor.users.find({_id: {$in: userIds}}),
        Transactions.find({$or: [{toOrg: org._id},{fromOrg: org._id}]})
        ];
    });

    Meteor.publish("orgBySlug", function(slug){
        org = Orgs.findOne({slug:slug});
        userIds = [];
        Roles.find({orgId: org._id}).map(function(doc){
            userIds.push(doc.userId);
        });
        return [
        Orgs.find({slug: slug}),
        Meteor.users.find({_id: {$in: userIds}}),
        Transactions.find({$or: [{toOrg: org._id},{fromOrg: org._id}]}),
        Roles.find({orgId: org._id})
        ];
    });

    Meteor.publish("myRoles", function(){
    if(this.userId){
        return Roles.find({userId: this.userId});
    }else{
        return [];
    }
});

Meteor.publish("myTransactions", function(limit){

        limit == limit || 0;

    trans= Transactions.find({
                    $or: [{
                        toUser: this.userId
                    }, {
                        fromUser: this.userId
                    }]
                },{skip: 0, limit: limit});
    tusers = [];
    torgs = [];
    trans.forEach(function(transaction){
                    if(transaction.toUser != this.userId) tusers.push(transaction.toUser)
                    if(transaction.fromUser != this.userId) tusers.push(transaction.fromUser)
                    if(transaction.toOrg) torgs.push(transaction.toOrg);
                    if(transaction.fromOrg) torgs.push(transaction.fromOrg);

                });

    return[trans, Meteor.users.find({_id: {$in: tusers}}),Orgs.find({_id: {$in: torgs}})]

});    

Meteor.publish("myFavoriteUsers", function(){
    me = Meteor.users.findOne({_id: this.userId});
    return Meteor.users.find({_id: {$in: [me.profile.favorite.users]}});
});

Meteor.publish("myFavoriteOrgs", function(){
    me = Meteor.users.findOne({_id: this.userId});
    return Orgs.find({_id: {$in: [me.profile.favorite.orgs]}});
});

Meteor.publish("myTransactionUsers", function(){
    thisOne = this;
    // me = Meteor.users.findOne({_id: this.userId});
    transactionUsers = [];
    myTransactions = Transactions.find({
                    $or: [{
                        toUser: this.userId
                    }, {
                        fromUser: this.userId
                    }]
                }).forEach(function(transaction){
                    if(transaction.toUser != thisOne.userId) transactionUsers.push(transaction.toUser)
                    if(transaction.fromUser != thisOne.userId) transactionUsers.push(transaction.fromUser)

                });
    return Meteor.users.find({_id: {$in: [transactionUsers]}});
})


Meteor.publish("myTransactionOrgs", function(){
    thisOne = this;
    // me = Meteor.users.findOne({_id: this.userId});
    transactionOrgs = [];
    myTransactions = Transactions.find({
                    $or: [{
                        toUser: this.userId
                    }, {
                        fromUser: this.userId
                    }]
                }).forEach(function(transaction){
                    if(transaction.toOrg) transactionOrgs.push(transaction.toOrg)
                    if(transaction.fromOrg) transactionOrgs.push(transaction.fromOrg)

                });
    return Orgs.find({_id: {$in: [transactionOrgs]}});
})




Meteor.publish("users", function(){
    return Meteor.users.find();
})

Meteor.publish("config", function(){
    return siteConfig.find();
})

Meteor.publish('admin', function(limit){
limit == limit || 0;
return [
Orgs.find({},{sort: {createdAt: 1}, skip: 0, limit: limit}),
Meteor.users.find({},{sort: {createdAt: 1}, skip: 0, limit: limit}),
Transactions.find({},{sort: {createdAt: 1}, skip: 0, limit: limit}),
];


});



}

