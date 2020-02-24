const autoCompleteConfig = {
  renderOption(movie) { //used to create decoupling and independent we can render the movie contnet by jst altering &adding elemnts we want
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; //check for the broken images and assign blank if N/A found in api response else poster url
    return `
    <img src="${imgSrc}" />
    ${movie.Title} (${movie.Year})
    `;
  },
 
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm){
    const response = await axios.get('http://www.omdbapi.com/',{
        params: {
            apikey: '93af1db3',
            s: searchTerm
        } // http://www.omdbapi.com/?apikey=93af1db3&s=avengers 
        //The second argument Obj with param property is simple feature that axios provide tht appends the url to fetch data from as u can see the result above
    });
    
    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
  }
};



createAutoComplete({
  ...autoCompleteConfig, //Make a copy of evertying inside the autocomplete obj and pass the obj for latter use
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {    //we want to hve two sides two shoes the details summary so we define this function on each obj //even to make functions independent we pass the functions or properties to return might be different
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  }

});


createAutoComplete({
  ...autoCompleteConfig, //Make a copy of evertying inside the autocomplete obj and pass the obj for latter use
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) { 
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  }

});

  let leftMovie; //To Compare The Content from REsponse we create new variable as well as pass different arguments on the func below
  let rightMovie;
  const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: '93af1db3',
        i: movie.imdbID
      }
    });
  
    summaryElement.innerHTML = movieTemplate(response.data);
    //we cmpre the arguments passed is whether for left or right and keep the response data for comparison
    if(side === 'left'){
      leftMovie = response.data;
    }else{
      rightMovie = response.data;
    }
    //if both the var stores the data run the belw code
    if (leftMovie && rightMovie){
      runComparison();
    }

  };

  //running comparison with data-value afterboth the search is done   
  const runComparison = () => {
      const leftSideStats = document.querySelectorAll(
        '#left-summary .notification'
        );
      const rightSideStats = document.querySelectorAll(
        '#right-summary .notification'
        );
      //iterate through all the elements also the template we render through must be the same Ex the html code should be the same for both sides to cmpre
      leftSideStats.forEach((leftStat, index) => { //left stat refers to the elements inside lefsidestars obj and index is initailized to 0 to whtever the no of elements it has
        const rightStat = rightSideStats[index];
        //retrive data-value property frm the html elementss
        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        if (rightSideValue > leftSideValue){
          leftStat.classList.remove('is-primary');   //we remove the is primary class if the datavalur on right is gretar than left
          leftStat.classList.add('is-warning'); 
        }else{
          rightStat.classList.remove('is-primary');
          rightStat.classList.add('is-warning');
        }

      });
  };


  //we pull out the data properties frm api then we inject it to data value 
  //the data vlaue is then used by our runcomparison by selecting the html elemnts datavalue property
  const movieTemplate = movieDetail => {
    // '$62,90,000' convertd to 6290000
    const dollars = parseInt(
      movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,'') //cnverting $ to '' and , to blank too (/strng-to-replace/g,'with-what')
    );
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));  
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => { //prev func args contaons the value  0 or starts with it as the second args in reduce obj has initail value of 0 prev args is acummalator
      const value = parseInt(word);
  
      if (isNaN(value)) {
        return prev;
      } else {
        return prev + value;
      }
    }, 0);  



    return `
      <article class="media">
        <figure class="media-left">
          <p class="image">
            <img src="${movieDetail.Poster}" />
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <h1>${movieDetail.Title}</h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
          </div>
        </div>
      </article>
      <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
      </article>
      <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
      </article>
      <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
      </article>
      <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
      </article>
      <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
      </article>
    `;
  };