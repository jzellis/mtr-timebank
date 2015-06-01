Template.registerHelper("siteName", function(){
	
return siteConfig.findOne({name: "name"}).value;


});