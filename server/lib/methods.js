// Functions for methods because I can't figure out Meteor's annoying load order

sendOrgCreateRequestEmail = function(org) {

    admins = Roles.find({orgId: "system", contact: true});

    admins.forEach(function(admin){

    r = Meteor.users.findOne({_id: admin.userId});

    to = r.emails[0].address;
    from = "noreply@thetimebank.org";
    subject = "New org request on timebank";
    SSR.compileTemplate('orgCreateRequestEmail', Assets.getText('templates/orgCreateRequestEmail.html'));
    body = SSR.render('orgCreateRequestEmail', {
        org: org,
        creator: Meteor.users.findOne({_id: org.creatorId}),
        server: Meteor.absoluteUrl()
    });
    Email.send({
        from: from,
        to: to,
        subject: subject,
        text: body
    });

});
}


sendGiveUserEmail = function(r, s, t) {
    transaction = Transactions.findOne({
        _id: t
    });
    to = r.emails[0].address;
    from = s.emails[0].address;
    subject = s.username + " has given you " + transaction.amount + "!";
    SSR.compileTemplate('giveUserEmail', Assets.getText('templates/giveUserEmail.html'));
    body = SSR.render('giveUserEmail', {
        recipient: r,
        sender: s,
        transaction: transaction,
        server: Meteor.absoluteUrl()
    });
    Email.send({
        from: from,
        to: to,
        subject: subject,
        text: body
    });
}

sendRequestUserEmail = function(r, s, t) {
    transaction = Transactions.findOne({
        _id: t
    });
    to = r.emails[0].address;
    from = s.emails[0].address;
    subject = s.username + " has requested " + transaction.amount + " from you";
    SSR.compileTemplate('requestUserEmail', Assets.getText('templates/requestUserEmail.html'));
    body = SSR.render('requestUserEmail', {
        recipient: r,
        sender: s,
        transaction: transaction,
        server: Meteor.absoluteUrl()
    });
    Email.send({
        from: from,
        to: to,
        subject: subject,
        text: body
    });
}

sendGiveOrgEmail = function(o, s, t) {
	org = o;
	contacts = Roles.find({orgId: o._id, contact:true});

    transaction = Transactions.findOne({
        _id: t
    });
    contacts.forEach(function(c){
    	r = Meteor.users.findOne({_id: c.userId});
    to = r.emails[0].address;
    from = s.emails[0].address;
    subject = s.username + " has given your organization " + org.name + " "  + transaction.amount + "!";
    SSR.compileTemplate('giveOrgEmail', Assets.getText('templates/giveOrgEmail.html'));
    body = SSR.render('giveOrgEmail', {
        recipient: r,
        org: o,
        sender: s,
        transaction: transaction,
        server: Meteor.absoluteUrl()
    });
    Email.send({
        from: from,
        to: to,
        subject: subject,
        text: body
    });
    })
}

sendRequestOrgEmail = function(o, s, t) {
	org = o;
	contacts = Roles.find({orgId: o._id, contact:true});

    transaction = Transactions.findOne({
        _id: t
    });
    contacts.forEach(function(c){
    	r = Meteor.users.findOne({_id: c.userId});
    to = r.emails[0].address;
    from = s.emails[0].address;
    subject = s.username + " has requested " + transaction.amount + " from your organization " + org.name;
    SSR.compileTemplate('requestOrgEmail', Assets.getText('templates/requestOrgEmail.html'));
    body = SSR.render('requestOrgEmail', {
        recipient: r,
        org: o,
        sender: s,
        transaction: transaction,
        server: Meteor.absoluteUrl()
    });
    Email.send({
        from: from,
        to: to,
        subject: subject,
        text: body
    });
    })
}

sendApprovalEmailUser = function(t){
	transaction = t;
r = Meteor.users.findOne({_id: t.toUser});
s = Meteor.users.findOne({_id: t.fromUser});
 to = r.emails[0].address;
    from = s.emails[0].address;
    subject = s.username + " has approved your request for " + transaction.amount + " from the timebank";
    SSR.compileTemplate('approveUserEmail', Assets.getText('templates/approveUserEmail.html'));
    body = SSR.render('approveUserEmail', {
        recipient: r,
        sender: s,
        transaction: transaction,
        server: Meteor.absoluteUrl()
    });
    Email.send({
        from: from,
        to: to,
        subject: subject,
        text: body
    });


    		}

