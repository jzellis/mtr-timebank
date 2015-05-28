Meteor.startup(function(){

if(Meteor.users.find({}).count() === 0){

id = Accounts.createUser({
	username: "jzellis",
	email: "jzellis@gmail.com",
	profile: {
		avatar: "/avatar.png",
		name: "Joshua Ellis",
		balance: 0,
		favoriteUsers: [],
		favoriteOrgs: []
	}
});

Roles.insert({orgId: "system", userId: id, admin: true});

Accounts.sendEnrollmentEmail(id);

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

Roles.insert({orgId: orgId, userId: id, admin: true});

}

});