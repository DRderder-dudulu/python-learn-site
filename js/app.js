/* ===== 极简骨架：hash 路由 + 双模式（学习版 / 速查版） ===== */
const $app = document.getElementById("app");

/* ---------- 模式切换（记忆在 localStorage） ---------- */
const Mode = {
  get: () => localStorage.getItem("pyxst.mode") || "learn",
  set(m) { localStorage.setItem("pyxst.mode", m); },
};

function renderModeSwitch() {
  const box = document.getElementById("mode-switch");
  if (!box) return;
  const m = Mode.get();
  box.innerHTML =
    `<button class="mode-btn ${m === "learn" ? "on" : ""}" data-m="learn">学习版</button>` +
    `<button class="mode-btn ${m === "cheat" ? "on" : ""}" data-m="cheat">速查版</button>`;
  box.querySelectorAll(".mode-btn").forEach((b) =>
    b.addEventListener("click", () => {
      Mode.set(b.dataset.m);
      location.hash = b.dataset.m === "cheat" ? "#/cheatsheet" : "#/";
      render(); // 立即重渲染（hash 变化时 hashchange 也会触发，幂等）
    })
  );
}

/* ---------- 站点统一元信息：每页页脚自动展示 ---------- */
const SITE_META = {
  release: "v2.3",
  versions: "Python 3.8—3.14",
  checked: "2026-10",
  doc: "https://docs.python.org/zh-cn/3/",
};
function metaFooterHTML() {
  return `<footer class="site-meta">站点版本：${SITE_META.release} ｜ 适用版本：${SITE_META.versions} ｜ 最后核对：${SITE_META.checked} ｜ 语言规则以 <a href="${SITE_META.doc}" target="_blank" rel="noopener">Python 官方文档</a> 为准</footer>`;
}

/* ---------- 代码高亮与编辑器（CodeMirror，VS Code 式分类型配色；CDN 不可用时退回纯文本框） ---------- */
/* 把 pre 里的 Python 源码渲染成带配色的静态高亮 */
function highlightInto(pre) {
  if (!window.CodeMirror || !CodeMirror.runMode) return;
  const code = pre.textContent;
  pre.textContent = "";
  pre.classList.add("cm-s-material-darker", "cm-static");
  CodeMirror.runMode(code, "python", pre);
}
/* 无 CodeMirror 时的回退：Tab 键输入 4 空格 */
function tabAsSpaces(ta) {
  ta.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = ta.selectionStart;
      ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(ta.selectionEnd);
      ta.selectionStart = ta.selectionEnd = s + 4;
    }
  });
}
/* 把 textarea 升级为高亮编辑器；返回 CodeMirror 实例，失败时返回 null（退回纯文本框） */
function makeEditor(ta, extraKeys) {
  if (!window.CodeMirror) { tabAsSpaces(ta); return null; }
  const keys = {
    Tab: (cm) => { if (cm.somethingSelected()) cm.indentSelection("add"); else cm.replaceSelection("    ", "end"); },
    "Shift-Tab": (cm) => cm.indentSelection("subtract"),
  };
  Object.assign(keys, extraKeys || {});
  return CodeMirror.fromTextArea(ta, {
    mode: "python",
    theme: "material-darker",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    extraKeys: keys,
  });
}

/* ---------- 通用：可运行代码块 ---------- */
function codeBlockHTML(code) {
  return `<div class="runcode" data-code="${encodeURIComponent(code)}">
    <pre></pre>
    <button class="run-btn">▶ 运行</button>
    <button class="step-btn">逐条运行</button>
    <div class="output"></div>
  </div>`;
}

function bindRunners(root) {
  root.querySelectorAll(".runcode").forEach((box) => {
    const code = decodeURIComponent(box.dataset.code);
    const pre = box.querySelector("pre");
    pre.textContent = code;
    highlightInto(pre);
    const btn = box.querySelector(".run-btn");
    const stepBtn = box.querySelector(".step-btn");
    const out = box.querySelector(".output");

    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.textContent = "运行中…";
      out.className = "output show";
      out.textContent = "准备中…";
      const r = await PyRunner.run(code, (s) => { out.textContent = s; });
      out.textContent = (r.output ? r.output + "\n" : "") + (r.ok ? "" : r.error || "");
      out.classList.toggle("err", !r.ok);
      btn.disabled = false;
      btn.textContent = "▶ 运行";
    });

    /* 逐条运行：先清空会话，再按语句块逐条执行并显示 >>> 与输出，
     * 每条间隔 250ms 形成"单步"节奏；出错即停。 */
    stepBtn.addEventListener("click", async () => {
      btn.disabled = true;
      stepBtn.disabled = true;
      out.className = "output show";
      out.textContent = "准备中…";
      await PyRunner.ensure((s) => { out.textContent = s; });
      await PyRunner.clearSession();
      const stmts = PyRunner.splitStatements(code);
      out.textContent = "";
      for (const stmt of stmts) {
        out.textContent += ">>> " + stmt + "\n";
        const r = await PyRunner.runStmt(stmt);
        if (r.output) out.textContent += r.output + "\n";
        if (!r.ok) {
          out.textContent += r.error + "\n";
          out.classList.add("err");
          break;
        }
        if (r.result) out.textContent += r.result + "\n";
        out.textContent += "\n";
        await new Promise((res) => setTimeout(res, 250));
      }
      btn.disabled = false;
      stepBtn.disabled = false;
    });
  });
}

