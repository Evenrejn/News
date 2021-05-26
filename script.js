//сервис noNewsApi gnews для получения новостей
//materialize - фреймворк для UI
//API key 95d4a05dba081e8d1fa530500a6ff121


// Custom Http Module
function customHttp() {
    return {
      get(url, cb) {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          xhr.addEventListener('load', () => {
            if (Math.floor(xhr.status / 100) !== 2) {
              cb(`Error. Status code: ${xhr.status}`, xhr);
              return;
            }
            const response = JSON.parse(xhr.responseText);
            cb(null, response);
          });
  
          xhr.addEventListener('error', () => {
            cb(`Error. Status code: ${xhr.status}`, xhr);
          });
  
          xhr.send();
        } catch (error) {
          cb(error);
        }
      },
      post(url, body, headers, cb) {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.addEventListener('load', () => {
            if (Math.floor(xhr.status / 100) !== 2) {
              cb(`Error. Status code: ${xhr.status}`, xhr);
              return;
            }
            const response = JSON.parse(xhr.responseText);
            cb(null, response);
          });
  
          xhr.addEventListener('error', () => {
            cb(`Error. Status code: ${xhr.status}`, xhr);
          });
  
          if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
              xhr.setRequestHeader(key, value);
            });
          }
  
          xhr.send(JSON.stringify(body));
        } catch (error) {
          cb(error);
        }
      },
    };
  }
  // Init http module
  const http = customHttp();

  const newsService = (function() {
    const apiKey = '95d4a05dba081e8d1fa530500a6ff121',
          apiUrl = 'https://gnews.io/api/v4';

    return {
        topHeadlines(country = 'us', cb) {
            http.get(`${apiUrl}/top-headlines?lang=${country}&lang=en&token=${apiKey}`, cb);
        },
        everything(query, cb) {
            http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
        }
    }
  });    // https://gnews.io/api/v4/top-headlines?token=95d4a05dba081e8d1fa530500a6ff121
  
  //  init selects
  document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    loadNews();
  });
  
  //load news
  function loadNews() {
      newsService().topHeadlines('us', onGetResponce);
  }

  //function on get response from service
  function onGetResponce(err, res) {
      //console.log(res);
      renderNews(res.articles);
  }

  //render news
  function renderNews(news) {
    const newsContainer = document.querySelector('.row-news');
    let fragment = '';

    news.forEach(newsItem => {
      const el = newsTemplate(newsItem);
      fragment += el;
    });

    newsContainer.insertAdjacentHTML('afterbegin', fragment);
  }

  //news item template function
  function newsTemplate({ image, title, url, description }) {
    //console.log(news);
    return `
    <div class="col s12 m7">
          <div class="card news-container">
            <div class="card-image">
              <img src="${image}">
              <span class="card-title">${title || ''}</span>
            </div>
            <div class="card-content">
              <p>${description || ''}</p>
            </div>
            <div class="card-action">
              <a href="${url}">Read more</a>
            </div>
          </div>
        </div>
    `;
  }