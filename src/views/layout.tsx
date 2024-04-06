import { jsxRenderer } from "hono/jsx-renderer";
import Header from "../components/Header";
// Workaround for MIME type issue in Vite
// https://github.com/vitejs/vite/issues/2642
// https://github.com/vitejs/vite/issues/6979#issuecomment-2041183606
import clientProd from "../client?worker&url";
import clientDev from "../client?url";
import styles from "../assets/index.css?url";

export default jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Demo page</title>
        <link rel="stylesheet" href={styles} />
        <script
          type="module"
          src={import.meta.env.PROD ? clientProd : clientDev}
        />
      </head>
      <body>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  );
});
