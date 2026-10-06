/* ===== 学习进度：localStorage 持久化（无需账号、无需后端） =====
 * 数据结构：
 * {
 *   sections: { "1-1": true },          // 已完成的课程小节
 *   quiz:     { "1": 3 },               // 每层测验最好成绩（答对题数）
 *   exercises:{ "3": "passed"|"failed" },// 习题状态
 *   errors:   { "2": true },            // 报错博物馆已答对
 *   wrong:    [3, 5],                   // 错题本（习题 id）
 *   projChecks: { "1": [0, 2] }         // 项目自测清单勾选
 * }
 */
const Progress = (() => {
  const KEY = "pyxst.progress.v1";
  const blank = () => ({ sections: {}, quiz: {}, exercises: {}, errors: {}, wrong: [], projChecks: {} });
  let cache = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign(blank(), JSON.parse(raw)) : blank();
    } catch {
      return blank();
    }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(cache));
    } catch {
      /* 存储被禁用或已满时静默降级：本次进度只保留在内存，不打断交互 */
    }
  }

  /* ---- 课程小节 ---- */
  function markSection(secId) { cache.sections[secId] = true; save(); }
  function toggleSection(secId) {
    if (cache.sections[secId]) delete cache.sections[secId];
    else cache.sections[secId] = true;
    save();
    return !!cache.sections[secId];
  }
  function isSectionDone(secId) { return !!cache.sections[secId]; }

  /* ---- 章节测验 ---- */
  function setQuizScore(layerId, score) {
    const k = String(layerId);
    if (!cache.quiz[k] || score > cache.quiz[k]) { cache.quiz[k] = score; save(); }
  }
  function getQuizScore(layerId) { return cache.quiz[String(layerId)] || 0; }

  /* ---- 习题 ---- */
  function markExercise(id, passed) {
    cache.exercises[String(id)] = passed ? "passed" : "failed";
    if (passed) {
      cache.wrong = cache.wrong.filter((x) => x !== id);   // 通过后移出错题本
    } else if (!cache.wrong.includes(id)) {
      cache.wrong.push(id);                                // 失败自动进错题本
    }
    save();
  }
  function exerciseState(id) { return cache.exercises[String(id)] || "todo"; }
  function wrongList() { return cache.wrong.slice(); }
  function removeWrong(id) { cache.wrong = cache.wrong.filter((x) => x !== id); save(); }

  /* ---- 报错博物馆 ---- */
  function markError(id) { cache.errors[String(id)] = true; save(); }
  function isErrorDone(id) { return !!cache.errors[String(id)]; }

  /* ---- 项目清单勾选 ---- */
  function toggleProjCheck(pid, idx) {
    const k = String(pid);
    cache.projChecks[k] = cache.projChecks[k] || [];
    const i = cache.projChecks[k].indexOf(idx);
    if (i >= 0) cache.projChecks[k].splice(i, 1);
    else cache.projChecks[k].push(idx);
    save();
    return cache.projChecks[k].includes(idx);
  }
  function projChecks(pid) { return cache.projChecks[String(pid)] || []; }

  /* ---- 统计与重置 ---- */
  function stats() {
    return {
      sections: Object.keys(cache.sections).length,
      quizPassed: Object.values(cache.quiz).filter((s) => s > 0).length,
      exPassed: Object.values(cache.exercises).filter((s) => s === "passed").length,
      errors: Object.keys(cache.errors).length,
      wrong: cache.wrong.length,
    };
  }
  function reset() {
    if (confirm("确定清空所有学习进度吗？此操作不可恢复。")) {
      cache = blank();
      save();
      location.reload();
    }
  }

  return {
    markSection, toggleSection, isSectionDone, setQuizScore, getQuizScore,
    markExercise, exerciseState, wrongList, removeWrong,
    markError, isErrorDone, toggleProjCheck, projChecks,
    stats, reset,
  };
})();
