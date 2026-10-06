/* ===== Pyodide 运行器（本地优先 + 分条会话版） =====
 * 加载策略：优先用项目内 libs/pyodide/（本地，约 1 秒）；缺失时回退 CDN。
 * 对外提供：
 *   PyRunner.run(code)                —— 整段运行（无状态）
 *   PyRunner.runStmt(code)            —— 分条运行：持久会话，变量保留，表达式自动回显
 *   PyRunner.clearSession()           —— 清空会话变量
 *   PyRunner.splitStatements(code)    —— 把代码拆成可逐条执行的语句块
 *   PyRunner.judge(userCode, tests)   —— 判题（整段）
 */
const PyRunner = (() => {
  const LOCAL = "libs/pyodide/";
  const CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  let pyodide = null;
  let loadingPromise = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("脚本加载失败：" + src));
      document.head.appendChild(s);
    });
  }

  async function ensure(onStatus) {
    if (pyodide) return pyodide;
    if (!loadingPromise) {
      loadingPromise = (async () => {
        let base = LOCAL;
        try {
          onStatus && onStatus("正在加载本地 Python 环境（约 1 秒）…");
          await loadScript(LOCAL + "pyodide.js");
        } catch (e) {
          base = CDN;
          onStatus && onStatus("本地环境未就绪，改用在线 CDN（首次约 10MB）…");
          await loadScript(CDN + "pyodide.js");
        }
        pyodide = await globalThis.loadPyodide({ indexURL: base });
        return pyodide;
      })();
    }
    try {
      await loadingPromise;
    } catch (e) {
      loadingPromise = null;   // 加载失败（如断网）后允许下次点击重试，不再永久卡在 rejected 状态
      throw e;
    }
    return pyodide;
  }

  // 截取 Python traceback，去掉 JS 堆栈噪音
  function extractPyError(msg) {
    const i = msg.indexOf("Traceback (most recent call last)");
    if (i >= 0) return msg.slice(i).trim();
    const j = msg.indexOf("Error");
    return j >= 0 ? msg.slice(j).trim() : msg;
  }

  // 整段运行（课程示例「运行」按钮用）
  async function run(code, onStatus) {
    const p = await ensure(onStatus);
    const out = [];
    p.setStdout({ batched: (s) => out.push(s) });
    p.setStderr({ batched: (s) => out.push(s) });
    try {
      await p.runPythonAsync(code);
      return { ok: true, output: out.join("\n") };
    } catch (e) {
      return { ok: false, output: out.join("\n"), error: extractPyError(e.message || String(e)) };
    }
  }

  /* 分条运行（REPL 会话）：与整段运行共用持久全局命名空间，
   * 变量会保留到下一条；最后一条是表达式时自动回显其值（repr）。 */
  async function runStmt(code, onStatus) {
    const p = await ensure(onStatus);
    const out = [];
    p.setStdout({ batched: (s) => out.push(s) });
    p.setStderr({ batched: (s) => out.push(s) });
    let ret;
    try {
      ret = await p.runPythonAsync(code);
    } catch (e) {
      return { ok: false, output: out.join("\n"), error: extractPyError(e.message || String(e)) };
    }
    let result = "";
    if (ret !== undefined) {
      try {
        const repr = p.globals.get("repr");
        result = String(repr(ret));          // REPL 风格回显：'abc'、[1, 2]、42
        if (repr && repr.destroy) repr.destroy();
      } catch { result = String(ret); }
      if (ret && ret.destroy) ret.destroy();
    }
    return { ok: true, output: out.join("\n"), result };
  }

  // 清空会话（删除所有用户定义的名字，保留内置）
  async function clearSession() {
    const p = await ensure();
    await p.runPythonAsync(
      "for __k in list(globals()):\n" +
      "    if not __k.startswith('__'):\n" +
      "        globals().pop(__k)\n"
    );
  }

  /* 把代码拆成语句块：顶层无缩进且非注释的行是新语句起点；
   * 注释行并入下一条；缩进行属于当前块（if/for/def 等不会被拆开）。 */
  function splitStatements(code) {
    const stmts = [];
    let cur = [];
    for (const line of code.split("\n")) {
      if (!line.trim()) continue;
      const indented = /^[ \t]/.test(line);
      const isComment = line.trim().startsWith("#");
      if (!indented && !isComment && cur.length) {
        stmts.push(cur.join("\n"));
        cur = [line];
      } else {
        cur.push(line);
      }
    }
    if (cur.length) stmts.push(cur.join("\n"));
    return stmts;
  }

  /* 判题：先执行用户代码，再逐条 eval 判题表达式。
   * tests: [{ name, expr }] → { ok, output, results:[{pass,name,msg}] } */
  async function judge(userCode, tests, onStatus) {
    const p = await ensure(onStatus);
    const casesJson = JSON.stringify(tests.map((t) => [t.name, t.expr]));
    const harness =
      userCode +
      "\n\nimport json as __json\n" +
      "__test_results__ = []\n" +
      "for __name, __expr in __json.loads(" + JSON.stringify(casesJson) + "):\n" +
      "    try:\n" +
      "        exec(__expr, globals())\n" +
      "        __test_results__.append((True, __name, ''))\n" +
      "    except Exception as __e:\n" +
      "        __msg = str(__e) or type(__e).__name__\n" +
      "        __test_results__.append((False, __name, type(__e).__name__ + ': ' + __msg))\n";

    const out = [];
    p.setStdout({ batched: (s) => out.push(s) });
    p.setStderr({ batched: (s) => out.push(s) });
    try {
      await p.runPythonAsync(harness);
    } catch (e) {
      return { ok: false, output: out.join("\n"), error: extractPyError(e.message || String(e)), results: [] };
    }
    const proxy = p.globals.get("__test_results__");
    const raw = proxy.toJs();
    proxy.delete();
    const results = raw.map((row) => ({ pass: !!row[0], name: String(row[1]), msg: String(row[2] || "") }));
    return { ok: true, output: out.join("\n"), results };
  }

  return { run, runStmt, clearSession, splitStatements, judge, ensure };
})();
