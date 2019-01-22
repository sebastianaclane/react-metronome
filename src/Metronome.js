import React, { Component } from 'react';
import './Metronome.css';
import click1 from './click1.wav';
import click2 from './click2.wav';

class Metronome extends Component {
    constructor(props) {
        super(props); // you need a super() method call in the constructor in order to access "this" because it initializes "this"
        // you would need to call super(props) if you want to access this.props in the constructor
        // which is useful if you need to control what the props object contains when the component is initially rendered
        // You don't need to pass props into the constructor to access props outside of the constructor method

        // Initialize the state
        // The metronome’s BPM and whether it is “on” or “off” are good candidates to put in React’s state, so we’ll initialize state in the constructor and then use those variables in the render function:
        this.state = {
            playing: false,
            count: 0,
            bpm: 100,
            beatsPerMeasure: 4
        };

        // Create Audio objects with the files Webpack loaded,
        // and we'll play them later.
        this.click1 = new Audio(click1);
        this.click2 = new Audio(click2);
    }

    playClick = () => {
        const { count, beatsPerMeasure } = this.state;

        // using % in an expression means getting the remainder of dividing two things
        // if the right hand arguement is bigger than the left hand arguement then it just returns the left hand arguement as is like: 1 % 5 returns 1
        // if the right hand arguement is smaller than the left hand arguement than it does the division and whatever number is left over is what it returns: example is 12 % 5 = 2
        // The first beat will have a different sound than the others
        if (count % beatsPerMeasure === 0) {
            this.click2.play();
        } else {
            this.click1.play();
        }

        // Keep track of which beat we're on
        this.setState(state => ({
            count: (state.count + 1) % state.beatsPerMeasure
        }));
    }

    // Here is how this startStop class method works:
    // If the metronome is playing, stop it by clearing the timer, and setting the playing state to false. This will cause the app to re-render, and the button will say “Start” again.
    //If the metronome is not playing, start a timer that plays a click every few milliseconds, depending on the bpm.
    //If you’ve used a metronome before, you know how the first beat is usually a distinctive sound (“TICK tock tock tock”). We’ll use count to keep track of which beat we’re on, incrementing it with each “click”, so we need to reset it when we start.
    //Calling setInterval will schedule the first “click” to be one beat in the future, and it’d be nice if the metronome started clicking immediately, so the second argument to setState takes care of this. Once the state is set, it will play one click.
    startStop = () => {
        if (this.state.playing) {
            // Stop the timer
            clearInterval(this.timer);
            this.setState({
                playing: false
            });
        } else {
            // Start a timer with the current BPM
            this.timer = setInterval(
                this.playClick,
                (60 / this.state.bpm) * 1000
            );

            this.setState(
                {
                    count: 0,
                    playing: true
                    // Play a click "immediately" (after setState finishes)
                },
                // in setState the 2nd arguemnt is optional but you can call a function that happens once setState is finished like below
                // this.setState({ playing: true, this.playClick})
                this.playClick
            )            
        }
    }

    // Since event handler functions (like handleBpmChange) are almost always passed around by reference, it’s important to declare them as arrow functions. 
    // You can also bind them in the constructor, but it’s a bit more hassle, and one more thing to forget, so I like to use the arrow functions.
    handleBpmChange = event => {
        const bpm = event.target.value;

        if (this.state.playing) {
            // Stop the old timer and start a new one
            clearInterval(this.timer);
            this.timer = setInterval(this.playClick, (60 / bpm) * 1000);

            // Set the new BPM, and reset the beat counter
            this.setState({
                count: 0,
                bpm  
            })
        } else {
            // otherwise just update the BPM
            this.state({ bpm })
        }
    }

    render() {
        const { playing, bpm } = this.state;
        // use the our variable references that retrieve the states's property variables inside the render() function
        // the above line is the same as the two lines below which is pretty handy and it lets you use {bpm} and {playing} down below in the return call
        // const playing = this.state.playing;
        // const bpm = this.state.bpm;

        // // do not do this, try to modify state using this.state outside of the constructor. You want to use this.state instead.
        // this.state = {
        //     searchTerm: event.target.value
        // }

        return (
            <div className="metronome">
               <div className="bpm-slider">
                    <div>{bpm} BPM</div>
                    <input
                        type="range"
                        min="60"
                        max="240"
                        value={bpm}
                        onChange={this.handleBpmChange} />
               </div>
               {/* Add the onClick handler: */}
               <button onClick={this.startStop}>
                    {playing ? 'Stop' : 'Start'}
                </button>
            </div>
        );
    }
}

export default Metronome;