
function shareToQzone(title,url,picurl){
	var shareqqzonestring='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title='+title+'&url='+url+'&pics='+picurl;
	window.open(shareqqzonestring,'newwindow','height=500,width=1000,top=100,left=100');
}
function shareToQq(title,url,picurl){
	var shareqqstring='http://connect.qq.com/widget/shareqq/index.html?title='+title+'&url='+url+'&pics='+picurl;
	window.open(shareqqstring,'newwindow','height=500,width=1000,top=100,left=100');
}
function shareToSina(title,url,picurl){
	//var sharesinastring='http://service.weibo.com/share/share.php?title='+title+'&url='+url+'&pic='+picurl;
	var sharesinastring='http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url+'&pic='+picurl;
	window.open(sharesinastring,'newwindow','height=500,width=1000,top=100,left=100');
}
function shareToTengxun(title,url,picurl){
	var sharetengxunstring='http://share.v.t.qq.com/index.php?c=share&a=index&title='+title+'&url='+url+'&pic='+picurl;
	window.open(sharetengxunstring,'newwindow','height=500,width=1000,top=100,left=100');
}
function shareToRenren(title,url,picurl){
	var sharetengxunstring='http://widget.renren.com/dialog/share?c=share&a=index&title='+title+'&resourceUrl='+url+'&pic='+picurl;
	window.open(sharetengxunstring,'newwindow','height=500,width=1000,top=100,left=100');
}
