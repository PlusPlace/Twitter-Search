<!DOCTYPE html>

<html lang="en">
	
	<head>
		<title>Twitter Search</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<meta name="keywords" content="Twitter Search,twitter,Search tweets by date" />
		<meta name="description" content="Search tweets by date" />
		<meta name="author" content="Saneyuki Tadokoro <post@saneyuki.gfunction.com>" />
		<meta name="copyright" content="Copyright (c) 2011 +place project" />
		<link rel="shortcut icon" href="http://twitter-search.jpn.org/packages/twitter-search/img/favicon.ico" />
		<link rel="stylesheet" type="text/css" href="http://twitter-search.jpn.org/packages/twitter-search/css/template.css" />
		<link rel="stylesheet" type="text/css" href="http://twitter-search.jpn.org/packages/applied-layer/css/window.css" />
		<!--
			ABOUT SCRIPTS
			
			<!IMPORTANT> Above scripts must be this order.
			<!CAUTION> Don't remove 'gfxt.js'. All scripts needs it.
		-->
		<script type="text/javascript" src="http://twitter-search.jpn.org/packages/gfxt/gfxt.js"></script>
		<script type="text/javascript" src="http://twitter-search.jpn.org/packages/applied-layer/js/window.js"></script>
		<script type="text/javascript">
		// <![CDATA[
			/*
			 * 	Inline JavaScript codes for initialize
			 * 
			 * 	@author		Saneyuki Tadokoro <post@saneyuki.gfunction.com>
			 * 	@version	1.0
			 * 	@require	gfxt.js
			 * 
			 * 	Copyright (c) 2011 +place project
			 */
			
			// Set language
			gfxt.uAgent.language = "en";
			
			
			
			(function( gx ){
				/*
				 * 	Message package
				 * 	@version 1.0
				 */
				var msg = function(){
					return {
						getLanguage: function(){
							return 'en';
						}
					};
				};
				// Informations
				var msgInfo = {
					language: 'en',
					version: '1.0',
					dateFormat: [ [ 'date', 'month', 'year' ], [ ' ', ', ', '' ] ],
					statusFormat: [ [ 'username', 'date' ], [ ' on ', '' ] ],
					monthStr: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
					dayStr: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
					username: 'Username',
					date: 'Date',
					results: ' results',
					page: 'Page: ',
					searching: 'Searching...',
					done: 'Done',
					nonexistence: '\
						<p>Cannot receive user timeline.</p><br />\
						Causes:<br />\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. There is no username you specified.<br />\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. There is no response from host server.<br />\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. You specified protected user.<br />\
						<p>Twitter Search retries on errors three times. If retrying is above three times, Twitter Search shows this contents.</p>\
					',
					noneTweets: '\
						There is no tweets.\
					',
					notFound: '\
						Twitter Search cannot find tweets.\
					',
					nearDate: '\
						Other day:\
					',
					limited: '\
						<p>Twitter Search stopped searching due to a number of Twitter API is less than 30.<br />You can search tweets by date if the cache has user timeline.</p><br />\
						Reset Time：\
					'
				};
				
				// Add package
				gx.sys( 'core' ).addPackage( 'messages', msg, msgInfo );
			})( gfxt );	// EXECUTE [ OK ]
			
			
			
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-26732997-1']);
			_gaq.push(['_trackPageview']);
			
			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		// ]]>
		</script>
		<script type="text/javascript" src="http://twitter-search.jpn.org/packages/twitter-search/js/template.js"></script>
		<script type="text/javascript">
		// <![CDATA[
			/*
			 * 	@require	gfxt.js
			 * 	@require	template.js
			 */
			(function( gx ){
				var hmon = gx.sys( 'hash_monitor' );
				var list = [
					{	// Top page 1
						hash: '',
						title: 'Twitter Search',
						container: 'home-container'
					},
					{	// Top page 2
						hash: '#!page=top',
						title: 'Twitter Search',
						container: 'home-container'
					},
					{	// Cache
						hash: '#!page=cache',
						title: 'Twitter Search - Cache',
						container: 'cache-container'
					},
					{
						matchHash: '#!page=search',
						container: 'result-container'
					},
					{	// Not found
						hash: '#!error=not_found',
						title: 'Twitter Search - Not found',
						file: 'http://twitter-search.jpn.org/en/error/not_found.html',
						container: 'general-container'
					},
					{	// About us
						hash: '#!page=about;section=us',
						title: 'Twitter Search - About',
						file: 'http://twitter-search.jpn.org/en/about/us.html',
						container: 'general-container'
					},
					{	// About team
						hash: '#!page=about;section=team',
						title: 'Twitter Search - Team',
						file: 'http://twitter-search.jpn.org/en/about/team.html',
						container: 'general-container'
					},
					{	// Operation
						hash: '#!page=help;section=operation',
						title: 'Twitter Search - Operation',
						file: 'http://twitter-search.jpn.org/en/help/operation.html',
						container: 'general-container'
					},
					{	// Twitter API
						hash: '#!page=help;section=api',
						title: 'Twitter Search - Twitter API',
						file: 'http://twitter-search.jpn.org/en/help/api.html',
						container: 'general-container'
					},
					{	// Supported browsers
						hash: '#!page=help;section=browsers',
						title: 'Twitter Search - Supporting browsers',
						file: 'http://twitter-search.jpn.org/en/help/browsers.html',
						container: 'general-container'
					},
					{	// Terms of service
						hash: '#!page=terms;section=tos',
						title: 'Twitter Search - Terms of Service',
						file: 'http://twitter-search.jpn.org/en/terms/tos.html',
						container: 'general-container'
					},
					{
						hash: '#!page=privacy;section=policy',
						title: 'Twitter Search - Privacy',
						file: 'http://twitter-search.jpn.org/en/privacy/policy.html',
						container: 'general-container',
					}
				];
				
				hmon.addList( list );
			})( gfxt );
		// ]]>
		</script>
		<script type="text/javascript" src="http://twitter-search.jpn.org/packages/twitter-search/js/init.js"></script>
	</head>



	<body>
		<!-- ## Home Container -->
		<div id="home-container">
			<div id="home-body">
				
				<!-- # Menu -->
				<div class="home-menu-wrapper">
					<div class="home-menu">
						<a href="#!page=top" title="Go to top page"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/home.png" alt="Top page" /></a>
						<a href="#!page=cache" title="View the cache" data-input-type="cache-viewer"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/cache.png" alt="View the cache" /></a>
					</div>
				</div>
				
				<div class="home-wrapper">
					<!-- # Contents -->
					<div class="home-contents">
						<div class="home-main">
							
							<!-- # Logo  -->
							<div class="home-logo-wrapper">
								<a href="#!page=top" class="logo"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/logo.png" alt="Twitter Search" class="logo-img" /></a>
							</div>
							
							<!-- # Search area -->
							<div>
								<form action="#" id="search-in-home">
									<!-- # User name section -->
									<div class="home-username">
										<input type="text" class="home-username-text" data-search-sort="username" />
									</div>
									
									<!-- # Date section -->
									<div class="home-date">
										<input type="text" class="home-date-text" data-search-sort="date" />
									</div>
									<div class="home-input-calendar" data-input-type="calendar"></div>
									
									<!-- # Search button -->
									<div class="home-button">
										<input type="button" value="" class="home-search-button" data-search-sort="button" />
									</div>
								</form>
							</div>
						</div>
						
						<div class="home-right-sidebar">
							<script type="text/javascript"><!--
							google_ad_client = "ca-pub-6538717943712742";
							/* twitter_search_home_container */
							google_ad_slot = "0976761902";
							google_ad_width = 120;
							google_ad_height = 240;
							//-->
							</script>
							<script type="text/javascript"
							src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
							</script>
						</div>
					</div>
				</div>
				
				<!-- # Address -->
				<div class="home-address-wrapper">
					<div class="home-address">
						<a href="#!page=about;section=us">About</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=help;section=operation">Help</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="http://www.facebook.com/pages/Place-project/172154506171999" target="_blank">Facebook</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="https://twitter.com/plus_place" target="_blank">Twitter</a>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
						<a href="http://plusplace.dip.jp/" target="_blank">&copy;&nbsp;plus-place project</a>
					</div>
				</div>
			</div>
		</div>
		
		
		<!-- ## Result Container -->
		<div id="result-container">
			<!-- # Header -->
			<div class="header">
				<div class="header-body">
					<div class="logo-wrapper">
						<a href="#!page=top" class="logo"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/mini-logo.png" alt="Twitter Search" class="logo-img" /></a>
					</div>
				</div>
			</div>
			
			<!-- # Body -->
			<div class="body">
				<!-- # Menu -->
				<div class="menu-wrapper">
					<div class="menu">
						<div class="menu-button">
							<a href="#!page=top" title="Go to top page"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/home.png" alt="Top page" /></a>
							<a href="#!page=cache" title="View the cache"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/cache.png" alt="View the cache" /></a>
						</div>
						<div class="menu-search">
							<form action="#" id="search-in-result" style="margin-top:13px;">
								<!-- # User name section -->
								<div class="username">
									<input type="text" class="username-text" data-search-sort="username" />
								</div>
									
								<!-- # Date section -->
								<div class="date">
									<div>
										<input type="text" class="date-text" data-search-sort="date" />
									</div>
									<div class="input-calendar" data-input-type="calendar"></div>
								</div>
								
								<!-- # Search button -->
								<div class="button">
									&nbsp;&nbsp;<input type="button" value="" class="search-button" data-search-sort="button" />
								</div>
							</form>
						</div>
					</div>
				</div>
				
				<!-- # Status -->
				<div class="status-wrapper">
					<div class="status">
						<span id="status-number"></span>
						<span id="status-username"></span>
						<span id="status-date"></span>
						<span id="status-page"></span>
					</div>
				</div>
				
				<!-- # Main area -->
				<div class="contents">
					<div class="main">
						<div id="tweets">
						</div>
						
						<div id="loading">
							<img src="http://twitter-search.jpn.org/packages/twitter-search/img/ajax-loader.gif" alt="" />
						</div>
						
						<div id="message"></div>
						
						<div id="addition">Load more</div>
						
						<div class="other-day">
							<img src="http://twitter-search.jpn.org/packages/twitter-search/img/previous-day.png" alt="Previous day" id="previous-day" />
							<img src="http://twitter-search.jpn.org/packages/twitter-search/img/next-day.png" alt="Next day" id="next-day" />
						</div>
					</div>
					
					<!-- # Right Sidebar -->
					<div class="right-sidebar">
						<script type="text/javascript"><!--
							google_ad_client = "ca-pub-6538717943712742";
							/* for_twitter_search_result_container */
							google_ad_slot = "1453092178";
							google_ad_width = 120;
							google_ad_height = 240;
						//-->
						</script>
						<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>
					</div>
				</div>
			</div>
			
			<!-- # Footer -->
			<div class="footer">
				<div class="footer-body">
					<div class="address">
						<!-- # Address -->
						<a href="#!page=about;section=us">About</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=help;section=operation">Help</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="http://www.facebook.com/pages/Place-project/172154506171999" target="_blank">Facebook</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="https://twitter.com/plus_place" target="_blank">Twitter</a>
						<br /><br />
						<img src="http://twitter-search.jpn.org/packages/twitter-search/img/plus-place.png" alt="" /><br />
						&copy; 2011 plus-place project
					</div>
				</div>
			</div>
		</div>
		
		
		<!-- ## Cache Container -->
		<div id="cache-container">
			<!-- # Header -->
			<div class="header">
				<div class="header-body">
					<div class="logo-wrapper">
						<a href="#!page=top" class="logo"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/mini-logo.png" alt="Twitter Search" class="logo-img" /></a>
					</div>
				</div>
			</div>
			
			<!-- # Body -->
			<div class="body">
				<!-- # Menu -->
				<div class="menu-wrapper">
					<div class="menu">
						<div class="menu-button">
							<a href="#!page=top" title="Go to top page"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/home.png" alt="Top page" /></a>
							<a href="#!page=cache" title="View the cache" data-input-type="cache-viewer"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/cache.png" alt="View the cache" /></a>
						</div>
						<div class="menu-search">
							<form action="#" id="search-in-cache" style="margin-top:13px;">
								<!-- # User name section -->
								<div class="username">
									<input type="text" class="username-text" data-search-sort="username" />
								</div>
									
								<!-- # Date section -->
								<div class="date">
									<div>
										<input type="text" class="date-text" data-search-sort="date" />
									</div>
									<div class="input-calendar" data-input-type="calendar"></div>
								</div>
								
								<!-- # Search button -->
								<div class="button">
									&nbsp;&nbsp;<input type="button" value="" class="search-button" data-search-sort="button" />
								</div>
							</form>
						</div>
					</div>
				</div>
				
				<div class="status-wrapper">
					<div class="status">
						<span id="status-number">Cache</span>
					</div>
				</div>
				
				<!-- # Main area -->
				<div class="contents">
					<div class="main">
						<p>
							&nbsp;&nbsp;&nbsp;If you want to search tweets by date, select a user from following lists. Twitter Search saves user timeline in the cache temporarily.
						</p>
						<table id="cache-table">
							<tbody id="cache">
							</tbody>
						</table>
					</div>
					
					<div class="right-sidebar">
						<script type="text/javascript"><!--
						google_ad_client = "ca-pub-6538717943712742";
						/* twitter_search_cache_container */
						google_ad_slot = "0237575501";
						google_ad_width = 120;
						google_ad_height = 240;
						//-->
						</script>
						<script type="text/javascript"
						src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
						</script>
					</div>
				</div>
			</div>
			
			<!-- Footer -->
			<div class="footer">
				<div class="footer-body">
					<div class="address">
						<!-- # Address -->
						<a href="#!page=about;section=us">About</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=help;section=operation">Help</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="http://www.facebook.com/pages/Place-project/172154506171999" target="_blank">Facebook</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="https://twitter.com/plus_place" target="_blank">Twitter</a>
						<br /><br />
						<img src="http://twitter-search.jpn.org/packages/twitter-search/img/plus-place.png" alt="" /><br />
						&copy; 2011 plus-place project
					</div>
				</div>
			</div>
		</div>
		
		<div id="general-container"><?php
			if( isset( $_GET['_escaped_fragment_'] ) ){
				$hash_flagment = $_GET['_escaped_fragment_'];
				if( strcmp( $hash_flagment, 'page=top' ) == 0 ){
					$contents = 'TOP';
				}
				else if( strcmp( $hash_flagment, 'page=cache' ) == 0 ){
					$contents = 'CACHE';
				}
				else if( strcmp( $hash_flagment, 'page=about;section=us' ) == 0 ){
					$contents = file_get_contents( 'about/us.html' );
				}
				else if( strcmp( $hash_flagment, 'page=about;section=team' ) == 0 ){
					$contents = file_get_contents( 'about/team.html' );
				}
				else if( strcmp( $hash_flagment, 'page=help;section=api' ) == 0 ){
					$contents = file_get_contents( 'help/api.html' );
				}
				else if( strcmp( $hash_flagment, 'page=help;section=browsers' ) == 0 ){
					$contents = file_get_contents( 'help/browsers.html' );
				}
				else if( strcmp( $hash_flagment, 'page=help;section=operation' ) == 0 ){
					$contents = file_get_contents( 'help/operation.html' );
				}
				else if( strcmp( $hash_flagment, 'page=privacy;section=policy' ) == 0 ){
					$contents = file_get_contents( 'privacy/policy.html' );
				}
				else if( strcmp( $hash_flagment, 'page=terms;section=tos' ) == 0 ){
					$contents = file_get_contents( 'terms/tos.html' );
				}
				print( $contents );
			}
		?></div>
		
		<div id="loading-page"></div>
		
		<!-- # Not supported JavaScript -->
		<noscript>
			<span>ERROR: JAVASCRIPT IS DISABLED ON THE BROWSER -> PLEASE ENABLE</span>
		</noscript>
		
	</body>

</html>