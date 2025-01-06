let lastScrollTop = 0; // Nilai awal posisi scroll
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > lastScrollTop) {
        // Saat scroll ke bawah
        header.classList.add('hidden');
    } else {
        // Saat scroll ke atas
        header.classList.remove('hidden');
    }
    
    lastScrollTop = Math.max(currentScroll, 0); // Pastikan tidak negatif
});

const fetchBannerData = async () => {
    try {

        const response = await fetch('/api/banner');
        const data = await response.json();

        
        document.querySelector(".hero img").src = data.image;
        document.querySelector(".hero h1").textContent = data.title;
        document.querySelector(".hero p").textContent = data.subtitle;
    } catch (error) {
        console.error("Error fetching banner data:", error);
        document.querySelector(".hero img").src = "default-image.jpg"; // Gambar default
        document.querySelector(".hero h1").textContent = "Default Title";
        document.querySelector(".hero p").textContent = "Default Subtitle";
    }
};

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchBannerData);


function lazyLoadImages() {
    const lazyImages = document.querySelectorAll(".lazy");
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('lazy-loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
}

require('dotenv').config();
const apiUrl = process.env.API_URL || 'https://suitmedia-backend.suitdev.com/api/ideas';
console.log('API URL:', apiUrl);
let currentPage = 1;


function loadIdeas(page = 1) {
    const pageSize = document.getElementById("show-per-page").value;
    const sortBy = document.getElementById("sort-by").value;

    // Simpan state ke localStorage
    localStorage.setItem('pageSize', pageSize);
    localStorage.setItem('sortBy', sortBy);

    fetch(`${apiUrl}?page[number]=${page}&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=${sortBy}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            const cardsContainer = document.querySelector(".cards");
            cardsContainer.innerHTML = "";

            data.data.forEach(idea => {
                const card = document.createElement("div");
                card.classList.add("card");

                const image = new Image();
                image.src = idea.small_image ? idea.small_image : idea.medium_image;
                image.classList.add("lazy");
                card.appendChild(image);

                const cardContent = document.createElement("div");
                cardContent.classList.add("card-content");

                const date = document.createElement("p");
                date.textContent = new Date(idea.published_at).toLocaleDateString();
                cardContent.appendChild(date);

                const title = document.createElement("h3");
                title.textContent = idea.title;
                cardContent.appendChild(title);

                card.appendChild(cardContent);
                cardsContainer.appendChild(card);
            });

            lazyLoadImages(); // Panggil lazy load

        })
        .catch(error => console.error('Error fetching data:', error));

    }
    

function nextPage() {
    loadIdeas(currentPage + 1);
}

function prevPage() {
    if (currentPage > 1) {
        loadIdeas(currentPage - 1);
    }
}

//parallax
window.addEventListener('scroll', () => {
    const heroImage = document.querySelector('.hero img');
    const heroText = document.querySelector('.hero h1, .hero p');
    
    // Efek parallax pada gambar
    heroImage.style.transform = `translateY(${window.scrollY * 0.5}px)`;
    
    // Efek parallax pada teks
    heroText.style.transform = `translateY(${window.scrollY * 0.2}px)`;
});

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav a"); // Pilih semua link di navigasi
    const currentPath = window.location.pathname; // Ambil path dari URL saat ini

    navLinks.forEach((link) => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active"); // Tambahkan kelas active jika path cocok
        } else {
            link.classList.remove("active"); // Hapus kelas active jika path tidak cocok
        }
    });
});

// Ambil state dari localStorage saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    const savedPageSize = localStorage.getItem('pageSize') || 10;
    const savedSortBy = localStorage.getItem('sortBy') || 'newest';

    document.getElementById("show-per-page").value = savedPageSize;
    document.getElementById("sort-by").value = savedSortBy;

    loadIdeas();
});

document.querySelectorAll('.pagination a').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const page = parseInt(event.target.textContent);
        currentPage = page;
        loadIdeas(currentPage);
    });
});


