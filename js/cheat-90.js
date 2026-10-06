/* ===== 速查·附录（§A.1—§A.4） =====
 * 内容来源：《Python 3 语法完全指南》附录（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 附录为学习路径/自查表/版本表/资料清单，无可运行示例的 topic 省略 code 字段（详情页已有分支处理）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 90,
  layer: "附录",
  stage: "附",
  topics: [
    {
      id: "A_1", title: "§A.1 推荐学习路径", desc: "四周路线图：基础→函数异常模块→面向对象文件→内置函数迭代器装饰器，之后按需进阶",
      html: `<ol>
<li><b>第 1 周</b>：第一、二、三层（基础语法、流程控制、数据结构）——边读边在解释器里敲每个示例</li>
<li><b>第 2 周</b>：第四、五、六层（函数、异常、模块）——开始写 50 行以内的小程序</li>
<li><b>第 3 周</b>：第七、八层（面向对象、文件读写）+ 第十一层的推导式——写一个「读文件→处理→写结果」的完整脚本</li>
<li><b>第 4 周</b>：第十、十一、十二层（内置函数、迭代器生成器、装饰器）</li>
<li><b>之后按需</b>：类型注解（13）→ 工程基础（18）→ 异步（14）→ 高级话题（19）</li>
<li>遇到报错先翻附录 B 的自查表（§A.2）</li></ol>`,
    },
    {
      id: "A_2", title: "§A.2 常见报错自查表", desc: "15 种高频报错的最常见原因与快速对策：语法/缩进/命名/类型/键值/索引/模块/文件/编码/递归",
      html: `<p>报错先看这张表，找到对应行按「快速对策」处理：</p>
<table><tr><th>报错</th><th>最常见原因</th><th>快速对策</th></tr>
<tr><td><code>SyntaxError: invalid syntax</code></td><td>少冒号、少括号、关键字拼错、赋值语句放进表达式</td><td>检查报错的<b>上一行</b>（解释器常在此行才发现问题）</td></tr>
<tr><td><code>IndentationError</code> / <code>TabError</code></td><td>缩进不一致、混用 Tab 空格</td><td>编辑器开「显示空白字符」，统一为 4 空格</td></tr>
<tr><td><code>NameError</code></td><td>变量名拼错、未定义就用、作用域问题</td><td>检查拼写；函数内改全局要 <code>global</code></td></tr>
<tr><td><code>UnboundLocalError</code></td><td>函数内「先赋值后引用」让 Python 误以为它是局部变量</td><td>加 <code>global</code>/<code>nonlocal</code> 声明（见 4.4）</td></tr>
<tr><td><code>TypeError: 'x' object is not callable</code></td><td>把变量起名为 <code>list</code>/<code>str</code> 等内置名</td><td>改名并重启解释器</td></tr>
<tr><td><code>TypeError: can only concatenate str</code></td><td>字符串和数字直接 <code>+</code></td><td><code>str(数字)</code> 或 f-string</td></tr>
<tr><td><code>ValueError</code></td><td><code>int("abc")</code>、解包数量不符</td><td>检查输入数据；解包用 <code>*</code> 收集</td></tr>
<tr><td><code>KeyError</code></td><td>字典取了不存在的键</td><td>用 <code>d.get(key, 默认值)</code></td></tr>
<tr><td><code>IndexError</code></td><td>索引越界</td><td>检查长度；考虑用切片（不报错）或 get 式逻辑</td></tr>
<tr><td><code>AttributeError</code></td><td>对象没有该方法（常因类型和想的不一样）</td><td><code>print(type(obj), dir(obj))</code> 看看它到底是谁</td></tr>
<tr><td><code>ModuleNotFoundError</code></td><td>没安装、虚拟环境没激活、文件名与库同名</td><td><code>pip install</code>；激活 venv；别把自己的文件起名 <code>random.py</code> ⭐</td></tr>
<tr><td><code>FileNotFoundError</code></td><td>相对路径基准错了（以「运行时所在目录」为基准，不是 .py 所在目录）⭐</td><td>用 <code>Path(__file__).parent</code> 拼绝对路径</td></tr>
<tr><td><code>UnicodeDecodeError</code></td><td>编码不一致（GBK 读 UTF-8 等）</td><td>读写都显式 <code>encoding="utf-8"</code></td></tr>
<tr><td><code>RuntimeError: dictionary changed size during iteration</code></td><td>遍历字典时增删了键</td><td>先 <code>list(d)</code> 再遍历（见 3.3）</td></tr>
<tr><td><code>RecursionError</code></td><td>递归没终止或太深</td><td>检查终止条件；必要时改循环</td></tr></table>`,
    },
    {
      id: "A_3", title: "§A.3 版本兼容速查", desc: "f-string 到 3.14 各语法特性的最低版本一览 + 查自己版本的两种方法",
      html: `<table><tr><th>语法</th><th>最低版本</th></tr>
<tr><td>f-string</td><td>3.6</td></tr>
<tr><td><code>breakpoint()</code>、海象 <code>:=</code>、仅限位置参数 <code>/</code>、<code>{x=}</code></td><td>3.7 / 3.8</td></tr>
<tr><td>内置泛型 <code>list[int]</code>、字典 <code>|</code>、<code>removeprefix</code></td><td>3.9</td></tr>
<tr><td><code>match</code>、<code>X | Y</code> 联合、<code>zip(strict=)</code></td><td>3.10</td></tr>
<tr><td>异常组 <code>except*</code>、<code>TaskGroup</code>、<code>Self</code>、<code>tomllib</code></td><td>3.11</td></tr>
<tr><td><code>type</code> 语句、<code>class Box[T]</code>、f-string 放宽</td><td>3.12</td></tr>
<tr><td>类型参数默认值、<code>TypeIs</code>、<code>@deprecated</code></td><td>3.13</td></tr>
<tr><td>t-string、延迟注解、<code>except A, B:</code> 无括号、<code>map(strict=)</code></td><td>3.14</td></tr></table>
<p>查自己版本：命令行 <code>python --version</code>，或代码里 <code>import sys; print(sys.version)</code>。</p>`,
    },
    {
      id: "A_4", title: "§A.4 官方核对资料", desc: "官方文档核对清单（新特性/词法/内置函数/类型/异常/typing/asyncio/教程）+ 相关 PEP 一览",
      html: `<p>本指南内容均可在以下官方文档中核对：</p>
<ul>
<li>Python 3.14 新特性：<code>https://docs.python.org/3.14/whatsnew/3.14.html</code></li>
<li>Python 3.13 新特性：<code>https://docs.python.org/3.14/whatsnew/3.13.html</code></li>
<li>词法分析（含软关键字 2.3.2 节）：<code>https://docs.python.org/3.14/reference/lexical_analysis.html#soft-keywords</code></li>
<li>内置函数完整清单：<code>https://docs.python.org/3.14/library/functions.html</code></li>
<li>内置类型（str/list/dict/set 全部方法）：<code>https://docs.python.org/3.14/library/stdtypes.html</code></li>
<li>表达式与运算符优先级：<code>https://docs.python.org/3.14/reference/expressions.html</code></li>
<li>复合语句完整清单：<code>https://docs.python.org/3.14/reference/compound_stmts.html</code></li>
<li>内置异常体系：<code>https://docs.python.org/3.14/library/exceptions.html</code></li>
<li>类型注解 typing：<code>https://docs.python.org/3.14/library/typing.html</code></li>
<li>异步 asyncio：<code>https://docs.python.org/3.14/library/asyncio.html</code></li>
<li>官方教程（新手第一课）：<code>https://docs.python.org/zh-cn/3.14/tutorial/</code></li></ul>
<p>相关 PEP：PEP 8（代码风格）、PEP 498（f-string）、PEP 572（海象）、PEP 634（match）、PEP 649/749（延迟注解）、PEP 695（泛型新语法）、PEP 696（类型参数默认值）、PEP 750（t-string）、PEP 758（except 无括号）、PEP 765（finally 警告）</p>`,
    },
    {
      id: "A_5", title: "§A.5 pip 与第三方库安装", desc: "pip install/uninstall/list/show、国内镜像加速、requirements.txt，以及虚拟环境 venv 的搭配使用",
      html: `<p>第三方库用 <b>pip</b> 安装——pip 命令在<b>命令行</b>运行（不是 Python 代码）：</p>
<table><tr><th>命令</th><th>作用</th></tr>
<tr><td><code>pip install 库名</code></td><td>安装（如 <code>pip install requests</code>）</td></tr>
<tr><td><code>pip install 库名==版本号</code></td><td>安装指定版本</td></tr>
<tr><td><code>pip uninstall 库名</code></td><td>卸载</td></tr>
<tr><td><code>pip list</code></td><td>查看已安装的库</td></tr>
<tr><td><code>pip show 库名</code></td><td>查看某个库的详情</td></tr>
<tr><td><code>pip install -i https://pypi.tuna.tsinghua.edu.cn/simple 库名</code></td><td>用国内镜像加速 ⭐</td></tr>
<tr><td><code>pip install -r requirements.txt</code></td><td>按清单批量安装</td></tr></table>
<p><b>虚拟环境 venv</b>：每个项目一套独立的库，互不污染。<code>python -m venv .venv</code> 创建 → 激活（Windows：<code>.venv\\Scripts\\activate</code>；macOS/Linux：<code>source .venv/bin/activate</code>）→ 之后 pip 装的库只属于本项目。</p>
<p>装好后在代码里 <code>import 库名</code> 即可使用（模块机制见第六层）；遇到 <code>ModuleNotFoundError</code> 先查 §A.2 对应行。</p>`,
      code: String.raw`# pip 命令要在命令行运行，这里用打印演示最常用的三条
cmds = ["pip install requests", "pip list", "pip install -r requirements.txt"]
for c in cmds:
    print("$ " + c)  # 复制到命令行里即可执行
# 装好之后：import requests 就能用了`,
      expect: "$ pip install requests\n$ pip list\n$ pip install -r requirements.txt\n",
    },
  ],
});