/* ---------- 视图 1：首页 ---------- */
function viewHome() {
  const cards = COURSE.map((l) => {
    const total = l.sections.length;
    // 进度键与课程页一致：layer.id + "-" + sec.id（修复此前用 s.id 导致首页永远显示 0 的 bug）
    const doneSecs = l.sections.filter((s) => Progress.isSectionDone(l.id + "-" + s.id)).length;
    const pct = Math.round((doneSecs / total) * 100);
    const state = doneSecs === 0 ? ["", "未开始"] : doneSecs === total ? ["done", "已完成"] : ["doing", "进行中"];
    return `<div class="card layer-card">
      <div class="layer-head"><h3><a href="#/course/${l.id}">${l.title}</a></h3>
        <span class="mins">约 ${l.minutes} 分钟 · ${total} 节</span>
        <span class="pill ${state[0]}">${state[1]}</span></div>
      <p class="muted">${l.goal}</p>
      <div class="progress"><i style="width:${pct}%"></i></div>
      <div class="progress-meta"><span>${doneSecs} / ${total} 节</span><span>自测最好成绩 ${Progress.getQuizScore(l.id)}/${l.quiz.length}</span></div>
      <p><a class="go-btn" href="#/course/${l.id}">${doneSecs === 0 ? "开始学习 →" : doneSecs === total ? "复习一遍 →" : "继续学习 →"}</a></p>
    </div>`;
  }).join("");
  $app.innerHTML = `
    <div class="card hero">
      <h2>Python 新手学堂</h2>
      <p><b>面向中文初学者的 Python 3.8—3.14 学习与速查网站。</b>示例代码均经本地 Python 实际运行验证。</p>
      <p class="muted">课程严格对齐《Python 3 语法完全指南》第一遍路线（第 1—6、8 层），每个语法点分条讲解并附官方文档链接；代码在浏览器内真实运行（本地 Pyodide，支持逐条运行）。进度存本机浏览器，无需账号。</p>
    </div>
    <h2>学习路线（第一遍）</h2>
    ${cards}
    <div class="card muted">第二阶段（面向对象、推导式、装饰器等）：规划中，将在后续版本加入</div>
    ${projectsHTML()}`;
}

/* ---------- 视图 2：课程页 ---------- */
function viewCourse(id) {
  const layer = COURSE.find((l) => l.id === id) || COURSE[0];
  let html = `<h1>${layer.title}</h1>
    <p class="muted">目标：${layer.goal} ｜ 前置：${layer.prereq} ｜ 约 ${layer.minutes} 分钟</p>`;
  layer.sections.forEach((sec) => {
    const done = Progress.isSectionDone(layer.id + "-" + sec.id);
    html += `<div class="card">
      <h3>§${sec.id} ${sec.title} ${done ? '<span class="sec-check">✅</span>' : ""}</h3>
      <p class="muted">${sec.ver ? `适用版本：${sec.ver} ｜ ` : ""}<a href="${sec.doc}" target="_blank" rel="noopener">官方文档 ↗</a> ｜ 对应指南 §${sec.id}</p>
      ${(sec.what || sec.use) ? `<div class="use-box">${sec.what ? `<p>📘 <b>是什么：</b>${sec.what}</p>` : ""}${sec.use ? `<p>💡 <b>什么时候用：</b>${sec.use}</p>` : ""}</div>` : ""}
      <ul>${sec.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      ${codeBlockHTML(sec.code)}
      ${sec.expect ? `<p class="muted">预期输出：</p><pre class="expect"></pre>` : ""}
      ${sec.note ? `<p class="muted">${sec.note}</p>` : ""}
      <button class="sec-done-btn${done ? " done" : ""}" data-sec="${layer.id}-${sec.id}">${done ? "✅ 已学会（点击撤销）" : "我学会了"}</button>
    </div>`;
  });
  html += `<div class="card"><h3>本章自测（答对 ≥2 题算通过）</h3><div id="quiz"></div></div>
    <p><a href="#/exercises">→ 去「习题」做本章配套练习</a></p>`;
  if (layer.id === COURSE[COURSE.length - 1].id) {
    html += `<p>🎓 这是第一遍路线的最后一章。全部学完后，<a href="#/">回首页做「项目实战」收尾</a>。</p>`;
  }
  $app.innerHTML = html;
  bindRunners($app);

  // 预期输出用 textContent 填入（避免 HTML 转义问题）
  const pres = $app.querySelectorAll("pre.expect");
  let ei = 0;
  layer.sections.forEach((sec) => {
    if (sec.expect && pres[ei]) {
      pres[ei].textContent = sec.expect;
      ei++;
    }
  });

  $app.querySelectorAll(".sec-done-btn").forEach((b) =>
    b.addEventListener("click", () => {
      const nowDone = Progress.toggleSection(b.dataset.sec);
      // 就地更新，不整页重渲染：保留滚动位置与代码编辑器里改过的内容，点击立刻有反馈
      b.classList.toggle("done", nowDone);
      b.textContent = nowDone ? "✅ 已学会（点击撤销）" : "我学会了";
      const h3 = b.closest(".card").querySelector("h3");
      const check = h3.querySelector(".sec-check");
      if (nowDone && !check) h3.insertAdjacentHTML("beforeend", ' <span class="sec-check">✅</span>');
      else if (!nowDone && check) check.remove();
    })
  );
  renderQuiz(layer);
}

