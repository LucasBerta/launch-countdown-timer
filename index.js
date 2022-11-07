document.addEventListener("DOMContentLoaded", function () {
  let now = new Date();
  const releaseDate = new Date(now.getTime() + 1000091110);

  updateRemainingTime(true);
  setInterval(function () {
    now = new Date();
    if (!timeHasFinished()) {
      updateRemainingTime();
    }
  }, 1000);

  // Updates
  function updateRemainingTime(preventAnimation) {
    if (timeHasChanged("days", getRemainingDays(true))) {
      updateElement("days", getRemainingDays, preventAnimation);
    }
    if (timeHasChanged("hours", getRemainingHours(true))) {
      updateElement("hours", getRemainingHours, preventAnimation);
    }
    if (timeHasChanged("minutes", getRemainingMinutes(true))) {
      updateElement("minutes", getRemainingMinutes, preventAnimation);
    }
    if (timeHasChanged("seconds", getRemainingSeconds(true))) {
      updateElement("seconds", getRemainingSeconds);
    }
  }

  function updateElement(elementId, getRemainingFn, preventAnimation) {
    const secondsElement = document.getElementById(elementId);
    const clone = secondsElement.cloneNode(true);
    if (!preventAnimation) {
      clone.classList.add("time-transition");
    }

    secondsElement.after(clone);
    secondsElement.remove();

    updateFront(clone, getRemainingFn());
    updateBack(clone, getRemainingFn(true));
  }

  // Helpers
  function timeHasFinished() {
    // 1000ms => 1s in future to prevent next animation
    return releaseDate.getTime() - now.getTime() <= 1000;
  }

  function timeHasChanged(timeId, newRemainingTime) {
    const element = document
      .getElementById(timeId)
      .getElementsByClassName("upper-back")[0]
      .getElementsByTagName("span")[0];
    const value = element.innerHTML;
    return parseInt(value) !== parseInt(newRemainingTime);
  }

  function updateFront(element, value) {
    const upper = element.getElementsByClassName("upper")[0];
    const lower = element.getElementsByClassName("lower")[0];

    upper.getElementsByTagName("span")[0].innerHTML = value;
    lower.getElementsByTagName("span")[0].innerHTML = value;
  }

  function updateBack(element, value) {
    const upperBack = element.getElementsByClassName("upper-back")[0];
    const lowerBack = element.getElementsByClassName("lower-back")[0];

    upperBack.getElementsByTagName("span")[0].innerHTML = value;
    lowerBack.getElementsByTagName("span")[0].innerHTML = value;
  }

  function getRemainingDays(_oneSecondInFuture) {
    return getTwoDigitTime(
      Math.floor(getDifferenceInTime(_oneSecondInFuture) / (1000 * 3600 * 24))
    );
  }

  function getRemainingHours(_oneSecondInFuture) {
    return getTwoDigitTime(
      Math.floor(
        (getDifferenceInTime(_oneSecondInFuture) / (1000 * 60 * 60)) % 24
      )
    );
  }

  function getRemainingMinutes(_oneSecondInFuture) {
    return getTwoDigitTime(
      Math.floor((getDifferenceInTime(_oneSecondInFuture) / 1000 / 60) % 60)
    );
  }

  function getRemainingSeconds(_oneSecondInFuture) {
    return getTwoDigitTime(
      Math.floor((getDifferenceInTime(_oneSecondInFuture) / 1000) % 60)
    );
  }

  function getDifferenceInTime(_oneSecondInFuture) {
    if (_oneSecondInFuture) {
      return (
        new Date(releaseDate).getTime() -
        new Date(new Date(now).setSeconds(now.getSeconds() + 1)).getTime()
      );
    }

    return new Date(releaseDate).getTime() - now.getTime();
  }

  function getTwoDigitTime(time) {
    if (("" + time).length === 1) {
      return "0" + time;
    }
    return time;
  }
});
