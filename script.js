const hour = document.getElementById("hour");
const minute = document.getElementById("minute");
const second = document.getElementById("second");
const set_time = document.getElementById("set_time");
const list = document.getElementById("list");
let time = [];
let pause = false;

const updateTimersDisplay = () => {
  const timerHTML =
    time.length === 0
      ? "<h3>You have no timer currently !</h3>"
      : time
          .map((timer, index) => {
            const hour = Math.floor(timer.remaining / 3600);
            const minute = Math.floor((timer.remaining % 3600) / 60);
            const second = timer.remaining % 60;

            if (timer.remaining <= 0) {
              return `
                  <div class="time-body timer" style="background-color: yellow;">
                    <h3>Time's up!</h3>
                    <button class="stop_time" onclick="deleteTimer(${index})">Stop</button>
                  </div>
                `;
            }

            return `
                  <div class="time-body timer">
                    <h3>Time Left</h3>
                    <div class="time-input">
                      <div class="time">
                        <h1>${String(hour).padStart(2, "0")}</h1>
                        :
                        <h1>${String(minute).padStart(2, "0")}</h1>
                        :
                        <h1>${String(second).padStart(2, "0")}</h1>
                      </div>
                      <button class="set_time" onclick="deleteTimer(${index})">Delete</button>
                      <button class="set_time" onclick="StopTimer(${index})">${timer.paused ? 'Resume' : 'Pause'}</button>
                    </div>
                  </div>
                `;
          })
          .join("");

  list.innerHTML = timerHTML;

  

  // Adding the 'tick-tock' class to the audio element
  const audioElements = document.querySelectorAll("audio");
  audioElements.forEach((audio) => audio.classList.add("tick-tock"));
 
};

const tickTockAudio = new Audio("tick-tock.mp3");
const startTimer = (index) => {
 

  const timerId = setInterval(() => {
    if (!time[index].paused) {
      time[index].remaining--;

      if (time[index].remaining <= 0) {
        clearInterval(timerId);

        // Play the audio when the timer reaches 0
        const audioElement = document.getElementById("timerAudio");
        audioElement.src = "./wrong-answer-129254.mp3";
        audioElement.play();

      
        // Pause the ticking sound when the timer reaches 0
        tickTockAudio.pause();
      } else {
        // Play the ticking sound for each second
        tickTockAudio.currentTime = 0;
        tickTockAudio.play();
      }
    }

    // Update the display every second (including when the timer reaches zero)
    updateTimersDisplay();
  }, 1000);
  time[index].timerId = timerId;
};

const setTime = () => {
  const Hour = () => {
    if (hour.value === "") {
      return 0;
    } else {
      return parseInt(hour.value) * 3600;
    }
  };

  const Minute = () => {
    if (minute.value === "") {
      return 0;
    } else {
      return parseInt(minute.value) * 60;
    }
  };

  const Second = () => {
    if (second.value === "") {
      alert("Please enter the second value");
      return 0;
    } else {
      return parseInt(second.value);
    }
  };

  let totalSeconds = Hour() + Minute() + Second();
  if (totalSeconds <= 0) {
    alert("Please enter a valid time greater than zero.");
    return;
  } else {
    time.push({ remaining: totalSeconds, timerId: null, paused: false });
    const index = time.length - 1;
    startTimer(index);
    updateTimersDisplay();
    hour.value = "";
    minute.value = "";
    second.value = "";
    updateTimersDisplay();
  }
};

const deleteTimer = (index) => {
    
  clearInterval(time[index].timerId); // Clear the interval to stop the timer
  time.splice(index, 1); // Remove the timer from the array
  updateTimersDisplay(); // Update the display
  tickTockAudio.pause();
  
};

const StopTimer = (index) => {
  if (time[index].paused) {
    time[index].paused = false;
    startTimer(index);
    
  } else {
    clearInterval(time[index].timerId); // Clear the interval to stop the timer
    time[index].paused = true;
    updateTimersDisplay(); // Update the display
    tickTockAudio.pause();
  }
};

document.getElementById("set_time").addEventListener("click", () => setTime());
