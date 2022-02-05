function PopupCenter (e, n, t, i) {
    var o = void 0 != window.screenLeft ? window.screenLeft : screen.left,
      d = void 0 != window.screenTop ? window.screenTop : screen.top,
      c = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width,
      w = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height,
      r = c / 2 - t / 2 + o,
      h = w / 2 - i / 2 + d,
      s = window.open(
        e,
        n,
        'scrollbars=yes, width=' +
          t +
          ', height=' +
          i +
          ', top=' +
          h +
          ', left=' +
          r
      )
    window.focus && s.focus()
  }
  
  const hamburger = document.querySelector('.hamburger')
  const navMenu = document.querySelector('.nav-menu')
  
  if (hamburger) {
    hamburger.addEventListener('click', mobileMenu)
  }
  
  function mobileMenu () {
    hamburger.classList.toggle('active')
    navMenu.classList.toggle('active')
  }