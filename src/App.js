import './App.scss'
import React from 'react';

let isSessionTime = true;
let isBreakAndSessionBtnLocked = false;
let isTimeStarted = false;

class App extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      breakMin: 5,
      sessionMin: 25,
      minutes: 25,
      seconds: 0,
      interval: '',
    }


    this.handleBreakAndSessionIncrementAndDecrement = this.handleBreakAndSessionIncrementAndDecrement.bind(this);

    this.reset = this.reset.bind(this);
    this.startStop = this.startStop.bind(this);

  }

  handleBreakAndSessionIncrementAndDecrement(event) {
    let value = event.target.id;

    if (!isBreakAndSessionBtnLocked) {

      switch (value) {
        case 'break-decrement':
          if (this.state.breakMin > 1 && this.state.breakMin <= 60) {

            this.setState({
              breakMin: this.state.breakMin - 1
            })

          }
          break;
        case 'break-increment':
          if (this.state.breakMin >= 1 && this.state.breakMin < 60) {

            this.setState({
              breakMin: this.state.breakMin + 1
            })

          }
          break;
        case 'session-decrement':
          if (this.state.minutes > 1 && this.state.minutes <= 60) {

            if (this.state.seconds == 0) {

              this.setState({
                sessionMin: this.state.sessionMin - 1,
                minutes: this.state.minutes - 1,
                seconds: 0
              })

            } else {

              this.setState({
                sessionMin: this.state.sessionMin - 1,
                minutes: this.state.minutes - 2,
                seconds: 0
              })

            }

          }
          break;
        case 'session-increment':
          if (this.state.minutes >= 1 && this.state.minutes < 60) {

            if (this.state.seconds == 0) {

              this.setState({
                sessionMin: this.state.sessionMin + 1,
                minutes: this.state.minutes + 1,
                seconds: 0
              })

            } else {

              this.setState({
                sessionMin: this.state.sessionMin + 1,
                minutes: this.state.minutes + 2,
                seconds: 0
              })

            }



          }
          break;
      }

    }

  }

  reset() {

    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;



    clearInterval(this.state.interval);

    isBreakAndSessionBtnLocked = false;
    isTimeStarted = false;
    isSessionTime = true;

    this.setState({
      breakMin: 5,
      minutes: 25,
      sessionMin: 25,
      seconds: 0,
    })

  }

  startStop() {

    if (!isTimeStarted) {
      isTimeStarted = true;

      this.state.interval = setInterval(() => {

        if (this.state.seconds == 0 && this.state.minutes != 0) {

          this.setState((prevState) => ({
            seconds: 59,
            minutes: prevState.minutes - 1

          }))

        } else if (this.state.minutes == 0 && this.state.seconds == 0) {

          this.audioBeep.play();

          isSessionTime = !isSessionTime;

          if (isSessionTime) {

            let sMin = this.state.sessionMin

            this.setState({
              minutes: sMin
            })

          } else {

            let brkMin = this.state.breakMin

            this.setState({
              minutes: brkMin
            })

          }

        } else {

          this.setState({
            seconds: this.state.seconds - 1
          })

        }

      }, 1000)

      isBreakAndSessionBtnLocked = true;

    } else {

      clearInterval(this.state.interval);
      isTimeStarted = false;
      isBreakAndSessionBtnLocked = false;

    }

  }

  render() {
    return (
      <div className='pomodoro-container'>
        <div id='break-div'>

          <h1 id='break-label'>Break Length</h1>

          <h2 id='break-length'>{this.state.breakMin}</h2>

          <button
            type='button'
            id='break-decrement'
            onClick={this.handleBreakAndSessionIncrementAndDecrement}
          >
            decrement
          </button>
          <button
            type='button'
            id='break-increment'
            onClick={this.handleBreakAndSessionIncrementAndDecrement}
          >
            increment
          </button>

        </div>

        <div id='session-div'>

          <h1 id='session-label'>Session Length</h1>

          <h2 id='session-length'>{this.state.sessionMin}</h2>

          <button
            type='button'
            id='session-decrement'
            onClick={this.handleBreakAndSessionIncrementAndDecrement}
          >
            decrement
          </button>
          <button
            type='button'
            id='session-increment'
            onClick={this.handleBreakAndSessionIncrementAndDecrement}
          >
            increment
          </button>

        </div>

        <div id='session-time-div'>

          {
            (isSessionTime)
              ? <h1 id='timer-label'>Session Time</h1>
              : <h1 id='timer-label'>Break Time</h1>
          }


          <h2 id='time-left'>
            {
              (this.state.minutes >= 0 && this.state.minutes < 10)
                ? <span>0{this.state.minutes}</span>
                : <span>{this.state.minutes}</span>
            }
            <span>:</span>
            {
              (this.state.seconds >= 0 && this.state.seconds < 10)
                ? <span>0{this.state.seconds}</span>
                : <span>{this.state.seconds}</span>
            }


          </h2>

        </div>

        <div className='btn-div-start-stop-reset'>
          <button
            id='start_stop'
            className='btn-start-stop'
            onClick={this.startStop}
          >
            Start
          </button>
          <button
            id='reset'
            className='btn-start-stop'
            onClick={this.reset}
          >
            Reset
          </button>
        </div>

        <audio
          id='beep'
          src='https://www.peter-weinberg.com/files/1014/8073/6015/BeepSound.wav'
          ref={(audio) => {
            this.audioBeep = audio
          }}
        >
        </audio>



      </div>
    );
  }
}

export default App;
