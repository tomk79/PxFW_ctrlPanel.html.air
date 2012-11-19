/*
* jquery.pxLBox.js
*/
(function($){

	$.pxLBox = new (function(){
		var elms = {
			container : $(document.createElement('div')) ,
			contentFrame : $(document.createElement('div')) ,
			content : $(document.createElement('div')) ,
			background : $(document.createElement('div')) 
		};

		elms.container
			.append(
				elms.background
					.css({
						backgroundColor: '#000000' ,
						position: 'absolute',
						top: '0px',
						left: '0px' ,
						width:'100%' ,
						height:'100%'
					})
			)
			.append(
				elms.contentFrame
					.css({
						padding: '0px' ,
						position: 'absolute',
						top: '0px',
						left: '0px' ,
						width:'100%' ,
						height:'100%' ,
						overflow: 'hidden'
					})
					.append(
						elms.content
							.css({
								backgroundColor: '#ffffff' ,
								marginLeft: 'auto', 
								marginRight: 'auto', 
								padding: '30px' ,
								maxWidth:'400px' ,
								width:'100%' ,
								maxHeight:'60%' ,
								height:'100%' ,
								overflow: 'auto'
							})
					)
					.append('<div style="clear:both; text-align:center; background-color:#fff; margin:1em auto; max-width:400px;">[<a href="./index.html" onclick="$.pxLBox.close(); return false;">とじる</a>]</div>')
			)
			.css({
				display:'block',
				position: 'fixed',
				top: '0px',
				left: '0px' ,
				width:'100%' ,
				height:'100%'
			})
			.hide()
		;
		$(function(){
			$('body').append( elms.container );
		});

		/**
		 * ライトボックスを開く
		 */
		this.open = function(htmlSrc){
			elms.content.html('').append(htmlSrc);
			elms.container.fadeIn();
		}

		/**
		 * ライトボックスを閉じる
		 */
		this.close = function(){
			elms.container.fadeOut();
			elms.content.html('');
		}

	})();


})(jQuery);