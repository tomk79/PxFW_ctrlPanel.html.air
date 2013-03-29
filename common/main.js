/**
 * PxFWCtrlPanel メインオブジェクト
 * @author Tomoya Koyanagi (@tomk79)
 */
window.main = new (function(){

	dojo.require("dojox.data.CsvStore");

	var htmlFileName = window.location.href;//←メモ
	var _main = this;
	var _this = this;

	this.projMgr = {}; //プロジェクトマネージャ

	/**
	 * HTMLアプリケーションをリロードする
	 */
	this.reload = function(){
		window.location.href = htmlFileName;
		return true;
	}

	/**
	 * ホーム画面へ遷移する
	 */
	this.back2home = function(){
		window.location.href = 'app:/index.html';
		return true;
	}

	/**
	 * 実行
	 */
	$(function(){
		if( !_this.projMgr ){
			alert('Error: projMgr の読み込みが正常に処理されませんでした。');
		}

		//_this.projMgr.saveProjs();
		_this.projMgr.loadProjs();

		setupAirNativeMenu();//AIR Native Menu を登録。

		var currentProjId = _this.projMgr.getSelectedProjId();
		if( strlen(currentProjId) ){
			//プロジェクトが選択された状態だったら実行する処理
			_this.projMgr.loadSelectedProjConf(currentProjId,function(){
				$('.theme_window_title').html(main.projMgr.getSelectedProjConf()['project.name'] + ' - PxFW: Control panel');
				startContent();
			});

			$('.theme_header')
				.append(
					$('<a href="javascript:;">')
						.css({
							position:'absolute',top:'10px',right:'10px',color:'#ffffff'
						})
						.html('[プロジェクトを再選択]')
						.each(function(){
							$(this).click(function(){
								main.deselectProj();
								main.back2home();
							});
						})
				)
			;
			(function(){
				var html = '';
				var modList = main.modMgr.getModList();
				html += '<ul>';
				for( var key in modList ){
					html += '<li><a href="'+htmlspecialchars(modList[key].path)+'"'+(htmlFileName==modList[key].path?' class="current"':'')+'>'+htmlspecialchars(modList[key].label)+'</a></li>';
				}
				html += '</ul>';
				$('.theme_mod_selector')
					.append(html)
				;
			})();
			main.updateModTitle( main.modMgr.getCurrentMod().label );
			return;
		}

		main.updateModTitle( 'プロジェクト選択' );
		startContent();
		return;
	});

	/**
	 * コンテンツ処理を開始する
	 */
	function startContent(){
		//コンテンツの処理を開始する
		window.cont.play();
	}

	/**
	 * モジュールのタイトルを更新する
	 */
	this.updateModTitle = function(title){
		$('h1').html(title);
	}

	/**
	 * プロジェクトを選択する
	 */
	this.selectProj = function(projId){
		if( !_this.projMgr.selectProj(projId) ){
			alert('プロジェクト '+projId+' は選択できませんでした。');
			return false;
		}
		this.reload();
		return true;
	}

	/**
	 * プロジェクトの選択を解除する
	 */
	this.deselectProj = function(){
		if( !_this.projMgr.selectProj('') ){
			alert('プロジェクトの選択解除に失敗しました。');
			return false;
		}
		this.reload();
		return true;
	}

	/**
	 * プロジェクトを作成する
	 */
	this.addProj = function(formElm){
		if( !_this.projMgr.addProj($('*[name=proj_url]',formElm)[0].value, $('*[name=proj_auth_id]',formElm)[0].value, $('*[name=proj_auth_pw]',formElm)[0].value) ){
			return false;
		}
		_this.projMgr.saveProjs();
		this.reload();
		return true;
	}
	/**
	 * プロジェクトを更新する
	 */
	this.updateProj = function(formElm){
		if( !_this.projMgr.updateProj($('*[name=proj_id]',formElm)[0].value, $('*[name=proj_url]',formElm)[0].value, $('*[name=proj_auth_id]',formElm)[0].value, $('*[name=proj_auth_pw]',formElm)[0].value) ){
			return false;
		}
		_this.projMgr.saveProjs();
		this.reload();
		return true;
	}
	/**
	 * プロジェクトを削除する
	 */
	this.delProj = function(id){
		if( !confirm('プロジェクト '+htmlspecialchars(id)+' を削除します。よろしいですか？') ){
			return false;
		}
		_this.projMgr.delProj(id);
		_this.projMgr.saveProjs();
		this.reload();
		return true;
	}

	/**
	 * AIR Native Menu を登録する。
	 */
	function setupAirNativeMenu(){
		var menuList = [
			{
				label:"&Project",
				submenu: [
					// {
					// 	label: "New" ,
					// 	submenu: [
					// 		{
					// 			label: "Quit" ,
					// 			exec: function(event){ alert('Quit'); }
					// 		},
					// 		{
					// 			label: "Quit" ,
					// 			exec: function(event){ alert('Quit'); }
					// 		},
					// 		{
					// 			label: "Quit" ,
					// 			exec: function(event){ alert('Quit'); }
					// 		}
					// 	]
					// },
					{
						label: "プロジェクトを再選択 (&R)" ,
						exec: function(event){
							window.main.deselectProj();
							window.main.back2home();
						}
					},
					{
						label: "このアプリケーションを終了する (&Q)" ,
						exec: function(event){
							air.NativeApplication.nativeApplication.exit();
						}
					}
				]
			} ,
			{
				label:"&Edit",
				submenu: (function(){
					var modList = window.main.modMgr.getModList();
					var rtn = [];
					var selectedProjId = main.projMgr.getSelectedProjId();
					if(!strlen(selectedProjId)){
						rtn.push({
							label: "プロジェクトを選択" ,
							exec: function(event){
								window.location.href = 'app:/index.html';
							}
						});
						return rtn;
					}
					for(var row in modList){
						var menuUnit = {};
						menuUnit.label = modList[row].label;
						menuUnit.exec = (function(path){return function(event){ window.location.href = path; }})(modList[row].path);
						rtn.push(menuUnit);
					}
					return rtn;
				})()
			} ,
			{
				label:"&Help",
				submenu: [
					{
						label: "&About Pickles Framework" ,
						exec: function(event){ air.navigateToURL(new air.URLRequest('https://github.com/tomk79/PxFW-1.x')); }
					} ,
					{
						label: "&Get Pickles Framework" ,
						exec: function(event){ air.navigateToURL(new air.URLRequest('https://github.com/tomk79/PxFW-1.x/tags')); }
					}
				]
			}
		];

//		airNativeMenu(menuList);
		return true;
	}

	/*
	メモ：
	:dojo  | さまざまなフレームワークやユーティリティーを提供する基本ライブラリーです。
	:dijit | ウィジェットと呼ばれるユーザー・インターフェイス部品のライブラリーです。
	:dojox | 表形式のデータ編集やグラフ表示機能を含む拡張ライブラリーです。
	*/






	/**
	 * 文字列の幅を調べる
	 */
	window.strlen = function( $string ){
		if( $string === undefined ){ return 0; }
		if( $string === null ){ return 0; }
		$string = $string + '';
		return $string.length;
	}

	/**
	 * HTMLの特殊文字を変換する
	 */
	window.htmlspecialchars = function( $string ){
		if( $string === undefined ){ return ''; }
		if( $string === null ){ return ''; }
		$string = $string + '';
		$string = $string.replace( new RegExp("&", "gi")  , '&amp;'  );
		$string = $string.replace( new RegExp("<", "gi")  , '&lt;'   );
		$string = $string.replace( new RegExp(">", "gi")  , '&gt;'   );
		$string = $string.replace( new RegExp("\"", "gi") , '&quot;' );
		return $string;
	}

	/**
	 * HTMLの特殊文字変換を戻す
	 */
	window.htmlspecialchars_decode = function( $string ){
		if( $string === undefined ){ return ''; }
		if( $string === null ){ return ''; }
		$string = $string + '';
		$string = $string.replace( new RegExp("&lt;", "gi")  , '<'  );
		$string = $string.replace( new RegExp("&gt;", "gi")  , '>'   );
		$string = $string.replace( new RegExp("&quot;", "gi")  , '"'   );
		$string = $string.replace( new RegExp("&amp;", "gi") , '&' );
		return $string;
	}

	/**
	 * 文字列型かどうか調べる
	 */
	window.is_string = function( val ){
		var type = typeof( val );
		if( type.toLowerCase() != 'string' ){ return false; }
		return true;
	}

	/**
	 * 整数型かどうか調べる
	 */
	window.is_int = function( val ){
		var type = typeof( val );
		if( type.toLowerCase() != 'number' ){ return false; }
		return true;
	}

	/**
	 * オブジェクト型かどうか調べる
	 */
	window.is_object = function( val ){
		if( val === undefined ){ return false; }
		if( val === null ){ return false; }
		var type = typeof( val );
		if( type.toLowerCase() != 'object' ){ return false; }
		return true;
	}

	/**
	 * 配列型かどうか調べる
	 */
	window.is_array = function( val ){
		if( val === undefined ){ return false; }
		if( val === null ){ return false; }
		var type = typeof( val );
		if( type.toLowerCase() != 'object' ){ return false; }
		return true;
	}

	/**
	 * nullかどうか調べる
	 */
	window.is_null = function( val ){
		if( val === undefined ){ return true; }//undefinedはtrue評価
		if( val === null ){ return true; }
		return false;
	}

	/**
	 * undefinedかどうか調べる
	 */
	window.is_undefined = function( val ){
		if( val === undefined ){ return true; }
		return false;
	}

	/**
	 * 外部のHTMLをインクルードする。
	 */
	window.include = function(path){
		//  [UTODO]Macで上手く動いてない。		
		var fileSystem = new air.FileStream();
		var fileProjs = air.File.applicationDirectory.resolvePath( path );
		if( !fileProjs.exists ){
			return false;
		}
		fileSystem.open( fileProjs , air.FileMode.READ );
		var content = fileSystem.readUTFBytes(fileProjs.size);	// UTF文字列として読み込む

		fileSystem.close();
		document.write(content);
		return true;
	}

})();//main()
