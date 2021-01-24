<h1 align="center">Welcome to Roadtrip planner 👋</h1>
<p>
  <a href="https://github.com/JuhoKon/roadtrip-front#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/JuhoKon/roadtrip-front/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
</p>

> Web application for planning and creating roadtrips.

### 🏠 [Homepage](https://github.com/JuhoKon/roadtrip-front)

### ✨ [Demo](https://roadtrip-planner-gis.herokuapp.com/)

## About

The application consists of Express.js-backend and React.js frontend. To use the application locally, you need a Google Maps API key. For the time being, a demo is available at: [here](https://roadtrip-planner-gis.herokuapp.com/).

Backend is available at: [here](https://github.com/JuhoKon/roadtrip-backend)

Both the frontend and backend need a Google Maps API key.

For the project I have created two API keys, one for the frontend and one for the backend. The frontend key is restricted to only work from certain URLs to keep it safer from abuse.

## Frontend

The frontend uses the following libraries and APIs:

- Material UI
- [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api)
- Google Places API, Maps API, Directions API

#### Install

```sh
yarn install
```

#### Usage

In development, backend should be running in `http://localhost:8080`.

```sh
yarn run start
```

#### Run tests

```sh
yarn run test
```

## Backend

The backend is an Express webserver, which serves as an API for the frontend and is used to aswell serve the React-applications build files.

Backend is available at: [here](https://github.com/JuhoKon/roadtrip-backend)

## Author

👤 **Juho Kontiainen**

- Github: [@JuhoKon](https://github.com/JuhoKon)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
