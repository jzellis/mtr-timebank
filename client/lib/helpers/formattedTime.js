Template.registerHelper("formattedTime", function(date){

	return moment(date).format("MMM DD, YYYY hh:mma");

});