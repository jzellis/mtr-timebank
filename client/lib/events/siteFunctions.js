Template.registerHelper("siteName", function(){
	      	if(siteConfig.findOne({name: "name"})) return siteConfig.findOne({name: "name"}).value;



});

Template.registerHelper("config", function(opt){
	      	if(siteConfig.findOne({name: opt})) return siteConfig.findOne({name: opt}).value;



});