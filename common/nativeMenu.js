(function(){
/**
 * Adobe AIR にネイティブメニューを実装する。
 * 一旦サンプルを落としてきた段階。
 * サンプルはここから入手⇒
 *     Adobe AIR 例：ウィンドウメニューとアプリケーションメニュー <http://help.adobe.com/ja_JP/AIR/1.1/devappshtml/WS5b3ccc516d4fbf351e63e3d118666ade46-7de7.html>
 */
var application = air.NativeApplication.nativeApplication; 
var recentDocuments =  
	new Array(new air.File("app-storage:/GreatGatsby.pdf"),  
			 new air.File("app-storage:/WarAndPeace.pdf"),  
			 new air.File("app-storage:/Iliad.pdf")); 
 
function MenuExample(){ 
	var fileMenu; 
	var editMenu; 
	 
	if (air.NativeWindow.supportsMenu &&  
		nativeWindow.systemChrome != air.NativeWindowSystemChrome.NONE) { 
		nativeWindow.menu = new air.NativeMenu(); 
		nativeWindow.menu.addEventListener(air.Event.SELECT, selectCommandMenu); 
		fileMenu = nativeWindow.menu.addItem(new air.NativeMenuItem("File")); 
		fileMenu.submenu = createFileMenu(); 

		editMenu = nativeWindow.menu.addItem(new air.NativeMenuItem("Edit")); 
		editMenu.submenu = createEditMenu(); 
	} 

	if (air.NativeApplication.supportsMenu) { 
		application.menu.addEventListener(air.Event.SELECT, selectCommandMenu); 
		fileMenu = application.menu.addItem(new air.NativeMenuItem("File")); 
		fileMenu.submenu = createFileMenu(); 
		editMenu = application.menu.addItem(new air.NativeMenuItem("Edit")); 
		editMenu.submenu = createEditMenu(); 
	} 
} 
		 
function createFileMenu() { 
	var fileMenu = new air.NativeMenu(); 
	fileMenu.addEventListener(air.Event.SELECT,selectCommandMenu); 
	 
	var newCommand = fileMenu.addItem(new air.NativeMenuItem("New")); 
	newCommand.addEventListener(air.Event.SELECT, selectCommand); 
	var saveCommand = fileMenu.addItem(new air.NativeMenuItem("Save")); 
	saveCommand.addEventListener(air.Event.SELECT, selectCommand); 
	var openFile = fileMenu.addItem(new air.NativeMenuItem("Open Recent"));  
	openFile.submenu = new air.NativeMenu(); 
	openFile.submenu.addEventListener(air.Event.DISPLAYING, updateRecentDocumentMenu); 
	openFile.submenu.addEventListener(air.Event.SELECT, selectCommandMenu); 
	 
	return fileMenu; 
} 
 
function createEditMenu() { 
	var editMenu = new air.NativeMenu(); 
	editMenu.addEventListener(air.Event.SELECT,selectCommandMenu); 
	 
	var copyCommand = editMenu.addItem(new air.NativeMenuItem("Copy")); 
	copyCommand.addEventListener(air.Event.SELECT,selectCommand); 
	copyCommand.keyEquivalent = "c"; 
	var pasteCommand = editMenu.addItem(new air.NativeMenuItem("Paste")); 
	pasteCommand.addEventListener(air.Event.SELECT, selectCommand); 
	copyCommand.keyEquivalent = "v"; 
	editMenu.addItem(new air.NativeMenuItem("", true)); 
	var preferencesCommand = editMenu.addItem(new air.NativeMenuItem("Preferences")); 
	preferencesCommand.addEventListener(air.Event.SELECT,selectCommand); 
	 
	return editMenu; 
} 
 
function updateRecentDocumentMenu(event) { 
	air.trace("Updating recent document menu."); 
	var docMenu = air.NativeMenu(event.target); 
	 
	for (var i = docMenu.numItems - 1; i >= 0; i--) { 
		docMenu.removeItemAt(i); 
	} 
	 
	for (var file in recentDocuments) { 
		var menuItem =  
			docMenu.addItem(new air.NativeMenuItem(recentDocuments[file].name)); 
		menuItem.data = recentDocuments[file]; 
		menuItem.addEventListener(air.Event.SELECT, selectRecentDocument); 
	} 
} 
 
function selectRecentDocument(event) { 
	air.trace("Selected recent document: " + event.target.data.name); 
} 
 
function selectCommand(event) { 
	air.trace("Selected command: " + event.target.label); 
} 
 
function selectCommandMenu(event) { 
	if (event.currentTarget.parent != null) { 
		var menuItem = findItemForMenu(event.currentTarget); 
		if(menuItem != null){ 
			air.trace("Select event for \"" + event.target.label +  
			"\" command handled by menu: " + menuItem.label); 
		} 
	} else { 
		air.trace("Select event for \"" + event.target.label +  
				"\" command handled by root menu."); 
	} 
} 
 
function findItemForMenu(menu){ 
	for (var item in menu.parent.items) { 
		if (item != null) { 
			if (item.submenu == menu) { 
				return item; 
			} 
		} 
	} 
	return null; 
} 
$(function(){
	//onloadで実行する。
	MenuExample();
});
})();