/* 章末自测：点选项即判对错，全部答完记最好成绩 */
function renderQuiz(layer) {
  const box = document.getElementById("quiz");
  box.innerHTML = layer.quiz.map((q, qi) => `
    <div class="quiz-q" data-qi="${qi}">
      <p><b>${qi + 1}. ${q.q}</b></p>
      ${q.options.map((op, oi) => `<button class="option" data-oi="${oi}">${op}</button>`).join("")}
      <p class="q-explain">${q.explain}</p>
    </div>`).join("") + `<p id="quiz-result" class="muted"></p>`;

  const answered = new Set();
  let score = 0;
  box.querySelectorAll(".quiz-q").forEach((qEl) => {
    const q = layer.quiz[+qEl.dataset.qi];
    qEl.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        qEl.querySelectorAll(".option").forEach((b) => {
          b.disabled = true;
          if (+b.dataset.oi === q.answer) b.classList.add("correct");
        });
        if (+btn.dataset.oi === q.answer) score++;
        else btn.classList.add("wrong");
        qEl.querySelector(".q-explain").classList.add("show");
        answered.add(+qEl.dataset.qi);
        if (answered.size === layer.quiz.length) {
          Progress.setQuizScore(layer.id, score);
          document.getElementById("quiz-result").textContent =
            `得分 ${score}/${layer.quiz.length}` + (score >= 2 ? "，本章通过 ✅" : "，建议复习后重试");
        }
      });
    });
  });
}

/* ---------- 视图 3：习题列表（按课程分层分组） ---------- */
function viewExercises() {
  const stateMap = { todo: ["未做", "badge"], passed: ["已通过", "badge ok"], failed: ["待订正", "badge err"] };
  const groups = [];
  EXERCISES.forEach((ex) => {
    let g = groups.find((x) => x.layerId === ex.layer);
    if (!g) {
      const layer = COURSE.find((l) => l.id === ex.layer);
      g = { layerId: ex.layer, title: layer ? layer.title : `第 ${ex.layer} 层`, items: [] };
      groups.push(g);
    }
    g.items.push(ex);
  });
  $app.innerHTML = `<h1>分层习题</h1>
    <p class="muted">★ 入门 / ★★ 基础 / ★★★ 进阶，共 ${EXERCISES.length} 题，覆盖第 1—6、8 层。判题在你浏览器里真实执行 Python 完成；部分题目改编自 zhiwehu/Python-programming-exercises 与 TheAlgorithms/Python。</p>` +
    groups.map((g) => {
      const done = g.items.filter((ex) => Progress.exerciseState(ex.id) === "passed").length;
      return `<h2 class="cs-group">${g.title}（已通过 ${done}/${g.items.length}）</h2>` +
        g.items.map((ex) => {
          const st = Progress.exerciseState(ex.id);
          const [txt, cls] = stateMap[st];
          return `<div class="card">
      <h3><a href="#/exercise/${ex.id}">${ex.title}</a>
        <span class="stars">${"★".repeat(ex.diff)}${"☆".repeat(3 - ex.diff)}</span></h3>
      <p class="muted">${ex.brief}</p>
      <p><span class="${cls}">${txt}</span> <span class="badge">${ex.point}</span>
        <a class="go-btn" href="#/exercise/${ex.id}">${st === "passed" ? "再做一遍 →" : "开始做题 →"}</a></p>
    </div>`;
        }).join("");
    }).join("");
}

