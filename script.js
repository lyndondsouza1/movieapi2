function openNav() {
	document.getElementById("side-nav").style.width = "350px";
}

function closeNav() {
	document.getElementById("side-nav").style.width = "0";

}

const APIKEY = "2271fbb427e2b1715a00dc5284c5bba9";
const APIURL =
	"https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=2271fbb427e2b1715a00dc5284c5bba9&page=1";
const SEARCHAPI =
	"https://api.themoviedb.org/3/search/movie?&api_key=2271fbb427e2b1715a00dc5284c5bba9&query=";
const SEARCHBYID =
	"https://api.themoviedb.org/3/movie/{movie_id}?api_key=2271fbb427e2b1715a00dc5284c5bba9&language=en-US";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const watchlistul =  document.getElementById('watchlistul')
getMovies(APIURL);
async function getMovies(url) {
	const resp = await fetch(url);
	const respData = await resp.json();
	showMovies(respData.results);
}

function getClassByRate(vote) {
	if (vote >= 8) {
		return "green";
	} else if (vote >= 5) {
		return "orange";
	} else {
		return "red";
	}
}

function showMovies(movies) {
	main.innerHTML = "";
	movies.forEach((movie) => {
		const { poster_path, title, vote_average, id } = movie;
		const movieEl = document.createElement("div");
		movieEl.classList.add("movie-card");
		movieEl.innerHTML = `
				<div class="img-container">
					<img src="${IMGPATH + poster_path}" alt="${title}" />
					<button class="btn1"><i class="bi bi-card-checklist"></i></button><button class="btn2"><i class="bi bi-eye-fill"></i></button>
					
				</div>
				<div class="footer">
					<h1>${title}</h1>
                    <span class="${getClassByRate(
											vote_average
										)}">${vote_average}</span>
				</div>
        `;
		const btn1 = movieEl.querySelector(".img-container .btn1");
		btn1.addEventListener("click", () => {
			if (btn1.classList.contains("active")) {
				removeFromWatchList(id);
				btn1.classList.remove("active");
				fetchWatchList()
			} else {
				addToWatchList(id);
				btn1.classList.add("active");
				fetchWatchList()

			}
		});
		main.appendChild(movieEl);
	});
}

async function fetchWatchList() {
	watchlistul.innerHTML = " ";

	const movieIds = getWatchList();

	for (let i = 0; i < movieIds.length; i++) {
		const movieId = movieIds[i];
		movie = await getMovieById(movieId);

		showWatchList(movie);
	}
}

async function getMovieById(id) {
	const resp = await fetch(
		`https://api.themoviedb.org/3/movie/${id}?api_key=2271fbb427e2b1715a00dc5284c5bba9&language=en-US`
	);
	const respData = await resp.json()
	const movie = respData
	return movie;
}

function addToWatchList(movieId) {
	const movieIds = getWatchList();
	localStorage.setItem("movieIds", JSON.stringify([...movieIds, movieId]));
}

function getWatchList() {
	const movieIds = JSON.parse(localStorage.getItem("movieIds"));
	return movieIds === null ? [] : movieIds;
}
function removeFromWatchList(movieId) {
	const movieIds = getWatchList();
	localStorage.setItem(
		"movieIds",
		JSON.stringify(movieIds.filter((id) => id !== movieId))
	);
}
function showWatchList(movieData) {
	const watchlistli = document.createElement("li")

	watchlistli.innerHTML = ` <span>${movieData.title}</span>
	`;
	watchlistul.appendChild(watchlistli)
	
}

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const searchTerm = search.value;

	if (searchTerm) {
		getMovies(SEARCHAPI + searchTerm);

		search.value = "";
	}
});

window.localStorage.clear();
