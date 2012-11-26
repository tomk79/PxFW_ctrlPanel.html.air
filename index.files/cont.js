/**
 * コンテンツの実装
 * @author Tomoya Koyanagi (@tomk79)
 */
window.cont = new (function(){
	var selectedProjId = '';
	var selectedProjConf = {};

	/**
	 * コンテンツ領域を更新する
	 */
	this.play = function(){
		$('#content').html('<p>ページを生成しています...。</p>');
		selectedProjId = main.projMgr.getSelectedProjId();
		if( !strlen(selectedProjId) ){
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
				tmpHtml += '<td class="center">[<a href="javascript:;" onclick="main.selectProj('+htmlspecialchars(allProjs[i].id)+');">開く</a>]</td>';
				tmpHtml += '<td class="center">[<a href="javascript:;" onclick="cont.reviseProj('+htmlspecialchars(allProjs[i].id)+');">変更</a>]</td>';
				tmpHtml += '<td class="center">[<a href="javascript:;" onclick="main.delProj('+htmlspecialchars(allProjs[i].id)+');">削除</a>]</td>';
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
		html += '<form action="javascript:;" method="get" onsubmit="main.addProj(this);">';
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
		html += '<form action="javascript:;" method="get" onsubmit="main.updateProj(this);">';
		html += '<dl>';
		html += '<dt>URL:</dt><dd><input type="text" name="proj_url" value="" /></dd>';
		html += '<dt>認証ID:</dt><dd><input type="text" name="proj_auth_id" value="" /></dd>';
		html += '<dt>認証PW:</dt><dd><input type="password" name="proj_auth_pw" value="" /></dd>';
		html += '</dl>';
		html += '<p><input type="submit" value="更新する" /></p>';
		html += '<div><input type="hidden" name="proj_id" value="" /></div>';
		html += '</form>';
		html += '<p><input type="button" value="キャンセル" onclick="cont.cancelReviseProj();return false;" /></p>';
		html += '</div>';
		html += '</div>';
		canvas.html(html);
		$('.contents .cont_form_updateproj').hide();
	}

	/**
	 * プロジェクト変更画面を表示する
	 */
	this.reviseProj = function(id){
		var targetProjInfo = main.projMgr.getProjInfo(id);
		$('.contents .cont_form_addproj').hide();
		$('.contents .cont_form_updateproj input[name=proj_id]')[0].value=(strlen(id)?id:'');
		$('.contents .cont_form_updateproj input[name=proj_url]')[0].value=(strlen(targetProjInfo.url)?targetProjInfo.url:'');
		$('.contents .cont_form_updateproj input[name=proj_auth_id]')[0].value=(strlen(targetProjInfo.authId)?targetProjInfo.authId:'');
		$('.contents .cont_form_updateproj input[name=proj_auth_pw]')[0].value=(strlen(targetProjInfo.authPw)?targetProjInfo.authPw:'');
		$('.contents .cont_form_updateproj').show();
		return true;
	}
	/**
	 * プロジェクト変更をキャンセルする
	 */
	this.cancelReviseProj = function(){
		$('.contents .cont_form_updateproj input[name=proj_id]')[0].value='';
		$('.contents .cont_form_updateproj input[name=proj_url]')[0].value='';
		$('.contents .cont_form_updateproj input[name=proj_auth_id]')[0].value='';
		$('.contents .cont_form_updateproj input[name=proj_auth_pw]')[0].value='';
		$('.contents .cont_form_updateproj').hide();
		$('.contents .cont_form_addproj').show();
	}

	/**
	 * プロジェクトスタートメニューページを描画する。
	 */
	function pageProjStartMenu(){
		var canvas = $('#content');
		var projInfo = main.projMgr.getProjInfo(selectedProjId);
		selectedProjConf = main.projMgr.getSelectedProjConf();

		var html = '';
		html += mk_config_list();
		canvas.html(html);
	}

	/**
	 * コンフィグの一覧画面を生成する。
	 */
	function mk_config_list(){
		var $src = '';

		$src += '<div class="unit">'+"\n";

		$src += '<h2>project</h2>'+"\n";
		$src += '<table class="def" style="width:100%;">'+"\n";
		$src += '<colgroup><col width="30%" /><col width="30%" /><col width="40%" /></colgroup>'+"\n";
		$src += mk_config_unit('project.id','プロジェクトID');
		$src += mk_config_unit('project.name','プロジェクト名');
		$src += mk_config_unit('project.auth_type','認証形式');
		$src += mk_config_unit('project.auth_name','認証ユーザーID');
		$src += mk_config_unit('project.auth_password','認証パスワード');
		$src += '</table>'+"\n";

		$src += '<h2>paths</h2>'+"\n";
		$src += '<table class="def" style="width:100%;">'+"\n";
		$src += '<colgroup><col width="30%" /><col width="30%" /><col width="40%" /></colgroup>'+"\n";
		$src += mk_config_unit('paths.px_dir','Pickles Framework のディレクトリパス','realpath',true);
		$src += mk_config_unit('paths.access_log','アクセスログ出力先ファイルパス','realpath');
		$src += mk_config_unit('paths.error_log','エラーログ出力先ファイルパス','realpath');
		$src += '</table>'+"\n";

		$src += '<h2>publish</h2>'+"\n";
		$src += '<table class="def" style="width:100%;">'+"\n";
		$src += '<colgroup><col width="30%" /><col width="30%" /><col width="40%" /></colgroup>'+"\n";
		$src += mk_config_unit('publish.path_publish_dir','パブリッシュ先ディレクトリパス','realpath');
		$src += mk_config_unit('publish.paths_ignore','パブリッシュ対象外パスの一覧');
		$src += '</table>'+"\n";

		$src += '<h2>dbms</h2>'+"\n";
		$src += '<table class="def" style="width:100%;">'+"\n";
		$src += '<colgroup><col width="30%" /><col width="30%" /><col width="40%" /></colgroup>'+"\n";
		$src += mk_config_unit('dbms.prefix','テーブル名の接頭辞');
		$src += mk_config_unit('dbms.dbms','DBMS名');
		$src += mk_config_unit('dbms.host','接続先ホスト名');
		$src += mk_config_unit('dbms.port','接続先ポート番号');
		$src += mk_config_unit('dbms.database_name','データベース名(SQLiteの場合は、データベースのパス)');
		$src += mk_config_unit('dbms.user','ユーザー名');
		$src += mk_config_unit('dbms.password','パスワード');
		$src += mk_config_unit('dbms.charset','文字セット');
		$src += '</table>'+"\n";

		$src += '<h2>system</h2>'+"\n";
		$src += '<table class="def" style="width:100%;">'+"\n";
		$src += '<colgroup><col width="30%" /><col width="30%" /><col width="40%" /></colgroup>'+"\n";
		$src += mk_config_unit('system.allow_pxcommands','PX Commands の実行を許可するフラグ(1=許可, 0=不許可)','bool');
		$src += mk_config_unit('system.session_name','セッションID');
		$src += mk_config_unit('system.filesystem_encoding','ファイル名の文字エンコード');
		$src += mk_config_unit('system.output_encoding','出力エンコード');
		$src += mk_config_unit('system.output_eof_coding',' 出力改行コード("CR"|"LF"|"CRLF")');
		$src += '</table>'+"\n";

		$src += '</div><!-- /.unit -->'+"\n";

		var count = 0;
		for( var key in selectedProjConf ){
			//JSでは連想配列の要素数はこうやって数えるのだそうだ。
			count++;
		}
		if( count ){
			$src += '<div class="unit">'+"\n";
			$src += '<h2>その他の値</h2>'+"\n";
			$src += '<table class="def" style="width:100%;">'+"\n";
			$src += '<colgroup><col width="40%" /><col width="60%" /></colgroup>'+"\n";
			for( var key in selectedProjConf ){
				$src += '<tr>'+"\n";
				$src += '<th>'+htmlspecialchars(key)+'</th>'+"\n";
				$src += '<td>'+htmlspecialchars(selectedProjConf[key])+'</td>'+"\n";
				$src += '</tr>'+"\n";
			}
			$src += '</table>'+"\n";
			$src += '</div><!-- /.unit -->'+"\n";
		}

		return $src;
	}

	/**
	 * コンフィグ項目1件の出力
	 */
	function mk_config_unit($key,$label,$type,$must){
		$src = '';
		$src += '	<tr>'+"\n";
		$src += '		<th>'+htmlspecialchars( $key )+'</th>'+"\n";
		$src += '		<th>'+htmlspecialchars( $label )+'</th>'+"\n";
		$src += '		<td>';
		if(is_null(selectedProjConf[$key])){
			$src += '<span style="font-style:italic; color:#aaaaaa; background-color:#ffffff;">null</span>';
		}else{
			switch($type){
				case 'bool':
					$src += (selectedProjConf[$key]?'<span style="font-style:italic; color:#0033dd; background-color:#ffffff;">true</span>':'<span style="font-style:italic; color:#0033dd; background-color:#ffffff;">false</span>');
					break;
				case 'realpath':
					$src += htmlspecialchars( selectedProjConf[$key] );
					break;
				case 'string':
				default:
					$src += htmlspecialchars( selectedProjConf[$key] );
					break;
			}
		}
		$src += '</td>'+"\n";
		$src += '	</tr>'+"\n";

		delete(selectedProjConf[$key]);

		return $src;
	}//mk_config_unit()

})();
