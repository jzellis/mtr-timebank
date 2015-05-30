Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/createOrg', function () {

if(Meteor.user()){
	  this.render('createOrg');

}else{
	  this.render('error',{data: {error: "You must be logged in to do this."}});	

}

});

Router.route('/signup/:token', function(){

token = this.params.token;
this.render('inviteSignup', {data: {token:token}});

});


Router.route('/users/:username', function () {
user = 	Meteor.users.findOne({username: this.params.username});
  this.render('user',{data: {user: user}});
});


Router.route('/orgs/:slug', function () {
org =	Orgs.findOne({slug: this.params.slug});
  this.render('org',{data: {org: org}});
});