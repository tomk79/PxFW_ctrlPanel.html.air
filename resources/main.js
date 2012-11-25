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

		var currentProjId = _this.projMgr.getSelectedProjId();
		if( strlen(currentProjId) ){
			_this.projMgr.loadSelectedProjConf(currentProjId,startContent);

			$('.theme_header')
				.append($('<a href="index.html">')
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
			);
			return;
		}

		startContent();
		return;
	});

	function startContent(){
		//コンテンツの処理を開始する
		window.cont.play();
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

})();//main()
