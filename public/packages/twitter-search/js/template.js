/*
 * 	Web template for Twitter Search
 *  
 * 	Copyright (c) 2011 +place project
 * 
 * 	@author		Saneyuki Tadokoro
 * 	@version	1.0
*/

(function( gfxt ){
	
	/*
	 * Import base and message package
	 * from the high privileged package management system
	 */
	var base = gfxt.sys( 'base' ),
		msg  = gfxt.sys( ).getPackageInfo( 'messages' );
	
	
	
	/*
	 * Make template package
	 */
	var p = (function(){
		var ACTIVE = null;
		var TIMER = null;
		
		/*
		 * Template package core
		 */
		var core = function(){
			var method = {
				
				
				/*
				 * Activate container
				 */
				activateContainer: function( id ){
					// Get container
					var co = document.getElementById( id );
					if( method.isActiveContainer( id ) || typeof co != 'object' )
						return false;	// Not activated
						
					// Hide active container if it exists
					if( ACTIVE )
						ACTIVE.style.display = 'none';
						
					co.style.display = 'block';
					ACTIVE = co;	// Apply new active container

					return true;	// Success
				},
				
				
				/*
				 * Check if specified container is activated or not
				 */
				isActiveContainer: function( id ){
					var co = document.getElementById( id );
					return ACTIVE == co;
				},
				
				
				/*
				 * Get active container
				 */
				getActiveContainer: function(){
					return ACTIVE;
				},
				
				
				/*
				 * Get active ID
				 */
				getActiveContainerId: function(){
					return ACTIVE.id;
				},
				
				
				/*
				 * Get container contents by Ajax
				 */
				getContainerContents: function( id, fileName, callback, changeFlag ){
					if( changeFlag === true ){
						var ldr = document.getElementById( 'loading-page' );
						ldr.style.display = 'block';
						method.activateContainer( id );
					}
					
					// For response method parameter
					var func = function( rTxt ){
						var elem = document.getElementById( id );
						elem.innerHTML = rTxt;
						if( changeFlag === true )
							ldr.style.display = 'none';	// Hide
						if( typeof callback == 'function' ){
							callback();
						}
					};
					var param = {
						responseType: 'TXT',
						method: 'GET',
						async: true,
						cache: false,
						postData: null,
						fileName: fileName,
						callback: func
					};
					
					base.getResponse( param );
				},
				
				
				/*
				 * Set search hints
				 */
				setSearchHints: function( target, value, deactiveColor, activeColor, normalBg, errorBg ){
					var err, f, g = true;	// This flag shows if hints can be displayed or not.
					
					target.value = value;
					target.style.color = deactiveColor;
					target.style.backgroundColor = normalBg;
					
					base.addEvent( 'mousedown', function(){
						if( target.value != '' ){
							if( g ){
								target.value = '';
								target.style.color = activeColor;
								g = false;
							}
						}
						else{
							return false;
						}
					}, target );
					
					base.addEvent( 'mouseover', function(){
						f = false;
					}, target );
					
					base.addEvent( 'mouseout', function(){
						f = true;
					}, target );
					
					base.addEvent( 'mousedown', function(){
						if(!f || target.value != '') return false;
						target.value = value;
						target.style.color = deactiveColor;
						g = true;
					} );
					
					// Add methods
					var addMe = {
						resetMethod: function(){
							target.style.color = deactiveColor;
							target.style.backgroundColor = normalBg;
							target.value = value;
							f = false;
							g = true;
							err = false;
						},
						
						validMethod: function(){
							target.style.color = activeColor;
							g = false;	// This value 
						},
						
						isTyped: function(){
							return !g;
						},
						
						errorMethod: function(){
							err = true;
							target.style.backgroundColor = errorBg;
						},
						
						delErrorMethod: function(){
							if(err !== true)
								return false;
							err = false;
							target.style.backgroundColor = normalBg;
						}
					};
					
					base.extend( target, addMe );
				},
				
				
				/*
				 * Request 
				 */
				request: function( username, year, month, date, page ){
					var stop = false,
						reqPage = 0;
					var u = String( username ),
						y = String( year ),
						m = String( month ),
						d = String( date ),
						p = String( page );

					// Check strings
					if( !u.match( /^(@|[A-Z]|[a-z]|[0-9]|_)([A-Z]|[a-z]|[0-9]|_)*(\b|[A-Z]|[a-z]|[0-9]|_)$/ ) )
						return 'E:username';
					if( !y.match( /[0-9]*/ ) || !m.match( /[0-9]*/ ) || !d.match( /[0-9]*/ ) )
						return 'E:date';
					if( p != 'search' )
						return 'E:page';
						
					// Remove '@'
					if( u.match( /^@.*/ ) )
						u = u.slice( 1 );
					
					// Get format
					var df = method.getDateFormat(),
						sf = method.getStatusFormat();	
					df[ df[ 'year_num' ] ] = y;
					df[ df[ 'month_num' ] ] = msg.monthStr[ m - 1 ];
					df[ df[ 'date_num' ] ] = d;
					sf[ sf[ 'username_num' ] ] = '@' + u;
					sf[ sf[ 'date_num' ] ] = df.join('');
					
					// Create tweets
					var create = function( result ){
						var ss = result.searchStatus;
						method.alterSearchStatus( ss.results + msg.results, ' - ' + sf.slice( 0, 2 ).join(''), sf.slice( 2, 4 ).join(''), '&nbsp;' );
						method.hideAjaxLoader();
						method.showOtherDay();
						method.createTweets( result, 15 );
								
						if( result.item.length > 15 )
							method.showAddition( result, 15, 15 );
					};
					
					// Retry to request
					var retry = function(){
						reqPage++;
						method.alterSearchStatus( msg.searching, ' ', ' ', msg.page + (reqPage + 1) + '/10' );
						tp().getUserTimeline( u, y, m, d, reqPage, receive );
					};
					
					// Show users there is no result
					var noResult = function(){
						method.alterSearchStatus( '0' + msg.results, ' - ' + sf.slice( 0, 2 ).join(''), sf.slice( 2, 4 ).join(''), '&nbsp;' );
						method.hideAjaxLoader();
						method.showOtherDay();
					};
					
					// Show users this system cannot find tweets
					var notFound = function(){
						method.alterSearchStatus( '0' + msg.results, ' - ' + sf.slice( 0, 2 ).join(''), sf.slice( 2, 4 ).join(''), '&nbsp;' );
						method.hideAjaxLoader();
						method.showOtherDay();
						
						var ca = tp().getOtherDate( u, y, m, d );
						if( ca ){
							method.showMessage('\
								<p style="font-weight: bold;">' + msg.notFound + '</p>\
								<p style="font-size: 12px;">' + msg.nearDate + ' <a href="#!page=search;username=' + u + ';year=' + ca.year + ';month=' + ca.month + ';date=' + ca.date + '">' + ca.year + '-' + ca.month + '-' + ca.date + '</a></p>\
							');
						}
						else{
							method.showMessage( msg.noneTweets );
						}
					};
					
					// Show users nonexistence
					var nonexistence = function(){
						method.alterSearchStatus( '0' + msg.results, ' - ' + sf.slice( 0, 2 ).join(''), sf.slice( 2, 4 ).join(''), '&nbsp;' );
						method.showMessage( msg.nonexistence );
						method.hideAjaxLoader();
					};
					
					// Show users limited
					var limit = function(){
						var lim = tp().getLimit(),
							da = new Date( lim[ 'reset_time' ] );
	
						// Other time format
						if( !da ){
							var sd = lim[ 'reset_time' ].split(' ');
							var xd = sd[ 0 ] + " " + sd[ 1 ] + " " + sd[ 2 ] + " " + sd[ 5 ] + " " + sd[ 3 ] + " " + sd[ 4 ];
							da = new Date( xd );
						}
						method.alterSearchStatus( '0' + msg.results, ' - ' + sf.slice( 0, 2 ).join(''), sf.slice( 2, 4 ).join(''), '&nbsp;' );
						method.showMessage( msg.limited + da );
						method.hideAjaxLoader();
					};
					
					// Receive data
					var receive = function( data ){
						if( stop === true ){
							return false;
						}
						
						if( typeof data != 'string' ){
							var ren = method.getMatchData( data, y, m, d );
							
							if( ren.item && ren.item.length > 0 ){
								create( ren );
							}
							else if( ren == 'E:not_found' ){
								retry();
							}
							else{
								noResult();
							}
						}
						else if( data == 'E:nonexistence' ){
							nonexistence();
						}
						else if( data == 'E:not_found' ){
							notFound();
						}
						else if( data == 'E:limited' ){
							limit();
						}
						else{
							noResult();
						}
					};
					
					// Initialize
					method.deleteAllTweets();
					method.alterSearchStatus( msg.searching, ' ', ' ', msg.page + (reqPage + 1) + '/10' );
					method.showAjaxLoader();
					method.hideOtherDay();
					method.hideMessage();
					method.hideAddition();
					
					// Request and get request controller
					var reqController = tp().getUserTimeline( u, y, m, d, reqPage, receive );
					
					return {
						stop: function(){
							reqController.stop();
							stop = true;
						}
					};
				},
				
				
				createCalendar: function( y, m, cb ){
					var mon = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
					var da = mon[ m - 1 ];
					var dof = ( new Date( y, m - 1, 1, 0, 0, 0 ) ).getDay();
					var calarr = new Array();
					var df = method.getDateFormat();
					df[ df[ 'year_num' ] ] = y;
					df[ df[ 'month_num' ] ] = msg.monthStr[ m - 1 ];
					df[ df[ 'date_num' ] ] = '';
					df[ df[ 'date_num' ] + 1 ] = '';
					
					if( m == 2 ){
						da += y % 4 ? 0 : y % 100 ? 1 : y % 400 ? 0 : 1;
					}
					
					for( var d = 1; d <= da; d++){
						calarr[ d + dof - 1 ] = d;
					}
					
					var applyCb = function( elem, y, m, d ){
						base.addEvent( 'mousedown', function(){
							cb( y, m, d );
						}, elem);
					};
					
					var cal = document.createElement( 'div' );
					var calhd = document.createElement( 'table' ),
						hd = document.createElement( 'tr' ),
						cr = document.createElement( 'th' ),
						prm = document.createElement( 'th' ),
						nxm = document.createElement( 'th' );
						cr.innerHTML = df.join('');
						prm.innerHTML = '<<';
						nxm.innerHTML = '>>';
						prm.style.width = '10px';
						prm.style.cursor = 'pointer';
						nxm.style.width = '10px';
						nxm.style.cursor = 'pointer';
						calhd.style.width = '100%';
						hd.appendChild(prm);
						hd.appendChild(cr);
						hd.appendChild(nxm);
						calhd.appendChild(hd);
						cal.appendChild(calhd);
						base.addEvent( 'mousedown', function(){
							var ny = y, nm = m;
							if(nm == 1){
								ny--;
								nm = 12;
							}
							else{
								nm--;
							}
							var newCal = method.createCalendar( ny, nm, cb );
							cal.parentNode.replaceChild( newCal, cal );
						}, prm);
						base.addEvent( 'mousedown', function(){
							var ny = y, nm = m;
							if(nm == 12){
								ny++;
								nm = 1;
							}
							else{
								nm++;
							}
							var newCal = method.createCalendar( ny, nm, cb );
							cal.parentNode.replaceChild( newCal, cal );
						}, nxm);
					var calTable = document.createElement( 'table' );
					var day, date, week,
						calbd = document.createElement( 'tbody' ),
						calDays = document.createElement( 'tr' );
					for( var i = 0; i < 7; i++){
						day = document.createElement( 'th' );
						day.className = 'calendar-day';
						day.appendChild( document.createTextNode( msg.dayStr[ i ] ) );
						calDays.appendChild( day );
					}
					calbd.appendChild( calDays );
					for( var j = 0, l = calarr.length; j < l; j++){
						if( j % 7 == 0)
							week = document.createElement( 'tr' );
						date = document.createElement( 'td' );
						if( calarr[ j ]){
							date.appendChild( document.createTextNode( calarr[ j ] ) );
							date.className = 'calendar-date';
							if( typeof cb == 'function' )
								applyCb( date, y, m, calarr[ j ] );
						}
						week.appendChild( date );
						if( j % 7 == 6)
							calbd.appendChild( week );
					}
					calbd.appendChild( week );
					calTable.appendChild( calbd );
					cal.appendChild(calTable);
					calTable.className = 'calendar-table';
					
					var calft = document.createElement( 'div' );
					calft.style.width = '100%';
					calft.style.textAlign = 'center';
					calft.style.paddingTop = '5px';
					calft.style.borderTop = '1px solid #E5E5E5';
					calft.style.cursor = 'pointer';
					calft.innerHTML = msg.done;
					base.addEvent( 'mousedown', function(){
						base.removeChildren(cal.parentNode);
					}, calft);
					cal.appendChild(calft);
					cal.className = 'calendar';
					
					return cal;
				},
				
				
				createTweets: function( data, number ){
					var it;
					for( var i = 0 ; data.item[ i ] && i < number ; i++ ){
						it = data.item[ i ];
						method.createTweet( it );
					}
				},
				
				
				createTweet: function( v ){
					var df = method.getDateFormat();
					df[ df[ 'year_num' ] ] = v.year;
					df[ df[ 'month_num' ] ] = v.monthStr;
					df[ df[ 'date_num' ] ] = v.date;
					
					var tw = document.createElement( 'div' ),
						twic = document.createElement( 'div' ),
						twbo = document.createElement( 'div' ),
						twun = document.createElement( 'div' ),
						twtx = document.createElement( 'div' ),
						twst = document.createElement( 'div' ),
						twim = document.createElement( 'img' ),
						twso = document.createElement( 'span' ),
						twut = document.createElement( 'span' ),
						twnt = document.createElement( 'span' ),
						src = document.createElement( 'span' ),
						twda = document.createElement( 'a' );
					
					tw.className = 'tweet';
					twic.className = 'tweet-icon';
					twbo.className = 'tweet-body';
					twun.className = 'tweet-names';
					twtx.className = 'tweet-text';
					twst.className = 'tweet-status';
					twut.className = 'tweet-username';
					twnt.className = 'tweet-name';
					twda.className = 'tweet-date';
					twso.className = 'tweet-source';
					twim.src = v.profileImage;
					twda.href = v.page;
					twda.target = '_blank';
					src.innerHTML = v.source;
					src.childNodes[ 0 ].className = 'tweet-source';
					
					twut.appendChild( document.createTextNode( v.username ) );
					twnt.appendChild( document.createTextNode( ' - ' + v.name ) );
					twtx.appendChild( document.createTextNode( v.text ) );
					twda.appendChild( document.createTextNode( df.join('') ) );
					twso.appendChild( document.createTextNode( ' via ' ) );
					twso.appendChild( src );
					
					base.addEvent( 'mousedown', function(){
						var al = gfxt.appliedLayer({
							width: 400,
							height: 400,
							top: 50,
							left: gfxt.uAgent.clientWidth / 2 - 150,
							title: v.username
						});
						al.controller.disableResize();
						
						var ud = tp().getUser( v.username );
						var isrc = ud[ 'profile_image_url' ];
						var ca = al.parts.clientArea;
						ca.innerHTML = '\
							<div style="width:340px; margin: 20px 0px 0px 20px; text-align:left;">\
								<div style="float:left;">\
									<img src="' + isrc.replace(/_normal/, '_bigger') + '" alt=""/>\
								</div>\
								<div style="margin-left: 20px; float:left;">\
									<div style="font-weight: bold; font-size:16px; margin-top:10px;">' + ud[ 'name' ] + '</div>\
									<div style="font-weight: bold; margin-top:10px;">@' + ud[ 'screen_name' ] + '</div>\
								</div>\
							</div>\
							<div style="width:340px; clear:both; margin-left: 20px; padding-top:20px; font-size: 12px;">' + ud[ 'description' ] + '</div>\
							<div style="width:340px; margin-left: 20px; padding-top: 20px;">Tweets: ' + ud[ 'statuses_count' ] + '</div>\
							<div style="width:340px; margin-left: 20px;">Followers: ' + ud[ 'followers_count' ] + '</div>\
							<div style="width:340px; margin-left: 20px;">Friends: ' + ud[ 'friends_count' ] + '</div>\
							<div style="width:100%; line-height: 30px; margin-top:20px; background-color:#E2E2E2; text-align:center;">\
								<a href="https://twitter.com/' + v.username + '" target="_blank">More information...</a>\
							</div>\
						';
					}, twut );
					
					twic.appendChild( twim );
					twst.appendChild( twda );
					twst.appendChild( twso );
					twun.appendChild( twut );
					twun.appendChild( twnt );
					twbo.appendChild( twun );
					twbo.appendChild( twtx );
					twbo.appendChild( twst );
					tw.appendChild( twic );
					tw.appendChild( twbo );
					document.getElementById( 'tweets' ).appendChild( tw );
				},
				
				
				deleteAllTweets: function(){
					var elem = document.getElementById( 'tweets' );
					if( elem.childNodes.length > 0){
						base.removeChildren( document.getElementById( 'tweets' ) );
					}
				},
				
				
				alterSearchStatus: function( number, username, date, page ){
					var rnm = document.getElementById( 'status-number' ),
						run = document.getElementById( 'status-username' ),
						rda = document.getElementById( 'status-date' ),
						rpa = document.getElementById( 'status-page' );
						
					rnm.innerHTML = number;
					run.innerHTML = username;
					rda.innerHTML = date;
					rpa.innerHTML = page;
					
					document.title = [ number, username, date, ' - Twitter Search' ].join( '' );
				},
				
				
				showAjaxLoader: function(){
					document.getElementById( 'loading' ).style.display = 'block';
				},
				
				
				hideAjaxLoader: function(){
					document.getElementById( 'loading' ).style.display = 'none';
				},
				
				
				showOtherDay: function(){
					document.getElementById( 'previous-day' ).style.display = 'inline';
					document.getElementById( 'next-day' ).style.display = 'inline';
				},
				
				
				hideOtherDay: function(){
					document.getElementById( 'previous-day' ).style.display = 'none';
					document.getElementById( 'next-day' ).style.display = 'none';
				},
				
				
				showMessage: function( message ){
					var elem = document.getElementById( 'message' );
					elem.style.display = 'block';
					elem.innerHTML = message;
				},
				
				
				hideMessage: function(){
					var elem = document.getElementById( 'message' );
					elem.style.display = 'none';
					elem.innerHTML = '&nbsp;';
				},
				
				
				showAddition: function( data, number, relative ){
					var elem = document.getElementById( 'addition' );
					elem.style.display = 'block';
					elem.onmousedown = function(){
						if( data.item.length > relative ){
							var rd = {
								item: data.item.slice( relative, relative + number ),
								searchStatus: data.searchStatus
							};
							method.createTweets( rd, number );
							
							if( data.item.length <= relative + number ){
								method.hideAddition();
							}
							else{
								method.showAddition( data, number, relative + number );
							}
						}
						else{
							method.hideAddition();
						}
					};
				},
				
				
				hideAddition: function(){
					var elem = document.getElementById( 'addition' );
					elem.style.display = 'none';
					elem.onmousedown = function(){};
				},
				
				
				/*
				 * If data match condition, get these data
				 */
				getMatchData: function( data, year, month, date ){
					var df = method.getDateFormat();
					var dataItem = data.item,
						item = new Array();

					for( var i = 0, j = 0; dataItem[ i ]; i++){
						if( 
							dataItem[ i ].year == year
							&& dataItem[ i ].month == month
							&& dataItem[ i ].date == date
						 ){
							item[ j ] = dataItem[ i ];
							j++;
						}
					}
					
					if( item.length > 0 ){
						df[ df[ 'year_num' ] ] = year;
						df[ df[ 'month_num' ] ] = msg.monthStr[ month - 1 ];
						df[ df[ 'date_num'] ] = date;
						var ren = {
							searchStatus: data.searchStatus,
							item: item
						};
						ren.searchStatus.date = df.join('');
						ren.searchStatus.results = item.length;
					}
					else{
						ren = 'E:not_found';
					}
					
					return ren;
				},
				
				
				getSearchValues: function( formId ){
					var elem;
					var v = new Object(),
						frm = document.getElementById( formId );
					
					for( var i = 0; frm.elements[ i ] ; i++ ){
						elem = frm.elements[i];
						switch( elem.getAttribute( 'data-search-sort' ) ){
							case 'username':
								v.username = elem.value;
								break;
							case 'date':
								var da = elem.value.split( '-' );
								v.year = da[ 0 ];
								v.month = da[ 1 ];
								v.date = da[ 2 ];
								break;
						}
					}
					
					return v;
				},
				
				
				mirrorSearchValues: function( formId, username, year, month, date ){
					var elem, frm = document.getElementById( formId );
					
					for(var i = 0; frm.elements[ i ] ; i++){
						elem = frm.elements[ i ];
						switch( elem.getAttribute( 'data-search-sort' ) ){
							case 'username':
								elem.value = username;
								elem.validMethod();
								break;
							case 'date':
								elem.value = [ year, '-', month, '-', date ].join( '' );
								elem.validMethod();
								break;
						}
					}
					
					return true;
				},
				
				
				getStatusFormat: function(){
					var format, sf = [];
					for( var i = 0; msg.statusFormat[ 0 ][ i ]; i++ ){
						format = msg.statusFormat[ 0 ][ i ];
						switch( format ){
							case 'username':
								sf[ 'username_num' ] = sf.length;
								sf[ sf.length + 1 ] = msg.statusFormat[ 1 ][ i ];
								break;
							case 'date':
								sf[ 'date_num' ] = sf.length;
								sf[ sf.length + 1 ] = msg.statusFormat[ 1 ][ i ];
								break;
						}
					}
					return sf;
				},
				
				
				getDateFormat: function(){
					var format, df = [];
					for( var i = 0; msg.dateFormat[ 0 ][ i ]; i++ ){
						switch( msg.dateFormat[ 0 ][ i ] ){
							case 'year':
								df[ 'year_num' ] = df.length;
								df[ df.length + 1 ] = msg.dateFormat[ 1 ][ i ];
								break;
							case 'month':
								df[ 'month_num' ] = df.length;
								df[ df.length + 1 ] = msg.dateFormat[ 1 ][ i ];
								break;
							case 'date':
								df[ 'date_num' ] = df.length;
								df[ df.length + 1 ] = msg.dateFormat[ 1 ][ i ];
								break;
						}
					}
					return df;
				},
				
				
				parseHash: function( ha ){
					if( ha.match( /^#.*/ ) )
						ha = ha.slice( 1 );
					if(ha.match(/^!.*/))
						ha = ha.slice( 1 );
					
					var r,
						v = new Array(),
						q = ha.split( ';' );
					
					for( var i = 0 ; q[ i ] ; i++ ){
						r = q[ i ].split( '=' );
						v[ r[ 0 ] ] = r[ 1 ];
					}
					
					return v;
				}
			};
			
			return method;
		};
		
		return core;
	})();
	
	// Add template package
	gfxt.sys().addPackage('template', p);
	
	
	var hp = (function(){
		// HASH variable assign current hash
		var HASH = null;
		var MONITOR = null;
		var LISTENER = new Array();
		var LIST = new Array();
		var core = function(){
			var method = {
				startupMonitor: function(){
					MONITOR = setInterval(function(){
						if( HASH == location.hash ){
							return false;
						}
						
						var f = false;
						for ( var list, i = 0; LIST[ i ]; i++ ){
							list = LIST[ i ];
							if( location.hash == list.hash || location.hash.match( (new RegExp( '^' + list.matchHash + '.*' ) ) ) != null ){
								if( typeof list.title == 'string' )
									document.title = list.title;
								if( typeof list.file == 'string' && typeof list.container == 'string' )
									p().getContainerContents( list.container, list.file, null, true );
								if( typeof list.file != 'string' && typeof list.container == 'string' ){
									p().activateContainer( list.container );
								}
								f = true;
								break;
							}
						}
						if( f === false ){
							method.setHash( '!error=not_found' );
						}
						HASH = location.hash;
						for( var i = 0 ; i < LISTENER.length ; i++ ) LISTENER[ i ]( HASH );
					}, 1);
				},
				
				stopMonitor: function( callback ){
					clearInterval( MONITOR );
					setTimeout( function(){
						callback();
					}, 100 );	// 100ms for minute adjustment
				},
				
				addList: function( list ){
					for( var i = 0; list[ i ]; i++ ){
						LIST.push( list[ i ] );
					}
				},
				
				setHash: function( hash ){
					if( hash.match( /^#.*/ ) == null )
						hash = '#'.concat( hash );
					// Stop hash monitor
					method.stopMonitor( function(){
						location.hash = hash;
						method.startupMonitor();
					} );
				},
				
				addEvent: function( listener ){
					LISTENER.push( listener );
				}
			};
			
			return method;
		};
		
		return core;
	})();
	
	// Add hash monitor package
	gfxt.sys().addPackage( 'hash_monitor', hp );
	
	
	
	/*
	 * Twitter package
	 */
	var tp = (function(){
		var USER = new Array();
		var CACHE = new Array();
		var LIMIT = null;
		
		/*
		 * Twitter package core
		 */
		var core = function(){
			var method = {
				
				/*
				 * Add cache
				 */
				addCache: function( data, username, page ){
					var un = username.toLowerCase();
					if( typeof CACHE[ un ] != 'object' ){
						CACHE[ un ] = {};
					}
					CACHE[ un ][ page ] = data;
				},
				
				
				/*
				 * Get cache
				 */
				getCache: function( username, page ){
					var r = null;
					username = username.toLowerCase();
					if( CACHE[ username ] && CACHE[ username ][ page ] ){
						r = CACHE[ username ][ page ];
					}

					return r;
				},
				
				
				/*
				 * Get all cache
				 */
				getAllCache: function(){
					var ca = CACHE;
					return ca;
				},
				
				
				/*
				 * Add user data
				 */
				addUser: function( username, userData ){
					username = username.toLowerCase();
					USER[ username ] = userData;
				},
				
				
				/*
				 * Get user data
				 */
				getUser: function( username ){
					username = username.toLowerCase();
					var u = USER[ username ];
					return u;
				},
				
				
				/*
				 * Get all user
				 */
				getAllUser: function(){
					var u = USER;
					return u;
				},
				
				
				/*
				 * Set limit data
				 */
				setLimit: function( limitData ){
					LIMIT = limitData;
				},
				
				
				/*
				 * Get limit data
				 */
				getLimit: function(){
					var lim = LIMIT;
					return lim;
				},
				
				
				/*
				 * Get user timeline
				 */
				getUserTimeline: function( username, year, month, date, page, callback ){
					// If page is more than 10, cannot get user timeline
					if( page >= 10 ){
						callback( 'E:not_found' );
					}
					
					var stop = false;
					var retry = 2,
						rateRetry = 2,
						userRetry = 2;
					var id;
					
					// Callback for twitter API
					var apiCallback = function( data ){
						var ren = method.parseResponse( data, username );
						if( typeof ren != 'string'){
							method.addCache( ren, username, page );	// add data to cache
						}
						callback( ren );
					};
					
					// New data getter
					var checkLimit = function( limitCallback ){
						if( stop === true ){
							return false;
						}
						
						var cb = function( error ){
							if( error != 'E:loading' ){
								var lim = method.getLimit();
								limitCallback( lim );
							}
							else if( error == 'E:loading' && rateRetry > 1 ){
								rateRetry--;
								get();
							}
							else{
								limitCallback( 'E:loading' );
							}
						};
						
						var get = function(){
							base.getJs(
								'http://api.twitter.com/1/account/rate_limit_status.json\
								?callback=gfxt.twitterApi.getRateLimit'
								, cb
							);
						};
						
						get();	// GET
					};
					
					var getTl = function( result ){
						if( result != 'E:loading' ){
							if( result[ 'remaining_hits' ] > 30 ){
								id = 'f' + String((new Date()).getTime());	// Make ID
								gfxt.twitterApi[ id ] = apiCallback;
								base.getJs(
									'https://api.twitter.com/1/statuses/user_timeline.json\
									?trim_user=true\
									&screen_name=' + username + '\
									&count=200\
									&page=' + (page + 1) + '\
									&callback=gfxt.twitterApi.' + id
									, tlCallback
								);
							}
							else{
								callback( 'E:limited' );
							}
						}
						else{
							callback( 'E:nonexistence' );
						}
					};
					
					var tlCallback = function( error ){
						if( error == 'E:loading' && retry > 1 ){	// Be able to retry
							retry--;
							checkLimit( getTl );
						}
						else if ( error == 'E:loading' ){
							callback( 'E:nonexistence' );
						}
					};
					
					var getUserData = function( result ){
						if( result != 'E:loading' && Number( result[ 'remaining_hits' ] ) > 30 ){
							base.getJs(
								'https://api.twitter.com/1/users/lookup.json\
								?screen_name=' + username + '\
								&callback=gfxt.twitterApi.getUser'
								, userCallback
							);
						}
					};
					
					var userCallback = function( error ){
						if( error == 'E:loading' && userRetry > 1 ){
							userRetry--;
							checkLimit( getUserData );
						}
					};
					
					// Check if specified user has more than the number of 200 * v.page tweets
					var ud = method.getUser( username );
					var flag = true;
					if( ud ){
						var sc = Number( ud[ 'statuses_count' ] );
						flag = sc >= ( 200 * page );
					}
					else{
						checkLimit( getUserData );
					}
					
					var ca = method.getCache( username, page );
					if( ca != null ){
						callback( ca );
					}
					else if ( flag === true ){
						checkLimit( getTl );
					}
					else{
						callback( 'E:not_found' );
					}
					
					return {
						stop: function(){
							stop = true;
						}
					};
				},
				
				getOtherDate: function( username, year, month, date ){
					var r, y, m, d, dp, item,
						f = [ false, false, false ],
						da = new Object(),
						ml = [ 9999, 99, 99 ],
						un = username;
						
					un.toLowerCase();
					var data = CACHE[ un ];
						
					if( data != null ){
						for( var p = 0; data[ p ]; p++){
							dp = data[ p ].item;
							for( var i = 0; dp[ i ]; i++){
								item = dp[ i ];
								y = Math.abs( year - item.year );
								m = Math.abs( month - item.month );
								d = Math.abs( date - item.date);
								if( d <= ml[ 2 ] ){
									ml[ 2 ] = d;
									f[ 2 ] = true;
								}
								else if( d > ml[ 2 ] ){
									f[ 2 ] = false;
								}
								if( m <= ml[ 1 ] ){
									ml[ 1 ] = m;
									f[ 1 ] = true;
								}
								else if( m > ml[ 1 ] ){
									f[ 1 ] = false;
								}
								if( y <= ml[ 0 ] ){
									ml[ 0 ] = y;
									f[ 0 ] = true;
								}
								else if( y > ml[ 0 ]){
									f[ 0 ] = false;
								}
								
								if( !f.indexOf ){	// For not supported indexOf() method of array. Such as IE.
									// I programmed this code consulting a part of jQuery codes. Thanks jQuery!
									r = (function(){
										for( var j = 0; f[ j ]; j++ ){
											if( f[ j ] === false )
												return r;
										}
										return -1;
									})();
								}
								else{
									r = f.indexOf( false );
								}
								
								if( r != -1){
									break;
								}
								else{
									da.date = item.date;
									da.month = item.month;
									da.year = item.year;
								}
							}
						}
					}
					else{
						return false;
					}
					
					return da;
				},
				
				parseResponse: function( r, username ){
					var da, y, m, d, ren,
						item = new Array();
					var ud = method.getUser( username );
						
					for( var i = 0, j = 0; r && r[ i ]; i++ ){
						da = new Date( r[ i ][ 'created_at'] );
						y = da.getYear();
						y = y >= 2000 ? y : y + 1900;
						m = da.getMonth();
						d = da.getDate();

						// Other time format
						if( isNaN( y ) || isNaN( m ) || isNaN( d ) ){
							var sd = r[ i ][ 'created_at' ].split(' ');
							var xd = sd[ 0 ] + " " + sd[ 1 ] + " " + sd[ 2 ] + " " + sd[ 5 ] + " " + sd[ 3 ] + " " + sd[ 4 ];
							da = new Date( xd );
							y = da.getYear();
							y = y >= 2000 ? y : y + 1900;
							m = da.getMonth();
							d = da.getDate();
						}

						item[ j ] = {
							username: ud[ 'screen_name' ],
							name: ud[ 'name' ],
							text: r[ i ][ 'text' ],
							year: y,
							month: m + 1,
							monthStr: msg.monthStr[ m ],
							date: d,
							source: r[ i ][ 'source' ],
							profileImage: ud[ 'profile_image_url' ],
							page: 'http://twitter.com/' + ud[ 'screen_name' ] + '/status/' + r[ i ][ 'id_str' ]
						};
						j++;	// Increase item index
					}
					
					if( item.length > 0 ){
						ren = {
							searchStatus: {
								results: item.length,
								username: ud[ 'screen_name' ],
								name: ud[ 'name' ]
							},
							
							item: item
						};
					}
					else{
						ren = 'E:not_found';
					}
					
					return ren;
				}
			};
			
			return method;
		};
		
		return core;
	})();
	
	gfxt.sys().addPackage( 'twitter', tp );
	
	gfxt.twitterApi = {
		getRateLimit: function( d ){
			tp().setLimit( d );
		},
		
		getUser: function( d ){
			if( d[ 0 ][ 'screen_name' ] )
				tp().addUser( d[ 0 ][ 'screen_name' ], d[ 0 ] );
		}
	};
})
(gfxt);	// EXECUTE