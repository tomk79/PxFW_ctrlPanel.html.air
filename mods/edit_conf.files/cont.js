/**
 * コンテンツの実装
 * @author Tomoya Koyanagi (@tomk79)
 */
window.cont = new (function(){

	var serverSrc = '';

	/**
	 * コンテンツ領域を更新する
	 */
	this.play = function(){
		$('#content').html('<p>読み込んでいます...。</p>');
		var projInfo = main.projMgr.getProjInfo(main.projMgr.getSelectedProjId());
		$.ajax({
			url: projInfo.url ,
			data: {
				PX: 'api.dlfile.config'
			} ,
			success: function(data){
				serverSrc = data;
			} ,
			error: function(XMLHttpRequest, textStatus, errorThrown){
				alert('コンフィグファイルの読み込みエラーが発生しました。');
			} ,
			complete: function(){
				var html = '';
				html += '<p>コンフィグファイルを編集します。</p>';
				html += '<p>ここで編集した内容は直接 Pickles Framework のコンフィグファイルを置き換えられます。内容に誤りがある場合、<strong>PxFWが正常に動作しなくなる場合があります</strong>。ご注意ください。</p>';
				html += '<p>次の点には特に注意して編集してください。これらを誤った値に設定すると、以降アプリからの操作を受け付けなくなり、アプリからの復旧が不可能になる場合があります。</p>';
				html += '<ul>';
				html += '<li>paths.px_dir は変更しないでください。</li>';
				html += '<li>system.allow_pxcommands は、必ず 1 に設定してください。これを 0 に設定すると、PxCommand のAPIが封鎖されます。</li>';
				html += '</ul>';
				html += '<form action="javascript:;" method="get">';
				html += '<textarea name="bin">'+htmlspecialchars(serverSrc)+'</textarea>';
				html += '<p class="center"><input type="submit" value="保存する" /></p>';
				html += '</form>';
				$('#content').html(html);
				$('#content form').bind('submit', function(){
					var bin = $('textarea[name=bin]',this)[0].value;
					var projInfo = main.projMgr.getProjInfo(main.projMgr.getSelectedProjId());
					var result = 0;
					$.ajax({
						url: projInfo.url ,
						dataType: 'xml' ,
						data: {
							type: 'xml',
							PX: 'api.ulfile.config',
							bin: bin
						} ,
						success: function(xml){
							result = $('api>object>element[name=result]>value',xml).text();
						} ,
						error: function(XMLHttpRequest, textStatus, errorThrown){
							alert('コンフィグファイルの保存時エラーが発生しました。');
						} ,
						complete: function(){
							if(!result){
								alert('コンフィグファイルの保存に失敗しました。');
							}else{
								main.back2home();
							}
						}
					});
					return false;
				});
			}
		});
		return;
	}

})();
