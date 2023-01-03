//=================================================
// Scroll
//=================================================

$(document).ready(function () {
  $(".scroll-to-id").click(function (e) {
    e.preventDefault();
    const hash = this.hash;
    const scrollToTop = $(hash).offset().top;
    $("html, body").animate({ scrollTop: scrollToTop }, 900);
  });
});
