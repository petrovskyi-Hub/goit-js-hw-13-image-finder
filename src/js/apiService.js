export default class ImageApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.BASE_URL = 'https://pixabay.com/api';
        this.API_KEY = '18452046-d075d28130c097165687e8e16';
    }

    async fetchImages () {
        const response = await fetch(
            `${this.BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${this.API_KEY}`
        );
        const newImages = await response.json();
        this.page += 1;

        return newImages.hits;
    }

    resetPage() {
        this.page = 1;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}


