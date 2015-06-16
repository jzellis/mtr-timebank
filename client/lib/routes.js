Router.configure({
  layoutTemplate: 'layout'
});

// Router.onBeforeAction(function () {
//   var rt = this;
//     Meteor.subscribe("users", { onReady: function(){

//     if (Meteor.users && Meteor.users.find().count() === 0) {
//         rt.redirect('/install');
//                 rt.next();} else {
//         // required by Iron to process the route handler
//         rt.next();
//     }
//   }});
// });

Router.route('/', {
    name: "home",
    template: "home",
    subscriptions: function(){
        return [
        Meteor.subscribe("myFavorites")
        ]

    },
    action: function () {
    if (this.ready()) {
      this.render();
    } else {
      this.render('loading');
    }
  },
    data: function(){
        return {}
    },
    title: function() {
    },
    parent: "home"
});

Router.route('/install', {
    name: "install",
    template: "install",
    subscriptions: function(){
        return [
        ]

    },
    action: function () {
    if (this.ready()) {
      this.render('install');
    } else {
      this.render('loading');
    }
  },
    data: function(){
        return {}
    },
    title: function() {
    },
    parent: "install"
});

Router.route('/users/:username', {
    name: "user",
    template: "user",
    subscriptions: function(){
      subs = [
        Meteor.subscribe("userByUsername", this.params.username)
        ];
        if(this.params.username == Meteor.user().username) subs.push(Meteor.subscribe("myTransactions"))
        return subs;

    },
    action: function () {
    if (this.ready()) {
      this.render("user");
    } else {
      this.render('loading');
    }
  },
    data: function(){
        return {
          user: Meteor.users.findOne({username: this.params.username})
        }
    },
    title: function() {
    },
    parent: "homr"
});

// Router.route('/', function () {
//   this.render('home');
// });

// Router.route('/createOrg', function () {

// if(Meteor.user()){
// 	  this.render('createOrg');

// }else{
// 	  this.render('error',{data: {error: "You must be logged in to do this."}});	

// }

// });

// Router.route('/signup/:token', function(){

// token = this.params.token;
// this.render('inviteSignup', {data: {token:token}});

// });


// Router.route('/users/:username', function () {
// user = 	Meteor.users.findOne({username: this.params.username});
//   this.render('user',{data: {user: user}});
// });


// Router.route('/orgs/:slug', function () {
// org =	Orgs.findOne({slug: this.params.slug});
//   this.render('org',{data: {org: org}});
// });


// Router.route('/admin', function () {
// // this.wait(Meteor.subscribe('users'));	
// if(this.ready()){
// if(Meteor.users.find().count() === 0){
// this.render('install');
// }else{
// 	pendingOrgs = Orgs.find({approvedAt: null});
// 	numUsers = Meteor.users.find().count();
// 	numOrgs = Orgs.find({approvedAt: {$ne: null}}).count()
// 	transactions = Transactions.find({},{skip: 0, limit: 25})
//   this.render('admin', {
//   	data: {
//   		pendingOrgs: pendingOrgs,
//   		numUsers: numUsers,
//   		numOrgs: numOrgs,
//   		transactions: transactions

//   	}});

// }

// }

// });