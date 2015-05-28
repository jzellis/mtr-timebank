Template.searchForm.events({
	'submit form#searchForm' : function(e){
		$('#results').html("<h1 class='text-center text-muted'><i class='fa fa-spin fa-spinner'></i> Searching...</h1>")
	e.preventDefault();
	query = $('input.search').val();
	Meteor.call("search", query, function(err,data){
		$('#results').html('');
		Blaze.renderWithData(Template.searchResults, data, $('#results')[0]);
	});
	}
});