/* ---------- 视图 4：做题页 ---------- */
function viewExercise(id) {
  const ex = EXERCISES.find((e) => e.id === id) || EXERCISES[0];
  $app.innerHTML = `
    <h1>${ex.title} <span class="stars">${"★".repeat(ex.diff)}</span></h1>
    <p>${ex.brief}</p>
    <p class="muted">知识点：${ex.point} ｜ <a href="#/exercises">← 返回习题列表</a></p>
    <textarea id="editor" class="editor"></textarea>
    <p>
      <button id="judge-btn">▶ 运行判题</button>
      <button id="hint-btn">💡 提示（<span id="hint-no">0</span>/${ex.hints.length}）</button>
      <button id="sol-btn">查看解析</button>
    </p>
    <div id="judge-out"></div>
    <div id="hints"></div>
    <div id="solution" style="display:none" class="solution-box">
      <b>参考实现：</b><pre id="sol-code"></pre>
      <b>${ex.wrongTitle}</b><p>${ex.wrongWhy}</p>
    </div>`;

  const editor = document.getElementById("editor");
  editor.value = ex.starter;
  // VS Code 式语法高亮编辑器（CDN 不可用时退回纯文本框）
  const cm = makeEditor(editor);
  const getCode = () => (cm ? cm.getValue() : editor.value);
  const solPre = document.getElementById("sol-code");
  solPre.textContent = ex.solution;
  highlightInto(solPre);

  let hintNo = 0;
  document.getElementById("hint-btn").addEventListener("click", () => {
    if (hintNo >= ex.hints.length) return;
    const div = document.createElement("div");
    div.className = "hint-box";
    div.textContent = `提示 ${hintNo + 1}：${ex.hints[hintNo]}`;
    document.getElementById("hints").appendChild(div);
    hintNo++;
    document.getElementById("hint-no").textContent = hintNo;
  });
  document.getElementById("sol-btn").addEventListener("click", () => {
    const s = document.getElementById("solution");
    s.style.display = s.style.display === "none" ? "block" : "none";
  });

  document.getElementById("judge-btn").addEventListener("click", async (e) => {
    const btn = e.target;
    const out = document.getElementById("judge-out");
    btn.disabled = true;
    btn.textContent = "判题中…";
    out.innerHTML = `<div class="banner">正在运行你的代码…</div>`;
    const r = await PyRunner.judge(getCode(), ex.tests, (s) => {
      out.innerHTML = `<div class="banner">${s}</div>`;
    });
    btn.disabled = false;
    btn.textContent = "▶ 运行判题";
    if (!r.ok) {
      Progress.markExercise(ex.id, false);
      out.innerHTML = `<div class="banner err">代码运行出错：\n${r.error}</div>`;
      return;
    }
    const allPass = r.results.every((x) => x.pass);
    Progress.markExercise(ex.id, allPass);
    const lis = r.results.map((x) =>
      `<li class="${x.pass ? "pass" : "fail"}">${x.pass ? "✓" : "✗"} ${x.name}${x.msg ? " — " + x.msg : ""}</li>`
    ).join("");
    out.innerHTML =
      `<ul class="case-list">${lis}</ul>` +
      (allPass
        ? `<div class="banner ok">全部用例通过 🎉 已记录进度（错题本自动移除）</div>`
        : `<div class="banner err">还有用例未通过，已加入「错题本」（在"我的进度"里可找到）</div>`);
  });
}

/* ---------- 视图 5：在线运行场（分条控制台） ---------- */
function viewPlayground() {
  $app.innerHTML = `
    <h1>在线运行场（分条模式）</h1>
    <p class="muted">像 Python 控制台一样：<b>每次运行一条</b>，变量会记住，表达式自动回显；「清空会话」可重来。input()、文件读写、第三方库请在本地环境使用。</p>
    <div id="repl-history" class="card" style="min-height:60px"><span class="muted">还没有运行记录，在下面输入第一条吧。</span></div>
    <textarea id="pg-editor" class="editor" style="min-height:90px"></textarea>
    <p>
      <button id="pg-run">▶ 运行本条（Ctrl+Enter）</button>
      <button id="pg-clear">清空会话</button>
    </p>`;
  const ed = document.getElementById("pg-editor");
  const hist = document.getElementById("repl-history");
  ed.value = String.raw`x = 10`;
  // 高亮编辑器；Ctrl/Cmd+Enter 运行本条（CDN 不可用时退回纯文本框 + 手动快捷键）
  const cm = makeEditor(ed, { "Ctrl-Enter": () => runOne(), "Cmd-Enter": () => runOne() });
  const getCode = () => (cm ? cm.getValue() : ed.value);
  const clearCode = () => { if (cm) { cm.setValue(""); cm.focus(); } else { ed.value = ""; ed.focus(); } };
  if (!cm) {
    ed.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runOne();
      }
    });
  }

  let running = false;
  async function runOne() {
    const code = getCode().trimEnd();
    if (!code.trim() || running) return;
    running = true;
    if (hist.firstElementChild && hist.firstElementChild.tagName === "SPAN") hist.innerHTML = "";
    const entry = document.createElement("div");
    entry.innerHTML = `<pre class="repl-in"></pre><div class="output show"></div>`;
    entry.querySelector(".repl-in").textContent = ">>> " + code;
    hist.appendChild(entry);
    const outBox = entry.querySelector(".output");
    outBox.textContent = "运行中…";
    const r = await PyRunner.runStmt(code, (s) => { outBox.textContent = s; });
    outBox.textContent =
      (r.output ? r.output + "\n" : "") + (r.ok ? r.result || "" : r.error || "");
    outBox.classList.toggle("err", !r.ok);
    clearCode();
    running = false;
  }

  document.getElementById("pg-run").addEventListener("click", runOne);
  document.getElementById("pg-clear").addEventListener("click", async () => {
    await PyRunner.clearSession();
    hist.innerHTML = '<span class="muted">会话已清空，变量全部重置。</span>';
  });
}

