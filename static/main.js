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
			window.history.pushState({file:file}, 'fs', `/fs/${file}`);
			this.selectedFile = file;
			this.showFsElement = true;
		},
		hideFs() {
			window.history.replaceState({}, 'fs', `/`);
			this.showFsElement = false;
		},
		updateItemsPerRow() {
			localStorage.setItem("itemsPerRow", this.itemsPerRow);
		},

		// Controls
		st() {return "style"},
		gridWidth() {
			return `width: calc(100% / ${this.itemsPerRow})`;
		},
		gridHeight() {
			return `height: calc(100vw / ${this.itemsPerRow} + 1.5rem)`;
		},

		setupObserver() {
			// Very inefficient. Implement a custom solution based on scroll position,
			// items per row, and relative index of the item in the array.
			// This way, only a small portion need to ever be tested.
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
			
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				this.hideFs();
			}
		});
		window.addEventListener("popstate", (e) => {
			if (e.state != null && e.state.file != null && this.showFsElement == false) {
				e.preventDefault();
				this.showFs(e.state.file);
			} else if (this.showFsElement) {
				e.preventDefault();
				this.hideFs();
			}
		});
	}
});

