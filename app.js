const MOCK_API_DELAY = 500;
const INVALID_URL_MESSAGE = "Url is Invalid";
const VALID_URL_MESSAGE = "Url is Valid";
const EMPTY_URL_MESSAGE = "Please enter an URL";

const checkUrlTargetThrottled = throttle(checkUrlTarget, 1000);

function handleKeyUp(event) {
  const inputUrl = event.target.value;

  if (!inputUrl) {
    setMessage(EMPTY_URL_MESSAGE);
    return;
  }

  const isUrlValid = isValidProtocolUrl(inputUrl);

  if (isUrlValid) {
    setMessage(VALID_URL_MESSAGE);
    checkUrlTargetThrottled(inputUrl).then((response) => {
      if (response.headers["content-type"]) {
        setMessage(
          `${VALID_URL_MESSAGE} \n and Mime Type is ${response.headers["content-type"]}`,
          "success"
        );
      } else {
        setMessage(`${VALID_URL_MESSAGE} but target not exist`, "error");
      }
    });
  } else {
    setMessage(INVALID_URL_MESSAGE);
  }
}

function setMessage(message, status) {
  const resultContainer = document.querySelector(".result");
  if (status === "error") {
    resultContainer.classList.remove("success");
    resultContainer.classList.add("error");
  } else if (status === "success") {
    resultContainer.classList.remove("error");
    resultContainer.classList.add("success");
  } else {
    resultContainer.classList = ["result"];
  }
  resultContainer.innerHTML = message;
}

function isValidProtocolUrl(input) {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
}

function checkUrlTarget(url) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const mimeType = getRandomMimeType();
      resolve({
        request: {
          target: url,
        },
        headers: {
          "content-type": mimeType,
        },
      });
    }, MOCK_API_DELAY);
  });
}

function getRandomMimeType() {
  const mimeTypes = [
    null,
    "image/png",
    "image/gif",
    "text/css",
    "application/json",
    "text/plain",
    "inode/directory",
  ];
  return mimeTypes[Math.floor(Math.random() * mimeTypes.length)];
}

window.addEventListener("load", () => {
  setMessage(EMPTY_URL_MESSAGE);
  document.querySelector("#input-url").addEventListener("keyup", handleKeyUp);
});

function throttle(func, wait, options) {
  let context, args, result;
  let timeout = null;
  let previous = 0;
  if (!options) options = {};
  const later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    const now = Date.now();
    if (!previous && options.leading === false) previous = now;
    const remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}
