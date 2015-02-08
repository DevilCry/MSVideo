var tabHashMap = {
    Set : function(key,value){this[key] = value},
    Get : function(key){return this[key]},
    Contains : function(key){return this.Get(key) == null?false:true},
    Remove : function(key){delete this[key]}
};

var menuArray =[
{"n":"#menu","p":"#menu #pEntity","s":"#entity"},
{"n":"#menu","p":"#menu #pMethod","s":"#method"},
{"n":"#entity","p":"#entity #pSuspect-man","s":"#suspect-man"},
{"n":"#entity","p":"#entity #pAccount","s":"#account"},
{"n":"#entity","p":"#entity #pTelephone","s":"#telephone"},
{"n":"#method","p":"#method #pEconomic-analysis","s":"#economic-analysis"}
];

$(window).load(function(){
  //控制左侧边栏初始状态，和每次关闭切换
  $("[data-sidebar]").click(function() {
    var toggle_el = $(this).data("sidebar");
    $(toggle_el).toggleClass("open-sidebar");
    $("#sidebar >ul").addClass("sidebar-hidden");
    $("#sidebar >div").addClass("sidebar-hidden");
    $("#sidebar #menu").removeClass("sidebar-hidden");
  });
  //注册左侧按钮点击事件
  registerMenuClickEvent();

  //以下控制Tab页
//  $('#mainTab a:first').tab('show');
//  $('.nav-tabs').tabdrop();
//  registerTabComposeEvent();
//  registerTabCloseEvent();
});

//以下是注册左侧菜单的点击事件

function registerMenuClickEvent(){
	$(menuArray).each(function(){
		var name = this.n;var son = this.s;
		$("#sidebar "+this.p).click(function(){
		    $("#sidebar "+name).addClass("sidebar-hidden");
		    $("#sidebar "+son).removeClass("sidebar-hidden");
		});
	});
}

//以下是控制Tab页函数
//function registerTabComposeEvent(){
//
//  $(".composeTab").click(function(e){
//
//      var tabId = $(this).attr('tabid');
//      console.log(tabHashMap);
//      if(!tabHashMap.Contains(tabId)){
//    	  tabHashMap.Set(tabId,$(this).attr('taburl'));
//          $('.nav-tabs').append('<li><a href="#' + tabId + '" data-toggle="tab"> <span class="close closeTab">&times;</span>'+$(this).html()+'</a></li>');
//          $('.tab-content').append('<div class="tab-pane" id="' + tabId + '"></div>');
//          craeteNewTabAndLoadUrl("", "./"+tabHashMap.Get(tabId), "#" + tabId);
//          showTab(tabId);
//          registerTabCloseEvent();
//          $('.nav-tabs').tabdrop('layout');
//      }else{
//    	  showTab(tabId);
//      }
//  });
//}
//
//function registerTabCloseEvent() {
//  $(".closeTab").click(function () {
//      //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
//      var tabContentId = $(this).parent().attr("href");
//      $(this).parent().parent().remove(); //remove li of tab
//      $(tabContentId).remove(); //remove respective tab content
//      tabHashMap.Remove(tabContentId.substr(1));
//      showTab("home");
//      $('.nav-tabs').tabdrop('layout');
//  });
//}
//
//function showTab(tabId) {
//  $('#mainTab a[href="#' + tabId + '"]').tab('show');
//}
//
////Ajax加载页面
//function craeteNewTabAndLoadUrl(parms, url, loadDivSelector) {
//  $("" + loadDivSelector).load(url, function (response, status, xhr) {
//    if (status == "error") {
//        var msg = "Sorry but there was an error getting details ! ";
//        $("" + loadDivSelector).html(msg + xhr.status + " " + xhr.statusText);
//        $("" + loadDivSelector).html("Load Ajax Content Here..."+loadDivSelector);
//      }
//  });
//}



