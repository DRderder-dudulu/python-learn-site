/* ===== 课程内容数据 · 第五层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第五层 · 异常处理。
 * 写法规范：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py + verify_expects.py）；expect 为真实输出。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 5,
  title: "第五层 · 异常处理",
  minutes: 50,
  goal: "会用 try 保护程序、认识常见异常、会主动抛出和自定义异常",
  prereq: "第一~四层",
  versions: "3.8—3.14",
  checked: "2026-10",
  sections: [
    {
      id: "5.1", title: "try / except / else / finally",
      use: "程序可能出错的地方（比如解析用户输入）用它兜底：出错给个交代，而不是直接崩溃。清理动作放 finally，异常要抓具体的，别一把全吞。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html",
      points: [
        "捕获<b>具体</b>的异常类型，别写裸 except:（会吞掉一切，包括 Ctrl+C 之外的系统异常）",
        "一个 except 抓多种异常用元组 (A, B)；3.14+ 不带 as 时可省略括号",
        "else 在 try 块顺利跑完时执行；finally 基本总会执行（清理动作用）⭐",
        "🔶 进阶坑：finally 里写 return 会覆盖返回值——知道即可（指南 §5.1）",
      ],
      code: String.raw`def parse(raw):
    try:
        return int(raw)
    except ValueError:               # 捕获【具体】的异常类型，别写裸 except:
        return "不是数字"
    # except:                        # ⭐ 错误示范（故意注释掉）：裸 except 会吞掉一切异常
    finally:
        print("尝试解析完毕")         # ⭐ finally 基本总会执行，清理动作放这里

print(parse("42"))
print(parse("abc"))

try:
    {}["x"]
except (KeyError, IndexError) as e:  # 一个 except 抓多种异常：用元组 (A, B)
    print("抓到：", type(e).__name__)
# 3.14+ 不带 as 时还可省略括号：except KeyError, IndexError:

try:
    n = int("42")
except ValueError:
    print("解析失败")
else:
    print("解析成功：", n)            # else：try 块顺利跑完（没出异常）才执行

def demo():
    try:
        return "try 的返回值"
    finally:
        return "finally 的返回值"     # 🔶 进阶坑：finally 里写 return 会覆盖返回值
print(demo())`,
      expect: "尝试解析完毕\n42\n尝试解析完毕\n不是数字\n抓到： KeyError\n解析成功： 42\nfinally 的返回值",
      note: "观察 finally 在 return 之前还是之后执行——答案：return 生效前。",
    },
    {
      id: "5.2", title: "异常对象与 raise",
      use: "数据不对时主动报错（raise），比默默返回错误值强。想先记日志再把问题往上交就裸 raise 重抛；raise ... from e 能把底层原因一起带上。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html#raising-exceptions",
      points: [
        "except X as e 拿到异常对象：e.args 是构造参数",
        "raise 异常类型(\"消息\") 主动抛出；except 块里写裸 raise 是原样重抛",
        "raise 新异常 from e 形成异常链，保留底层原因",
      ],
      code: String.raw`def set_age(age):
    if age < 0:
        raise ValueError(f"年龄不能为负：{age}")   # raise 异常类型("消息")：主动抛出
    return age

try:
    set_age(-1)
except ValueError as e:              # except X as e：拿到异常对象
    print("捕获：", e)
    print("构造参数：", e.args)       # e.args 是构造时传入的参数

def demo_reraise():
    try:
        set_age(-2)
    except ValueError:
        print("先记一笔日志")
        raise                        # except 块里写裸 raise：原样重抛

try:
    demo_reraise()
except ValueError as e:
    print("外层又抓到：", e)

try:
    try:
        int("abc")
    except ValueError as e:
        raise RuntimeError("数据加载失败") from e   # raise 新异常 from e：异常链
except RuntimeError as e:
    print("链顶层：", type(e).__name__, "-", e)
    print("底层原因：", type(e.__cause__).__name__, "-", e.__cause__)`,
      expect: "捕获： 年龄不能为负：-1\n构造参数： ('年龄不能为负：-1',)\n先记一笔日志\n外层又抓到： 年龄不能为负：-2\n链顶层： RuntimeError - 数据加载失败\n底层原因： ValueError - invalid literal for int() with base 10: 'abc'",
      note: "业务代码里用 raise 拒绝非法数据，比默默返回错误值好。",
    },
    {
      id: "5.3", title: "常见内置异常速查",
      use: "报错看不懂时回这节对号入座：异常名基本就告诉你是哪一类错。顺便弄清为什么 except Exception 不会误吞 Ctrl+C。",
      doc: "https://docs.python.org/zh-cn/3.14/library/exceptions.html",
      points: [
        "TypeError 类型不对 / ValueError 值不对 / KeyError 键不存在 / IndexError 下标越界",
        "AttributeError 属性不存在 / NameError 名字未定义 / UnboundLocalError 缺 global",
        "⭐ KeyboardInterrupt 和 SystemExit 不是 Exception 的子类——except Exception 不会误吞 Ctrl+C",
        "完整速查表见指南 §5.5 与附录 B 报错自查",
      ],
      code: String.raw`errs = []

def capture(label, func):
    try:
        func()
    except Exception as e:
        errs.append(f"{label}: {type(e).__name__}")

capture("类型不对", lambda: "1" + 1)    # TypeError：类型不对
capture("值不对", lambda: int("abc"))   # ValueError：值不对
capture("键不存在", lambda: {}["x"])    # KeyError：键不存在
capture("下标越界", lambda: [][0])      # IndexError：下标越界
capture("属性不存在", lambda: (1).xxx)  # AttributeError：属性不存在
capture("名字未定义", lambda: 没定义过)  # NameError：名字未定义

count = 0
def f():
    count = count + 1   # 想改外层变量却没写 global：count 被当成没赋过值的局部变量
capture("缺 global", f)                 # UnboundLocalError：缺 global

print(*errs, sep="\n")

# ⭐ KeyboardInterrupt / SystemExit 不是 Exception 的子类：
print(issubclass(KeyboardInterrupt, Exception))  # False，except Exception 不会误吞 Ctrl+C
print(issubclass(SystemExit, Exception))         # False
# 完整速查表见指南 §5.5 与附录 B 报错自查`,
      expect: "类型不对: TypeError\n值不对: ValueError\n键不存在: KeyError\n下标越界: IndexError\n属性不存在: AttributeError\n名字未定义: NameError\n缺 global: UnboundLocalError\nFalse\nFalse",
      note: "报错博物馆（导航栏）里可以玩交互式猜错因。",
    },
    {
      id: "5.4", title: "自定义异常",
      use: "内置异常说不清业务错误时（比如「用户不存在」），就自己定义一个，调用方一看名字就知道该抓什么。项目里通常集中放在一个 exceptions.py。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html#user-defined-exceptions",
      points: [
        "继承 Exception；通常只要类名 + docstring，不必重写 __init__",
        "项目里常集中放在一个 exceptions.py 中",
      ],
      code: String.raw`# 项目里常把自定义异常集中放在一个 exceptions.py 中
class AppError(Exception):
    """应用异常基类：继承 Exception，通常只要类名 + docstring。"""

class NotFoundError(AppError):
    """找不到资源时抛出。"""            # 不必重写 __init__

def check(x):
    if x < 0:
        raise AppError("不能为负")
    return x

try:
    check(-5)
except AppError as e:
    print("抓到自定义异常：", e)

try:
    raise NotFoundError("用户不存在")
except AppError as e:                   # 子类异常也会被基类的 except 抓住
    print("子类也被抓住：", type(e).__name__, "-", e)`,
      expect: "抓到自定义异常： 不能为负\n子类也被抓住： NotFoundError - 用户不存在",
      note: "需要附加信息时再写 __init__ 并调 super().__init__（指南 §5.6）。",
    },
    {
      id: "5.5", title: "assert 断言",
      use: "写代码时自查「这里肯定成立」的假设用 assert，写测试最常用。但校验用户输入别靠它——它会被 -O 模式整个删掉，正式校验用 if + raise。",
      doc: "https://docs.python.org/zh-cn/3.14/reference/simple_stmts.html#the-assert-statement",
      points: [
        "assert 条件, \"消息\"——条件不成立抛 AssertionError",
        "⭐ assert 是调试工具：python -O 运行时会被整体移除",
        "⭐ 所以绝不能用它校验用户输入或做安全检查（该用 if + raise）",
      ],
      code: String.raw`def sqrt(x):
    assert x >= 0, "x 必须非负"      # assert 条件, "消息"：条件不成立抛 AssertionError
    return x ** 0.5

print(sqrt(16))
try:
    sqrt(-1)
except AssertionError as e:
    print("断言失败：", e)

# ⭐ assert 只是调试工具：python -O 运行时会被整体移除
# ⭐ 所以绝不能用它校验用户输入或做安全检查——正式校验该用 if + raise：
def sqrt_safe(x):
    if x < 0:
        raise ValueError("x 必须非负")
    return x ** 0.5

try:
    sqrt_safe(-1)
except ValueError as e:
    print("正式校验：", e)`,
      expect: "4.0\n断言失败： x 必须非负\n正式校验： x 必须非负",
      note: "测试代码里大量使用 assert（指南 §18.4 pytest）。",
    },
    {
      id: "5.6", title: "最佳实践：EAFP 风格",
      use: "Python 的地道风格：先做再说，出错再处理，而不是先问「能不能做」。简单场景可以更省事，比如 d.get 代替 try/except KeyError。",
      doc: "https://docs.python.org/zh-cn/3.14/tutorial/errors.html",
      points: [
        "EAFP：先做了再说、出错再处理——Python 的地道风格",
        "很多场景有更简洁的等价写法（如 d.get 代替 try/except KeyError）",
        "🔶 异常组 ExceptionGroup 与 except* 是 3.11+ 的进阶内容（指南 §5.8），第一遍跳过",
      ],
      code: String.raw`d = {"a": 1}

# EAFP 风格：先做了再说，出错再处理——Python 的地道风格
try:
    v = d["b"]
except KeyError:
    v = "默认"
print(v)

# 很多场景有更简洁的等价写法：d.get 代替 try/except KeyError
print(d.get("b", "默认"))

# 🔶 进阶内容（3.11+，第一遍跳过，指南 §5.8）：
# ExceptionGroup 把多个异常打包抛出，配合 except* 按类型分别捕获`,
      expect: "默认\n默认",
      note: "两种写法都对，简单场景优先 d.get。",
    },
  ],
  quiz: [
    { q: "except 块里的 else 子句什么时候执行？",
      options: ["try 块顺利跑完（没出异常）时", "出异常时", "finally 之后总是执行", "从不执行"], answer: 0,
      explain: "else 只在没出异常时执行。" },
    { q: "一个 except 捕获多种异常的正确写法是？",
      options: ["except (KeyError, IndexError):", "except KeyError, IndexError:", "except KeyError or IndexError:", "except [KeyError, IndexError]:"], answer: 0,
      explain: "用元组；3.14+ 不带 as 时才可省略括号。" },
    { q: "为什么不能写 assert 校验用户输入？",
      options: ["python -O 运行时 assert 会被移除", "assert 太慢", "assert 不能带消息", "assert 只能用于数字"], answer: 0,
      explain: "assert 是调试工具，-O 模式被移除，校验要用 if + raise。" },
  ],
});
