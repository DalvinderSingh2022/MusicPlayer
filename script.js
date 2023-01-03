const container = document.querySelector(".container");
const playPause = document.querySelector(".play-pause");
const mainAudio = document.querySelector("#main-audio");
const muteBtn = document.querySelector(".top .mute");
const volumeArea = document.querySelector(".vol-box");
const moremusicBtn = document.querySelector("#more");
const closemusicBtn = document.querySelector(".container #close");
const repeat = document.querySelector("#repeat-list");
const musicArtist = document.querySelector(".details .artist");
const prev = document.querySelector("#prev");
const next = document.querySelector("#next");
const progressArea = document.querySelector(".progress.audio");
const searchBtn = document.querySelector(".search-btn")

let musicIndex = 1;

loadSong();
playingsong();
loadList();
changeVol(mainAudio.volume);

prev.addEventListener("click", () => prevsong());
next.addEventListener("click", () => nextsong());
moremusicBtn.addEventListener("click", () => container.classList.toggle("show"));
closemusicBtn.addEventListener("click", () => moremusicBtn.click());

repeat.addEventListener("click", () => {
    let text = repeat.innerText;
    if (text === "repeat") {
        repeat.innerText = "repeat_one";
        repeat.setAttribute("title", "Song Looped");
    } else if (text === "repeat_one") {
        repeat.innerText = "shuffle";
        repeat.setAttribute("title", "Queue shuffled");
    } else {
        repeat.innerText = "repeat";
        repeat.setAttribute("title", "Queue Looped");
    }
})

mainAudio.addEventListener("timeupdate", (e) => {
    const progressBar = document.querySelector(".progress-bar.audio");
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progress = (currentTime / duration) * 100;
    progressBar.style.width = `${progress}%`;

    let musicCurrentTime = container.querySelector(".current-time");

    let currentmin = Math.floor(currentTime / 60);
    let currentsec = Math.floor(currentTime % 60);
    if (currentsec < 10) currentsec = `0${currentsec}`;
    musicCurrentTime.innerText = `${currentmin}:${currentsec}`;
})

mainAudio.addEventListener("loadeddata", () => {
    let musicDuration = container.querySelector(".duration");
    let musicCurrentTime = container.querySelector(".current-time");
    let mainAudioduration = mainAudio.duration;

    let totalmin = Math.floor(mainAudioduration / 60);
    let totalsec = Math.floor(mainAudioduration % 60);
    if (totalsec < 10) totalsec = `0${totalsec}`;
    musicDuration.innerText = `${totalmin}:${totalsec}`;
    musicCurrentTime.innerText = "0:00";
})

volumeArea.addEventListener("click", (e) => {
    let volumeWidth = volumeArea.clientWidth;
    let clickoffset = e.offsetX;
    let Volume = clickoffset / volumeWidth;
    changeVol(Volume);
})

muteBtn.addEventListener("click", (e) => {
    if (mainAudio.volume > 0) {
        changeVol(0);
        e.target.innerText = "volume_off";
        e.target.setAttribute("title", "unmute")
    } else {
        changeVol(1);
        e.target.innerText = "volume_up";
        e.target.setAttribute("title", "mute")
    }
})

musicArtist.addEventListener("click", (e) => {
    const discography = document.querySelector(".discography");
    const name = discography.querySelector(".artist");
    const instagram = discography.querySelector(".instagram");
    const spotify = discography.querySelector(".spotify");
    const image = discography.querySelector(".img-area img");
    const close = discography.querySelector("#close-dis");

    let artist = e.target.innerText;
    for (let i = 0; i < singers.length; i++) {
        if (singers[i].name == artist) {
            list = singers[i].song;
            name.innerText = singers[i].name;
            instagram.setAttribute("href", singers[i].instagram);
            spotify.setAttribute("href", singers[i].spotify);
            image.setAttribute("src", singers[i].image);
            image.setAttribute("alt", singers[i].name);
            image.onerror = () => image.setAttribute("src", defaultSingerImg);
            close.addEventListener("click", () => {
                discography.scrollTo(0, 0);
                discography.classList.add("hide");
            })
        }
    }
    discography.classList.remove("hide");
    singerSongs(list, discography);
})

progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickoffset = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickoffset / progressWidth) * songDuration;
    playsong();
    playingsong(songs);
})

playPause.addEventListener("click", () => {
    const Issongplay = container.classList.contains("paused");
    Issongplay ? pausesong() : playsong();
    playingsong();
})

mainAudio.addEventListener("ended", () => {
    let text = repeat.innerText;
    if (text === "repeat") {
        nextsong();
    } else if (text === "repeat_one") {
        mainAudio.currentTime = 0;
        loadSong();
        playsong();
    } else {
        let random = Math.floor((Math.random() * songs.length) + 1);
        do {
            random = Math.floor((Math.random() * songs.length) + 1);
        } while (musicIndex == random);
        musicIndex = random;
        loadSong();
        playsong();
        playingsong();
    }
})

searchBtn.addEventListener("click", () => {
    const searchArea = document.querySelector(".search");
    const close = searchArea.querySelector("#close-search");
    const searchField = searchArea.querySelector(".search-field");

    searchArea.classList.remove("hide");
    singerSongs(songs, searchArea);

    close.addEventListener("click", () => {
        searchArea.querySelector(".grid").scrollTo(0, 0);
        searchArea.classList.add("hide");
        searchField.value = "";
    })

    const songDivs = searchArea.querySelectorAll(".song-sub");
    searchField.addEventListener("keyup", (e) => {
        var searchValue = e.target.value.toLowerCase();
        var searchMatch = [];
        for (let i = 0; i < songDivs.length; i++) {
            const songTitle = songDivs[i].querySelector(".song").innerText.toLowerCase().replaceAll(".", "");
            if (songTitle.includes(searchValue)) {
                songs.forEach((song) => {
                    if (song.name == songDivs[i].querySelector(".song").innerText) {
                        searchMatch.push(song);
                    }
                })
            }
        }
        searchArea.querySelector(".grid").classList.remove("empty")
        singerSongs(searchMatch, searchArea);
        if (!searchMatch.length) searchArea.querySelector(".grid").classList.add("empty");
    })
})

window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowRight") nextsong();
    if (e.key == "ArrowLeft") prevsong();
    if (e.keyCode == 32) playPause.click();
})

function loadSong() {
    const musicImg = document.querySelector(".img-area img");
    const musicVideo = document.querySelector(".img-area a");
    const musicName = document.querySelector(".details .name");
    musicArtist.innerHTML = "";

    for (let i = 0; i < songs[musicIndex - 1].artist.length; i++) {
        musicArtist.innerHTML += `<span class="pointer">${songs[musicIndex - 1].artist[i]}</span> `;
    }

    musicName.innerText = songs[musicIndex - 1].name;
    musicVideo.setAttribute("href", songs[musicIndex - 1].video);
    mainAudio.src = songs[musicIndex - 1].audio;
    musicImg.src = songs[musicIndex - 1].image;
    musicImg.setAttribute("alt", songs[musicIndex - 1].name + " by " + songs[musicIndex - 1].artist);
    musicImg.onerror = () => {
        musicImg.setAttribute("src", defaultSongImg);
    }
}

function playsong() {
    container.classList.add("paused");
    playPause.querySelector("i").innerText = "pause";
    playPause.querySelector("i").setAttribute("title", "pause");
    mainAudio.play();
}

function pausesong() {
    container.classList.remove("paused");
    playPause.querySelector("i").innerText = "play_arrow";
    playPause.querySelector("i").setAttribute("title", "play");
    mainAudio.pause();
}

function prevsong() {
    musicIndex--;
    if (musicIndex < 1) musicIndex = songs.length;
    loadSong();
    playsong();
    playingsong();
}

function nextsong() {
    musicIndex++;
    if (musicIndex > songs.length) musicIndex = 1;
    loadSong();
    playsong();
    playingsong();
}

