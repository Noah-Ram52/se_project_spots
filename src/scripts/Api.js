class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "ee606c2e-637f-46fa-9b40-24ad3120b944",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

// export the class
