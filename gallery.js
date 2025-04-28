const galleryData = [
    {
      id: 1,
      image: "assets/gallery/mona.png",
      title: "Projet Kairouan/Suite Kairouan2015/2018",
      artist: "Mouna Jemal Siala"
    },
    {
      id: 2,
      image: "assets/gallery/ali bellagha le belvédère.png", 
      title: "le belvédère",
      artist: "Ali Bellagha"
    },
    {
      id: 3,
      image: "assets/gallery/wissem.png",
      title: "Une métaphysique de la vie et de l’amour",
      artist: "Wissem Ben Hassine"
    },
    {
        id: 4,
        image: "assets/gallery/nadia.jpg",
        title: "Kaché sous la pluie",
        artist: "Nadia Jelassi"
      },
      {
        id: 5,
        image: "assets/gallery/mohamed.png",
        title: "Amour avec un grand tas",
        artist: "Mohamed Ben Soltane"
      },
      {
        id:6,
        image: "assets/gallery/najet.png",
        title: "Me & Her 1",
        artist: "Najet Dhahbi"
      },
      {
        id:7,
        image: "assets/gallery/brahim.png",
        title: "Fête",
        artist: "Brahim Dhahak"
      },
      {
        id:8,
        image: "assets/gallery/sonia.png",
        title: "Les figures de l’ombre",
        artist: "Sonia Said"
      },
    {
      id: 9, 
      image: "assets/gallery/adel.png",
      title: "Echiquier",
      artist: "Adel Megdiche"
    }
  ];
  // Initialize gallery when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  const galleryGrid = document.querySelector('.gallery-grid');
  
  // Create gallery items
  galleryData.forEach(artwork => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${artwork.image}" alt="${artwork.title}">
      <div class="overlay">
        <h3>${artwork.title}</h3>
        <p>${artwork.artist}</p>
      </div>
      <a href="artist.html?id=${artwork.id}" class="gallery-link"></a>
    `;
    galleryGrid.appendChild(item);
  });
});