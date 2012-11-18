/**
 * プロジェクトマネージャの実装
 * @author Tomoya Koyanagi (@tomk79)
 */
window.main.projMgr = new (function(){
	var projDb = [];
	var _main = window.main;
	var maxIdNum = 0;

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
	this.updateProj = function(id,url,authId,authPw){
		var projInfo = this.getProjInfo(id);
		if(!projInfo){ return false; }//存在しないIDなら

		var tmpRow = {
			id: id,
			url: url,
			authId: authId,
			authPw: authPw
		}
		projDb.push(tmpRow);
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
		if( !air ){
			//デバッグ用モード
			return true;
		}
		var fileSystem = new air.FileStream();
		fileSystem.open( air.File.applicationStorageDirectory.resolvePath( 'projects.csv' ) , air.FileMode.WRITE);

		var csvSrc = '';
		csvSrc += 'id,url,authId,authPw'+"\r\n";
		for( var i = 0; i < projDb.length; i ++ ){
			csvSrc += projDb[i].id+','+projDb[i].url+','+projDb[i].authId+','+projDb[i].authPw+''+"\r\n";
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

		if(!air){
			//デバッグ用モード
			projDb = [
				{id:0, url:'http://localhost:19991/', authId:'', authPw:'' },
				{id:1, url:'http://localhost:19992/', authId:'', authPw:'' },
				{id:2, url:'http://localhost:19993/', authId:'', authPw:'' },
			];
			maxIdNum = 2;
			return true;
		}

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

})();