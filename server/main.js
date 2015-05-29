Accounts.onCreateUser(function(options, user) {
  if (options.profile){
  	if(!options.profile.avatar) options.profile.avatar = "/avatar.png";
  	options.profile.balance = 0;
  	options.profile.favoriteUsers = [];
  	options.profile.favoriteOrgs = [];
    user.profile = options.profile;
}
  return user;
});


Meteor.startup(function(){

if(Meteor.users.find({}).count() === 0){

id = Accounts.createUser({
	username: "jzellis",
	email: "jzellis@gmail.com",
	profile: {
		avatar: "/avatar.png",
		name: "Joshua Ellis",
		balance: 1000,
		favoriteUsers: [],
		favoriteOrgs: []
	}
});

Roles.insert({orgId: "system", userId: id, admin: true});
Accounts.sendEnrollmentEmail(id);


idb = Accounts.createUser({
	username: "xopug",
	email: "davidryal@gmail.com",
	profile: {
		avatar: "/avatar.png",
		name: "David Anderson",
		balance: 1000,
		favoriteUsers: [],
		favoriteOrgs: []
	}
});

Roles.insert({orgId: "system", userId: idb, admin: true});

Accounts.sendEnrollmentEmail(idb);

Accounts.createUser({
	username: "testuser",
	email: "test@testuser.com",
	password: "testy12345",
	profile: {
		avatar: "/avatar.png",
		name: "Test User",
		balance: 0,
		favoriteUsers: [],
		favoriteOrgs: []
	}
});

orgId = Orgs.insert({
	name: "Test Org",
	slug: "test-org",
	avatar: "/org.png",
	description: "This is a test organization.",
	balance: 0
});

Roles.insert({orgId: orgId, userId: id, admin: true,contact:true});
Roles.insert({orgId: orgId, userId: idb, admin: true,contact:true});

}

});