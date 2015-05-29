Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/users/:username', function () {
user = 	Meteor.users.findOne({username: this.params.username});
  this.render('user',{data: {user: user}});
});

Router.route('/orgs/:slug', function () {
org =	Orgs.findOne({slug: this.params.slug});
  this.render('org',{data: {org: org}});
});