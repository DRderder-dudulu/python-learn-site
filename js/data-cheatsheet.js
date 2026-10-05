/* ===== 速查版内容组装器（核心语法） =====
 * 组成 = 课程数据（第 1—6、8 层，单一数据源自动转换）+ 进阶数据 CHEATSHEET_ADV（第 7、9—20 层）。
 * 覆盖《Python 3 语法完全指南》核心语法 20 层；stage 标签与指南目录的【一】【二】【三】一致。
 * 第三方库（第 21 层）单独维护于 data-libraries.js，经 CHEATSHEET_ALL 并入详情页索引。
 * 适用版本 3.8—3.14 ｜ 最后核对 2026-09 ｜ 语言规则以 Python 官方文档为准。
 */
const CHEATSHEET_GROUPS = (() => {
  // 第一遍路线各层：由 COURSE 转换（讲解要点 + 可运行示例 + 官方文档链接）
  const base = COURSE.map((layer) => ({
    layer: layer.title,
    stage: "一",
    topics: layer.sections.map((sec) => ({
      id: `L${layer.id}s${sec.id.replace(".", "_")}`,
      title: `§${sec.id} ${sec.title}`,
      desc: `${layer.title}${sec.ver ? "｜适用版本 " + sec.ver : ""}`,
      doc: sec.doc,
      html: `<ul>${sec.points.map((p) => `<li>${p}</li>`).join("")}</ul>`,
      code: sec.code,
    })),
  }));
  return base.concat(CHEATSHEET_ADV);
})();

/* 扁平化索引：供详情页按 id 查找 */
const CHEATSHEET = CHEATSHEET_GROUPS.flatMap((g) => g.topics);

/* 含第三方库的完整索引：库内容单独维护（data-libraries.js），仅此处并入供详情页查找 */
const CHEATSHEET_ALL = CHEATSHEET.concat(LIB_LAYER.topics);
