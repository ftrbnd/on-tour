<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ftrbnd/on-tour">
    <img src="https://i.imgur.com/KnLfe3s.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">On Tour</h3>

  <p align="center">
    Create playlists from your favorite live shows
    <br />
    <a href="/">Play Store</a>
    ·
    <a href="https://github.com/ftrbnd/on-tour/issues">Report Bug</a>
    ·
    <a href="https://github.com/ftrbnd/on-tour/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#configuration">Configuration</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<div>
  <img src="https://i.imgur.com/d4IBRJF.png" height="500" />
  <img src="https://i.imgur.com/UH5mRBa.png" height="500" />
  <img src="https://i.imgur.com/GcaZnvj.png" height="500" />
  <img src="https://i.imgur.com/ONMR0P9.png" height="500" />
</div>

Log in with Spotify to get your favorite artists' recent shows!
* Easily create a playlist directly from any setlist
* Additionally, search for any artist in the explore tab
* View your created playlists
* Create an *Upcoming Show* to remind you when the setlist is available!
* Dark mode is also available

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![ReactNative][ReactNative]][ReactNative-url]
* [![Expo][Expo]][Expo-url]
* [![Typescript][Typescript]][Typescript-url]
* [![UiKitten][UiKitten]][UiKitten-url]
* [![Drizzle][Drizzle]][Drizzle-url]
* [![NeonDb][NeonDb]][NeonDb-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) LTS
* [Expo](https://docs.expo.dev) SDK 50
* Client keys from Spotify's [Web Api](https://developer.spotify.com/documentation/web-api)
* API key from [setlist.fm](https://api.setlist.fm/docs/1.0/index.html)
* A [Fastify server](https://github.com/ftrbnd/on-tour-server) set up for handling authentication and database interactions
* Optional: DSN from [Sentry](https://sentry.io/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ftrbnd/on-tour.git
   ```
2. Install NPM packages
   ```sh
   yarn install
   ```
5. Start the local dev build
   ```sh
   yarn android
   ```

### Configuration

Create a `.env` file at the root and fill out the values:
```env
  EXPO_PUBLIC_SPOTIFY_CLIENT_ID=
  EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET=
  EXPO_PUBLIC_SETLIST_FM_API_KEY=
  EXPO_PUBLIC_FASTIFY_SERVER_URL=http://localhost:3000/api
  EXPO_PUBLIC_SENTRY_DSN=
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
* Both use cases allow for uploading images
* The second screenshot shows an option to import an Upcoming Show's details, including its image

### Creating a playlist on a setlist page
<div>
  <img src="https://i.imgur.com/KbRZXRI.png" height="500" />
  <img src="https://i.imgur.com/tmPBC9k.png" height="500" />
  <img src="https://i.imgur.com/rCFl5Ea.png" height="500" />
  <img src="https://i.imgur.com/r0pQX8L.png" height="500" />
</div>

### Creating an Upcoming Show
<div>
  <img src="https://i.imgur.com/2X9OD0G.png" height="500" />
  <img src="https://i.imgur.com/h3bwZAx.png" height="500" />
</div>


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Giovanni Salas - [@finalcalI](https://twitter.com/finalcali) - giosalas25@gmail.com

Project Link: [https://github.com/ftrbnd/on-tour](https://github.com/ftrbnd/on-tour)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/ftrbnd/on-tour.svg?style=for-the-badge
[contributors-url]: https://github.com/ftrbnd/on-tour/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ftrbnd/on-tour.svg?style=for-the-badge
[forks-url]: https://github.com/ftrbnd/on-tour/network/members
[stars-shield]: https://img.shields.io/github/stars/ftrbnd/on-tour.svg?style=for-the-badge
[stars-url]: https://github.com/ftrbnd/on-tour/stargazers
[issues-shield]: https://img.shields.io/github/issues/ftrbnd/on-tour.svg?style=for-the-badge
[issues-url]: https://github.com/ftrbnd/on-tour/issues
[license-shield]: https://img.shields.io/github/license/ftrbnd/on-tour.svg?style=for-the-badge
[license-url]: https://github.com/ftrbnd/on-tour/blob/master/LICENSE.txt

[ReactNative]: https://img.shields.io/badge/React%20native-f6f7f9?style=for-the-badge&logo=react&logoColor=61DAFB
[ReactNative-url]: https://reactnative.dev/
[Expo]: https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo
[Expo-url]: https://expo.dev
[Typescript]: https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[UiKitten]: https://img.shields.io/badge/ui%20kitten-ff6721?style=for-the-badge
[UiKitten-url]: https://akveo.github.io/react-native-ui-kitten/
[Drizzle]: https://img.shields.io/badge/drizzle-000000?style=for-the-badge&logo=drizzle&logoColor=C5F74F
[Drizzle-url]: https://orm.drizzle.team
[NeonDb]: https://img.shields.io/badge/neon-00e599?style=for-the-badge
[NeonDb-url]: https://neon.tech/
