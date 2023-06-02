# CoinDash

## About

Crypto portfolio tracker with a focus on simplicity and privacy. It's also the first tracker that let's you chat with your portfolio with a little help from AI.

The only complexity that I experienced while developing this was that I found that not much Web3 API providers have endpoints for fetching data from multiple addresses in one call. In fact I found that only Zappier has this but it takes some time from requesting the API key to actually getting so not option for this task.

## Documentation

Project is based on `Next.js`, a production-ready React Framework. Check out the [documentation](https://nextjs.org/docs) for more information.

## Prerequisites

- `node`
- `pnpm`

## Usage

Before you start make sure that you have all ENV variables set. You can find all required variables in `.env.example` file.

**Firstly, install all necessary dependencies:**

```sh
pnpm install
```

**To start a development server:**

```sh
pnpm run dev
```

**To build the app for production:**

```sh
pnpm run build
pnpm start
```

## Folder structure

```bash
coindash/
├── config
├── public
└── src
    ├── components
    │   ├── elements
    │   ├── layouts
    │   ├── modules
    │   └── templates
    ├── hooks
    ├── pages
    ├── services
    ├── stores
    ├── types
    └── utils
```
