/* ===== 速查版进阶内容注册表 =====
 * v1.6 起：速查内容按层拆分在 cheat-01.js … cheat-20.js 与 cheat-90.js（附录）中，
 * 各文件以 CHEATSHEET_ADV.push({ layerId, layer, stage, topics }) 逐层注册，
 * 由 data-cheatsheet.js 组装为 CHEATSHEET_GROUPS（按 layerId 排序）。
 * 每个 topic 1:1 对齐《Python 3 语法完全指南》小节，承载完整细节。
 * 适用版本 3.8—3.14 ｜ 最后核对 2026-10 ｜ 语言规则以 Python 官方文档为准。
 */
const CHEATSHEET_ADV = [];
