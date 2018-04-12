
var defaultPageSize = 8
displayImages(defaultPageSize)

function displayImages (per_page) {
  var restCall = apiParams.url + '&api_key=' + apiParams.API_KEY + '&user_id=' + apiParams.userId + '&format=json&nojsoncallback=1&per_page=' + per_page
  var title 		= 	getPageHeader()
  var amountOfPages
  $.ajax({
    url: restCall,
    async: true,
    success: function (response) {
      var pictureCount = response.photos.total
      amountOfPages = Math.ceil((pictureCount) / per_page)
      if (response.stat.toLowerCase() === 'ok') {
        $('#appdashboard').empty().append(title + "'s Gallery")
        $('#flickr').empty()
        var items = []
        $.each(response.photos.photo, function (i, data) {
          var src = 'https://farm' + data.farm + '.staticflickr.com/' + data.server + '/' + data.id + '_' + data.secret + '.jpg'
					    items.push('<div class="col-lg-3 col-md-4 col-xs-6"><a href="#" class="d-block mb-4 h-100"><img id="' + data.id + '" onclick="event.preventDefault(); me(this);" imgtitle="' + data.title + '" class="img-fluid img-thumbnail small" src="' + src + '"></a></div>')
        })
        $('#flickr').empty().append(items.join(''))
        if ($('.pagination').data('twbs-pagination')) {
	                    $('.pagination').twbsPagination('destroy')
	                }
        $('.pagination').twbsPagination({
					    totalPages: amountOfPages,
					    visiblePages: 10,
					    onPageClick: function (event, page) {
					        event.preventDefault()
					        getMyLink(per_page, page)
					    }
        })
      }
      if (response.stat.toLowerCase() === 'fail') {
        console.log('Failed to make connection!')
      }
    },
    error: function (response) {

    }
  })
}

function getMyLink (per_page, link) {
  var id 		= 	link
  restCall = apiParams.url + '&api_key=' + apiParams.API_KEY + '&user_id=' + apiParams.userId + '&format=json&nojsoncallback=1&per_page=' + per_page + '&page=' + id
  $.ajax({
    url: restCall,
    success: function (response) {
      var pictureCount = response.photos.total
      amountOfPages = Math.ceil((pictureCount) / per_page)
      if (response.stat.toLowerCase() === 'ok') {
        $('#flickr').empty()
        var items = []
        $.each(response.photos.photo, function (i, data) {
          var src = 'https://farm' + data.farm + '.staticflickr.com/' + data.server + '/' + data.id + '_' + data.secret + '.jpg'
					    items.push('<div class="col-lg-3 col-md-4 col-xs-6"><a href="#" class="d-block mb-4 h-100"><img id="' + data.id + '" onclick="event.preventDefault(); me(this);" imgtitle="' + data.title + '" class="img-fluid img-thumbnail small" src=' + src + '></a></div>')
        })
        $('#flickr').empty().append(items.join(''))
      }
      if (response.stat.toLowerCase() === 'fail') {
        console.log('Failed to make connection!')
      }
    },
    error: function (response) {

    }
  })
}

function getPageHeader () {
  const apiCall = apiParams.userData + '&api_key=' + apiParams.API_KEY + '&user_id=' + apiParams.userId + '&format=json&nojsoncallback=1'
  var title
  $.ajax({
    url: apiCall,
    async: false,
    success: function (response) {
      title = response.person.realname._content
    }
  })
  return title
}

$('#sel1').change(function () {
  var newPageDisplay = $('#sel1 option:selected').text()
  displayImages(newPageDisplay)
})

$('#appName').click(function () {
  $('#sel1').val('8')
  displayImages(defaultPageSize)
})

function me (wee) {
  var id 			= $(wee).attr('imgtitle')
  var modalImgsrc = $(wee)[0]['src']
  $('#currentImage').text(id)
  $('#imgbody').empty().append('<img class="center-block enlarged" style="width: auto; height: auto;" src="' + modalImgsrc + '" >')
  $('#myModal').modal()
}
