/* ===== 速查版内容组装器（核心语法） =====
 * 组成 = CHEATSHEET_ADV 注册表：cheat-01.js … cheat-20.js + cheat-90.js（附录）逐层 push，
 * 每个 topic 1:1 对齐《Python 3 语法完全指南》小节，承载完整细节（v1.6 起不再由课程数据转换）。
 * stage 标签与指南目录一致：【一】第一遍 【二】第二阶段 【三】进阶 【附】附录。
 * 第三方库（第 21 层）单独维护于 data-libraries.js，经 CHEATSHEET_ALL 并入详情页索引。
 * 适用版本 3.8—3.14 ｜ 最后核对 2026-10 ｜ 语言规则以 Python 官方文档为准。
 */
const CHEATSHEET_GROUPS = CHEATSHEET_ADV.slice().sort((a, b) => a.layerId - b.layerId);

/* 扁平化索引：供详情页按 id 查找 */
const CHEATSHEET = CHEATSHEET_GROUPS.flatMap((g) => g.topics);

/* 含第三方库的完整索引：库内容单独维护（data-libraries.js），仅此处并入供详情页查找 */
const CHEATSHEET_ALL = CHEATSHEET.concat(LIB_LAYER.topics);
