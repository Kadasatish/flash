(function() {
  const flashIndicator = document.querySelector('.flash-indicator');
  const startBtn = document.querySelector('.start-btn');
  const hoursInput = document.querySelector('.hours');
  const minutesInput = document.querySelector('.minutes');
  const secondsInput = document.querySelector('.seconds');
  const hoursBtn = document.querySelector('.hours-btn');
  const minutesBtn = document.querySelector('.minutes-btn');
  const secondsBtn = document.querySelector('.seconds-btn');
  const selectAllBtn = document.querySelector('.select-all-btn');

  let selectedInputs = new Set([hoursInput, minutesInput, secondsInput]);
  let stream = null;

  async function turnOnFlash() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      const track = stream.getVideoTracks()[0];
      await track.applyConstraints({ advanced: [{ torch: true }] });
      flashIndicator.classList.add("active");
    } catch (err) {
      console.error("Flashlight error:", err);
      alert("ఫ్లాష్‌లైట్ ఆన్ చేయడంలో విఫలమైంది. దయచేసి కెమెరా అనుమతి ఇవ్వండి.");
    }
  }

  function turnOffFlash() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
      flashIndicator.classList.remove("active");
    }
  }

  function toggleSelection(input, shouldAdd) {
    if (shouldAdd) {
      selectedInputs.add(input);
    } else {
      selectedInputs.delete(input);
    }
  }

  hoursBtn.addEventListener("click", () => {
    toggleSelection(hoursInput, !selectedInputs.has(hoursInput));
  });

  minutesBtn.addEventListener("click", () => {
    toggleSelection(minutesInput, !selectedInputs.has(minutesInput));
  });

  secondsBtn.addEventListener("click", () => {
    toggleSelection(secondsInput, !selectedInputs.has(secondsInput));
  });

  selectAllBtn.addEventListener("click", () => {
    if (selectedInputs.size === 3) {
      selectedInputs.clear();
    } else {
      selectedInputs.add(hoursInput);
      selectedInputs.add(minutesInput);
      selectedInputs.add(secondsInput);
    }
  });

  startBtn.addEventListener("click", async () => {
    let totalSeconds = 0;
    if (selectedInputs.has(hoursInput)) {
      totalSeconds += parseInt(hoursInput.value || "0") * 3600;
    }
    if (selectedInputs.has(minutesInput)) {
      totalSeconds += parseInt(minutesInput.value || "0") * 60;
    }
    if (selectedInputs.has(secondsInput)) {
      totalSeconds += parseInt(secondsInput.value || "0");
    }

    if (totalSeconds > 0) {
      await turnOnFlash();
      setTimeout(() => {
        turnOffFlash();
      }, totalSeconds * 1000);
    }
  });
})();
