/* ===== 速查·第十一层 · 推导式、迭代器与生成器（§11.1—§11.4） =====
 * 内容来源：《Python 3 语法完全指南》第十一层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例与课程 §11.x 一致或取自指南，均可运行（课程按教学节奏拆成 6 节，本速查按指南 4 小节组织）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 11,
  layer: "第十一层 · 推导式、迭代器与生成器",
  stage: "二",
  topics: [
    {
      id: "11_1", title: "§11.1 推导式（comprehension）", desc: "列表/集合/字典/生成器表达式四种模板、多层循环、if 末尾过滤 vs if-else 前三元、独立作用域不泄漏",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/datastructures.html#list-comprehensions",
      html: `<ul>
<li>一行造出列表/集合/字典，Python 的招牌语法。<b>四种模板</b>：<code>[expr for x in seq]</code> 列表｜<code>{expr for x in seq}</code> 集合（自动去重）｜<code>{k: v for x in seq}</code> 字典（同一个键后写的覆盖先写的）｜⭐ <code>(expr for x in seq)</code> 圆括号是<b>生成器表达式</b>（惰性！），不是"元组推导式"</li>
<li>读法：从 for 开始读——"对每个 x，算出 expr 装进去"</li>
<li><b>多层循环</b>：从左到右 = 从外到内：<code>[(x, y) for x in range(2) for y in range(2)]</code> → [(0, 0), (0, 1), (1, 0), (1, 1)]</li>
<li>⭐ <b>条件写在哪，含义完全不同</b>：<code>if</code> 在末尾 = <b>过滤</b>（不满足就丢弃）：<code>[a for a in range(6) if a % 2 == 0]</code> → [0, 2, 4]；<code>if-else</code> 在最前 = <b>三元表达式</b>（每个元素二选一换个模样）：<code>["偶" if a % 2 == 0 else "奇" for a in range(4)]</code> → ['偶', '奇', '偶', '奇']</li>
<li>⭐ <b>推导式有自己的作用域</b>：循环变量不会泄漏到外面（Python 3 已修复 Python 2 的泄漏问题）</li>
<li>可读性建议：推导式一行写不下、逻辑超过一层过滤时，老老实实写 for 循环</li></ul>`,
      code: String.raw`squares = [x ** 2 for x in range(10)]              # 列表推导式
evens = {x for x in range(10) if x % 2 == 0}       # 集合推导式（自动去重）
square_map = {x: x ** 2 for x in range(5)}         # 字典推导式
gen = (x ** 2 for x in range(10))                  # ⭐ 圆括号是生成器表达式（惰性！）
print(squares)
print(sorted(evens))
print(square_map)
print(list(gen))

# 多层循环：从左到右 = 从外到内
pairs = [(x, y) for x in range(2) for y in range(2)]
print(pairs)     # [(0, 0), (0, 1), (1, 0), (1, 1)]

# ⭐ 条件写在哪，含义完全不同
print([a for a in range(6) if a % 2 == 0])              # [0, 2, 4]：if 在末尾 = 过滤
print(["偶" if a % 2 == 0 else "奇" for a in range(4)])  # if-else 在前 = 三元表达式

# ⭐ 推导式有自己的作用域：循环变量不泄漏
x = 100
_ = [x for x in range(3)]
print(x)          # 100：外面的 x 不受影响`,
    },
    {
      id: "11_2", title: "§11.2 可迭代对象 vs 迭代器", desc: "iterable 与 iterator 严格区分、iter/next/StopIteration、for 循环内部真相、耗尽就没了",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#iterator-types",
      html: `<ul>
<li><b>可迭代（iterable）</b>：实现了 <code>__iter__</code> 的对象，能被 for 遍历，<b>可以反复遍历</b>：list、tuple、str、dict、set、range、文件对象……</li>
<li><b>迭代器（iterator）</b>：同时实现 <code>__iter__</code> 和 <code>__next__</code> 的对象，代表"一次性的遍历过程"——⭐⭐ <b>耗尽就没了</b></li>
<li><code>iter(可迭代)</code> 从可迭代造出一个迭代器；<code>next(it)</code> 取一个值，耗尽时抛 <code>StopIteration</code></li>
<li>⭐ <b>实用判断</b>：能被 <code>next()</code> 直接用的是迭代器；只能被 <code>iter()</code> 包一层的是可迭代</li>
<li>耗尽的迭代器再 <code>list(it)</code> 得 []；而可迭代对象本身完好，可反复 <code>iter()</code> 造新迭代器</li></ul>
<p><b>for 循环的内部真相</b>：</p>
<pre>it = iter(可迭代)
while True:
    try: x = next(it)
    except StopIteration: break
    &lt;循环体&gt;</pre>`,
      code: String.raw`nums = [1, 2, 3]          # nums 是可迭代，不是迭代器
it = iter(nums)           # iter() 从可迭代造出一个迭代器
print(next(it))           # 1
print(next(it))           # 2
print(next(it))           # 3
# next(it)                # ❌ StopIteration：耗尽

try:
    next(it)
except StopIteration:
    print("迭代器已耗尽")

print(list(it))           # []：it 已耗尽，再 list 也没东西 ⭐
print(list(iter(nums)))   # [1, 2, 3]：nums 本身完好，可反复造新迭代器`,
    },
    {
      id: "11_3", title: "§11.3 生成器（generator）完整版", desc: "yield 暂停术、调用不执行、只能遍历一次、send/throw/close、return 值藏在 StopIteration.value、yield from 委托",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/classes.html#generators",
      html: `<ul>
<li><b>生成器函数</b>：含 <code>yield</code> 的函数。⭐ 调用它<b>不执行</b>函数体，而是返回一个<b>生成器对象</b>（迭代器的一种）；每次 <code>next()</code> 从上次"定格"处接着跑到下一个 yield，交出一个值后再定格，局部变量原样保留</li>
<li>⭐ 生成器<b>只能遍历一次</b>：<code>list(g)</code> 之后再 <code>list(g)</code> 得 []；想要第二遍得重新调用函数造个新的</li>
<li>⭐ <b>yield 是表达式</b>：它不光交出一个值，还能<b>接收</b>外部 <code>send()</code> 进来的值：<code>x = yield total</code>；函数 <code>return</code> 的值藏在 <code>StopIteration.value</code> 里</li>
<li><b>启动规矩</b>：必须先 <code>next(g)</code> 或 <code>g.send(None)</code> 推进到第一个 yield，之后才能 send 真值</li>
<li><b>完整接口</b>：<code>send(值)</code> 送值进去｜<code>throw(异常)</code> 在 yield 处抛入一个异常｜<code>close()</code> 提前终止（在 yield 处注入 GeneratorExit）</li>
<li><code>yield from 子生成器</code>（委托）：把产出工作交给子生成器，还能双向传递 send/return——<code>result = yield from sub()</code> 能拿到子生成器 return 的值</li>
<li><b>用途</b>：处理大文件（文件对象本身就是惰性迭代器，包一层 yield 逐行产出即成生成器管道）/ 无限序列（配 <code>itertools.islice</code> 截取），内存占用 O(1)</li></ul>`,
      code: String.raw`def count_up_to(n):
    i = 1
    while i <= n:
        yield i        # 每次 yield 交出一个值，函数"暂停"在这
        i += 1

g = count_up_to(3)     # 此刻函数体一行都没跑 ⭐
print(next(g))         # 1：从开头跑到第一个 yield
print(next(g))         # 2
print(next(g))         # 3
# next(g)              # ❌ StopIteration

# ⭐ 生成器只能遍历一次
g2 = (x for x in range(3))
print(list(g2))        # [0, 1, 2]
print(list(g2))        # []：已耗尽

# ⭐ yield 是表达式：能接收 send() 进来的值；return 值藏在 StopIteration.value
def accumulator():
    total = 0
    while True:
        x = yield total          # 交出 total，同时等外部 send 一个 x 进来
        if x is None:
            break
        total += x
    return total                 # 生成器的"返回值"

acc = accumulator()
print(next(acc))       # 0（启动：必须先 next 或 send(None) 推进到第一个 yield）
print(acc.send(10))    # 10
print(acc.send(5))     # 15
try:
    acc.send(None)     # 触发 break → return 15
except StopIteration as e:
    print("return 值：", e.value)   # 15 ⭐
acc.close()            # 提前终止生成器（在 yield 处注入 GeneratorExit）
# acc.throw(ValueError("x"))       # 在 yield 处抛入一个异常

# yield from（委托）：产出交给子生成器，还能拿到它 return 的值
def sub():
    yield 1
    yield 2
    return "子生成器的返回值"

def main_gen():
    result = yield from sub()    # result 拿到子生成器 return 的值
    print(result)
    yield 3

print(list(main_gen()))   # [1, 2, 3]（"子生成器的返回值"被 print 了）

# 用途：无限序列 + islice 截取，内存 O(1)
def fib():                   # 无限斐波那契
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

import itertools
print(list(itertools.islice(fib(), 10)))   # 取前 10 个：[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
    },
    {
      id: "11_4", title: "§11.4 itertools 精选", desc: "count/cycle/repeat 无限流、chain/islice/takewhile/dropwhile/accumulate/zip_longest、组合排列笛卡尔积",
      doc: "https://docs.python.org/zh-cn/3.14/library/itertools.html",
      html: `<p><code>itertools</code> 是官方迭代器工具箱，<b>全部返回惰性迭代器</b>（要 <code>list()</code> 或 for 取用）。⭐ 无限流直接 list() 会卡死，必须用 <code>islice</code> 截断！</p>
<table><tr><th>函数</th><th>作用</th><th>示例 / 结果</th></tr>
<tr><td><code>count(10, 2)</code></td><td>无限等差</td><td>10, 12, 14, ...</td></tr>
<tr><td><code>cycle("AB")</code></td><td>无限循环</td><td>A, B, A, B, ...</td></tr>
<tr><td><code>repeat("x", 3)</code></td><td>重复 n 次</td><td>x, x, x</td></tr>
<tr><td><code>chain([1, 2], "ab")</code></td><td>串联多个可迭代</td><td>1, 2, 'a', 'b'</td></tr>
<tr><td><code>islice(range(100), 5, 10)</code></td><td>⭐ 惰性切片，驯服无限序列的缰绳</td><td>5, 6, 7, 8, 9</td></tr>
<tr><td><code>takewhile(f, seq)</code></td><td>满足条件就取，遇到不满足<b>立刻停</b></td><td><code>takewhile(lambda x: x &lt; 3, [1, 2, 3, 1])</code> → 1, 2</td></tr>
<tr><td><code>dropwhile(f, seq)</code></td><td>满足条件就丢，直到第一个不满足</td><td><code>dropwhile(lambda x: x &lt; 3, [1, 2, 3, 1])</code> → 3, 1</td></tr>
<tr><td><code>accumulate([1, 2, 3, 4])</code></td><td>累计（默认累加）</td><td>1, 3, 6, 10</td></tr>
<tr><td><code>zip_longest(a, b, fillvalue=0)</code></td><td>补齐式 zip</td><td><code>zip_longest([1, 2], "ab", fillvalue=0)</code> → (1, 'a'), (2, 'b')</td></tr>
<tr><td><code>combinations("ABC", 2)</code></td><td>组合（不讲顺序）</td><td>AB AC BC</td></tr>
<tr><td><code>permutations("AB", 2)</code></td><td>排列（讲顺序）</td><td>AB BA</td></tr>
<tr><td><code>product([0, 1], repeat=2)</code></td><td>笛卡尔积</td><td>00 01 10 11</td></tr></table>`,
      code: String.raw`import itertools as it

print(list(it.chain([1, 2], "ab")))          # [1, 2, 'a', 'b']：串联多个可迭代
print(list(it.islice(it.count(10, 2), 4)))   # [10, 12, 14, 16]：无限等差，截 4 个
print(list(it.repeat("x", 3)))               # ['x', 'x', 'x']
print(list(it.accumulate([1, 2, 3, 4])))     # [1, 3, 6, 10]：累计和
print(list(it.takewhile(lambda x: x < 3, [1, 2, 3, 1])))   # [1, 2]：遇到不满足就停
print(list(it.dropwhile(lambda x: x < 3, [1, 2, 3, 1])))   # [3, 1]
print(list(it.zip_longest([1, 2], "ab", fillvalue=0)))     # 补齐式 zip
print(list(it.combinations("ABC", 2)))       # 组合：AB AC BC
print(list(it.permutations("AB", 2)))        # 排列：AB BA
print(list(it.product([0, 1], repeat=2)))    # 笛卡尔积：00 01 10 11

def fib():                    # 无限斐波那契
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

print(list(it.islice(fib(), 10)))   # 取前 10 项
# list(it.count())                  # ❌ 别试：无限序列直接 list 会卡死，必须 islice 截断`,
    },
  ],
});
