(function() {
  document.onkeypress = function(e) {
    e = e || window.event;

    if (e.keyCode) {
      var pager = document.getElementsByClassName('pager')[0];

      switch (e.keyCode) {
        case 37:
          if (pager.getElementsByClassName('previous').length > 0) {
            pager.getElementsByClassName('previous')[0].getElementsByTagName('a')[0].click();
          }
          break;
        case 39:
          if (pager.getElementsByClassName('next').length > 0) {
            pager.getElementsByClassName('next')[0].getElementsByTagName('a')[0].click();
          }
          break;
      }
    }
  };
})();
