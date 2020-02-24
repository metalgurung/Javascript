// asearch bar widget in our app
const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData
}) => {
    root.innerHTML = `
      <label><b>Search Nigga</b></label>
      <input class="input" />
      <div class="dropdown">
        <div class="dropdown-menu">
          <div class="dropdown-content results"></div>
        </div>
      </div>
    `;
    //instead of looking at document we tried to find the element from root objct property thts destructured
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');
  
    const onInput = async event => { 
        const items  = await fetchData(event.target.value);
     
        //HANDLING EMPY RESPON
        //IF THE SEARCH HAS NO LENGTH REMOCVE CLASS AND RETURN TO END THE FUNCTION FRM RUNNING BELOW
        if(!items.length){
         dropdown.classList.remove('is-active'); 
         return;
        }
     
        resultsWrapper.innerHTML = '';    //clearing the results to display before adding them
        dropdown.classList.add('is-active');
        for (let item of items) {
            const option = document.createElement('a');            
            option.classList.add('dropdown-item'); 
            option.innerHTML = renderOption(item)

            //event tht updates the txt in input by the title we clked in anchor elemnt
             option.addEventListener('click', () => {
                 dropdown.classList.remove('is-active');
                 input.value = inputValue(item);
                 onOptionSelect(item);
             });
            resultsWrapper.appendChild(option);
        }
     };
     
    input.addEventListener('input', debounce(onInput, 500));

    //to close the dropdown if user click elsewhere beside the autocomplete html class
    document.addEventListener('click', event => {
    if (!root.contains(event.target)) { //if the target is elsewhere than the selected elements in this case root
      dropdown.classList.remove('is-active');  //is-active is a class in bulma css to not display the dropdown
    }
  });

  };
  