sendApprovalEmailOrg = function(t) {
	transaction = t;
	o = t.toTheOrg();
	contacts = Roles.find({orgId: o._id, contact:true});

    contacts.forEach(function(c){
    	r = Meteor.users.findOne({_id: c.userId});
    to = r.emails[0].address;
    from = s.emails[0].address;
    subject = s.username + " has approved the request for " + transaction.amount + " from your organization " + org.name;
    SSR.compileTemplate('approveOrgEmail', Assets.getText('templates/approveOrgEmail.html'));
    body = SSR.render('approveOrgEmail', {
        recipient: r,
        org: o,
        sender: s,
        transaction: transaction,
        server: Meteor.absoluteUrl()
    });
    Email.send({
        from: from,
        to: to,
        subject: subject,
        text: body
    });
    })
}




// Actual methods
Meteor.methods({
    "search": function(q) {
        users = Meteor.users.find({
            $text: {
                $search: q
            }
        }).fetch();
        orgs = Orgs.find({
            $text: {
                $search: q
            }, approvedAt: {$ne: null}
        }).fetch();
        return {
            users: users,
            orgs: orgs
        };
    },
    "giveUser": function(uId, amount) {
        if (Meteor.user().profile.balance < amount) {
            throw new Meteor.Error("insufficient-balance", "You have insufficient balance to give this user this amount of time.");
        } else {
            recipient = Meteor.users.findOne({
                _id: uId
            });
            amount = (Math.round(amount * 2) / 2).toFixed(2);
            recipientNewBalance = parseFloat(recipient.profile.balance) + parseFloat(amount);
            myNewBalance = parseFloat(Meteor.user().profile.balance) - parseFloat(amount);
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $set: {
                    "profile.balance": myNewBalance
                }
            });
            Meteor.users.update({
                _id: uId
            }, {
                $set: {
                    "profile.balance": recipientNewBalance
                }
            });
            tId = Transactions.insert({
                toUser: uId,
                fromUser: Meteor.userId(),
                amount: amount,
                createdAt: new Date(),
                completedAt: new Date()
            });
            sendGiveUserEmail(recipient, Meteor.user(), tId);
            return true;
        }
    },
    "requestUser": function(uId, amount) {
        recipient = Meteor.users.findOne({
            _id: uId
        });
        if (recipient.profile.balance < amount) {
            throw new Meteor.Error("insufficient-balance", recipient.username + "has insufficient balance to give you this amount of time.");
        } else {
            // amount = (Math.round(amount * 2) / 2).toFixed(2);
            // recipientNewBalance = parseFloat(recipient.profile.balance) + parseFloat(amount);
            // myNewBalance = parseFloat(Meteor.user().profile.balance) - parseFloat(amount);
            // Meteor.users.update({_id: Meteor.userId()},{$set: {"profile.balance": myNewBalance}});
            // Meteor.users.update({_id: uId},{$set: {"profile.balance": recipientNewBalance}});
            tId = Transactions.insert({
                fromUser: uId,
                toUser: Meteor.userId(),
                amount: amount,
                createdAt: new Date(),
                completedAt: null
            });
            sendRequestUserEmail(recipient, Meteor.user(), tId);
            return true;
        }
    },
    "giveOrg": function(oId, amount) {
        if (Meteor.user().profile.balance < amount) {
            throw new Meteor.Error("insufficient-balance", "You have insufficient balance to give this org this amount of time.");
        } else {
            recipient = Orgs.findOne({
                _id: oId
            });
            amount = (Math.round(amount * 2) / 2).toFixed(2);
            recipientNewBalance = parseFloat(recipient.balance) + parseFloat(amount);
            myNewBalance = parseFloat(Meteor.user().profile.balance) - parseFloat(amount);
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $set: {
                    "profile.balance": myNewBalance
                }
            });
            Orgs.update({
                _id: oId
            }, {
                $set: {
                    "balance": recipientNewBalance
                }
            });
            tId = Transactions.insert({
                toOrg: oId,
                fromUser: Meteor.userId(),
                amount: amount,
                createdAt: new Date(),
                completedAt: new Date()
            });
            sendGiveOrgEmail(recipient, Meteor.user(), tId);
            return true;
        }
    },
    "requestOrg": function(uId, amount) {
        org = Orgs.findOne({
            _id: uId
        });
        // amount = (Math.round(amount * 2) / 2).toFixed(2);
        // recipientNewBalance = parseFloat(recipient.profile.balance) + parseFloat(amount);
        // myNewBalance = parseFloat(Meteor.user().profile.balance) - parseFloat(amount);
        // Meteor.users.update({_id: Meteor.userId()},{$set: {"profile.balance": myNewBalance}});
        // Meteor.users.update({_id: uId},{$set: {"profile.balance": recipientNewBalance}});
        tId = Transactions.insert({
            toOrg: uId,
            fromUser: Meteor.userId(),
            amount: amount,
            createdAt: new Date(),
            completedAt: null
        });
        sendRequestOrgEmail(org, Meteor.user(), tId);
        return true;
    },

    "approveTransactionUser" : function(id){

    	t = Transactions.findOne({_id: id});
 		recipient = t.toTheUser();
    	if(t.fromUser == Meteor.userId()){
    		amount = (Math.round(t.amount * 2) / 2).toFixed(2);
            recipientNewBalance = parseFloat(recipient.profile.balance) + parseFloat(amount);
            myNewBalance = parseFloat(Meteor.user().profile.balance) - parseFloat(amount);
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $set: {
                    "profile.balance": myNewBalance
                }
            });
            Meteor.users.update({
                _id: recipient._id
            }, {
                $set: {
                    "profile.balance": recipientNewBalance
                }
            });
    		Transactions.update({_id: id},{$set: {completedAt: new Date()}});
    		sendApprovalEmailUser(t);
    		return true;
    	}

    },

    "updateUser" : function(user){

    	    	Meteor.users.update({_id: Meteor.userId()},{$set: user});

    	if(user.newPassword){
    		Accounts.setPassword(Meteor.userId(), user.newPassword,{logout: false});
    	}
    	return true;

    },

    "createOrg" : function(org){

        org.creatorId = Meteor.userId();
        org.createdAt = new Date();
        org.approvedAt = null;
        Orgs.insert(org);
        sendOrgCreateRequestEmail(org);
        return true;


    },
        "updateOrg" : function(orgId, org){

                Orgs.update({_id:orgId},{$set: org});

        return true;

    },
    "removeUserFromOrg": function(oId,uId){
        Roles.remove({orgId: oId, userId: uId});
        return true;
    },
    "sendUserOrgInvite" : function(orgId,email){
        to = email;
        from = "noreply@thetimebank.org";

        user = Meteor.users.findOne({"emails.0.address": email});
        org = Orgs.findOne({_id: orgId});
        if(user){
            Roles.insert({orgId: orgId, userId: user._id, admin: false, contact: false});
            subject = "You've been added to the org " + org.name + " on the timebank";
            SSR.compileTemplate('userOrgAddedEmail', Assets.getText('templates/userOrgAddedEmail.html'));

    body = SSR.render('userOrgAddedEmail', {
        org: org,
        sender: Meteor.user()
    });
        }else{
            rid = Roles.insert({orgId: org._id, accepted: false, admin: false, contact: false});
            SSR.compileTemplate("userInviteEmail", Assets.getText("templates/userInviteEmail.html"));

                body = SSR.render('userInviteEmail', {
                    token: rid,
        org: org,
        creator: Meteor.users.findOne({_id: org.creatorId}),
        server: Meteor.absoluteUrl()
    });
                subject = "You've been invited to join the org " + org.name + " on the timebank!";

        }

        Email.send({
        from: from,
        to: to,
        subject: subject,
        text: body
    });



    }

});