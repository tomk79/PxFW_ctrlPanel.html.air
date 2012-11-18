/**
 * PxFWCtrlPanel メインオブジェクト
 * @author Tomoya Koyanagi (@tomk79)
 */
window.main = new (function(){

	dojo.require("dojox.data.CsvStore");

	var _main = this;
	var _this = this;

	this.projMgr = {}; //プロジェクトマネージャ

	/**
	 * 実行
	 */
	$(function(){
		if( !_this.projMgr ){
			alert('Error: projMgr の読み込みが正常に処理されませんでした。');
		}

		//_this.projMgr.saveProjs();
		_this.projMgr.loadProjs();
		_this.refreshContent();
	});

	/**
	 * コンテンツ領域を更新する
	 */
	this.refreshContent = function(){
		$('#content').html('<p>ページを生成しています...。</p>');
		drawStartMenu();
	}

	/**
	 * スタートメニュー画面を描画する。
	 */
	function drawStartMenu(){
		var allProjs = _this.projMgr.getAllProjs();
		var canvas = $('#content');
		var html = '';
		if( allProjs.length ){
			var tmpHtml = '';
			for( var i = 0; i<allProjs.length; i ++ ){
				tmpHtml += '<tr>';
				tmpHtml += '<th>'+htmlspecialchars(allProjs[i].id)+'</th>';
				tmpHtml += '<th>'+htmlspecialchars(allProjs[i].url)+'</th>';
				tmpHtml += '<td>'+htmlspecialchars(allProjs[i].authId)+'</td>';
				tmpHtml += '<td>[<a href="javascript:;" onclick="alert(\'開発中\');">開く</a>]</td>';
				tmpHtml += '<td>[<a href="javascript:alert(\'click href event.\'); ;" onclick="main.reviseProj('+htmlspecialchars(allProjs[i].id)+'); return false;">変更</a>]</td>';
				tmpHtml += '<td>[<a href="javascript:alert(\'click href event.\'); ;" onclick="main.delProj('+htmlspecialchars(allProjs[i].id)+'); return false;">削除</a>]</td>';
				tmpHtml += '</tr>';
			}
			html += '<table class="def">';
			html += '<thead>';
			html += '<tr>';
			html += '<th>ID</th>';
			html += '<th>URL</th>';
			html += '<th>認証ID</th>';
			html += '<th></th>';
			html += '<th></th>';
			html += '<th></th>';
			html += '</tr>';
			html += '</thead>';
			html += '<tbody>';
			html += ''+tmpHtml+'';
			html += '</tbody>';
			html += '</table>';
		}else{
			html += '<p>プロジェクトが定義されていません。</p>';
		}
		html += mkHtmlFormProjEditor();
		canvas.html(html);
	}

	/**
	 * プロジェクトを作成する
	 */
	this.addProj = function(formElm){
		main.projMgr.addProj($('*[name=proj_url]',formElm)[0].value, $('*[name=proj_auth_id]',formElm)[0].value, $('*[name=proj_auth_pw]',formElm)[0].value);
		main.projMgr.saveProjs();
		main.refreshContent();
		return true;
	}
	/**
	 * プロジェクト変更画面を表示する
	 */
	this.reviseProj = function(id){
		var html = '';
		html += '<p>変更'+htmlspecialchars(id)+'</p>';
		html += mkHtmlFormProjEditor({def:id});
		$.pxLBox.open(html);
		return true;
	}
	/**
	 * プロジェクトを削除する
	 */
	this.delProj = function(id){
		if( !confirm('プロジェクト '+htmlspecialchars(id)+' を削除します。よろしいですか？') ){
			return true;
		}
		_this.projMgr.delProj(id);
		_this.projMgr.saveProjs();
		_this.refreshContent();
		return true;
	}

	/**
	 * プロジェクト編集フォームのHTMLソースを生成する。
	 */
	function mkHtmlFormProjEditor(opt){
		var html = '';
		html += '<form action="javascript:;" method="get" onsubmit="main.addProj(this); return false;">';
		html += '<ul>';
		html += '<li>URL: <input type="text" name="proj_url" value="" /></li>';
		html += '<li>認証ID: <input type="text" name="proj_auth_id" value="" /></li>';
		html += '<li>認証PW: <input type="password" name="proj_auth_pw" value="" /></li>';
		html += '</ul>';
		html += '<p><input type="submit" value="作成する" /></p>';
		html += '</form>';
		return html;
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
	 * 文字列の幅を調べる
	 */
	//--------------------------------------
	//	HTMLの特殊文字を変換する
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
	 * 文字列の幅を調べる
	 */
	//--------------------------------------
	//	整数型かどうか調べる
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

})();//main()
