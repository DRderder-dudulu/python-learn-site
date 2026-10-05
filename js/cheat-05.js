/* ===== 速查·第五层 · 异常处理（§5.1—§5.9） =====
 * 内容来源：《Python 3 语法完全指南》第五层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例与课程 §5.x 一致或取自指南，均经本地 Python 实跑验证（exit 0）。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 5,
  layer: "第五层 · 异常处理",
  stage: "一",
  topics: [
    {
      id: "5_1", title: "§5.1 try / except / else / finally 全家桶", desc: "多 except 按序匹配、as e 拿异常对象、元组抓多种、else 顺利跑完才进、finally 精确语义与 return 覆盖坑（PEP 765）",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html",
      html: `<ul>
<li>整体结构：<code>try:</code> 包住要保护的代码 → 多个 <code>except 类型 [as e]:</code> 按顺序匹配，命中即处理 → ⭐ <code>else:</code> try 块<b>顺利跑完（没出异常）才进</b> → <code>finally:</code> 清理动作（关文件、还连接）</li>
<li>捕获<b>特定</b>异常：<code>except ValueError:</code>；<code>as e</code> 拿到异常对象；一个 except 抓多种异常用<b>元组</b>：<code>except (KeyError, IndexError):</code></li>
<li>⭐ <b>finally 的精确语义</b>：无论 try 里是否抛异常、是否执行了 <code>return</code>/<code>break</code>/<code>continue</code>，finally <b>都会执行</b>——只有进程被强杀、<code>os._exit()</code>、解释器崩溃等极端情况例外</li>
<li>⭐ <b>新手坑：finally 里写 return</b> 会<b>覆盖</b> try 里的返回值、并<b>吞掉</b>未处理的异常——极易藏 bug；3.14 起解释器对 finally 中的 <code>return</code>/<code>break</code>/<code>continue</code> 发出 <code>SyntaxWarning</code>（PEP 765）</li></ul>`,
      code: String.raw`def parse(raw):
    try:
        num = int(raw)
        result = 10 / num
    except ValueError:
        print("输入不是数字")             # 捕获特定异常
    except ZeroDivisionError as e:
        print("不能除以 0：", e)          # as e 拿到异常对象
    except (KeyError, IndexError):        # 一个 except 抓多种异常用元组
        print("键或索引有问题")
    else:
        print("没出异常才执行：", result)   # ⭐ else：try 块顺利跑完才进
    finally:
        print("无论如何都执行")           # 清理动作（关文件、还连接）

parse("5")
parse("abc")

# ⭐ finally 里的 return 会覆盖 try 的返回值（3.14 起 SyntaxWarning，千万别这么写）
def f():
    try:
        return 1
    finally:
        return 2     # f() 返回 2；若 try 里有异常也会被吞掉
print(f())`,
    },
    {
      id: "5_2", title: "§5.2 3.14 新写法：except 可省略括号（PEP 758）", desc: "不带 as 时多个异常可省略括号；带 as 仍需括号；旧版本必须写元组",
      html: `<ul>
<li>⭐ <b>3.14+（PEP 758）</b>：不带 <code>as</code> 子句时，多个异常可以不写括号：<code>except ValueError, TypeError:</code></li>
<li>旧版本（3.13 及以前）必须写元组形式：<code>except (ValueError, TypeError):</code></li>
<li>⭐ 带 <code>as</code> 仍需括号：<code>except (ValueError, TypeError) as e:</code></li></ul>`,
      code: String.raw`# 3.14+ 新写法（PEP 758）：不带 as 时多个异常可省略括号
# try:
#     ...
# except ValueError, TypeError:      # 3.14+ 合法；旧版本必须写 (ValueError, TypeError)
#     print("两类异常同一处理")

# 任何版本都合法的元组写法；带 as 必须保留括号 ⭐
try:
    int("abc")
except (ValueError, TypeError) as e:
    print("捕获：", type(e).__name__)`,
    },
    {
      id: "5_3", title: "§5.3 异常对象", desc: "except as e 绑定异常对象、print(e) 信息字符串、e.args 参数元组、type(e)",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html#raising-exceptions",
      html: `<ul>
<li><code>except 类型 as e:</code> 把异常对象绑定到名字 <code>e</code>，可在 except 块里查看它</li>
<li><code>print(e)</code>：异常信息字符串</li>
<li><code>e.args</code>：构造异常时传入的<b>参数元组</b></li>
<li><code>type(e)</code>：异常类，如 <code>&lt;class 'ValueError'&gt;</code></li></ul>`,
      code: String.raw`try:
    int("abc")
except ValueError as e:
    print(e)                    # 异常信息字符串
    print(e.args)               # 构造异常时传入的参数元组
    print(type(e).__name__)     # ValueError`,
    },
    {
      id: "5_4", title: "§5.4 raise 主动抛异常与异常链", desc: "raise 抛出异常对象、裸 raise 原样重抛、raise ... from e 显式异常链、__cause__ / __context__",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html#raising-exceptions",
      html: `<ul>
<li><code>raise 异常类型("消息")</code> 主动抛出一个异常对象——业务代码用它<b>拒绝非法数据</b>，比默默返回错误值好</li>
<li>⭐ <b>裸 raise</b>：except 块里单独写 <code>raise</code>，<b>原样重新抛出</b>当前异常（记录日志后常用）</li>
<li>⭐ <b>异常链</b>：<code>raise 新异常 from e</code> 把"底层原因"挂在"高层异常"上；打印 traceback 时会看到 <code>The above exception was the direct cause...</code></li>
<li>相关属性：<code>__cause__</code>（from 指定的直接原因）、<code>__context__</code>（处理 A 时发生 B，A 自动成为上下文）、<code>__suppress_context__</code></li></ul>`,
      code: String.raw`def set_age(age):
    if age < 0:
        raise ValueError(f"年龄不能为负：{age}")   # 抛出一个异常对象
    return age

try:
    set_age(-1)
except ValueError as e:
    print("捕获：", e)

# ⭐ 异常链：把底层原因挂在高层异常上
try:
    try:
        int("abc")
    except ValueError as e:
        raise RuntimeError("解析配置失败") from e     # from：显式指定原因
except RuntimeError as e:
    print("高层：", e)
    print("直接原因 __cause__：", repr(e.__cause__))

# 裸 raise：记录日志后原样重新抛出当前异常
def risky():
    int("abc")

try:
    try:
        risky()
    except ValueError:
        print("记录日志……")
        raise             # 裸 raise：原样重抛
except ValueError as e:
    print("外层再次捕获：", type(e).__name__)`,
    },
    {
      id: "5_5", title: "§5.5 常见内置异常速查", desc: "BaseException 继承体系、except Exception 不吞 Ctrl+C、13 种常见异常对照表",
      doc: "https://docs.python.org/zh-cn/3.14/library/exceptions.html",
      html: `<ul>
<li><b>继承体系（简化）</b>：<code>BaseException</code> 之下分 <code>SystemExit</code>（<code>sys.exit()</code> 触发）、<code>KeyboardInterrupt</code>（Ctrl+C 触发）、⭐ <code>Exception</code>（<b>自定义异常继承它</b>）</li>
<li>Exception 主要分支：<code>ArithmeticError</code> → ZeroDivisionError / OverflowError｜<code>LookupError</code> → KeyError / IndexError｜<code>OSError</code> → FileNotFoundError / PermissionError / TimeoutError｜<code>NameError</code> → UnboundLocalError｜<code>ImportError</code> → ModuleNotFoundError</li>
<li>Exception 其余常见直属：<code>TypeError</code> / <code>ValueError</code> / <code>AttributeError</code> / <code>RuntimeError</code> / <code>RecursionError</code> / <code>NotImplementedError</code> / <code>StopIteration</code> / <code>StopAsyncIteration</code></li>
<li>⭐ <code>KeyboardInterrupt</code> 和 <code>SystemExit</code> <b>不是</b> <code>Exception</code> 的子类——所以 <code>except Exception:</code> 不会误吞 Ctrl+C；但也别写裸 <code>except:</code>（会吞掉一切）</li></ul>
<table><tr><th>异常</th><th>什么时候出现</th></tr>
<tr><td><code>TypeError</code></td><td>类型不对：<code>"1" + 1</code>、参数数量不对</td></tr>
<tr><td><code>ValueError</code></td><td>类型对但值不对：<code>int("abc")</code></td></tr>
<tr><td><code>KeyError</code></td><td>字典取了不存在的键</td></tr>
<tr><td><code>IndexError</code></td><td>序列索引越界</td></tr>
<tr><td><code>AttributeError</code></td><td>对象没有这个属性/方法</td></tr>
<tr><td><code>NameError</code></td><td>用了没定义的名字</td></tr>
<tr><td><code>UnboundLocalError</code></td><td>函数内赋值前就引用同名变量（缺 global/nonlocal）⭐</td></tr>
<tr><td><code>ZeroDivisionError</code></td><td>除以 0</td></tr>
<tr><td><code>FileNotFoundError</code></td><td>打开不存在的文件</td></tr>
<tr><td><code>ModuleNotFoundError</code></td><td>import 了不存在的模块</td></tr>
<tr><td><code>StopIteration</code></td><td>迭代器耗尽（for 循环内部靠它停下）</td></tr>
<tr><td><code>RecursionError</code></td><td>递归太深</td></tr>
<tr><td><code>RuntimeError</code></td><td>如"遍历时修改了字典大小"</td></tr></table>`,
      code: String.raw`errs = []
for action in ("type", "value", "key", "index", "attr", "name"):
    try:
        if action == "type":
            "1" + 1                  # 类型不对 → TypeError
        elif action == "value":
            int("abc")               # 类型对但值不对 → ValueError
        elif action == "key":
            {}["x"]                  # 键不存在 → KeyError
        elif action == "index":
            [][0]                    # 下标越界 → IndexError
        elif action == "attr":
            "s".not_exist            # 属性不存在 → AttributeError
        else:
            print(not_defined)       # 名字未定义 → NameError
    except Exception as e:
        errs.append(type(e).__name__)
print(errs)

# ⭐ KeyboardInterrupt / SystemExit 不是 Exception 的子类——except Exception 不会误吞 Ctrl+C
print(issubclass(KeyboardInterrupt, Exception))   # False
print(issubclass(SystemExit, Exception))          # False
print(issubclass(FileNotFoundError, OSError))     # True`,
    },
    {
      id: "5_6", title: "§5.6 自定义异常", desc: "继承 Exception、类名 + docstring 即可、集中放 exceptions.py、需要附加信息时再写 __init__",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html#user-defined-exceptions",
      html: `<ul>
<li>惯例：<b>继承 Exception</b>，一般只要<b>类名 + docstring</b>，<b>不需要</b>重写 <code>__init__</code>（基类的够用）</li>
<li>项目里常集中放在一个 <code>exceptions.py</code> 中</li>
<li>需要附加信息时再加 <code>__init__</code>：<code>super().__init__(f"...")</code> 传消息，额外数据（如 attempts）存成自己的属性</li>
<li>基类能接住整棵子树：<code>except AppError:</code> 同时抓到 ConfigError、RetryError</li></ul>`,
      code: String.raw`class AppError(Exception):
    """本应用的异常基类。"""

class ConfigError(AppError):
    """配置缺失或非法。"""

# 需要附加信息时再加 __init__
class RetryError(AppError):
    """重试耗尽。"""
    def __init__(self, attempts, last_error):
        super().__init__(f"重试 {attempts} 次后仍失败：{last_error}")
        self.attempts = attempts

try:
    raise RetryError(3, "连接超时")
except AppError as e:                 # 基类能接住所有子类异常
    print(type(e).__name__, "：", e)
    print("重试次数：", e.attempts)`,
    },
    {
      id: "5_7", title: "§5.7 assert 断言", desc: "assert 条件, 消息；-O 模式整体移除；绝不能校验用户输入；assert (a, b) 永远为真",
      doc: "https://docs.python.org/zh-cn/3.14/reference/simple_stmts.html#the-assert-statement",
      html: `<ul>
<li><code>assert 条件, "消息"</code>——条件不成立抛 <code>AssertionError</code>，消息随异常显示</li>
<li>⭐ 铁律 1：assert 是<b>调试工具</b>，<code>python -O</code> 运行时会被<b>整体移除</b>——<b>绝不能</b>用它校验用户输入或做安全检查（该用 if + raise）</li>
<li>⭐ 铁律 2：<code>assert a, b</code> 里逗号后是<b>消息</b>；想断言元组要小心 <code>assert (a, b)</code> 永远为真（非空元组是真值）</li></ul>`,
      code: String.raw`def sqrt(x):
    assert x >= 0, "x 必须非负"
    return x ** 0.5

print(sqrt(16))
try:
    sqrt(-1)
except AssertionError as e:
    print("断言失败：", e)

# ⭐ 别写 assert (a, b)：非空元组永远为真（新版本会给 SyntaxWarning）
# assert (1, 2)   # 错误示范，仅作注释展示`,
    },
    {
      id: "5_8", title: "§5.8 异常组 ExceptionGroup 与 except*（3.11+）", desc: "多个互不相关的异常打包成组、except* 按类型分流处理、TaskGroup 用它传播失败",
      html: `<ul>
<li>⭐ <b>3.11+</b>：多个互不相关的异常（如并发任务中多个子任务失败）可以打包成一个 <code>ExceptionGroup("说明", [异常1, 异常2])</code></li>
<li><code>except* 类型 as eg:</code> 按类型<b>分流处理</b>组内异常；<code>eg.exceptions</code> 是匹配到的异常元组；组内未被任何 <code>except*</code> 匹配的异常会继续向上传播</li>
<li><code>asyncio.TaskGroup</code>（见 §14.3）的失败就是用异常组传播的</li></ul>`,
      code: String.raw`# 3.11+ 语法
try:
    raise ExceptionGroup("批量失败", [ValueError("x"), TypeError("y")])
except* ValueError as eg:
    print("处理其中的 ValueError：", eg.exceptions)
except* TypeError as eg:
    print("处理其中的 TypeError：", eg.exceptions)`,
    },
    {
      id: "5_9", title: "§5.9 最佳实践速记", desc: "捕获具体异常别裸 except、EAFP 比 LBYL 更地道、d.get 等价简洁写法",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html",
      html: `<ul>
<li>捕获<b>具体</b>的异常类型，别写裸 <code>except:</code></li>
<li>⭐ <b>EAFP 风格</b>（先做了再说，出错再处理）在 Python 里比 <b>LBYL</b>（先检查再做）更地道</li>
<li>很多场景有更简洁的等价写法：<code>value = d.get("key", "默认")</code> 代替 try/except KeyError</li></ul>`,
      code: String.raw`d = {"a": 1}

# EAFP（推荐）：先做了再说，出错再处理
try:
    value = d["key"]
except KeyError:
    value = "默认"
print(value)

# 等价简洁写法
print(d.get("key", "默认"))`,
    },
  ],
});
