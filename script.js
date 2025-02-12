class APIService {
  static async getJSON(url) {
    let result = await fetch(url);
    if (!result.ok) {
      throw new Error('HTTP error!');
    }
    return await result.json();
  }
}

class MovieService {
  static async fetchMovies() {
    try {
      return APIService.getJSON('https://whoa.onrender.com/whoas/movies');
    } catch (error) {
      throw new Error('Failed to fetch movies');
    }
  }

  static async fetchMovieDetails(movie) {
    try {
      return APIService.getJSON(
        `https://whoa.onrender.com/whoas/random?results=100&movie=${movie}&sort=number_current_whoa`
      );
    } catch (error) {
      throw new Error(`Failed to fetch details for ${movie}`);
    }
  }
}

// UI Handling
class MovieListUI {
  static render(movieList) {
    let html = movieList
      .map(
        movie =>
          `<div data-movie="${encodeURIComponent(
            movie
          )}" class="movie-item">${movie}</div>`
      )
      .join('');

    document.getElementById('mainListContainer').innerHTML = html;

    EventHandler.attachMovieClickListeners();
  }
}

class MovieSummaryUI {
  static render(movieData) {
    const {
      poster,
      movie,
      year,
      release_date,
      director,
      character,
      total_whoas_in_movie,
    } = movieData[0];

    let summaryHtml = `
      <article class="movie-summary">
        <img src="${poster}" alt="Movie Poster" class="movie-poster">
        <div class="movie-info">
          <h2 class="movie-title">${movie}</h2>
          <p class="movie-year"><span>Year:</span> ${year}</p>
          <p class="movie-release-date"><span>Release Date:</span> ${release_date}</p>
          <p class="movie-director"><span>Director:</span> ${director}</p>
          <p class="movie-character"><span>Character:</span> ${character}</p>
          <p class="movie-total-whoas"><span>Total Whoas in Movie:</span> ${total_whoas_in_movie}</p>
        </div>
      </article>`;

    document.getElementById('summaryContainer').innerHTML = summaryHtml;
  }
}

class MovieQuoteInstancesUI {
  static render(movieData) {
    const instanceHtml = movieData
      .map(
        instance => `
        <article class="movie-card">
          <div class='movie-woah-counter'>${instance.current_whoa_in_movie}/${movieData[0].total_whoas_in_movie}</div>
          <div class="movie-info">
            <p class="movie-timestamp"><span>Timestamp:</span> ${instance.timestamp}</p>
            <p class="movie-full-line"><span>Full Line:</span> ${instance.full_line}</p>
            <audio controls class="movie-audio">
              <source src="${instance.audio}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        </article>`
      )
      .join('');

    document.getElementById('instanceContainer').innerHTML = instanceHtml;
  }
}

class ErrorUI {
  static show(message) {
    document.getElementById('errorContainer').innerHTML = `
      <div class="popup-content">
        <span class="close" onclick="ErrorUI.hide()">&times;</span>
        <h2>Error</h2>
        <p>${message}</p>
      </div>`;
    document.getElementById('errorContainer').style.display = 'block';
  }

  static hide() {
    document.getElementById('errorContainer').style.display = 'none';
  }
}

// Event Handling
class EventHandler {
  static attachMovieClickListeners() {
    document.querySelectorAll('.movie-item').forEach(item => {
      item.addEventListener('click', async function () {
        const movieTitle = this.getAttribute('data-movie');

        try {
          const movieData = await MovieService.fetchMovieDetails(movieTitle);
          MovieSummaryUI.render(movieData);
          MovieQuoteInstancesUI.render(movieData);
        } catch (err) {
          ErrorUI.show(err.message);
        }
      });
    });
  }
}

// Initialization
(async function initialize() {
  try {
    const movies = await MovieService.fetchMovies();
    MovieListUI.render(movies);
  } catch (err) {
    ErrorUI.show(err.message);
  }
})();
