class Timer {
    constructor(durationInput, startButton, pauseButton, callbacks) { //callback here is an object
      this.durationInput = durationInput;
      this.startButton = startButton;
      this.pauseButton = pauseButton;
      if (callbacks) {
        this.onStart = callbacks.onStart; //holds callback to communict with code outside the class
        this.onTick = callbacks.onTick;
        this.onComplete = callbacks.onComplete;
      }
  
      this.startButton.addEventListener('click', this.start);
      this.pauseButton.addEventListener('click', this.pause);
    }
  
    start = () => {
      if (this.onStart) { //look if there is any property onStart
        this.onStart(this.timeRemaining); //value passed to outside callback funtion
      }
      this.tick();
      this.interval = setInterval(this.tick, 20); //string setinterval id in variable
    };
  
    pause = () => {
      clearInterval(this.interval);
    };
  
    tick = () => {
      if (this.timeRemaining <= 0) {
        this.pause();
        if (this.onComplete) {
          this.onComplete();
        }
      } else {
        this.timeRemaining = this.timeRemaining - 0.02;
        if (this.onTick) {
          this.onTick(this.timeRemaining);
        }
      }
    };
  
    get timeRemaining() {
      return parseFloat(this.durationInput.value);
    }
  
    set timeRemaining(time) {
      this.durationInput.value = time.toFixed(2);
    }
  }
  