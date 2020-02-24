
//debounce to make restrictions n make code cleaner 
const debounce = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => { 
      if (timeoutId) {
        clearTimeout(timeoutId);  
      }
      //runs the function after sometime i.e value found in delay
      timeoutId = setTimeout(() => {   //settimeout runs the function and returns some int number to keep track or identify
        func.apply(null, args);       //jvs feature equivalent to func(arg1,arg2,arg3) it jst spreads the arguments also args here refers to event being passed fun(args) too onInput(events)
                                      //args here is passed as we want to use pass the event object and want to use some of its property lke event.target.value)
      }, delay);
    };
  };