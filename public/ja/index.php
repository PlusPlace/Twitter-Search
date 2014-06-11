<!DOCTYPE html>

<html lang="ja">
	
	<head>
		<title>Twitter Search</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<meta name="keywords" content="Twitter Search,twitter,twitter 日にち検索,日にち検索,日付指定" />
		<meta name="description" content="twitter 日にち検索" />
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
			gfxt.uAgent.language = "ja";
			
			
			
			(function( gx ){
				/*
				 * 	Message package
				 * 	@version 1.0
				 */
				var msg = function(){
					return {
						getLanguage: function(){
							return 'ja';
						}
					};
				};
				// Informations
				var msgInfo = {
					language: 'ja',
					version: '1.0',
					/*
					 * Japanese text:
					 * 2次元配列の dateFormat および statusFormat は、それぞれ表示するワードの順番・最後尾の文字に付与するワードを示します。
					 * 特に、[0][x]（xは任意の自然数）ではフォーマット指定、[1][x]では最後尾に付与するワードです。
					 * 例えば以下の場合、日付表示のとき dateFormat に従うと「2011年11月11日」となり、ステータス表示のとき statusFormat に従うと
					 * 「2011年11月11日の@plus_place」となります。
					 */
					dateFormat: [ [ 'year', 'month', 'date' ], [ '年', '月', '日' ] ],
					statusFormat: [ [ 'date', 'username' ], [ ' の ', '' ] ],
					monthStr: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ],
					dayStr: [ '日', '月', '火', '水', '木', '金', '土' ],
					username: 'ユーザー名',
					date: '日付',
					results: ' 個の検索結果',
					page: 'ページ: ',
					searching: '検索中...',
					done: '閉じる',
					nonexistence: '\
						<p>ユーザータイムラインをレシーブできませんでした。</p><br />\
						原因：<br />\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 指定のユーザー名が存在しない。<br />\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. サーバーからのレスポンスがない。<br />\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. 保護されたユーザーを指定している。<br />\
						<p>リトライは3回まで行われますが、それ以上のエラーが発生した場合はこのコンテンツが表示されます。</p>\
					',
					noneTweets: '\
						ツイートが存在しません。\
					',
					notFound: '\
						ツイートは見つかりませんでした。\
					',
					nearDate: '\
						別の日のツイート：\
					',
					limited: '\
						<p>Twitter API数が残り 30 以下となったため検索を中止しました。<br />タイムラインがキャッシュに保存されている場合は、ここから日付検索をすることができます。</p><br />\
						リセット時間：\
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
						title: 'Twitter Search - キャッシュの参照',
						container: 'cache-container'
					},
					{
						matchHash: '#!page=search',
						container: 'result-container'
					},
					{	// Not found
						hash: '#!error=not_found',
						title: 'Twitter Search - ページが存在しません',
						file: 'http://twitter-search.jpn.org/ja/error/not_found.html',
						container: 'general-container'
					},
					{	// About us
						hash: '#!page=about;section=us',
						title: 'Twitter Search - Twitter Search について',
						file: 'http://twitter-search.jpn.org/ja/about/us.html',
						container: 'general-container'
					},
					{	// About team
						hash: '#!page=about;section=team',
						title: 'Twitter Search - プロジェクトチーム',
						file: 'http://twitter-search.jpn.org/ja/about/team.html',
						container: 'general-container'
					},
					{	// Operation
						hash: '#!page=help;section=operation',
						title: 'Twitter Search - 操作方法',
						file: 'http://twitter-search.jpn.org/ja/help/operation.html',
						container: 'general-container'
					},
					{	// Twitter API
						hash: '#!page=help;section=api',
						title: 'Twitter Search - Twitter API',
						file: 'http://twitter-search.jpn.org/ja/help/api.html',
						container: 'general-container'
					},
					{	// Supported browsers
						hash: '#!page=help;section=browsers',
						title: 'Twitter Search - 対応ブラウザー',
						file: 'http://twitter-search.jpn.org/ja/help/browsers.html',
						container: 'general-container'
					},
					{	// Terms of service
						hash: '#!page=terms;section=tos',
						title: 'Twitter Search - 利用規約',
						file: 'http://twitter-search.jpn.org/ja/terms/tos.html',
						container: 'general-container'
					},
					{
						hash: '#!page=privacy;section=policy',
						title: 'Twitter Search - プライバシーポリシー',
						file: 'http://twitter-search.jpn.org/ja/privacy/policy.html',
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
						<a href="#!page=top" title="トップページ"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/home.png" alt="トップページ" /></a>
						<a href="#!page=cache" title="キャッシュの参照" data-input-type="cache-viewer"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/cache.png" alt="キャッシュの参照" /></a>
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
						<a href="#!page=about;section=us">Twitter Search について</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=help;section=operation">ヘルプ</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=terms;section=tos">利用規約</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=privacy;section=policy">プライバシーポリシー</a>
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
							<a href="#!page=top" title="トップページ"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/home.png" alt="トップページ" /></a>
							<a href="#!page=cache" title="キャッシュの参照"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/cache.png" alt="キャッシュの参照" /></a>
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
						
						<div id="addition">さらに読み込む</div>
						
						<div class="other-day">
							<img src="http://twitter-search.jpn.org/packages/twitter-search/img/previous-day.png" alt="前日" id="previous-day" />
							<img src="http://twitter-search.jpn.org/packages/twitter-search/img/next-day.png" alt="翌日" id="next-day" />
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
						<a href="#!page=about;section=us">Twitter Search について</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=help;section=operation">ヘルプ</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=terms;section=tos">利用規約</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=privacy;section=policy">プライバシーポリシー</a>
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
							<a href="#!page=top" title="トップページ"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/home.png" alt="トップページ" /></a>
							<a href="#!page=cache" title="キャッシュの参照" data-input-type="cache-viewer"><img src="http://twitter-search.jpn.org/packages/twitter-search/img/cache.png" alt="キャッシュの参照" /></a>
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
						<span id="status-number">キャッシュ</span>
					</div>
				</div>
				
				<!-- # Main area -->
				<div class="contents">
					<div class="main">
						<p>
							　検索したタイムラインはキャッシュに一時保存されています。日付別にツイートを参照するには以下のリストから選択してください。
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
						<a href="#!page=about;section=us">Twitter Search について</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=help;section=operation">ヘルプ</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=terms;section=tos">利用規約</a>
						<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<a href="#!page=privacy;section=policy">プライバシーポリシー</a>
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
			<span>エラー: ご使用のブラウザは JavaScript が無効になっています。 → 有効にしてください。</span>
		</noscript>
		
	</body>

</html>