/* ---------- 视图 6：报错博物馆（按课程分层分组，覆盖每一节） ---------- */
function viewErrors() {
  const groups = [];
  ERRORS.forEach((er) => {
    const layerId = er.sec.split(".")[0];
    let g = groups.find((x) => x.layerId === layerId);
    if (!g) {
      const layer = COURSE.find((l) => String(l.id) === layerId);
      g = { layerId, title: layer ? layer.title : "其他", items: [] };
      groups.push(g);
    }
    g.items.push(er);
  });
  $app.innerHTML = `<h1>报错博物馆</h1>
    <p class="muted">看 traceback 猜原因，点击选项立即揭晓。覆盖课程每一节（第 1—6、8 层），共 ${ERRORS.length} 条。</p>` +
    groups.map((g) => {
      const done = g.items.filter((er) => Progress.isErrorDone(er.id)).length;
      return `<h2 class="cs-group">${g.title}（${done}/${g.items.length}）</h2>` +
        g.items.map((er) => `
    <div class="card" data-eid="${er.id}">
      <h3><span class="badge">§${er.sec}</span> ${er.title} ${Progress.isErrorDone(er.id) ? "✅" : ""}</h3>
      <pre></pre>
      ${er.options.map((op, oi) => `<button class="option" data-oi="${oi}">${op}</button>`).join("")}
      <div class="q-explain">
        <p>${er.explain}</p><b>正确写法：</b><pre class="fix"></pre>
      </div>
    </div>`).join("");
    }).join("");

  $app.querySelectorAll(".card[data-eid]").forEach((card) => {
    const er = ERRORS.find((x) => x.id === +card.dataset.eid);
    card.querySelector("pre").textContent = er.traceback;
    card.querySelector(".fix").textContent = er.fix;
    card.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        card.querySelectorAll(".option").forEach((b) => {
          b.disabled = true;
          if (+b.dataset.oi === er.answer) b.classList.add("correct");
        });
        if (+btn.dataset.oi === er.answer) {
          Progress.markError(er.id);
          card.querySelector("h3").innerHTML += " ✅";
        } else {
          btn.classList.add("wrong");
        }
        card.querySelector(".q-explain").classList.add("show");
      });
    });
  });
}

/* ---------- 项目实战：个人学习的最后一个环节（嵌在首页学习路线末尾） ---------- */
function projectsHTML() {
  return `<h2>最后一步：项目实战</h2>
    <p class="muted">六个递进项目，给第一遍学习收尾（对应指南第 20 层应用板块）。第三方库选型按四要素：<b>适用场景 / 入门门槛 / 维护状态 / 官方文档</b>（不以下载量为依据，2026-09 核对）。</p>` +
    PROJECTS.map((p) => `
    <div class="card">
      <h3>${p.id}. ${p.title}</h3>
      <p>${p.brief}</p>
      <ul class="muted">
        <li>适用场景：${p.scene}</li>
        <li>入门门槛：${p.level}</li>
        <li>维护状态：${p.maintenance}</li>
        <li>官方文档：<a href="${p.doc}" target="_blank" rel="noopener">${p.doc}</a></li>
      </ul>
      <span class="badge">${p.unlock}</span> <span class="badge">涉及：${p.skills}</span>
    </div>`).join("");
}

