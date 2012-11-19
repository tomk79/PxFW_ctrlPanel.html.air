/**
 * コンテンツの実装
 * @author Tomoya Koyanagi (@tomk79)
 */
window.cont = new (function(){

	/**
	 * コンテンツ領域を更新する
	 */
	this.play = function(){
		$('#content').html('<p>ページを生成しています...。</p>');
		currentProjId = main.projMgr.getSelectedProj();
		if( !strlen(currentProjId) ){
			pageProjSelectMenu();
			return;
		}
		pageProjStartMenu();
		return;
	}

	/**
	 * プロジェクト選択ページを描画する。
	 */
	function pageProjSelectMenu(){
		var allProjs = main.projMgr.getAllProjs();
		var canvas = $('#content');
		var html = '';
		html += '<div class="cont_layout_main">';
		if( allProjs.length ){
			var tmpHtml = '';
			for( var i = 0; i<allProjs.length; i ++ ){
				tmpHtml += '<tr>';
				tmpHtml += '<th>'+htmlspecialchars(allProjs[i].id)+'</th>';
				tmpHtml += '<th>'+htmlspecialchars(allProjs[i].url)+'</th>';
				tmpHtml += '<td>'+htmlspecialchars(allProjs[i].authId)+'</td>';
				tmpHtml += '<td class="center">[<a href="./index.html" onclick="return main.selectProj('+htmlspecialchars(allProjs[i].id)+');">開く</a>]</td>';
				tmpHtml += '<td class="center">[<a href="./index.html" onclick="return !main.reviseProj('+htmlspecialchars(allProjs[i].id)+');">変更</a>]</td>';
				tmpHtml += '<td class="center">[<a href="./index.html" onclick="return main.delProj('+htmlspecialchars(allProjs[i].id)+');">削除</a>]</td>';
				tmpHtml += '</tr>';
			}
			html += '<table class="def" style="width:100%;">';
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
//		html += '<p>(デバッグ用: <a href="./index.html">リロード</a>)</p>';
		html += '</div>';
		html += '<div class="cont_layout_sub">';
		html += '<div class="cont_form_addproj">';
		html += '<form action="./index.html" method="get" onsubmit="return main.addProj(this);">';
		html += '<dl>';
		html += '<dt>URL:</dt><dd><input type="text" name="proj_url" value="" /></dd>';
		html += '<dt>認証ID:</dt><dd><input type="text" name="proj_auth_id" value="" /></dd>';
		html += '<dt>認証PW:</dt><dd><input type="password" name="proj_auth_pw" value="" /></dd>';
		html += '</dl>';
		html += '<p><input type="submit" value="作成する" /></p>';
		html += '<div><input type="hidden" name="proj_id" value="" /></div>';
		html += '</form>';
		html += '</div>';
		html += '<div class="cont_form_updateproj">';
		html += '<form action="./index.html" method="get" onsubmit="return main.updateProj(this);">';
		html += '<dl>';
		html += '<dt>URL:</dt><dd><input type="text" name="proj_url" value="" /></dd>';
		html += '<dt>認証ID:</dt><dd><input type="text" name="proj_auth_id" value="" /></dd>';
		html += '<dt>認証PW:</dt><dd><input type="password" name="proj_auth_pw" value="" /></dd>';
		html += '</dl>';
		html += '<p><input type="submit" value="更新する" /></p>';
		html += '<div><input type="hidden" name="proj_id" value="" /></div>';
		html += '</form>';
		html += '<p><input type="button" value="キャンセル" onclick="main.cancelReviseProj();return false;" /></p>';
		html += '</div>';
		html += '</div>';
		canvas.html(html);
		$('.contents .cont_form_updateproj').hide();
	}

	/**
	 * プロジェクトスタートメニューページを描画する。
	 */
	function pageProjStartMenu(){
		var canvas = $('#content');
		var html = '';
		html += '<p>プロジェクト '+currentProjId+' を選択しました。</p>';
		html += '<p>開発中です。</p>';
		html += '<p class="center">[<a href="./index.html" onclick="return main.deselectProj();">プロジェクトを選択しなおす</a>]</p>';
		canvas.html(html);
	}


})();