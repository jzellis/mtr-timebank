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
            tags: $('input.tagInput').tagsinput('items'),
            favorites: {
                users: [],
            orgs: []
        }
        }
        }, function(){

            site = {
    name: $('input[name="sitename"]').val(),
    currency: $('input[name="currency"]').val(),
    currencyPlural: $('input[name="currencyPlural"]').val(),
    currencySymbol: $('input[name="currencySymbol"]').val()

}

            Meteor.call("installSite", site, function(e,d){
                Router.go("/admin");
            })
        });




}

}

});