/* ---------- 视图 8：我的进度 ---------- */
function viewMe() {
  const s = Progress.stats();
  const totalSecs = COURSE.reduce((n, l) => n + l.sections.length, 0);
  const wrong = Progress.wrongList();
  const wrongHtml = wrong.length
    ? wrong.map((id) => {
        const ex = EXERCISES.find((e) => e.id === id);
        return ex ? `<li><a href="#/exercise/${id}">${ex.title}</a> <button class="rm-wrong" data-id="${id}">移出</button></li>` : "";
      }).join("")
    : "<li class='muted'>错题本是空的，继续保持 🎉</li>";
  $app.innerHTML = `
    <h1>我的进度</h1>
    <div class="card">
      <p>课程小节完成：<b>${s.sections}</b> / ${totalSecs}</p>
      <p>习题通过：<b>${s.exPassed}</b> / ${EXERCISES.length}</p>
      <p>报错博物馆答对：<b>${s.errors}</b> / ${ERRORS.length}</p>
      <p>待订正错题：<b>${s.wrong}</b></p>
    </div>
    <div class="card"><h3>错题本</h3><ul>${wrongHtml}</ul></div>
    <p><button id="reset-btn">清空全部进度</button></p>`;
  $app.querySelectorAll(".rm-wrong").forEach((b) =>
    b.addEventListener("click", () => { Progress.removeWrong(+b.dataset.id); viewMe(); })
  );
  document.getElementById("reset-btn").addEventListener("click", () => Progress.reset());
}

/* ---------- 视图 9：速查目录（速查版首页，21 层折叠分组：先看大层，点击展开小层） ---------- */
function viewCheatsheet() {
  const groupHTML = (g, note) => `
    <details class="cs-group" data-useropen="0">
      <summary><span class="cs-stage">${g.stage}</span><span class="cs-layer">${g.layer}</span><span class="cs-count">${g.topics.length} 条</span><span class="cs-caret">›</span></summary>
      ${note || ""}
      <div class="grid grid-2">` +
      g.topics.map((t) => `
        <div class="card topic-card" data-tid="${t.id}">
          <h3><a href="#/cheatsheet/${t.id}">${t.title}</a></h3>
          <p class="muted">${t.desc}</p>
          <p><a class="go-btn" href="#/cheatsheet/${t.id}">查看 →</a></p>
        </div>`).join("") + `</div>
    </details>`;
  let html = `
    <h1>知识速查</h1>
    <p class="muted">核心语法 ${CHEATSHEET.length} 条，1:1 覆盖指南第 1—20 层全部小节与附录（【一】第一遍 【二】第二阶段 【三】进阶 【附】附录）｜ 第三方库 ${LIB_LAYER.topics.length} 条单独维护，见本页末节。点击大层展开小层。</p>
    <p><input id="cs-filter" class="filter-input" placeholder="全文检索：标题 / 正文 / 代码逐字命中，空格分隔多词（如：字典 切片）…"></p>`;
  CHEATSHEET_GROUPS.forEach((g) => { html += groupHTML(g); });
  html += groupHTML(LIB_LAYER, `<p class="muted cs-note">库生态变化快，本节与核心语法分开核对：最后核对 ${LIB_META.checked} ｜ 选库按四要素——适用场景 / 入门门槛 / 维护状态 / 官方文档，不以下载量为依据 ｜ <a href="${LIB_META.doc}" target="_blank" rel="noopener">PyPI ↗</a></p>`);
  $app.innerHTML = html;
  const groups = Array.from($app.querySelectorAll("details.cs-group"));
  // 全文检索索引：层名 + 标题 + 摘要 + 正文（去 HTML 标签）+ 示例代码，逐字可命中
  const stripTags = (s) => (s || "").replace(/<[^>]*>/g, " ");
  const searchIndex = new Map();
  CHEATSHEET_GROUPS.concat([LIB_LAYER]).forEach((g) =>
    g.topics.forEach((t) => searchIndex.set(t.id,
      (g.layer + " " + t.title + " " + t.desc + " " + stripTags(t.html) + " " + (t.code || "")).toLowerCase())));
  let filtering = false;
  groups.forEach((d) => d.addEventListener("toggle", () => {
    if (!filtering) d.dataset.useropen = d.open ? "1" : "0";
  }));
  document.getElementById("cs-filter").addEventListener("input", (e) => {
    const kw = e.target.value.trim().toLowerCase();
    const kws = kw.split(/\s+/).filter(Boolean);             // 空格分隔多词，AND 匹配
    if (kw && !filtering) { filtering = true; groups.forEach((d) => (d.open = true)); }          // 筛选时自动展开全部大层
    if (!kw && filtering) { filtering = false; groups.forEach((d) => (d.open = d.dataset.useropen === "1")); } // 清空后恢复手动开合状态
    groups.forEach((d) => {
      let visible = 0;
      const cards = d.querySelectorAll(".topic-card");
      cards.forEach((c) => {
        const text = searchIndex.get(c.dataset.tid) || "";
        const show = kws.length === 0 || kws.every((k) => text.includes(k));
        c.style.display = show ? "" : "none";
        if (show) visible++;
      });
      const countEl = d.querySelector(".cs-count");
      if (countEl) countEl.textContent = kw ? `${visible}/${cards.length} 条` : `${cards.length} 条`;
      d.style.display = !kw || visible > 0 ? "" : "none";   // 无命中的大层整组隐藏
    });
  });
}

