let playlist = [];
let currentIndex = 0;
let audio = document.getElementById("audio");
let nowPlaying = document.getElementById("now-playing");
let shuffleMode = false; // ⭐ added: shuffle flag

fetch("songs.json")
    .then(res => res.json())
    .then(data => {
        playlist = data;
        loadSong(0);
        displayPlaylist();
    });

function loadSong(index) {
    currentIndex = index;
    audio.src = playlist[index].file;
    nowPlaying.textContent = `${playlist[index].title} - ${playlist[index].artist}`;

    // Media Session API for background controls
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: playlist[index].title,
            artist: playlist[index].artist,
            album: 'My Music App',
            artwork: [
                { src: 'Icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                { src: 'Icons/icon-512.png', sizes: '512x512', type: 'image/png' }
            ]
        });

        navigator.mediaSession.setActionHandler('play', () => audio.play());
        navigator.mediaSession.setActionHandler('pause', () => audio.pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
            loadSong(currentIndex);
            audio.play();
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            currentIndex = (currentIndex + 1) % playlist.length;
            loadSong(currentIndex);
            audio.play();
        });
    }
}

document.getElementById("play").addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentIndex);
    audio.play();
});

document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
    audio.play();
});

// ⭐ changed shuffle button logic
document.getElementById("shuffle").addEventListener("click", () => {
    shuffleMode = !shuffleMode; // toggle shuffle mode
    if (shuffleMode) {
        // immediately start with a random song
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * playlist.length);
        } while (randomIndex === currentIndex);
        loadSong(randomIndex);
        audio.play();
    } else {
        // if turning shuffle off, continue from currentIndex
        loadSong(currentIndex);
        audio.play();
    }
});

// ⭐ added: handle song end (continuous play)
audio.addEventListener("ended", () => {
    if (shuffleMode) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === currentIndex); // avoid repeat
        loadSong(nextIndex);
        audio.play();
    } else {
        currentIndex = (currentIndex + 1) % playlist.length; // next in order
        loadSong(currentIndex);
        audio.play();
    }
});

function displayPlaylist() {
    let ol = document.getElementById("playlist");
    ol.innerHTML = "";
    playlist.forEach((song, index) => {
        let li = document.createElement("li");
        li.textContent = `${song.title} - ${song.artist}`;
        li.addEventListener("click", () => {
            loadSong(index);
            audio.play();
        });
        ol.appendChild(li);
    });

    Sortable.create(ol, {
        animation: 150,
        onEnd: function (evt) {
            const movedItem = playlist.splice(evt.oldIndex, 1)[0];
            playlist.splice(evt.newIndex, 0, movedItem);
        }
    });
}

// Register service worker for offline support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('Service Worker registered:', reg.scope))
        .catch(err => console.error('Service Worker registration failed:', err));
}