document.addEventListener('DOMContentLoaded', function(){

    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const form = document.getElementById('commentForm');
    const showFormButton = document.getElementById('showFormButton');
    const cancel = document.getElementById('cancel');
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var images = document.querySelectorAll(".hero-image");
  
    for (var i = 0; i < allButtons.length; i++) {
      allButtons[i].addEventListener('click', function() {
        searchBar.style.visibility = 'visible';
        searchBar.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
        searchInput.focus();
      });
    }
  
    searchClose.addEventListener('click', function() {
      searchBar.style.visibility = 'hidden';
      searchBar.classList.remove('open');
      this.setAttribute('aria-expanded', 'false');
    });

    showFormButton.addEventListener('click', function() {
      form.style.display = 'block';
      showFormButton.style.display = 'none';
    });

    cancel.addEventListener('click', function() {
      form.style.display = 'none';
      showFormButton.style.display = 'block';
    });

    // Funkcja otwierająca modal
    function openModal() {
      modal.style.display = "block";
      modalImg.src = this.src;
      captionText.innerHTML = this.alt;
  }

  // Dodanie zdarzenia otwierającego modal do każdego obrazu
  images.forEach(img => {
      img.addEventListener('click', openModal);
  });

  // Zamykanie modala
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() { 
      modal.style.display = "none";
  };

  // Zamykanie modala po kliknięciu poza obrazem
  modal.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  };
  
  
  });