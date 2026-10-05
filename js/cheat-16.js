/* ===== 速查·第十六层 · 词法与表达式体系（§16.1—§16.4） =====
 * 内容来源：《Python 3 语法完全指南》第十六层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 对应官方文档《词法分析》《表达式》两章，把"散装知识"串成体系。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 16,
  layer: "第十六层 · 词法与表达式体系",
  stage: "二",
  topics: [
    {
      id: "16_1", title: "§16.1 字面量", desc: "直接写出来的值、数字/字符串/字节串/容器、单例、Ellipsis 三用途、相邻字符串自动拼接",
      html: `<p>字面量（literal）= <b>直接写出来的值</b>。本层对应官方文档《词法分析》《表达式》两章，帮你把"散装知识"串成体系。</p>
<pre>42  3.14  1_000  0xff  3+4j        # 数字
"abc"  'x'  """多行"""              # 字符串
b"raw bytes"                        # 字节串
[1, 2]  (1, 2)  {1, 2}  {"a": 1}   # 容器
None  True  False                   # 单例（关键字）
...                                 # ⭐ Ellipsis 字面量（三个点）</pre>
<ul>
<li><b>Ellipsis（<code>...</code>）的三个常见用途</b>：① 类型注解里表示"任意形状"（<code>tuple[int, ...]</code>、<code>Callable[..., int]</code>）；② numpy 切片占位；③ 临时代码占位符（与 <code>pass</code> 类似但是个对象）</li>
<li>⭐ <b>相邻字符串字面量自动拼接</b>：中间<b>没有 + 也没有逗号</b>——长串分行的标准写法；注意 <code>("a" "b")</code> 是字符串 <code>"ab"</code>，<code>("a", "b")</code> 才是元组 ⭐</li></ul>
<pre>s = ("这是一段很长的"
     "字符串，写不下就分行，"
     "解释器会自动拼成一个")      # 中间没有 + 也没有逗号！
# 注意与元组的区别：("a" "b") 是字符串 "ab"；("a", "b") 才是元组 ⭐</pre>`,
      code: String.raw`print(42, 3.14, 1_000, 0xff, 3 + 4j)      # 数字字面量
print("abc", 'x', """多行""")              # 字符串
print(b"raw bytes")                        # 字节串
print([1, 2], (1, 2), {1, 2}, {"a": 1})   # 容器
print(None, True, False)                   # 单例（关键字）
print(..., Ellipsis)                       # Ellipsis 字面量（三个点）⭐

s = ("这是一段很长的"
     "字符串，写不下就分行，"
     "解释器会自动拼成一个")      # 中间没有 + 也没有逗号！
print(s)
print(("a" "b"), ("a", "b"))    # 'ab' 与 ('a', 'b') 的区别 ⭐`,
    },
    {
      id: "16_2", title: "§16.2 字符串前缀组合速查", desc: "r/b/f/t/u 前缀表、组合 fr/rf/br 等顺序大小写不限",
      html: `<table><tr><th>前缀</th><th>含义</th><th>版本</th></tr>
<tr><td><code>r</code></td><td>原始字符串（反斜杠不转义）</td><td>全版本</td></tr>
<tr><td><code>b</code></td><td>字节串</td><td>全版本</td></tr>
<tr><td><code>f</code></td><td>格式化字符串</td><td>3.6+</td></tr>
<tr><td><code>t</code></td><td>模板字符串（产出 Template 对象，见第十五层）</td><td>3.14+</td></tr>
<tr><td><code>u</code></td><td>无效果（Py2 兼容遗留）</td><td>全版本</td></tr>
<tr><td>组合 <code>fr</code>/<code>rf</code>/<code>tr</code>/<code>rt</code>/<code>br</code>/<code>rb</code></td><td>前缀可叠加，顺序/大小写不限</td><td>视成员而定</td></tr></table>
<pre>print(fr"C:\\temp\\{1+1}")   # C:\\temp\\2：原始 + 格式化同时生效</pre>`,
      code: String.raw`print(r"C:\temp")            # r：原始字符串（反斜杠不转义）
print(b"bin")                # b：字节串
print(f"{1 + 1}")            # f：格式化字符串（3.6+）
print(fr"C:\temp\{1 + 1}")   # 前缀组合：原始 + 格式化同时生效 → C:\temp\2
print(u"abc" == "abc")       # u：无效果（Py2 兼容遗留）→ True
# t"Hello {name}"            # t：模板字符串（3.14+），产出 Template 对象——仅展示
# 组合顺序/大小写不限：fr 与 rf 等价；br/rb；3.14 起还有 tr/rt`,
    },
    {
      id: "16_3", title: "§16.3 表达式一览", desc: "表达式 = 能算出值的片段：原子→属性/下标/切片/调用→运算符→条件表达式→lambda→海象→生成器表达式",
      html: `<p>表达式 = <b>能算出一个值</b>的代码片段。官方表达式体系从"原子"到复杂：</p>
<pre># 原子（atom）：名字、字面量、括号表达式
x    42    (1 + 2)

# 属性引用 / 下标 / 切片 / 调用（优先级最高的一档）
obj.attr    seq[0]    seq[1:3]    func(1, key=2)

# await / yield 也是表达式
# await coro            —— 异步上下文中取协程结果
# x = yield             —— 生成器里接收 send 值（见 11.3）

# 幂、一元、算术、位运算、比较、成员、身份、逻辑
2 ** 8    -x    a + b    x &lt;&lt; 2    a &lt; b    x in s    a is b    p and q

# 条件表达式（三元）
result = "成年" if age &gt;= 18 else "未成年"

# lambda 表达式
f = lambda x: x * 2

# 海象（赋值表达式）
if (n := len(data)) &gt; 0: ...

# 生成器表达式（圆括号）
total = sum(x * x for x in range(10))</pre>`,
      code: String.raw`x = 42
print((1 + 2) * x)                        # 原子（名字/字面量/括号）+ 算术

seq = [10, 20, 30]
print(seq[0], seq[1:3], len(seq))         # 下标 / 切片 / 调用

age = 20
result = "成年" if age >= 18 else "未成年"  # 条件表达式（三元）
print(result)

f = lambda n: n * 2                       # lambda 表达式
print(f(21))

data = "hello"
if (n := len(data)) > 0:                  # 海象（赋值表达式）
    print("长度", n)

total = sum(i * i for i in range(10))     # 生成器表达式（圆括号）
print(total)
# await coro / x = yield 也是表达式（见第十四层 / 11.3）`,
    },
    {
      id: "16_4", title: "§16.4 求值顺序", desc: "从左到右、赋值从右到左、解包先算右边、短路求值、同表达式读写同一对象是坑",
      html: `<ul>
<li>一般<b>从左到右</b>：<code>f() + g()</code> 先调 <code>f</code>；调用 <code>f(a(), b())</code> 先算 <code>a()</code></li>
<li><b>赋值从右到左</b>：<code>a = b = 值</code> 先把值算出来，再从左到右绑给 a、b</li>
<li>解包赋值 <code>x, y = f(), g()</code>：右边先整体求值完再绑定</li>
<li><code>and</code>/<code>or</code>/<code>if-else</code> 短路：确定结果后右边不再求值（见 1.7）</li>
<li>⭐ 不要在一个表达式里既修改又读取同一对象（如 <code>lst[i] = lst.pop()</code>），结果虽然语言有定义，但可读性极差</li></ul>`,
      code: String.raw`log = []
def mark(name, value):
    log.append(name)
    return value

mark("f", 1) + mark("g", 2)          # 一般从左到右：先 f 后 g
print(log)

a = b = mark("值", 9)                # 赋值从右到左：先算值再绑定
print(a, b)

x, y = mark("左", 1), mark("右", 2)  # 解包：右边整体求值完再绑定
print(x, y)

print(0 and mark("不会执行", 1))      # 短路：右边不再求值 → 0
print(log)
# ⭐ 反面教材：lst[i] = lst.pop() —— 一个表达式里既修改又读取同一对象，别这么写`,
    },
  ],
});
