const MOCK_API_DELAY = 500;
const INVALID_URL_MESSAGE = "Url is Invalid";
const VALID_URL_MESSAGE = "Url is Valid";
const EMPTY_URL_MESSAGE = "Please enter an URL";

function handleKeyUp(event) {
  const inputUrl = event.target.value;

  if (!inputUrl) {
    setMessage(EMPTY_URL_MESSAGE);
    return;
  }

  const isUrlValid = isValidProtocolUrl(inputUrl);

  if (isUrlValid) {
    setMessage(VALID_URL_MESSAGE);
    checkUrlTarget(inputUrl)
      .then((response) => {
        setMessage(
          `${VALID_URL_MESSAGE} \n and Mime Type is ${response.headers["content-type"]}`,
          "success"
        );
      })
      .catch(() => {
        setMessage(`${VALID_URL_MESSAGE} but target not exist`, "error");
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

const checkUrlTarget = () => {
  return new Promise((resolve, reject) => {
    throttle((url) => {
      window.setTimeout(() => {
        const mimeType = getRandomMimeType();
        if (mimeType) {
          resolve({
            request: {
              target: url,
            },
            headers: {
              "content-type": mimeType,
            },
          });
        } else {
          reject();
        }
      }, MOCK_API_DELAY);
    }, 500).apply();
  });
};

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

function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
