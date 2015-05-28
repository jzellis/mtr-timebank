Template.registerHelper("count", function(o){
	if(typeof(o) == "object" && 'collection' in o){
		return o.count();
	}else{return o.length;}
});