function loadList() {
    const ulTag = document.querySelector(".container ul")
    ulTag.innerHTML = "";
    for (let i = 0; i < songs.length; i++) {
        let liTag = `
       <li li-index="${i + 1}" class="flex pointer">
       <div class="row">
           <span>${songs[i].name}</span>
           <p>${songs[i].artist}</p>
       </div>
       <span id="song-${i + 1}" class="audio-duration material-icons refresh">refresh</span>
       <audio class="song-${i + 1}" src="${songs[i].audio}"></audio>
       </li>`;

        ulTag.insertAdjacentHTML("beforeend", liTag);

        let liduration = ulTag.querySelector(`#song-${i + 1}`);
        let liaudio = ulTag.querySelector(`.song-${i + 1}`);

        liaudio.addEventListener("loadeddata", () => {
            let Duration = liaudio.duration;
            let min = Math.floor(Duration / 60);
            let sec = Math.floor(Duration % 60);
            if (sec < 10) sec = `0${sec}`;
            liduration.classList.remove("material-icons", "refresh");
            liduration.innerText = `${min}:${sec}`;
            liduration.setAttribute("duration", `${min}:${sec}`);
        })
        liaudio.onerror = () => {
            liduration.innerText = "error";
            liduration.classList.add("material-icons");
            liduration.classList.remove("refresh");
        }
    }
}

function playingsong() {
    const allLiTag = document.querySelectorAll(".container li")
    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");

        if (allLiTag[j].querySelector("audio").src == mainAudio.src) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "equalizer";
            audioTag.classList.add("material-icons");
            audioTag.classList.remove("refresh");
        } else {
            if (audioTag.innerText != "refresh" && audioTag.innerText != "error") {
                allLiTag[j].classList.remove("playing");
                audioTag.classList.remove("material-icons");
                let duration = audioTag.getAttribute("duration");
                audioTag.innerText = duration;
            }
        }
        allLiTag[j].onclick = () => listClick(allLiTag[j]);
    }
}

function listClick(element) {
    let index = element.getAttribute("li-index");
    musicIndex = index;
    loadSong();
    playsong();
    playingsong();
}

function songDivClick(songGrid, Parent) {
    const playSong = songGrid.querySelectorAll(".play-song");
    const allLiTag = document.querySelectorAll(".container li");
    for (let i = 0; i < playSong.length; i++) {
        if (playSong[i].getAttribute("src").replaceAll(" ", "%20") == mainAudio.src) {
            playSong[i].innerText = "Playing";
            playSong[i].classList.add("current");
        } else {
            playSong[i].onclick = () => {
                for (let j = 0; j < allLiTag.length; j++) {
                    if (allLiTag[j].querySelector("audio").src == playSong[i].getAttribute("src").replaceAll(" ", "%20")) {
                        listClick(allLiTag[j]);
                        Parent.classList.add("hide");
                    }
                }
            }
        }
    }
}

function changeVol(Volume) {
    const volumeBar = document.querySelector(".progress-bar.vol");
    const volumePer = document.querySelector(" .percent");

    if (Volume > 1) Volume = 1;
    if (Volume < 0) Volume = 0;
    (Volume == 0) ? muteBtn.innerText = "volume_off" : muteBtn.innerText = "volume_up";

    volumeBar.style.width = `${Volume * 100}%`;
    mainAudio.volume = (Volume / 2).toFixed(2);
    volumePer.innerText = (Volume * 100).toFixed(0) + "%";
}

function singerSongs(list, Parent) {
    const songGrid = Parent.querySelector(".grid");
    songGrid.innerHTML = "";
    for (let i = 0; i < list.length; i++) {
        songGrid.innerHTML += `
        <div class="flex column song-sub">
            <div class="img-area">
                <img src="${list[i].image}" alt="${list[i].name} by ${list[i].artist}">
                <a href="#" class="play-song pointer" src="${list[i].audio}">Play</a>
            </div>
            <span class="song">${list[i].name}</span>
        </div>`;
    }
    const images = songGrid.querySelectorAll("img");
    for (let i = 0; i < images.length; i++) {
        images[i].onerror = () => {
            images[i].setAttribute("src", defaultSongImg);
        }
    }
    songDivClick(songGrid, Parent);
}