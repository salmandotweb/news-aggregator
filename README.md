# News Aggregator

A modern news aggregation application built with React, TypeScript, and Redux Toolkit that combines articles from multiple news sources including NewsAPI, The Guardian, and The New York Times.

## Features

- 🔍 Real-time news search across multiple sources
- 🎨 Light/Dark theme support
- 📱 Responsive design for all devices
- 🔧 Advanced filtering options:
  - Filter by news source
  - Filter by category
  - Search functionality
- 📄 Infinite scroll pagination
- 💾 Persistent user preferences
- ⚡ Fast and optimized performance
- 🛡️ Error boundary protection
- 🎯 Type-safe development with TypeScript

## Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or later)
- npm or yarn
- API keys for:
  - NewsAPI
  - The Guardian API
  - New York Times API

## Installation

1. Clone the repository:

```bash
git clone https://github.com/salmandotweb/news-aggregator.git
```

cd news-aggregator

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your API keys:

```bash
REACT_APP_NEWS_API_KEY=your_newsapi_key
REACT_APP_GUARDIAN_API_KEY=your_guardian_key
REACT_APP_NYTIMES_API_KEY=your_nytimes_key
```

4. Start the development server:

```bash
npm start
```

## Docker Support

The application can also be run using Docker:

1. Build the Docker image:

```bash
docker build -t news-aggregator .
```

2. Run the Docker container:

```bash
docker run -p 3000:3000 \
-e REACT_APP_NEWS_API_KEY=your_key \
-e REACT_APP_GUARDIAN_API_KEY=your_key \
-e REACT_APP_NYTIMES_API_KEY=your_key \
news-aggregator
```

Alternatively, use Docker Compose:

```bash
docker-compose up
```

## Project Structure

├── src/
│ ├── api/ # API services and types
│ ├── components/ # React components
│ ├── hooks/ # Custom React hooks
│ ├── store/ # Redux store configuration
│ │ └── slices/ # Redux slices
│ └── styles/ # SCSS styles
├── public/ # Static files
└── ...configuration files

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit
- SASS/SCSS
- Axios
- date-fns
- Docker

## Acknowledgments

- [NewsAPI](https://newsapi.org/)
- [The Guardian API](https://open-platform.theguardian.com/)
- [The New York Times API](https://developer.nytimes.com/)
