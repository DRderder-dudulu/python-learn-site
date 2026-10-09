/* ===== 问答引擎：以站内知识库（速查专题 + 课程小节，源自《Python 语法完全指南》）作答 =====
 * 两条路线：
 * 1) 本地检索问答（默认，离线可用）：CJK 二元组 + 英文标识符 + 口语别名表 打分，
 *    命中后直接展示站内权威解答与可运行示例；
 * 2) 可选大模型增强：用户自填 OpenAI 兼容接口（BYOK，密钥只存本机 localStorage），
 *    检索结果作为上下文（RAG）直发服务商，本站无任何服务器中转。
 * 对外 API：QA.retrieve(q) / QA.llmSettings() / QA.saveLlm(s) / QA.askLLM(q, hits) / QA.renderMd(md)
 */
const QA = (() => {
  const LLM_KEY = "pyxst.qa.llm";
  let INDEX = null;

  const stripTags = (s) => (s || "").replace(/<[^>]+>/g, " ");
  const norm = (s) => (s || "").toLowerCase();

  /* 口语/俗称 → 规范术语（命中即在查询里追加等价词，提升召回） */
  const ALIASES = [
    ["四舍五入", "round 取整 舍入"],
    ["round", "取整 舍入"],
    ["取整", "整除 floor round 舍入"],
    ["除法", "整除 取余"],
    ["求余", "取余 %"],
    ["小数", "float 浮点"],
    ["整数", "int"],
    ["文字", "字符串 str"],
    ["文本", "字符串 str"],
    ["列表", "list"],
    ["数组", "list 列表"],
    ["字典", "dict"],
    ["哈希", "dict 字典"],
    ["元组", "tuple"],
    ["集合", "set"],
    ["循环", "for while 迭代"],
    ["遍历", "for 迭代"],
    ["判断", "if 条件 分支"],
    ["如果", "if 条件"],
    ["报错", "异常 try except"],
    ["出错", "异常 try except"],
    ["错误", "异常 try except"],
    ["崩溃", "异常 try except"],
    ["函数", "def 函数"],
    ["方法", "def 函数"],
    ["对象", "class 面向对象"],
    ["类", "class 面向对象"],
    ["文件", "open 读写"],
    ["读写", "open 文件"],
    ["模块", "import 模块"],
    ["第三方库", "pip 安装 模块"],
    ["安装", "pip"],
    ["库", "import 模块 标准库"],
    ["包", "import 模块"],
    ["装饰器", "@ 装饰器"],
    ["生成器", "yield 生成器"],
    ["迭代器", "迭代 __next__"],
    ["推导式", "推导"],
    ["切片", "切片"],
    ["排序", "sorted sort"],
    ["拼接", "连接 join +"],
    ["合并", "连接 join"],
    ["格式化", "f-string format"],
    ["占位", "f-string format"],
    ["输入", "input"],
    ["打印", "print"],
    ["输出", "print"],
    ["虚拟环境", "venv"],
    ["异步", "async await"],
    ["协程", "async await"],
    ["并发", "async 线程"],
    ["线程", "threading"],
    ["类型标注", "注解 类型"],
    ["类型提示", "注解 类型"],
    ["下划线", "命名 私有"],
    ["私有", "命名 __"],
    ["继承", "继承 super"],
    ["多态", "继承 覆盖"],
    ["作用域", "global nonlocal 作用域"],
    ["全局变量", "global 作用域"],
    ["正则", "re 正则"],
    ["日期", "datetime 时间"],
    ["时间", "datetime 日期"],
    ["json", "json 序列化"],
    ["序列化", "json pickle"],
    ["随机", "random"],
    ["路径", "pathlib 路径"],
    ["环境变量", "os 环境"],
    ["命令行", "sys.argv 命令行"],
    ["参数", "参数 *args **kwargs"],
    ["默认值", "默认 参数"],
    ["可变", "可变 不可变"],
    ["拷贝", "copy 深拷贝 浅拷贝"],
    ["深拷贝", "copy deepcopy"],
    ["浅拷贝", "copy 浅拷贝"],
    ["去重", "set 去重"],
    ["反转", "reversed 切片"],
    ["枚举", "enumerate"],
    ["打包", "zip"],
    ["解包", "解包 *"],
  ];

  /* 疑问短语与停用字：提问语气词没有区分度，分词前剔除 */
  const STOP_PHRASE = /(为什么|怎么回事|怎么办|怎么|怎样|如何|是什么|什么是|什么|有啥|有没有|能不能|是不是|可不可以|的区别|区别|的意思|意思|用法|教程|示例|例子)/g;
  const STOP_CHARS = new Set([..."是么为怎如何吗呢吧啊呀的了和与及在有没不要想我你他她它们这那个种点下用做啥什"]);
  /* 运算符 → 语义词（运算符本身不会被英文分词捕获） */
  const OP_ALIASES = [
    ["==", "等于 相等 比较"],
    ["!=", "不等 比较"],
    ["//", "整除"],
    ["**", "幂 乘方"],
    ["->", "注解 返回"],
    [":=", "海象 赋值表达式"],
  ];

  /* 查询分词：英文/标识符整词 + CJK 单字(低权) + CJK 二元组(高权) + 长整段 + 别名/运算符扩展 */
  function tokenize(q) {
    const s = norm(q).replace(STOP_PHRASE, " ");
    const best = new Map(); // token -> 权重（取最大）
    const push = (t, w) => { if (t && (!best.has(t) || best.get(t) < w)) best.set(t, w); };
    (s.match(/[a-z_][a-z0-9_.-]*/g) || []).forEach((w) => push(w, 3));
    (s.match(/[0-9]+(?:\.[0-9]+)?/g) || []).forEach((w) => push(w, 1));
    (s.match(/[一-鿿]+/g) || []).forEach((run) => {
      for (const ch of run) { if (!STOP_CHARS.has(ch)) push(ch, 0.5); }
      for (let i = 0; i < run.length - 1; i++) {
        const bi = run.slice(i, i + 2);
        if (!STOP_CHARS.has(bi[0]) && !STOP_CHARS.has(bi[1])) push(bi, 2);
      }
      if (run.length >= 3 && ![...run].some((c) => STOP_CHARS.has(c))) push(run, 3);
    });
    ALIASES.forEach(([key, extra]) => {
      if (s.includes(key)) extra.split(" ").forEach((t) => push(t, 2));
    });
    OP_ALIASES.forEach(([op, extra]) => {
      if (q.includes(op)) extra.split(" ").forEach((t) => push(t, 2));
    });
    return [...best.entries()].map(([t, w]) => ({ t, w }));
  }

  function buildIndex() {
    const entries = [];
    CHEATSHEET_ALL.forEach((t) => {
      entries.push({
        kind: "cheat",
        id: t.id,
        title: t.title,
        url: "#/cheatsheet/" + t.id,
        desc: t.desc || "",
        body: stripTags(t.html),
        code: t.code || "",
        html: t.html || "",
        points: null,
        titleL: norm(t.title),
        descL: norm(t.desc || ""),
        bodyL: norm(stripTags(t.html)),
        codeL: norm(t.code || ""),
      });
    });
    COURSE.forEach((l) => {
      l.sections.forEach((sec) => {
        const pts = stripTags((sec.points || []).join(" "));
        entries.push({
          kind: "course",
          id: l.id + "-" + sec.id,
          title: "§" + sec.id + " " + sec.title,
          url: "#/course/" + l.id,
          desc: "课程 · " + l.title,
          body: (sec.use || "") + " " + pts + " " + (sec.note || ""),
          code: sec.code || "",
          html: "",
          points: sec.points || [],
          titleL: norm(sec.title + " " + l.title),
          descL: norm(l.title + " " + l.goal),
          bodyL: norm((sec.use || "") + " " + pts + " " + (sec.note || "")),
          codeL: norm(sec.code || ""),
        });
      });
    });
    return entries;
  }

  /* 拉丁/数字 token 用词边界匹配（防 raise 误中 is），CJK 用子串匹配 */
  const LAT_TOKEN = /^[a-z0-9_.-]+$/;
  const escRe = (t) => t.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
  function fieldHit(field, t) {
    if (!field) return false;
    if (LAT_TOKEN.test(t)) return new RegExp("(^|[^a-z0-9_.])" + escRe(t) + "($|[^a-z0-9_.])").test(field);
    return field.includes(t);
  }

  function scoreDoc(d, q, toks) {
    let s = 0;
    for (const { t, w } of toks) {
      if (fieldHit(d.titleL, t)) s += 10 * w;
      else if (fieldHit(d.descL, t)) s += 4 * w;
      else if (fieldHit(d.bodyL, t)) s += 2 * w;
      else if (fieldHit(d.codeL, t)) s += 2.5 * w;
    }
    const qq = norm(q).replace(STOP_PHRASE, "").replace(/[\s?？!！,，。.、~…"“”'‘’:：;；()（）【】[\]「」]/g, "");
    if (qq.length >= 4 && (d.titleL.includes(qq) || d.bodyL.includes(qq))) s += 8;
    return s;
  }

  /* 返回 [{entry, score}]，按分降序取前 k；调用方用阈值档判断把握 */
  function retrieve(q, k = 3) {
    if (!INDEX) INDEX = buildIndex();
    const toks = tokenize(q);
    return INDEX.map((d) => ({ entry: d, score: scoreDoc(d, q, toks) }))
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }

  /* 把握分档：>=14 有把握；8~14 可能相关；<8 视为没识别出 Python 相关知识点 */
  const CONFIDENT = 14;
  const MAYBE = 8;

  /* ---- 可选大模型（BYOK） ---- */
  function llmSettings() {
    try {
      const raw = localStorage.getItem(LLM_KEY);
      if (raw) return Object.assign({ enabled: false, base: "https://api.openai.com/v1", model: "gpt-4o-mini", key: "" }, JSON.parse(raw));
    } catch { /* 无存储环境 */ }
    return { enabled: false, base: "https://api.openai.com/v1", model: "gpt-4o-mini", key: "" };
  }
  function saveLlm(s) {
    try { localStorage.setItem(LLM_KEY, JSON.stringify(s)); } catch { /* 静默降级 */ }
  }

  async function askLLM(question, hits) {
    const s = llmSettings();
    const ctx = hits.map((h, i) =>
      `【资料${i + 1} · ${h.entry.kind === "cheat" ? "速查" : "课程"}】${h.entry.title}\n${h.entry.body.slice(0, 900)}` +
      (h.entry.code ? `\n示例代码：\n${h.entry.code.slice(0, 500)}` : "")
    ).join("\n\n");
    const sys = "你是 Python 新手助教，面向零基础学员。只用简体中文回答，语气温和、直接。" +
      "优先依据给定资料作答；资料未覆盖时可用可靠常识补充并注明「资料外补充」；" +
      "与 Python 无关的问题礼貌拒绝并引导回 Python。回答控制在 300 字以内，需要示例时给出简短 Python 代码块。";
    const res = await fetch(s.base.replace(/\/+$/, "") + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + s.key },
      body: JSON.stringify({
        model: s.model,
        temperature: 0.3,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: `站内资料：\n${ctx || "（未检索到相关资料）"}\n\n学员问题：${question}` },
        ],
      }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status + "：" + (await res.text()).slice(0, 200));
    const data = await res.json();
    const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!text) throw new Error("接口返回格式异常");
    return text;
  }

  /* 轻量 Markdown → HTML（先转义，再还原代码块/行内码/粗体/换行） */
  function renderMd(md) {
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return md.split(/```/).map((p, i) => {
      if (i % 2 === 1) return "<pre>" + esc(p.replace(/^[a-zA-Z]*\r?\n/, "")) + "</pre>";
      return esc(p)
        .replace(/`([^`\n]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>")
        .replace(/\r?\n/g, "<br>");
    }).join("");
  }

  return { retrieve, tokenize, CONFIDENT, MAYBE, llmSettings, saveLlm, askLLM, renderMd };
})();
