import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { join } from "path";
import { spawn } from "child_process";

const app = new Hono()

app.use('/*', serveStatic({ root: './public' }))

app.get('*', async (c) => {
  const filePath = join(import.meta.dir, 'public', 'index.html');
  const file = Bun.file(filePath);
  const content = await file.text();
  return c.html(content);
})

function startProject() {
  const child = spawn("bun", ["./server/main.ts"], {
    cwd: import.meta.dir,
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (code) => {
    if (code === 2) {
      
      startProject();
    }
  });
}

export default {
  port: 3000,
  fetch: app.fetch,
}

startProject();