
var app = {
	form_pos: 'top',
	change: 'true',
	fill_table: function(results){
		$('#recommendations').empty();
		var temp = ["<li><a href='#","' onClick=app.href('","'><h3>","</h3></a></li>"];
		for(var i=0;i<results.length&&i<9;i++ )
			$('#recommendations').append(temp[0]+results[i].replaceAll(' ','_')+temp[1]+results[i].replaceAll(' ','_')+"') title='Know what "+results[i]+" means'"+temp[2]+results[i]+temp[3]);	
	},
	href: function(string){
		$('#searchvalue')[0].value = string.replaceAll('_',' ');
		app.change = 'false';
		location.hash = string;
	},
	iframe: function(string){
		$('#loader').show();		
		var main_url = "http://en.wiktionary.org/wiki/";
		$('iframe')[0].src = main_url+string;			
		$('#searchvalue').focus();
		console.log(string);
	},
	searchstring: function(value){
		return "https://en.wiktionary.org/w/api.php?action=opensearch&search="+value+"&format=json";
	},
	searchwiki: function(value){
		var url = this.searchstring(value);
		$.get(url,function(data){
			app.re_array = data[1];
		},'jsonp');
	},
	page_retrive: function(searchstring){
		app.AjaxCallbacks();
		var url = "https://en.wiktionary.org/w/api.php?action=query&titles="+searchstring+"&format=json";
		app.searchwiki(searchstring);
		$('#loader').show();
		app.hide();
		app.scrollHandle();
		$.get(url,function(data,status){
			try{
				if(data.query.pages['-1']){
					app.iframe(app.re_array[0]);
					if(app.change == 'true')
						app.fill_table(app.re_array);
					else
						app.change = 'true';
				}
				else{	
					app.iframe(searchstring);
					if(app.change == 'true')
						app.fill_table(app.re_array);
					else	
						app.change = 'true';
				}
			}
			catch(err){}
		},'jsonp');
	},
	hide: function(){
		if($('body').scrollTop()<70){
			$('html, body').animate({ scrollTop: '78px' },'50');
		}
		$('#loader').fadeOut();
	},
	AjaxCallbacks: function(){
		$('body').ajaxError(function (event, xhr, ajaxOptions, thrownError) {
	        if (xhr.status === 404) {
	        console.log("XHR Response: " + xhr);
	     	}
	     });
	},
	scrollHandle: function(){
		if($('body').scrollTop()<44 && app.form_pos =='below'){
			$('#form').css('position','relative');
			$('#form').animate({top:'0',left:'0'});
			app.form_pos = 'top';
		}
		else if($('body').scrollTop()>44 && app.form_pos == 'top'){
			$('#form').css('z-index','1000');
			$('#form').css('position','relative');
			$('#form').animate({top:'100px',left:'120px'});
			app.form_pos = 'below';
		}
		$('#searchvalue').focus();
	},
	wotd: function(){
		var date = new Date();
		var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		var data = 'Wiktionary:Word_of_the_day/{}_{}';
		data = data.replace('{}',months[date.getMonth()]);
		data = data.replace('{}',date.getDate());
		$.ajax({
    		url: 'http://en.wiktionary.org/w/api.php',
    		dataType: 'jsonp',  // will automatically add "?callback=jqueryXXX"
    		cache: true,  // the API complains about the extra parameter
    		data: {  // the parameters to add to the request
     			format: 'json',
    		    action: 'parse',
    		    prop: 'wikitext',
    		    page: data
    		},
	    	success: function(data){
	       		data = data['parse']['wikitext']['*'];
	       		data = data.split('|');
	       		$('#wotd_title')[0].textContent = '  '+data[1];
	       		$('#meaning')[0].textContent = '   '+data[3].split('.')[0];
	    	}
		});
	}
}
jQuery(function(){
	if(location.hash){
		console.log(1);
		app.page_retrive(location.hash.slice(1));
		$('#share')[0].value = document.URL;			
	};
	app.wotd();
	$('#searchvalue').focus();
	String.prototype.replaceAll = function(search, replace){
    	if(!replace) 
       		return this;

    	return this.replace(new RegExp('[' + search + ']', 'g'), replace);
	};
	window.onscroll = app.scrollHandle;
	$(document).keypress(
    		function(event){
				 if (event.which == '13') {
			    event.preventDefault();
				 }
		$('#searchvalue').live('key input change',function(event){
			console.log('2');
			location.hash = $('#searchvalue')[0].value.replace(' ','_');
			$('#share')[0].value = document.URL;
		});	
	});
	window.onhashchange = function(){
		if(location.hash)
			app.page_retrive(location.hash.slice(1));
		else
			window.location.replace('/index.html')
	}
	
})

