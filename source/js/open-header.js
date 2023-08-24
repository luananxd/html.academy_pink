var pageHeader = document.querySelector('.page-header');
var menuToggle = document.querySelector('.page-header__toggle');

menuToggle.addEventListener('click', function () {
  if (pageHeader.classList.contains('page-header--closed')) {
    pageHeader.classList.remove('page-header--closed');
    pageHeader.classList.add('page-header--open');
  }

  else {
    pageHeader.classList.add('page-header--closed');
    pageHeader.classList.remove('page-header--open');
  }
});
