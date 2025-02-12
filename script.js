class MovieList {
  constructor() {
    this.movies = [];
  }

  async getData() {
    try {
      let result = await fetch('https://whoa.onrender.com/whoas/movies');
      let data = await result.json();
      this.movies = data;
    } catch (error) {
      console.log(error);
    }
  }
}

class Movie {
  constructor(movie) {
    this.movie = movie;
  }

  async getData() {
    try {
      let result = await fetch(
        `https://whoa.onrender.com/whoas/random?results=100&movie=${this.movie}&sort=number_current_whoa`
      );
      let data = await result.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

class Error {
  static render(err) {
    document.getElementById(
      'errorContainer'
    ).innerHTML = `<div class="popup-content">
      <span class="close" onclick="ErrorUI.hide()">&times;</span>
      <h2>Error</h2>
      <p>${err}</p>
    </div>`;
    ErrorUI.show();
  }
}

//--- The UI classes are used for rendering the data to the page
class PageUI {
  static resetDisplay() {
    ErrorUI.hide();
    document.getElementById('summaryContainer').innerHTML = '';
    document.getElementById('instanceContainer').innerHTML = '';
  }
}

class MovieListUI {
  static render(thisMovieList) {
    let html = '';
    thisMovieList.forEach(movie => {
      const encodedTitle = encodeURIComponent(movie);
      html += `<div data-movie="${encodedTitle}" class="movie-item">${movie}</div>`;
    });

    //Add the html to the page
    document
      .getElementById('mainListContainer')
      .insertAdjacentHTML('afterbegin', `${html}`);

    // Add event listeners to each movie item
    document.querySelectorAll('.movie-item').forEach(item => {
      item.addEventListener('click', function () {
        const movieTitle = this.getAttribute('data-movie');

        const thisMovie = new Movie(movieTitle);
        thisMovie
          .getData()
          .then(data => MovieUI.render(data))
          .catch(err => Error.render(err));
      });
    });
  }
}

class MovieSummaryUI {
  static render(data) {
    let summaryHtml = '';
    summaryHtml = `<article class="movie-summary">
  <img src="${data[0].poster}" alt="Movie Poster" class="movie-poster">
  <div class="movie-info">
    <h2 class="movie-title">${data[0].movie}</h2>
    <p class="movie-year"><span>Year:</span> ${data[0].year}</p>
    <p class="movie-release-date"><span>Release Date:</span> ${data[0].release_date}</p>
    <p class="movie-director"><span>Director:</span> ${data[0].director}</p>
    <p class="movie-character"><span>Character:</span> ${data[0].character}</p>
    <p class="movie-total-whoas"><span>Total Whoas in Movie:</span> ${data[0].total_whoas_in_movie}</p>
  </div>
</article>
`;
    document
      .getElementById('summaryContainer')
      .insertAdjacentHTML('afterbegin', summaryHtml);
  }
}

class MovieQuoteInstancesUI {
  static render(data) {
    let instanceHtml = '';
    instanceHtml = '';
    for (const instance of data) {
      instanceHtml += `<article class="movie-card">
        <div class='movie-woah-counter'>${instance.current_whoa_in_movie}/${data[0].total_whoas_in_movie}</div>
  <div class="movie-info">
    <p class="movie-timestamp"><span>Timestamp:</span> ${instance.timestamp}</p>
    <p class="movie-full-line"><span>Full Line:</span> ${instance.full_line}</p>
    <audio controls class="movie-audio">
      <source src="${instance.audio}" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>
</article>
`;
      document
        .getElementById('instanceContainer')
        .insertAdjacentHTML('afterbegin', instanceHtml);
    }
  }
}

class MovieUI {
  static render(data) {
    PageUI.resetDisplay();
    MovieSummaryUI.render(data);
    MovieQuoteInstancesUI.render(data);
  }
}

class ErrorUI {
  static show() {
    document.getElementById('errorContainer').style.display = 'block';
  }

  static hide() {
    document.getElementById('errorContainer').style.display = 'none';
  }
}

//---Kick off

const thisMovieList = new MovieList();

thisMovieList
  .getData()
  .then(() => {
    MovieListUI.render(thisMovieList.movies);
  })
  .catch(err => renderError(err));
