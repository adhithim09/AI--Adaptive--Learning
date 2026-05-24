import { execSync } from "child_process";

const port = process.argv[2] || process.env.PORT || "5000";

function killOnWindows() {
  let output = "";
  try {
    output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
  } catch {
    return;
  }

  const pids = new Set();
  for (const line of output.split("\n")) {
    if (!line.includes("LISTENING")) continue;
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && /^\d+$/.test(pid) && pid !== "0") pids.add(pid);
  }

  const self = String(process.pid);
  for (const pid of pids) {
    if (pid === self) continue;
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
      console.log(`[free-port] Stopped PID ${pid} on port ${port}`);
    } catch {
      // Process may have already exited
    }
  }
}

function killOnUnix() {
  try {
    const pids = execSync(`lsof -ti tcp:${port}`, { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
    for (const pid of pids) {
      if (pid === String(process.pid)) continue;
      try {
        process.kill(Number(pid), "SIGKILL");
        console.log(`[free-port] Stopped PID ${pid} on port ${port}`);
      } catch {
        // ignore
      }
    }
  } catch {
    // Port not in use
  }
}

if (process.platform === "win32") killOnWindows();
else killOnUnix();
