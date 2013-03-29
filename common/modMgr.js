/**
 * モジュールマネージャの実装
 * @author Tomoya Koyanagi (@tomk79)
 */
window.main.modMgr = new (function(){
	var modDb = [
		{ label: 'ホーム'           , path: 'app:/index.html'          } ,
		{ label: '設定ファイル編集' , path: 'app:/mods/edit_conf.html' }
	];
	var _main = window.main;

	/**
	 * モジュールの一覧を取得する
	 */
	this.getModList = function(){
		return modDb;
	}

	/**
	 * カレントモジュールの情報を返す
	 */
	this.getCurrentMod = function(){
		for( var index in modDb ){
			if( modDb[index].path == window.location.href ){
				return modDb[index];
			}
		}
		return false;
	}

})();