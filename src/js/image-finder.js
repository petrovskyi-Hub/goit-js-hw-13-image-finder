import ImageApiService from './apiService';
import photoCard from '../templates/photoCard.hbs';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, error } from '@pnotify/core';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

// getRefs
const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('[data-action="load-more"]'); //For Load more btn
const sentinel = document.querySelector('#sentinel');

// EventListeners
searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.addEventListener('click', onLoadMore);//For Load more btn
galleryContainer.addEventListener('click', onOpenModal)

// New API service
const imageApiService = new ImageApiService();

async function onSearch(event) {
    event.preventDefault();

    try {
      imageApiService.query = event.currentTarget.elements.query.value;
      imageApiService.resetPage();
      clearGalleryMarkup();
      // loadMoreBtn.classList.add('is-hidden'); //For Load more btn

      const response = await imageApiService.fetchImages();
      
      if (response.length === 0) {
        noResult();
        clearGalleryMarkup();
      }

      if (response.length > 0) {
        appendCardsMarkup(response);
        // loadMoreBtn.classList.remove('is-hidden'); //For Load more btn
      }
    
      // if (response.length < 12) {
      //   loadMoreBtn.classList.add('is-hidden'); //For Load more btn
      // }
      
    }catch (error) {
      console.log('Ошибка', error);
    }
}

function appendCardsMarkup(cards) {
  galleryContainer.insertAdjacentHTML('beforeend', photoCard(cards));
}

async function onLoadMore() {
  const yScroll = galleryContainer.scrollHeight + 95;

  try {
    const response = await imageApiService.fetchImages();

    if (response.length < 12) {
        loadMoreBtn.classList.add('is-hidden');
    }
        
    appendCardsMarkup(response);
    
  } catch (error) {
    console.log('Ошибка', error);
  }

  window.scrollTo({
    top: yScroll,
    behavior: "smooth",
  });
}

function noResult() {
  error({
    title: 'Uh Oh!',
    text: 'No matches found!',
    delay: 1800,
    styling: 'brighttheme',
    maxTextHeight: null,
  });
}

function clearGalleryMarkup() {
  galleryContainer.innerHTML = '';
}

function onOpenModal (event) {
  if (event.target.nodeName !== "IMG") {
    return;
  }

  basicLightbox.create(`
		<img width="1400" height="900" src=${event.target.dataset.source}>
	`).show()
}

const onEntry = async entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && searchForm.elements.query.value !== '') {
      console.log('Пора грузить еще картинки ' + imageApiService.query);
      console.log(searchForm.elements.query.value)
      
      infiniteScrol();
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '350px',
});

observer.observe(sentinel);

async function infiniteScrol () {
  try {
       const response = await imageApiService.fetchImages();

      if (response.length < 12) {
        console.log('Пора отключить IntersectionObserver' + Date.now());
        observer.unobserve(sentinel);
      }
        
      appendCardsMarkup(response);
    
      } catch (error) {
        console.log('Ошибка', error);
      }
}