/* ---------- 视图 10：速查主题详情 ---------- */
function viewCheatTopic(id) {
  const t = CHEATSHEET_ALL.find((x) => x.id === id) || CHEATSHEET_ALL[0];
  const idx = CHEATSHEET_ALL.indexOf(t);
  const prev = CHEATSHEET_ALL[idx - 1];
  const next = CHEATSHEET_ALL[idx + 1];
  $app.innerHTML = `
    <h1>${t.title}</h1>
    <p class="muted"><a href="#/cheatsheet">← 返回速查目录</a>${t.doc ? ` ｜ <a href="${t.doc}" target="_blank" rel="noopener">官方文档 ↗</a>` : ""}</p>
    <div class="card">${t.html}</div>
    ${t.code ? `<div class="card"><h3>示例（可运行 / 逐条运行）</h3>${codeBlockHTML(t.code)}</div>` : ""}
    <p>
      ${prev ? `<a href="#/cheatsheet/${prev.id}">← ${prev.title}</a>` : ""}
      ${next ? `<a style="float:right" href="#/cheatsheet/${next.id}">${next.title} →</a>` : ""}
    </p>`;
  bindRunners($app);
}

/* ---------- 视图 10：问答（本地检索 + 可选大模型） ---------- */
function qaEntryHtml(h) {
  const e = h.entry;
  if (e.kind === "cheat") {
    return `<h3>📖 ${e.title} <span class="muted">· 速查专题</span></h3>
      <div class="qa-body">${e.html}</div>
      ${e.code ? codeBlockHTML(e.code) : ""}
      <p><a class="go-btn" href="${e.url}">打开专题 →</a></p>`;
  }
  return `<h3>📗 ${e.title} <span class="muted">· ${e.desc}</span></h3>
    <ul>${e.points.map((p) => `<li>${p}</li>`).join("")}</ul>
    ${e.code ? codeBlockHTML(e.code) : ""}
    <p><a class="go-btn" href="${e.url}">打开课程 →</a></p>`;
}

function qaLocalAnswer(q) {
  const hits = QA.retrieve(q, 3);
  if (!hits.length || hits[0].score < QA.MAYBE) {
    return `<p>🤔 这个问题里我没识别出 Python 相关的知识点——我只回答 Python 学习问题。试试这样问：</p>
      <ul><li>「round(2.5) 为什么是 2」</li><li>「is 和 == 有什么区别」</li><li>「怎么读取文件」</li><li>「什么是装饰器」</li></ul>`;
  }
  const unsure = hits[0].score < QA.CONFIDENT ? `<p class="muted">我不太确定，最相关的是这些：</p>` : "";
  const more = hits.slice(1).filter((h) => h.score >= QA.MAYBE)
    .map((h) => `<a href="${h.entry.url}">${h.entry.title}</a>`).join(" ｜ ");
  return unsure + qaEntryHtml(hits[0]) + (more ? `<p class="muted">相关推荐：${more}</p>` : "");
}

