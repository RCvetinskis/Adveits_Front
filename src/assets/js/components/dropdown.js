//=================================================
// Dropdown
//=================================================

$(document).ready(function () {
  $(".burger-btn-container").click(function () {
    $(".dropdown-content").slideToggle(200);
    $(".bar1 ").toggleClass("burgerX");
    $(".bar3 ").toggleClass("burgerY");
  });
});
