// ==UserScript==
// @name           Reddit Image Preloader
// @namespace      nbarrientos
// @description    Preloads images and shows them when the link is clicked
// @version        0.6-unreleased
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

  function GM_rip_flip_visibility(expando, button) {
    var showing = button.data("showing");
    showing ? expando.hide() : expando.show();
    var text = showing ? "SHOW" : "HIDE";
    button.text(text);
    button.data("showing", !showing);
   }

  function GM_rip_img_onload(event) {
    var entry = $(event.data.entry);
    var expando = $(event.data.expando);
    var expando_button = $("<div></div>").addClass("expando-button")
                              .css("width", "34px")
                              .css("marginTop", "5px");
    $("p.title", entry).after(expando_button);
    var expando_button_anchor = $("<a href='javascript:void(0)'></a>")
                              .data("showing", false)
                              .css("color", "#336699")
                              .text("SHOW")
                              .appendTo(expando_button);
    $(this).show();
    expando_button_anchor.click(function() {
        GM_rip_flip_visibility(expando, expando_button_anchor);
    });
    $(this).click(function() {
        GM_rip_flip_visibility(expando, expando_button_anchor);
    });
  }

  function GM_rip_exec_jQuery() {
    $(".entry").each(function() {
        var link = $("a.title", this);
        var href = link.attr("href");
        var pattern = /(\.jpg$|\.png$|\.gif$)/;
        if(pattern.test(href)) {
            var expando = $(".expando", this);
            var inner = $("<div></div>").addClass("md");
            var img = $("<img/>").css("width", "100%")
                                 .css("overflow", "visible")
                                 .bind("load", {entry: this, expando: expando}, GM_rip_img_onload)
                                 .attr("src", href);
            expando.children(".error").hide();
            inner.append(img);
            expando.append(inner);
        }
   });
  }
  GM_wait();
})();
