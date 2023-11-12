const apiKey = 'a1ea6836ba26fc4ec22e1c9ddbd76628';
let currentPage = 1;
const moviesPerPage = 10;


async function loadGenres() {
    const genreSelect = document.getElementById('genre-select');
    genreSelect.innerHTML = ''; 
    const genreList = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${document.getElementById('language-select').value}&api_key=${apiKey}`);
    const genres = await genreList.json();

    genres.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.text = genre.name;
        genreSelect.appendChild(option);
    });

 
    genreSelect.addEventListener('change', loadMovies);
}


async function loadMovies() {
    const genreSelect = document.getElementById('genre-select');
    const selectedGenreIds = genreSelect.value;
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = ''; 

    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?language=${document.getElementById('language-select').value}&with_genres=${selectedGenreIds}&page=${currentPage}&api_key=${apiKey}`);
    const data = await response.json();

    data.results.slice(0, moviesPerPage).forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>${movie.overview}</p>
        `;
        movieList.appendChild(movieCard);
    });

   
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.addEventListener('click', () => {
            currentPage--;
            loadMovies();
        });
        pagination.appendChild(prevButton);
    }
    if (currentPage < data.total_pages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.addEventListener('click', () => {
            currentPage++;
            loadMovies();
        });
        pagination.appendChild(nextButton);
    }
}


function changeLanguage() {
    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect.value;


    document.documentElement.lang = selectedLanguage;


    loadGenres();
    loadMovies();
}


window.addEventListener('load', () => {
    loadGenres();
    
    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', changeLanguage);
});
