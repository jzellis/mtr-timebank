Template.searchForm.events({
	'submit form#searchForm' : function(e){
	e.preventDefault();
	query = $('input.search').val();
	Meteor.call("search", query, function(err,data){
		$('#results').html('');
		Blaze.renderWithData(Template.searchResults, data, $('#results')[0]);
	});
	}
});