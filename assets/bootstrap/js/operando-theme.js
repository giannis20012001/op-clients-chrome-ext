$(document).ready(function(){

    var navbars = $(".navbar-nav");
    var menusTabLinks = $("a[target-tab]");
    var contentTabs = $("div.content_tab");


    function changeHash() {
        if(window.location.hash) {
            if($(window.location.hash).length) {

                navbars.find("li[class=active]").removeClass("active");
                var anchor = $("a[target-tab='"+window.location.hash.replace('#','')+"']");
                anchor.parent().addClass("active");
                contentTabs.hide();
                $(window.location.hash).show();
            }

        }
    }

    $.each(menusTabLinks,function(index,item){
        $(item).on("click", function(){
            navbars.find("li[class=active]").removeClass("active");
            $(this).parent().addClass("active");
            var currentTabId = $(this).attr("target-tab");
            contentTabs.hide();
            $('#'+currentTabId).show();
            window.location.hash = currentTabId;
        })
    });


    $(window).on('hashchange', function() {
        changeHash();
    });
    changeHash();






})

