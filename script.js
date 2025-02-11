//Get Woah data for all movies
const getAllMovies = fetch('https://whoa.onrender.com/whoas/movies')
  .then(response => response.json())
  .then(function (data) {
    //Convert the data into html
    let html = '';
    data.forEach(movie => {
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
        getSpecificMovieData(movieTitle);
      });
    });
  });

const resetDisplay = function () {
  document.getElementById('summaryContainer').innerHTML = '';
  document.getElementById('instanceContainer').innerHTML = '';
};

const getSpecificMovieData = function (movieTitle) {
  resetDisplay();

  //Get Woah data for an individual movie
  const getData = fetch(
    `https://whoa.onrender.com/whoas/random?results=100&movie=${movieTitle}&sort=number_current_whoa`
  )
    .then(response => response.json())
    .then(function (data) {
      //extract summary information for the movie
      summaryhtml = `<article class="movie-summary">
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

      //extract all woahs for the movie
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
      }

      document
        .getElementById('summaryContainer')
        .insertAdjacentHTML('afterbegin', summaryhtml);
      document
        .getElementById('instanceContainer')
        .insertAdjacentHTML('afterbegin', instanceHtml);
      console.log(html);
    });
};
