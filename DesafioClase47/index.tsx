// @deno-types="https://deno.land/x/servest@v1.3.4/types/react/index.d.ts"
import React from "https://dev.jspm.io/react/index.js";
// @deno-types="https://deno.land/x/servest@v1.3.4/types/react-dom/server/index.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom@16.13.1/server.js";
import { createApp } from "https://deno.land/x/servest@v1.3.4/mod.ts";

const app = createApp();
const colors: string[] = [];

app.handle("/", async (req) => {
  await req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "text/html; charset=UTF-8",
    }),
    body: ReactDOMServer.renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>Servest</title>
        </head>
        <body style={{backgroundColor: 'black'}}>
          <h1 style={{color: 'blue'}}>Hello Servest con React!</h1>
          <div>
            <form action="/color" method="post">
              <label style={{color: 'white'}} htmlFor="color">Add color: </label>
              <input type="text" name="colorAgregado" id="colorAgregado" />
              <input type="submit" value="Add"  />
            </form>
          </div>
          <div>
            <ul>
              {colors.map((c) => (
                <li style={{color: c}}>{c}</li>
              ))}
            </ul>
          </div>
        </body>
      </html>
    )
  });
});

app.post('/color', async (req) => {
  try {
    const payload = await req.text();
    const nuevoColor = payload.substring(payload.indexOf('=')+1, payload.length);

    colors.push(nuevoColor);
  } catch (error) {
    console.log('Error: ' + error);
  }

  req.redirect('/');
});

app.listen({ port: 8888 });