/*
 * 	Initialization for Twitter Search
 * 
 * 	@author Saneyuki Tadokoro <post@saneyuki.gfunction.com>
 * 	@version 1.0
 * 
 * 	Copyright (c) 2011 +place project
*/

gfxt.initialize = function(){
	
	/*
	 * Import base and template package
	 * from the high privileged package management system
	 */
	var base = gfxt.sys( 'base' ),
		temp = gfxt.sys( 'template' ),
		hmon = gfxt.sys( 'hash_monitor' ),
		twit = gfxt.sys( 'twitter' ),
		msg  = gfxt.sys( 'core' ).getPackageInfo( 'messages' );
		
		
	
	/*
	 * Initialization
	 */
	var indexOf = function( target, value ){
		for( var i = 0; target && target[ i ]; i++ ){
			if( target[ i ] === false )
				return r;
		}
		return -1;
	};



	/*
	 * <!> CAUTION
	 * This process needs same number of username text, date text and calendar elements.
	 */
	var fid = [
		'search-in-home', 'search-in-result', 'search-in-cache'
	];
	
	var parts = (function(){
		var id, elem, form, ary = [];
		for( var i = 0; fid[ i ]; i++ ){
			id = fid[ i ];
			ary[ id ] = [];
			form = document.getElementById( id );
			
			for( var j = 0; form.getElementsByTagName('*')[ j ]; j++ ){
				elem = form.getElementsByTagName('*')[ j ];
				switch( elem.getAttribute( 'data-search-sort' ) ){
					case 'username':
						ary[ id ][ 'username' ] = elem;
						break;
					case 'date':
						ary[ id ][ 'date' ] = elem;
						break;
					case 'button':
						ary[ id ][ 'button' ] = elem;
						break;
				}
				switch( elem.getAttribute( 'data-input-type' ) ){
					case 'calendar':
						ary[ id ][ 'calendar' ] = elem;
						break;
				}
			}
		}
		
		return ary;
	})();
	
	// Set requester of text
	for( var id, i = 0; fid[ i ]; i++ ){
		id = fid[ i ];
		// Order of color: Hints, Typed, Current background, Error background
		temp.setSearchHints( parts[ id ][ 'username' ], msg.username, '#A2A2A2', '#000000', '#FFFFFF', '#f4c8c8' );
	}
	
	
	
	/*
	 * Set date
	 */
	var setDateListener = function( textElement, inputTarget ){
		return function(){
			var date = new Date(),
				sy = date.getYear();
			sy = sy >= 2000 ? sy : sy + 1900;
			sm = date.getMonth() + 1;
			// Create a calendar
			var cal = temp.createCalendar( sy, sm, function( y, m, d ){
				textElement.validMethod();
				textElement.value = [ y, '-', m, '-', d ].join('');
			} );
			inputTarget.appendChild( cal );
		};
	};
	
	for( var type, lis, i = 0; fid[ i ]; i++){
		type = parts[ fid[ i ] ];
		lis = setDateListener( type[ 'date' ], type[ 'calendar' ] );
		temp.setSearchHints( type[ 'date' ], msg.date, '#A2A2A2', '#000000', '#FFFFFF', '#f4c8c8' );
		base.addEvent( 'mousedown', lis, type[ 'date' ] );
	}
	
	
	
	/*
	 * Set button
	 */
	var setRequester = function( formId, usernameText, dateText ){
		return function(){
			var res,
				err = false,
				r = temp.getSearchValues( formId );
			var u = String(r.username),
				y = String(r.year),
				m = String(r.month),
				d = String(r.date);

			if( usernameText.isTyped() === false ){
				err = true;
				usernameText.errorMethod();
			}
			if( !u.match( /^(@|[A-Z]|[a-z]|[0-9]|_)([A-Z]|[a-z]|[0-9]|_)*(\b|[A-Z]|[a-z]|[0-9]|_)$/ ) ){
				err = true;
				usernameText.errorMethod();
			}
			if( y.match( /^[0-9]*$/ ) == null || m.match( /^[0-9]*$/ ) == null || d.match( /^[0-9]*$/ ) == null ){
				err = true;
				dateText.errorMethod();
			}
			
			if( err === true ){
				return false;
			}
						
			// Remove '@'
			if( u.match( /^@.*/ ) )
				u = u.slice( 1 );
							
			// Make query string
			var qstr = encodeURI( '!page=search;username=' + u + ';year=' + y + ';month=' + m + ';date=' + d );
		
			// Set hash & request them
			hmon.setHash( qstr );
			
			return false;
		};
	};
	
	for( var type, req, i = 0; fid[ i ]; i++ ){
		type = parts[ fid[ i ] ];
		req = setRequester( fid[ i ], type[ 'username' ], type[ 'date' ] );
		base.addEvent( 'click', req, type[ 'button' ] );
	}
	
	
	
	/*
	 * Reseting search form method
	 */
	var resetSearchForms = function(){
		for( var type, i = 0; fid[ i ]; i++ ){
			type = parts[ fid[ i ] ];
			type[ 'username' ].resetMethod();
			type[ 'date' ].resetMethod();
			
			if( type[ 'calendar' ].childNodes.length > 0 ){
				base.removeChildren( type[ 'calendar' ] );
			}
		}
	};
	
	
	
	/*
	 * Changing date method
	 */
	var mon = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
	var prd = document.getElementById( 'previous-day' ),
		nxd = document.getElementById( 'next-day' );
		
	// Searching previous day
	var searchPrevious = function(){
		var v = temp.parseHash( location.hash );
		var u = v.username,
			y = v.year,
			m = v.month,
			d = v.date;
			
		if( d == 1 ){
			if( m == 1 ){
				m = 12;
				y--;
			}
			else if ( m == 3 ){
				mon[ 1 ] = 28 + ( y % 4 ? 0 : y % 100 ? 1 : y % 400 ? 0 : 1 );
				m--;
			}
			else{
				m--;
			}
			d = mon[ m - 1 ];
		}
		else{
			d--;
		}
		
		var qstr = encodeURI( '!page=search;username=' + u + ';year=' + y + ';month=' + m + ';date=' + d );
		hmon.setHash( qstr );
	};
	
	// Searching next day
	var searchNext = function(){
		var v = temp.parseHash( location.hash );
		var u = v.username,
			y = v.year,
			m = v.month,
			d = v.date;
		var allDay = mon[ m - 1 ];
			
		if( d == allDay ){
			if( m == 12 ){
				m = 1;
				y++;
			}
			else if( m == 1 ){
				mon[ 1 ] = 28 + ( y % 4 ? 0 : y % 100 ? 1 : y % 400 ? 0 : 1 );
				m++;
			}
			else{
				m++;
			}
			d = 1;
		}
		else{
			d++;
		}
		
		var qstr = encodeURI( '!page=search;username=' + u + ';year=' + y + ';month=' + m + ';date=' + d );
		hmon.setHash( qstr );
	};
	
	// For previous day
	base.addEvent( 'mousedown', searchPrevious, prd );
	// For next day
	base.addEvent( 'mousedown', searchNext, nxd );
	
	
	
	// Set cache viewer
	var cv = base.getElementsByDataset( 'input-type', 'cache-viewer' ),
		tws = document.getElementById( 'cache' );
	
	var setListMaker = function( elem, un, n, isrc ){
		base.addEvent( 'mousedown', function(){
			if( tws.childNodes.length > 0 ){
				base.removeChildren( tws );
			}
				
			var ca = twit.getAllCache(),
				daAry = [],
				line_Ttl = document.createElement( 'tr' ),
				coun_Ttl = document.createElement( 'td' ),
				con_Ttl = document.createElement( 'td' ),
				coico_Ttl = document.createElement( 'td' ),
				ico_Ttl = document.createElement( 'img' );
			
			ico_Ttl.src = isrc;
			line_Ttl.className = 'cache-line';
			coun_Ttl.className = 'cache-username';
			con_Ttl.className = 'cache-name';
			coico_Ttl.className = 'cache-icon';
			
			coun_Ttl.appendChild( document.createTextNode( un ) );
			con_Ttl.appendChild( document.createTextNode( n ) );
			coico_Ttl.appendChild( ico_Ttl );
			line_Ttl.appendChild( coico_Ttl );
			line_Ttl.appendChild( coun_Ttl );
			line_Ttl.appendChild( con_Ttl );
			tws.appendChild( line_Ttl );
			
			un = un.toLowerCase();
			
			
			for( var i = 0, num = 1; ca[ un ][ i ]; i++ ){
				var it = ca[ un ][ i ].item;
				
				for( var j = 0; it[ j ]; j++ ){
					var d = it[ j ];
					var r = (function(){
						for( var k = 0; daAry[ k ]; k++ ){
							if( daAry[ k ][ 0 ] == d.year && daAry[ k ][ 1 ] == d.month && daAry[ k ][ 2 ] == d.date )
								return daAry;
						}
						return -1;
					})();
					
					if( r == -1){
						var line = document.createElement( 'tr' ),
							conum = document.createElement( 'td' ),
							coda = document.createElement( 'td' );
							
						conum.appendChild( document.createTextNode( num ) );
						coda.appendChild( document.createTextNode( [ d.year, '-', d.month, '-', d.date ].join('') ) );
						line.appendChild( conum );
						line.appendChild( coda );
						tws.appendChild( line );
						
						line.className = 'cache-date-line';
						line.onmousedown = (function(){
							var hash = [ '!page=search;username=', un, ';year=', d.year, ';month=', d.month, ';date=', d.date ].join('');
							return function(){
								hmon.setHash( hash );
							};
						})();
						
						daAry.push( [ d.year, d.month, d.date ] );
						num++;
					}
				}
			}
		}, elem );
	};
	var cvLis = function(){
		if( tws.childNodes.length > 0 ){
			base.removeChildren( tws );
		}
		
		// start
		var ud = twit.getAllUser();
		for( var j in ud ){
			var d = ud[ j ],
				line = document.createElement( 'tr' ),
				coun = document.createElement( 'td' ),
				con = document.createElement( 'td' ),
				coico = document.createElement( 'td' ),
				ico = document.createElement( 'img' );
				
			ico.src = d[ 'profile_image_url' ];
			line.className = 'cache-line';
			coun.className = 'cache-username';
			con.className = 'cache-name';
			coico.className = 'cache-icon';
			
			coun.appendChild( document.createTextNode( d[ 'screen_name' ] ) );
			con.appendChild( document.createTextNode( d[ 'name' ] ) );
			coico.appendChild( ico );
			line.appendChild( coico );
			line.appendChild( coun );
			line.appendChild( con );
			tws.appendChild( line );
			
			setListMaker( line, d[ 'screen_name' ], d[ 'name' ], d[ 'profile_image_url' ] );
		}
	};
	for( var i = 0; cv[ i ]; i++ ){
		base.addEvent( 'mousedown', function(){cvLis();}, cv[ i ] );
	}
	
	
	
	/*
	 * Set middle keeper
	 */
	var hb = document.getElementById( 'home-body' );
	var middleKeeper = function(){
		var t = gfxt.uAgent.clientHeight / 2 - hb.offsetHeight / 2;
		if( t >= 0 )
			hb.style.top = t + 'px';
		else if( t < 0){
			hb.style.top = '0px';
		}
	};
	
	base.addEvent( 'resize', middleKeeper );
	
	
	
	/*
	 * Add event listener to hash monitor
	 */
	var reqController;
	var stopReq = function(){
		if( 
			typeof reqController == 'object'
			&& typeof reqController.stop == 'function'
			&& reqController.valid === true
		){	
			reqController.stop();	// Stop Request
			reqController.valid = false;
		}
	};
	
	// Set hash monitor
	hmon.addEvent( function( hash ){
		stopReq();
		resetSearchForms();
		
		if( hash == '' || hash == '#!page=top' ){
			middleKeeper();
		}
		else if( hash == '#!page=cache' ){
			cvLis();
		}
		else if( hash.match( /page=search/ ) ){
			var v = temp.parseHash( hash );
			var u = v.username,
				y = v.year,
				m = v.month,
				d = v.date,
				p = v.page;
				
			reqController = temp.request( u, y, m, d, p );
			reqController.valid = true;
			temp.mirrorSearchValues( 'search-in-result', u, y, m, d );
		}
	} );
	
	
	
	// Startup hash monitor
	hmon.startupMonitor();
	
	// Hide page loader
	document.getElementById( 'loading-page' ).style.display = 'none';
	
	// This initializer will NOT use again.
	gfxt.initialize = function(){};
};

// Apply initializer
window.onload = gfxt.initialize;