import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const form = document.querySelector("[data-form");

axios.interceptors.request.use((req) => {
  req.customData = req.customData || {};
  req.customData.startTime = new Date().getTime();
  return req;
});

axios.interceptors.response.use(updateEndTime, (e) => {
  return Promise.reject(updateEndTime(e.response));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const config = {
    url: document.querySelector("[data-url").value,
    method: document.querySelector("[data-method").value,
    params: keyValuePairsToObject(queryParamsContainer),
    headers: keyValuePairsToObject(requestHeadersContainer),
  };
  if (document.querySelector("[data-method").value === "POST") {
    config.data =
      JSON.parse(document.getElementById("json--post").value || "{}") || null;
  }
  axios(config)
    .catch((e) => e)
    .then((res) => {
      document
        .querySelector("[data-response-section]")
        .classList.remove("d-none");

      updateResponseDetails(res);
      // updateResponseEditor(res.data)
      updateResponseHeaders(res.headers);
    });
});

const queryParamsContainer = document.querySelector("[data-query-params]");

const requestHeadersContainer = document.querySelector(
  "[data-request-headers]"
);
const keyValueTemplate = document.querySelector("[data-key-value-template]");

const responseHeaderContainer = document.querySelector(
  "[data-response-headers]"
);

document
  .querySelector("[data-add-query-param-btn]")
  .addEventListener("click", () => {
    queryParamsContainer.append(createKeyValuePair());
  });

document
  .querySelector("[data-add-request-header-btn]")
  .addEventListener("click", () => {
    requestHeadersContainer.append(createKeyValuePair());
  });

queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());

function updateEndTime(res) {
  res.customData = res.customData || {};
  res.customData.time = new Date().getTime() - res.config.customData.startTime;

  return res;
}

function createKeyValuePair() {
  const ele = keyValueTemplate.content.cloneNode(true);

  ele.querySelector("[data-remove-btn]").addEventListener("click", (e) => {
    e.target.closest("[data-key-value-pair]").remove();
  });
  return ele;
}

function keyValuePairsToObject(container) {
  const pairs = container.querySelectorAll("[data-key-value-pair]");

  return [...pairs].reduce((data, pairs) => {
    const key = pairs.querySelector("[data-key]").value;
    const value = pairs.querySelector("[data-value]").value;

    if (key === "") return data;
    return { ...data, [key]: value };
  }, {});
}

function updateResponseHeaders(headers) {
  responseHeaderContainer.innerHTML = "";

  Object.entries(headers).forEach(([key, value]) => {
    const keyEl = document.createElement("div");
    console.log(key);
    keyEl.textContent = key;
    responseHeaderContainer.append(keyEl);
    const valueEl = document.createElement("div");
    valueEl.textContent = value;
    responseHeaderContainer.append(valueEl);
  });
}

function updateResponseDetails(response) {
  document.querySelector("[data-status]").textContent = " " + response.status;

  document.querySelector("[data-time]").textContent =
    " " + response.customData.time;

  document.querySelector("[data-size]").textContent =
    " " +
    Number(
      new TextEncoder().encode(JSON.stringify(response)).length / 1024
    ).toFixed(0) +
    "KB";

  const jsonResponseBody = document.querySelector("[data-json-response-body]");

  jsonResponseBody.innerHTML = `<pre>${JSON.stringify(
    response.data,
    null,
    4
  )}<pre>`;

  jsonResponseBody.conten;
}