function viewQA() {
  const s = QA.llmSettings();
  const esc1 = (v) => String(v || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const aiOn = s.enabled && s.key;
  $app.innerHTML = `
    <h1>💬 学习问答</h1>
    <p class="muted">知识库 = 本站 105 个速查专题 + 93 个课程小节（源自《Python 语法完全指南》）。
      当前模式：${aiOn ? "<b>🤖 大模型增强</b>（检索站内资料作上下文）" : "<b>⚡ 本地检索</b>（离线可用）"}
      ｜ <a href="javascript:void 0" id="qa-toggle-settings">⚙️ 接入大模型</a></p>
    <div class="card qa-settings" id="qa-settings" style="display:none">
      <h3>⚙️ 接入大模型（可选）</h3>
      <p class="muted">填入任意 <b>OpenAI 兼容接口</b>即可升级为 AI 回答：检索到的站内资料会作为上下文一起发给模型（RAG）。
        密钥只保存在你自己浏览器的 localStorage，请求由浏览器直连服务商，本站没有服务器中转。
        服务商需允许浏览器跨域调用；调用失败会自动回退本地回答。</p>
      <p><label>接口地址 <input id="qa-set-base" type="text" value="${esc1(s.base)}" style="width:58%"></label></p>
      <p><label>模型　　<input id="qa-set-model" type="text" value="${esc1(s.model)}"></label></p>
      <p><label>API Key <input id="qa-set-key" type="password" value="${esc1(s.key)}" style="width:58%"></label></p>
      <p><label><input id="qa-set-enabled" type="checkbox" ${s.enabled ? "checked" : ""}> 启用大模型增强</label>
        　<button id="qa-set-save" class="run-btn">保存</button> <span id="qa-set-msg" class="muted"></span></p>
    </div>
    <div class="qa-log" id="qa-log"></div>
    <div class="qa-chips">
      ${["round(2.5) 为什么是 2？", "is 和 == 有什么区别？", "列表和元组的区别", "怎么读取文件？", "什么是装饰器？", "怎么安装第三方库？"].map((c) => `<button class="qa-chip">${c}</button>`).join("")}
    </div>
    <div class="qa-input-row">
      <input id="qa-input" type="text" placeholder="输入 Python 问题，回车发送…" autocomplete="off">
      <button id="qa-send" class="run-btn">发送</button>
    </div>`;

  const log = $app.querySelector("#qa-log");
  const input = $app.querySelector("#qa-input");
  const pushMsg = (role, html) => {
    log.insertAdjacentHTML("beforeend",
      role === "user" ? `<div class="qa-msg user"><span class="qa-bubble">${html}</span></div>` : `<div class="qa-msg ai">${html}</div>`);
    if (role === "ai") bindRunners(log.lastElementChild);
    log.lastElementChild.scrollIntoView({ block: "nearest" });
  };
  const send = async (qRaw) => {
    const q = (qRaw || "").trim();
    if (!q) return;
    input.value = "";
    pushMsg("user", esc1(q));
    const cur = QA.llmSettings();
    const hits = QA.retrieve(q, 3);
    if (cur.enabled && cur.key) {
      pushMsg("ai", `<span class="muted">🤖 思考中…</span>`);
      const thinking = log.lastElementChild;
      try {
        const text = await QA.askLLM(q, hits);
        const src = hits.filter((h) => h.score >= QA.MAYBE)
          .map((h) => `<a href="${h.entry.url}">${h.entry.title}</a>`).join(" ｜ ");
        thinking.innerHTML = QA.renderMd(text) + (src ? `<p class="muted">📚 依据资料：${src}</p>` : "");
      } catch (e) {
        thinking.innerHTML = `<p class="muted">⚠️ 大模型调用失败（${esc1(e && e.message || e)}），已回退本地回答：</p>` + qaLocalAnswer(q);
      }
      bindRunners(thinking);
    } else {
      pushMsg("ai", qaLocalAnswer(q));
    }
  };
  $app.querySelector("#qa-send").addEventListener("click", () => send(input.value));
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(input.value); });
  $app.querySelectorAll(".qa-chip").forEach((b) => b.addEventListener("click", () => send(b.textContent)));
  $app.querySelector("#qa-toggle-settings").addEventListener("click", () => {
    const p = $app.querySelector("#qa-settings");
    p.style.display = p.style.display === "none" ? "" : "none";
  });
  $app.querySelector("#qa-set-save").addEventListener("click", () => {
    QA.saveLlm({
      enabled: $app.querySelector("#qa-set-enabled").checked,
      base: $app.querySelector("#qa-set-base").value.trim() || "https://api.openai.com/v1",
      model: $app.querySelector("#qa-set-model").value.trim() || "gpt-4o-mini",
      key: $app.querySelector("#qa-set-key").value.trim(),
    });
    viewQA();
  });
  input.focus();
}

/* ---------- 路由 ---------- */
function render() {
  renderModeSwitch();
  const parts = (location.hash || "#/").split("/");
  const page = parts[1] || "";
  const arg = parts[2];
  window.scrollTo(0, 0);
  const mode = Mode.get();
  document.querySelectorAll(".nav-link").forEach((a) => {
    const dm = a.dataset.mode || "all";
    a.style.display = dm === "all" || dm === mode ? "" : "none";
    a.classList.toggle(
      "active",
      a.dataset.page === (page || (mode === "cheat" ? "cheatsheet" : "home"))
    );
  });
  if (page === "course") viewCourse(+(arg || 1));
  else if (page === "exercises") viewExercises();
  else if (page === "exercise") viewExercise(+(arg || 1));
  else if (page === "playground") viewPlayground();
  else if (page === "errors") viewErrors();
  else if (page === "me") viewMe();
  else if (page === "qa") viewQA();
  else if (page === "cheatsheet") { if (arg) viewCheatTopic(arg); else viewCheatsheet(); }
  else if (mode === "cheat") viewCheatsheet();
  else viewHome();
  $app.insertAdjacentHTML("beforeend", metaFooterHTML());
}
window.addEventListener("hashchange", render);
render();

/* Python 环境预热：页面打开后利用浏览器空闲时间后台加载 Pyodide，首次点「运行」基本零等待 */
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => PyRunner.ensure().catch(() => {}), { timeout: 5000 });
} else {
  setTimeout(() => PyRunner.ensure().catch(() => {}), 2000);
}

/* Pyodide 运行时持久缓存：仅在线（http/https）访问时注册 Service Worker，file:// 本地打开自动跳过 */
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
