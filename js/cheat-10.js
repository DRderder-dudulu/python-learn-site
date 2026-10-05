/* ===== 速查·第十层 · 内置函数速查（§10.1—§10.2） =====
 * 内容来源：《Python 3 语法完全指南》第十层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例取自指南并扩充，均可运行（本层无课程；写文件示例用 _tmp_ 临时文件并在结尾自行清理）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 10,
  layer: "第十层 · 内置函数速查",
  stage: "二",
  topics: [
    {
      id: "10_1", title: "§10.1 内置函数分组总表", desc: "全部内置函数按用途七组：类型转换/数学/迭代相关/对象与反射/输入输出与调试/动态执行/异步迭代",
      html: `<p>内置函数<b>不用 import</b>、随取随用。下表按用途分七组（与官方清单一一对应）；完整官方清单：<code>docs.python.org/3.14/library/functions.html</code></p>
<table><tr><th>分组</th><th>函数</th></tr>
<tr><td><b>类型转换</b></td><td><code>int()</code> <code>float()</code> <code>str()</code> <code>bool()</code> <code>list()</code> <code>tuple()</code> <code>set()</code> <code>frozenset()</code> <code>dict()</code> <code>bytes()</code> <code>bytearray()</code> <code>complex()</code> ｜ <code>chr()</code>（码点→字符）<code>ord()</code>（字符→码点）<code>hex()</code> <code>oct()</code> <code>bin()</code></td></tr>
<tr><td><b>数学</b></td><td><code>abs()</code> <code>round()</code> <code>divmod()</code> <code>pow()</code> <code>sum()</code> <code>min()</code> <code>max()</code></td></tr>
<tr><td><b>迭代相关</b></td><td><code>len()</code> <code>range()</code> <code>enumerate()</code> <code>zip()</code> <code>map()</code> <code>filter()</code> <code>sorted()</code> <code>reversed()</code> <code>iter()</code> <code>next()</code> <code>slice()</code> <code>all()</code> <code>any()</code></td></tr>
<tr><td><b>对象与反射</b></td><td><code>type()</code> <code>isinstance()</code> <code>issubclass()</code> <code>id()</code> <code>hash()</code> <code>repr()</code> <code>ascii()</code> <code>format()</code> <code>dir()</code> <code>vars()</code> <code>getattr()</code> <code>setattr()</code> <code>hasattr()</code> <code>delattr()</code> <code>callable()</code> <code>super()</code> <code>object()</code> <code>property()</code> <code>classmethod()</code> <code>staticmethod()</code></td></tr>
<tr><td><b>输入输出与调试</b></td><td><code>print()</code> <code>input()</code> <code>open()</code> <code>help()</code> <code>breakpoint()</code>（3.7+：进入调试器）</td></tr>
<tr><td><b>动态执行（⭐ 慎用）</b></td><td><code>eval()</code> <code>exec()</code> <code>compile()</code> <code>globals()</code> <code>locals()</code> <code>__import__()</code></td></tr>
<tr><td><b>异步迭代（3.10+）</b></td><td><code>aiter()</code> <code>anext()</code></td></tr></table>
<ul>
<li>⭐ <code>chr()</code>/<code>ord()</code> 是一对：<code>chr(65)</code> → 'A'、<code>ord("A")</code> → 65；<code>hex(255)</code> → '0xff'、<code>oct(8)</code> → '0o10'、<code>bin(5)</code> → '0b101'</li>
<li>⭐ 动态执行这一组能把字符串当代码跑——<b>永远不要喂用户输入</b>（详见 §10.2）</li></ul>`,
      code: String.raw`# 类型转换
print(int("42"), float("3.14"), str(100), bool(0))     # 42 3.14 100 False
print(list("abc"), tuple([1, 2]), set([1, 1, 2]))      # ['a', 'b', 'c'] (1, 2) {1, 2}
print(chr(65), ord("A"), hex(255), oct(8), bin(5))     # A 65 0xff 0o10 0b101

# 数学
print(abs(-3), round(2.5), divmod(7, 2), pow(2, 10))   # 3 2 (3, 1) 1024
print(sum([1, 2, 3]), min(3, 1, 2), max("a", "b"))     # 6 1 b

# 迭代相关
print(len("hello"), list(range(3)))                    # 5 [0, 1, 2]
print(sorted([3, 1, 2]), list(reversed([1, 2, 3])))    # [1, 2, 3] [3, 2, 1]
print(all([1, True, 3]), any([0, "", 2]))              # True True

# 对象与反射
print(type(42).__name__, isinstance(42, int), id(42) == id(42))   # int True True
print(callable(print), callable(42))                   # True False`,
    },
    {
      id: "10_2", title: "§10.2 内置函数高频细节", desc: "enumerate start、zip 静默截断与 strict、map/filter 惰性、iter 哨兵形态、min/max default 与 key、getattr 系、sum 起点、literal_eval、breakpoint",
      html: `<ul>
<li><code>enumerate(seq, start=1)</code>：带索引遍历，start 改起始编号</li>
<li>⭐ <code>zip(a, b)</code> 长度不同<b>默认静默截断</b>：<code>list(zip([1, 2], [1, 2, 3]))</code> → [(1, 1), (2, 2)]——第三个被悄悄丢掉！<code>strict=True</code>（3.10+）长度不等就报 ValueError</li>
<li><code>map</code>/<code>filter</code> 返回<b>惰性迭代器</b>，要 <code>list()</code> 才看到结果 ⭐；<code>map(strict=...)</code>（3.14+）多个输入长度不等时报错，与 zip 的 strict 同理</li>
<li>⭐ <code>iter(callable, sentinel)</code> <b>双参数形态</b>：反复调用 callable，直到返回值等于哨兵——<code>for line in iter(f.readline, ""):</code> 是逐行读文件的惯用法（readline 返回 "" 表示读完）</li>
<li>⭐ <code>min([], default=0)</code>：空序列兜底不报错（不写 default 则 ValueError）；<code>max(["a", "bb"], key=len)</code> → 'bb'：key 指定"按什么比"</li>
<li><code>sorted(iterable, key=..., reverse=...)</code>：<code>key=len</code> 按长度、<code>key=lambda p: p[1]</code> 按第二项；返回新列表，原序列不变</li>
<li><code>all()</code> 全真才真 / <code>any()</code> 一真即真，都<b>短路</b>；常配生成器表达式：<code>all(x &gt; 0 for x in [1, 2, 3])</code></li>
<li><code>divmod(7, 2)</code> → (3, 1)：商和余数一次搞定</li>
<li><code>getattr / setattr / hasattr / delattr</code>：用"字符串名字"操作属性；<code>getattr(a, "y", "默认")</code> 三参形式找不到也不报错</li>
<li><code>callable(x)</code> 判断能不能被调用：<code>callable(print)</code> True、<code>callable(42)</code> False</li>
<li><code>sum(iterable, 起点)</code>：<code>sum([1, 2, 3], 100)</code> → 106；⭐ 列表拼接别用 sum（慢），用 itertools.chain</li>
<li>⭐ <b>eval/exec 安全警告</b>：能把字符串当代码执行，<b>永远不要喂用户输入</b>！解析字面量更安全的替代：<code>ast.literal_eval("[1, 2, {'a': 3}]")</code> 只解析字面量 ⭐</li>
<li><code>breakpoint()</code>（3.7+）：程序跑到这行自动进入 pdb 调试器</li></ul>`,
      code: String.raw`import os, ast

# enumerate：带索引遍历，start 改起始编号
for i, name in enumerate(["a", "b"], start=1):
    print(i, name)

# zip：⭐ 长度不同默认静默截断！
print(list(zip([1, 2], [1, 2, 3])))            # [(1, 1), (2, 2)]：第三个被悄悄丢掉
# list(zip([1, 2], [1, 2, 3], strict=True))    # 3.10+：长度不等就报 ValueError
# map(f, a, b, strict=True)                    # 3.14+：多个输入长度不等时报错，同理

# map / filter：返回惰性迭代器，要 list() 才看到结果
print(list(map(str, [1, 2])))                    # ['1', '2']
print(list(filter(lambda x: x > 1, [1, 2, 3])))  # [2, 3]

# iter 的双参数形态：反复调用 callable，直到返回值等于哨兵
with open("_tmp_data.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n第二行\n")
with open("_tmp_data.txt", encoding="utf-8") as f:
    for line in iter(f.readline, ""):          # readline 返回 "" 表示读完
        print(line, end="")
os.remove("_tmp_data.txt")

# min / max：default 兜底空序列，key 指定"按什么比"
print(min([], default=0))          # 0（不写 default 则 ValueError）
print(max(["a", "bb"], key=len))   # bb

# sorted：key 与 reverse
print(sorted(["bb", "a"], key=len))                    # ['a', 'bb']
print(sorted([("a", 2), ("b", 1)], key=lambda p: p[1]))  # 按第二项

# all / any：短路
print(all(x > 0 for x in [1, 2, 3]))   # True（全真才真）
print(any(x > 2 for x in [1, 2, 3]))   # True（一真即真）

print(divmod(7, 2))     # (3, 1)：商和余数一次搞定

# getattr / setattr / hasattr / delattr：用"字符串名字"操作属性
class A: pass
a = A()
setattr(a, "x", 10)
print(getattr(a, "x"))          # 10
print(getattr(a, "y", "默认"))  # 默认（三参形式不报错）
print(hasattr(a, "x"))          # True
delattr(a, "x")

print(callable(print), callable(42))   # True False
print(sum([1, 2, 3], 100))             # 106：起点参数；列表拼接别用 sum（慢），用 itertools.chain

# eval / exec ⭐ 安全警告：能把字符串当代码执行，永远不要喂用户输入！
print(eval("1 + 2"))                            # 3（仅限可信场景）
print(ast.literal_eval("[1, 2, {'a': 3}]"))     # 只解析字面量，安全 ⭐

# breakpoint()   # 3.7+：跑到这行自动进入 pdb 调试器（本示例不启用）`,
    },
  ],
});
