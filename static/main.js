const app = new Vue({
	el: '#app',
	data: {
		fileList: [],
		itemsPerRow: parseInt(localStorage.getItem("itemsPerRow")) || 4,
		showFsElement: false,
		selectedFile: null,
	},
	computed: {
		filteredFiles() {
			return this.fileList.filter(file => /\.(gif|jpe?g|png|webp|mp4|webm|ogv|mp3|ogg|wav)$/i.test(file));
		},
	},
	methods: {
		getElementType(file) {
			if (/\.(gif|jpe?g|png|webp)$/i.test(file)) return 'img';
			if (/\.(mp4|webm|ogv)$/i.test(file)) return 'video';
			if (/\.(mp3|ogg|wav)$/i.test(file)) return 'audio';
		},
		showFs(file) {
			this.selectedFile = file;
			this.showFsElement = true;
		},
		hideFs() {
			this.showFsElement = false;
			this.pauseAllMedia();
		},
		pauseAllMedia() {
			const videos = document.querySelectorAll("video");
			const audios = document.querySelectorAll("audio");

			// Feature does not work.
			videos.forEach(video => video.pause());
			audios.forEach(audio => audio.pause());
		},
		updateItemsPerRow() {
			localStorage.setItem("itemsPerRow", this.itemsPerRow);
		},

		// Controls
		st() {return "style"},
		gridWidth() {
			return `width: calc(100% / ${this.itemsPerRow})`;
		},

		setupObserver() {
			const options = {
				root: null,
				rootMargin: '100% 0px',
				threshold: 0,
			};
	
			const observer = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const media = entry.target.querySelector('img, video, audio');
						if (media) {
							media.src = media.dataset.src;
						}
					} else {
						const media = entry.target.querySelector('img, video, audio');
						if (media) {
							media.removeAttribute('src');
						}
					}
				});
			}, options);

	
			const gridItems = document.querySelectorAll('.grid-item');
			gridItems.forEach(gridItem => observer.observe(gridItem));
		},
	},
	mounted() {
        fetch("./list/").then(res => res.json())
			.then(files => {this.fileList = files})
			.then(() => this.setupObserver());
			
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				this.hideFs();
			}
		});
	}
});