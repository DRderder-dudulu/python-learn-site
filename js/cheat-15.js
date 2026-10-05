/* ===== 速查·第十五层 · Python 3.8—3.14 新特性总览 =====
 * 内容来源：《Python 3 语法完全指南》第十五层（outputs/python-syntax-guide-v1.md）；
 * 本层指南无 ### 小节，整层合并为 1 个 topic（与旧速查一致）。
 * 版本门槛：被执行示例只用 3.10 及以前特性；3.11+/3.12+/3.13/3.14 演示一律注释展示、html 正文写全并标注版本。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 15,
  layer: "第十五层 · Python 3.8—3.14 新特性总览",
  stage: "二",
  topics: [
    {
      id: "15_1", title: "§15 各版本新特性速查", desc: "3.8 海象到 3.14 t-string，每个版本的重点一张表，⭐ 为日常高频",
      html: `<p>标注 ⭐ 的是日常编码最常接触到的。</p>
<table><tr><th>版本</th><th>重点（⭐ 日常高频）</th></tr>
<tr><td><b>3.8</b>（2019）</td><td>⭐ 海象 <code>:=</code>；仅限位置参数 <code>/</code>；⭐ f-string 调试符 <code>{x=}</code>；<code>functools.cached_property</code>；<code>math.comb/perm/isqrt</code></td></tr>
<tr><td><b>3.9</b>（2020）</td><td>⭐ 内置泛型 <code>list[int]</code>/<code>dict[str, int]</code>（注解不用再 import List/Dict）；⭐ 字典合并 <code>|</code>、<code>|=</code>；<code>str.removeprefix/removesuffix</code>；<code>zoneinfo</code> 时区库</td></tr>
<tr><td><b>3.10</b>（2021）</td><td>⭐ <code>match</code> 结构化模式匹配（见 2.4）；⭐ 联合类型 <code>int | str</code>；⭐ <code>zip(strict=True)</code>；带括号的多行 with；更精准的错误提示（指出具体哪行哪个字符）</td></tr>
<tr><td><b>3.11</b>（2022）</td><td>异常组 <code>ExceptionGroup</code> 与 <code>except*</code>；<code>tomllib</code>（标准库读 TOML）；<code>typing.Self</code>；⭐ <code>asyncio.TaskGroup</code>、<code>asyncio.timeout</code>；速度大幅提升（Faster CPython 项目，官方称平均快 10~60%）；traceback 精确标注出错表达式</td></tr>
<tr><td><b>3.12</b>（2023）</td><td>⭐ <code>type</code> 类型别名语句、泛型新语法 <code>class Box[T]:</code>/<code>def f[T](x: T)</code>（见 13.4）；⭐ f-string 大放宽：同引号复用、允许反斜杠、多行表达式可写注释；<code>typing.override</code>；每个解释器独立 GIL（PEP 684，C 层面）</td></tr>
<tr><td><b>3.13</b>（2024）</td><td>自由线程构建（PEP 703，实验性"无 GIL" CPython）；实验性 JIT（PEP 744）；⭐ 全新的交互式解释器（彩色提示、多行编辑）；<code>locals()</code> 语义规范化（PEP 667）；<code>copy.replace()</code>；类型参数默认值（PEP 696）；<code>warnings.deprecated()</code>（PEP 702）；<code>TypedDict</code> 支持 <code>ReadOnly</code>（PEP 705）；<code>TypeIs</code>（PEP 742）；<code>dbm.sqlite3</code> 后端；iOS/Android 成为官方支持平台</td></tr>
<tr><td><b>3.14</b>（2025）</td><td>⭐ 模板字符串 t-string（PEP 750，见下）；⭐ 注解延迟求值成为默认（PEP 649/749）+ 新模块 <code>annotationlib</code>（见 13.1）；<code>except</code> 可省略括号（PEP 758，见 5.2）；<code>finally</code> 中的 return/break/continue 触发 SyntaxWarning（PEP 765，见 5.1）；<code>map()</code> 增加 <code>strict</code> 参数（与 zip 对齐）；标准库新增 <code>compression.zstd</code>（PEP 784）；多解释器进入标准库 <code>concurrent.interpreters</code>（PEP 734）；错误信息继续优化（如拼错关键字/属性时给建议）</td></tr></table>
<p>⭐ <b>3.14 模板字符串 t-string（PEP 750）</b>：语法像 f-string，但产出 <code>Template</code> 对象而非字符串——可以自定义插值处理（如 SQL 参数化防注入、HTML 转义）后再渲染：</p>
<pre>from string.templatelib import Template          # 3.14+

name = "Tom"
t: Template = t"Hello {name}"     # 不是字符串，是 Template 对象
for part in t:                    # 可以逐个检查静态部分与插值部分
    print(repr(part))</pre>
<p>查版本：<code>python --version</code>；各版本完整说明：docs.python.org/3.14/whatsnew/</p>`,
      code: String.raw`# ===== 3.8 =====
data = "hello"
if (n := len(data)) > 3:          # 海象 :=：判断的同时完成赋值
    print("长度", n)

def add(a, b, /):                 # 仅限位置参数 /：a、b 不能按名字传
    return a + b
print(add(1, 2))
print(f"{n=}")                    # f-string 调试符：n=5

# ===== 3.9 =====
nums: list[int] = [1, 2]          # 内置泛型：注解不用再 import List
d1, d2 = {"a": 1}, {"b": 2}
print(d1 | d2)                    # 字典合并 |
print("test.py".removesuffix(".py"))   # removeprefix/removesuffix

# ===== 3.10 =====
def show(x):
    match x:                      # match 结构化模式匹配
        case int():
            return "整数"
        case str():
            return "字符串"
        case _:
            return "其它"

def pick(x: int | str) -> str:    # 联合类型 int | str
    return str(x)

print(show(1), show("a"), pick(7))
print(list(zip([1, 2], [3, 4], strict=True)))   # zip(strict=)：长度不等就报错

# ===== 3.11+（仅展示）=====
# import tomllib                                   # 标准库读 TOML
# with open("pyproject.toml", "rb") as fp:
#     cfg = tomllib.load(fp)
# try:
#     raise ExceptionGroup("组", [ValueError("a"), TypeError("b")])
# except* ValueError as eg:                        # 异常组按类型拆开处理
#     print("值错误", eg.exceptions)
# except* TypeError as eg:
#     print("类型错误", eg.exceptions)
# from typing import Self                          # typing.Self
# async with asyncio.TaskGroup() as tg: ...        # 结构化并发
# async with asyncio.timeout(1.5): ...             # 超时上下文

# ===== 3.12+（仅展示）=====
# type Vector = list[float]        # type 别名语句（type 在此是软关键字）
# class Box[T]:                    # 泛型新语法
#     def __init__(self, item: T): ...
# # f-string 大放宽：同引号可复用、允许反斜杠、多行表达式可写注释

# ===== 3.13（仅展示）=====
# from typing import TypeIs        # 自定义类型收窄（PEP 742）
# from warnings import deprecated  # @deprecated 标记弃用（PEP 702）
# from copy import replace         # copy.replace()
# class Box[T = int]: ...          # 类型参数默认值（PEP 696）

# ===== 3.14（仅展示）=====
# from string.templatelib import Template
# t: Template = t"Hello {name}"    # t-string：产出 Template 对象（PEP 750）
# # 注解默认延迟求值（PEP 649/749）+ annotationlib（见 13.1）
# # except A, B: 可省括号（PEP 758）；map(..., strict=True)；compression.zstd`,
    },
  ],
});
