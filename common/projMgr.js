/**
 * プロジェクトマネージャの実装
 * @author Tomoya Koyanagi (@tomk79)
 */
window.main.projMgr = new (function(){
	var projDb = [];
	var _main = window.main;
	var maxIdNum = 0;
	var selectedProjId = '';
	var selectedProjConf = {};

	/**
	 * 全プロジェクトの情報を取得
	 */
	this.getAllProjs = function(){
		return projDb;
	}

	/**
	 * プロジェクト情報を取得
	 */
	this.getProjInfo = function( projId ){
		for( var i = 0; i < projDb.length; i ++ ){
			if( projDb[i].id == projId ){
				return projDb[i];
			}
		}
		return false;
	}

	/**
	 * プロジェクトを追加する
	 */
	this.addProj = function(url,authId,authPw){
		var tmpRow = {
			id: ++maxIdNum,
			url: url,
			authId: authId,
			authPw: authPw
		}
		projDb.push(tmpRow);
		return true;
	}

	/**
	 * プロジェクトを更新する
	 */
	this.updateProj = function(projId,url,authId,authPw){
		var projInfo = this.getProjInfo(projId);
		if(!projInfo){ return false; }//存在しないIDなら

		for( var i = 0; i < projDb.length; i ++ ){
			if( projDb[i].id == projId ){
				projDb[i] = {
					id: projId,
					url: url,
					authId: authId,
					authPw: authPw
				};
				break;
			}
		}
		return true;
	}

	/**
	 * プロジェクトを削除する
	 */
	this.delProj = function(projId){
		for( var i = 0; i < projDb.length; i ++ ){
			if( projDb[i].id == projId ){
				projDb.splice(i,1);//配列の要素を削除
				return true;
			}
		}
		return false;
	}

	/**
	 * プロジェクトの一覧を保存する
	 */
	this.saveProjs = function(){
		var fileSystem = new air.FileStream();
		fileSystem.open( air.File.applicationStorageDirectory.resolvePath( 'projects.csv' ) , air.FileMode.WRITE);

		var csvSrc = '';
		csvSrc += 'id,url,authId,authPw'+"\r\n";
		for( var i = 0; i < projDb.length; i ++ ){
			csvSrc += (strlen(projDb[i].id)?projDb[i].id:'')+',';
			csvSrc += (strlen(projDb[i].url)?projDb[i].url:'')+',';
			csvSrc += (strlen(projDb[i].authId)?projDb[i].authId:'')+',';
			csvSrc += (strlen(projDb[i].authPw)?projDb[i].authPw:'')+'';
			csvSrc += "\r\n";
		}
		fileSystem.writeUTFBytes(csvSrc);
		fileSystem.close();

		return true;
	}//saveProjs()

	/**
	 * プロジェクトの一覧を読み込む
	 */
	this.loadProjs = function(){
		projDb = [];

		var fileSystem = new air.FileStream();
		var fileProjs = air.File.applicationStorageDirectory.resolvePath( 'projects.csv' );
		if( !fileProjs.exists ){
			this.saveProjs();
		}
		fileSystem.open( fileProjs , air.FileMode.READ );
		var csvValue = fileSystem.readUTFBytes(fileProjs.size);	// UTF文字列として読み込む
		fileSystem.close();

		var store = new dojox.data.CsvStore({data: csvValue});
			//↑dojox.data.CsvStore() は、url の代わりに data を受け取ることができる。 see: http://dojotoolkit.org/reference-guide/1.8/dojox/data/CsvStore.html

		// Invoke the fetch.
		store.fetch({
			onComplete: function (items, findResult){
				projDb = [];
				for( var i = 0; i < items.length; i ++ ){
					var tmpRow = {};
					tmpRow.id = store.getValue(items[i], "id");
					tmpRow.url = store.getValue(items[i], "url");
					tmpRow.authId = store.getValue(items[i], "authId");
					tmpRow.authPw = store.getValue(items[i], "authPw");
					projDb.push(tmpRow);

					if(maxIdNum<tmpRow.id){maxIdNum = Number( tmpRow.id );}
				}
			} ,
			onError: function (errData, request){
				//if( errData == 'TypeError: Null value' ){
				//	//CSVが空っぽの場合に起きるエラー(⇒無視)
				//	return;
				//}
				//alert('csv read error.');
				//alert(errData);
				//alert(request);
					//↑CSVが空なだけでエラー扱いになっちゃうので、エラー処理やめた。
				return;
			}
		});

		return true;
	}//loadProjs()

	/**
	 * プロジェクトを選択する
	 */
	this.selectProj = function(projId){
		if( !strlen(projId) ){
			projId = '';
		}
		var fileSystem = new air.FileStream();
		fileSystem.open( air.File.applicationStorageDirectory.resolvePath( 'selected_proj.txt' ) , air.FileMode.WRITE);
		fileSystem.writeUTFBytes(projId);
		fileSystem.close();

		selectedProjId = projId;
		return true;
	}//selectProj()

	/**
	 * 選択したプロジェクトIDを読み込む
	 */
	this.getSelectedProjId = function(){
		var fileSystem = new air.FileStream();
		var fileProjs = air.File.applicationStorageDirectory.resolvePath( 'selected_proj.txt' );
		if( !fileProjs.exists ){
			this.selectProj('');
		}
		fileSystem.open( fileProjs , air.FileMode.READ );
		var loadedValue = fileSystem.readUTFBytes(fileProjs.size);	// UTF文字列として読み込む
		fileSystem.close();

		selectedProjId = loadedValue;
		return loadedValue;

	}//getSelectedProjId()

	/**
	 * プロジェクトのコンフィグ情報を取得する
	 */
	this.getSelectedProjConf = function(){
		return selectedProjConf;
	}

	/**
	 * プロジェクトのコンフィグ情報を読み込む
	 */
	this.loadSelectedProjConf = function(projId,callback){
		var projInfo = this.getProjInfo(projId);
		selectedProjConf = {};
		$.ajax({
			url: projInfo.url ,
			dataType: 'xml' ,
			data: {
				PX: 'api.get.config' ,
				type: 'xml'
			} ,
			success: function(data){
				var elms = $(data);
				selectedProjConf = {};
				$('api>object>element',elms).each(function(){
					selectedProjConf[$(this).attr('name')] = $('value',this).text();
					return true;
				});

			} ,
			error: function(XMLHttpRequest, textStatus, errorThrown){
				alert('コンフィグ情報の読み込みエラーが発生しました。');
			} ,
			complete: function(){
				if(callback){
					(callback)();
				}
			}
		});
	}

})();