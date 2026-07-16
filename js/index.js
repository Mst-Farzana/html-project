document.addEventListener('DOMContentLoaded', function () {
  const dropdownBtn = document.querySelector('.dropdown-btn');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', function (e) {
      if (!dropdownMenu.contains(e.target) && !dropdownBtn.contains(e.target)) {
        dropdownMenu.classList.remove('show');
      }
    });
  } else {
    console.error('Error: .dropdown-btn or .dropdown-menu not found in HTML!');
  }
});
