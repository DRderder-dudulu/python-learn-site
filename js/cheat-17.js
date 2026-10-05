/* ===== 速查·第十七层 · 完整语句清单（§17.1—§17.3） =====
 * 内容来源：《Python 3 语法完全指南》第十七层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * Python 语句分简单/复合两类，两表即全部（其它你见到的都是表达式或库函数）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 17,
  layer: "第十七层 · 完整语句清单",
  stage: "二",
  topics: [
    {
      id: "17_1", title: "§17.1 简单语句（一行一句）", desc: "全部简单语句一览：表达式/赋值/增量/注解赋值、assert、pass、del、return、yield、raise、break/continue、import、global/nonlocal、type",
      html: `<p>Python 的语句分两类，两表是<b>全部</b>（其它你见到的都是表达式或库函数）。简单语句：一行一句，可用 <code>;</code> 连写。</p>
<table><tr><th>语句</th><th>作用</th><th>详见</th></tr>
<tr><td>表达式语句</td><td>单独写个表达式（函数调用、docstring 等）</td><td>—</td></tr>
<tr><td>赋值语句</td><td><code>x = 1</code>、链式、解包</td><td>1.4</td></tr>
<tr><td>增量赋值</td><td><code>x += 1</code>（含 <code>-= *= /= //= %= **= @= &amp;= |= ^= &lt;&lt;= &gt;&gt;=</code>）</td><td>1.4</td></tr>
<tr><td>注解赋值</td><td><code>x: int = 1</code></td><td>13.1</td></tr>
<tr><td><code>assert</code></td><td>调试断言（-O 会移除）</td><td>5.7</td></tr>
<tr><td><code>pass</code></td><td>空操作占位</td><td>—</td></tr>
<tr><td><code>del</code></td><td>解除绑定/删除</td><td>3.8</td></tr>
<tr><td><code>return</code></td><td>函数返回</td><td>4.1</td></tr>
<tr><td><code>yield</code></td><td>生成器交出值</td><td>11.3</td></tr>
<tr><td><code>raise</code></td><td>抛异常</td><td>5.4</td></tr>
<tr><td><code>break</code> / <code>continue</code></td><td>循环控制</td><td>2.2</td></tr>
<tr><td><code>import</code> / <code>from ... import</code></td><td>导入</td><td>6.1</td></tr>
<tr><td><code>global</code> / <code>nonlocal</code></td><td>作用域声明</td><td>4.4</td></tr>
<tr><td><code>type</code> 语句</td><td>类型别名（3.12+，软关键字）</td><td>13.4</td></tr></table>`,
      code: String.raw`x = 1                  # 赋值语句
x += 1                 # 增量赋值
y: int = 2             # 注解赋值
assert x == 2          # assert：调试断言（python -O 会移除）
pass                   # pass：空操作占位

def f():
    return x           # return：函数返回
print(f())

del y                  # del：解除绑定

import math            # import 语句
from math import sqrt
print(math.floor(3.7), sqrt(16))

for i in range(3):
    if i == 1:
        continue       # continue：跳过本次
    if i == 2:
        break          # break：结束循环
    print(i)

def gen():
    yield 1            # yield：生成器交出值
print(list(gen()))

counter = 0
def bump():
    global counter     # global：作用域声明（nonlocal 见 4.4）
    counter += 1
bump()
print(counter)
# raise ValueError("x")            # raise：抛异常（见 5.4）——故意报错，仅展示
# type Vector = list[float]        # type 语句：类型别名（3.12+，软关键字）——仅展示`,
    },
    {
      id: "17_2", title: "§17.2 复合语句（带头行 + 缩进代码块）", desc: "全部复合语句一览：if/while/for/try/with/match/def/class/async 三件套",
      html: `<table><tr><th>语句</th><th>作用</th><th>详见</th></tr>
<tr><td><code>if</code> / <code>elif</code> / <code>else</code></td><td>条件分支</td><td>2.1</td></tr>
<tr><td><code>while</code>（可带 <code>else</code>）</td><td>条件循环</td><td>2.2</td></tr>
<tr><td><code>for</code>（可带 <code>else</code>）</td><td>遍历循环</td><td>2.3</td></tr>
<tr><td><code>try</code> / <code>except</code> / <code>else</code> / <code>finally</code>（含 <code>except*</code>）</td><td>异常处理</td><td>第五层</td></tr>
<tr><td><code>with</code>（含多上下文）</td><td>上下文管理</td><td>8.1、12.2</td></tr>
<tr><td><code>match</code> / <code>case</code></td><td>模式匹配（3.10+）</td><td>2.4</td></tr>
<tr><td><code>def</code>（可带装饰器）</td><td>函数定义</td><td>第四层</td></tr>
<tr><td><code>class</code>（可带装饰器）</td><td>类定义</td><td>第七层</td></tr>
<tr><td><code>async def</code> / <code>async with</code> / <code>async for</code></td><td>异步（3.5+）</td><td>第十四层</td></tr></table>`,
      code: String.raw`n = 0
while n < 2:             # while：条件循环（可带 else）
    n += 1

for ch in "ab":          # for：遍历循环（可带 else）
    print(ch)

if n == 2:               # if / elif / else：条件分支
    print("n 是 2")

try:                     # try / except / else / finally：异常处理
    1 / 0
except ZeroDivisionError:
    print("除零了")
finally:
    pass                 # 清理动作；3.14 起 finally 里 return/break/continue 有 SyntaxWarning

import io
with io.StringIO("数据") as buf:   # with：上下文管理（含多上下文写法）
    print(buf.read())

def add(a, b):           # def：函数定义（可带装饰器）
    return a + b

class Box:               # class：类定义（可带装饰器）
    pass

point = (1, 2)
match point:             # match / case：模式匹配（3.10+）
    case (x, y):
        print("坐标", x, y)

print(add(1, 2))
# async def / async with / async for：异步语句（3.5+，见第十四层）
# except*：异常组（3.11+，见第五层）——仅展示`,
    },
    {
      id: "17_3", title: "§17.3 语句 vs 表达式", desc: "表达式有值可放 = 右边；语句是动作没有值；海象 := 是表达式而赋值是语句",
      html: `<ul>
<li>⭐ <b>表达式有值</b>，可以放在 <code>=</code> 右边、<code>f()</code> 里、<code>if</code> 条件里</li>
<li><b>语句是动作</b>，没有值，不能放在那些位置</li>
<li>高频考点：赋值是<b>语句</b>（<code>if (x = 1):</code> ❌ SyntaxError），海象 <code>:=</code> 是<b>表达式</b>（<code>if (x := 1):</code> ✅）</li>
<li><code>if</code> 语句不能放 <code>=</code> 右边，<b>条件表达式</b>可以：<code>x = 1 if True else 2</code></li></ul>
<pre># if (x = 1):       # ❌ SyntaxError：赋值是【语句】，不能放在条件里
if (x := 1):         # ✅ 海象是【表达式】，可以
    ...
x = print("hi")      # print 调用是表达式（返回 None）
# x = if True: 1    # ❌ if 语句不能这么写；条件表达式可以：x = 1 if True else 2</pre>`,
      code: String.raw`# if (x = 1):       # ❌ SyntaxError：赋值是【语句】，不能放在条件里
if (x := 1):         # ✅ 海象 := 是【表达式】，可以
    print("x =", x)

r = print("hi")      # print 调用是表达式（返回 None）
print(r)

y = 1 if True else 2   # ✅ 条件表达式可以放 = 右边
# y = if True: 1        # ❌ if 语句不能这么写
print(y)

double = lambda v: v * 2   # lambda 也是表达式
print(double(21))`,
    },
  ],
});
