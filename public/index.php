<?php
	/*
	 * 	Automatic Language Selector
	 * 
	 * 	@author		Saneyuki Tadokoro <post@saneyuki.gfunction.com>
	 * 	@version	1.0
	 * 
	 * 	Copyright (c) 2011 +place project
	 */
	
	$lang_str = $_SERVER[ 'HTTP_ACCEPT_LANGUAGE' ];
	$lang_list = explode( ',', $lang_str );
	
	if( $lang_list[ 0 ] === 'ja' || $lang_list[ 0 ] === 'ja_JP' ){
		$lang = 'ja';
		$keywords = 'Twitter Search,twitter,twitter 日にち検索,日にち検索,日付指定';
		$desc = 'twitter 日にち検索';
		$replace_url = 'http://twitter-search.jpn.org/ja/';
	}
	else{
		$lang = 'en';
		$keywords = 'Twitter Search,twitter,search tweets by date';
		$desc = 'Search tweets by date';
		$replace_url = 'http://twitter-search.jpn.org/en/';
	}
?>
<!DOCTYPE html>

<html lang="<?php print( $lang ); ?>">

	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<meta name="keywords" content="<?php print( $keywords ) ?>" />
		<meta name="description" content="<?php print( $desc ) ?>" />
		<meta name="author" content="Saneyuki Tadokoro <post@saneyuki.gfunction.com>" />
		<meta name="copyright" content="Copyright (c) 2011 +place project" />
		<link rel="shortcut icon" href="img/favicon.ico" />
		<script type="text/javascript">
		// <![CDATA[
			window.onload = function(){
				location.replace( '<?php print( $replace_url ) ?>' );
			};
		// ]]>
		</script>
	</head>

	<body>
		<noscript>
		<?php if( strcmp( $lang, 'ja' ) ){ ?>
			自動的にリンクされない場合は以下のURLをクリックしてください。
		<?php } else{ ?>
			If your browser doesn't link, click this URL.
		<?php } ?>
			<br /><a href="<?php $replace_url ?>"></a>
		</noscript>
	</body>

</html>