Template.install.events({
	
'submit form' : function(e){
	e.preventDefault();

	if(Meteor.users.find().count() === 0){

Accounts.createUser({
            username : $('input[name="username"]').val(),
    		email: $('input[name="email"]').val(),
            password: $('input[name="password"]').val(),
    		profile: {
            name : $('input[name="name"]').val(),
    		avatar : $('img.avatar').attr('src'),
            url : $('input[name="url"]').val(),
            balance: $('input[name="balance"]').val(),
            favoriteUsers: [],
            favoriteOrgs: []
        }
        }, function(){

        	Roles.insert({orgId: "system", userId: Meteor.userId(), admin: true, contact: true, accepted: true});

        });


site = {
	name: $('input[name="sitename"]').val(),
	currency: $('input[name="currency"]').val(),
	currencyPlural: $('input[name="currencyPlural"]').val()
}

siteConfig.insert({name: "name", value: site.name});
siteConfig.insert({name: "currency", value: site.currency});
siteConfig.insert({name: "currencyPlural", value: site.currencyPlural});

}

}

});