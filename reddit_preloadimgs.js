// ==UserScript==
// @name           Reddit Image Preloader
// @namespace      nbarrientos
// @description    Preloads images and shows them when the link is clicked
// @version        0.5
// @copyright      2010 Nacho Barrientos
// @license        MIT
// @include        http://*reddit.com/*
// ==/UserScript==

(function(){
  function GM_wait() {
    if(typeof unsafeWindow != 'undefined' && typeof unsafeWindow.jQuery != 'undefined') { // FF
        $ = unsafeWindow.jQuery; 
        GM_rip_exec_jQuery();
    } else if (typeof $ != 'undefined') { // Opera
        GM_rip_exec_jQuery();
    } else {
      window.setTimeout(GM_wait,75);
    }
  }

  function GM_rip_img_onload(event) {
    var link = $(event.data.link);
    var expando = $(event.data.expando);
    link.data("showing", false);
    var span = $("<span></span>").css("color", "red")
                                 .css("font-weight", "bold")
                                 .text("» ");
    link.prepend(span);
    $(this).show();
    link.click(function() {
        if(!$(this).data("showing")) {
            expando.show();
            $(this).data("showing", true)
        }
        else {
            expando.hide();
            $(this).data("showing", false)
        }
   });
  }

  function GM_rip_exec_jQuery() {
    $(".entry").each(function() {
        var link = $("a.title", this);
        var href = link.attr("href");
        var pattern = /(\.jpg$|\.png$|\.gif$)/;
        if(pattern.test(href)) {
            link.removeAttr("href");
            var expando = $(".expando", $(this));
            var inner = $("<div></div>").addClass("md");
            var img = $("<img/>").css("width", "100%")
                                 .css("overflow", "visible")
                                 .bind("load", {link: link, expando: expando}, GM_rip_img_onload)
                                 .attr("src", href);
            expando.children(".error").hide();
            inner.append(img);
            expando.append(inner);
        }
   });
  }
  GM_wait();
})();
