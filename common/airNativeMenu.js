/**
 * Adobe AIR にネイティブメニューを実装する。
 * 一旦サンプルを落としてきた段階。
 * サンプルはここから入手⇒
 *     Adobe AIR 例：ウィンドウメニューとアプリケーションメニュー <http://help.adobe.com/ja_JP/AIR/1.1/devappshtml/WS5b3ccc516d4fbf351e63e3d118666ade46-7de7.html>
 */
function airNativeMenu(menuList){

	var menu = [];
	var application = air.NativeApplication.nativeApplication; 

	function applySubmenu(menuList){
		var submenu = new air.NativeMenu();

		for(var row in menuList){
			var newCommand = submenu.addItem(new air.NativeMenuItem(menuList[row].label));
			if(menuList[row].exec){
				newCommand.addEventListener(air.Event.SELECT, menuList[row].exec);
			}
			if(menuList[row].submenu){

// openFile.submenu = new air.NativeMenu();
// openFile.submenu.addEventListener(air.Event.DISPLAYING, updateRecentDocumentMenu);
				// var docMenu = air.NativeMenu(event.target);

				// var menuItem = docMenu.addItem(new air.NativeMenuItem(recentDocuments[file].name));
				// menuItem.data = recentDocuments[file];
				// menuItem.addEventListener(air.Event.SELECT, selectCommand);

				submenu.addEventListener(air.Event.DISPLAYING, updateRecentDocumentMenu);
			}
		}
		return submenu;

	}

	if(air.NativeWindow.supportsMenu && nativeWindow.systemChrome != air.NativeWindowSystemChrome.NONE) {
		nativeWindow.menu = new air.NativeMenu();
	}

	for(var row in menuList){
		if(air.NativeWindow.supportsMenu && nativeWindow.systemChrome != air.NativeWindowSystemChrome.NONE) {
			menu[row] = nativeWindow.menu.addItem(new air.NativeMenuItem(menuList[row].label));
		}
		if(air.NativeApplication.supportsMenu) {
			menu[row] = application.menu.addItem(new air.NativeMenuItem(menuList[row].label));
		}
		menu[row].submenu = applySubmenu(menuList[row]['submenu']);
	}

	/**
	 * サブメニューが出るときに呼ばれる。
	 */
	function updateRecentDocumentMenu(event) {
		alert("Updating recent document menu.");
		return;

/*
		var docMenu = air.NativeMenu(event.target);

		for (var i = docMenu.numItems - 1; i >= 0; i--) {
			docMenu.removeItemAt(i);
		}

		var recentDocuments = [
			new air.File("app-storage:/GreatGatsby.pdf"),
			new air.File("app-storage:/WarAndPeace.pdf"),
			new air.File("app-storage:/Iliad.pdf")
		];

		for (var file in recentDocuments) {
			var menuItem = docMenu.addItem(new air.NativeMenuItem(recentDocuments[file].name));
			menuItem.data = recentDocuments[file];
			menuItem.addEventListener(air.Event.SELECT, selectCommand);
		}
*/
	}

}//airNativeMenu()

