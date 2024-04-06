# Vite server build demo

[Context](https://github.com/vitejs/vite/discussions/10097#discussioncomment-9031458)

This demo shows how to build a server using Vite that processes and correctly imports client assets—for example, CSS and client JS—and injects them into a server-rendered static page. It uses [Hono](https://hono.dev/) as a web server and its JSX library for templating, but you can adapt these concepts to any framework of your choice.

This approach is more of how traditional web apps work. The demo leverages Vite's `ssr` options in its config, but there isn't any actual SSR going on in the modern sense of a front-end JS framework like React being executed on the server and spitting out an HTML string.

Vite wasn't designed with this style of web apps in mind (see context above), but this demo shows that it's possible.

## Structure

```
dist/                  <-- Vite-compiled output
  .vite/
    manifest.json      <-- can use, in theory, for CSS module <link>s
  assets/
    client-*.js        <-- client bundle
    Header-*.css       <-- transformed CSS module
    Header.tsx-*.js    <-- weird CSS module artifact produced when splitting chunks
    index-*.css        <-- global CSS
  _worker.js           <-- server bundle; run this to start your app.

src/
  assets/
    index.css          <-- global CSS
  components/
    Header.module.css  <-- CSS module for Header
    Header.tsx         <-- imports CSS module
  views/
    layout.tsx         <-- imports global CSS and client bundle
  client.ts            <-- client bundle transformed by Vite (but NOT rendered in SSR)
  index.tsx            <-- main entrypoint for the server

emitCssModules.js      <-- experimental Vite/Rollup plugin (see below)
vite.config.js         <-- note usage of ssr options (but no SSR going on)
```

## Setup

```
npm install
```

**Dev**

```
npm run dev
open http://localhost:5173
```

**Prod**

```
npm run build && npm run start
open http://localhost:3000
```

## Key ideas

- Use Vite's `ssr` options to compile the server. Execute the compiled bundle, not the raw server code, because the bundle will contain the correct file paths to your compiled assets.
- Import global CSS/JS using `?url` suffix to pull in assets into Vite's compile graph without pulling client code into the server bundle.
- Split CSS files from compiled CSS modules.

## emitCssModules Vite plugin

Vite supports CSS modules out of the box:

- `import styles 'my.module.css'` returns an object with class names that you can use in your tag/component.
- Vite emits a CSS file that contains all of your CSS modules' CSS code and includes it in `dist/.vite/manifest.json`.

There are two problems with this behavior:

1. You're supposed to find the filename of your emitted CSS file using the manifest, then use that filename in a `<link>` tag, which is kinda annoying and unintuitive. It would be nicer if a plugin did this for you.
2. All of your CSS modules get rolled up into one CSS file, which means that the browser has to download a lot of unnecessary CSS for a given page. It also degrades caching since each new build will generate a new hash for the combined CSS modules file even if only one CSS module has changed.

This demo contains a partially-functional prototype of a Vite/Rollup plugin in `emitCssModules.js` that triggers Vite's CSS plugin to emit separate files for each CSS module and add them to the manifest, solving problem 2. It doesn't yet solve problem 1.

For a detailed discussion, [see context here](https://github.com/vitejs/vite/discussions/10097#discussioncomment-9031458).