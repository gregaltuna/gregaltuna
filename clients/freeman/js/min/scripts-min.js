$(window).load(function(){$(".imagefit").imagefit()}),$(document).ready(function(){$('a[href^="#"]').on("click",function(o){o.preventDefault();var n=this.hash,t=$(n);$("html, body").stop().animate({scrollTop:t.offset().top},1e3,"swing",function(){window.location.hash=n})})});