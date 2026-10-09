/* ===== 课程内容数据 · 第九层 =====
 * 内容来源：《Python 3 语法完全指南》（outputs/python-syntax-guide.md）第九层 · 二进制数据。
 * 写法规范：section.id 即指南小节号；points 为分条要点（内联 <code>/<b>）；
 * 【对应规范】points 每条要点必须在 code 中有明确对应：可演示的写成可运行代码并配注释；
 * 错误/危险示范以「故意注释掉」的形式呈现（学员可取消注释亲测报错）；
 * code 示例均经本地 Python 实际运行验证（tools/verify_examples.py + verify_expects.py）；expect 为真实输出。
 * 说明：二进制文件读写示例改用 io.BytesIO 在内存中模拟（不依赖真实磁盘文件，浏览器 Pyodide 也能跑）。
 * 适用版本：3.8—3.14 ｜ 最后核对：2026-10
 */
COURSE.push({
  id: 9,
  title: "第九层 · 二进制数据",
  minutes: 35,
  goal: "分清字符与字节两座世界：编解码、bytearray、memoryview 与 struct 打包",
  prereq: "第八层（文件读写）",
  versions: "3.8—3.14",
  checked: "2026-10",
  sections: [
    {
      id: "9.1", title: "bytes：字符与字节的两座世界",
      what: "str 是字符、bytes 是原始字节（0—255 的整数序列）；encode 把文字编成字节，decode 把字节解回文字。",
      use: "文字进出网络、图片、压缩包时都会变成字节。看到 b'...' 或撞上 UnicodeDecodeError，就是两座世界没对上，回这节搭桥。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#bytes-objects",
      points: [
        "str 是「字符」，bytes 是「原始字节」（0—255 的整数序列）；网络传输、图片、压缩包里跑的都是字节",
        "<code>b\"ABC\"</code> 字面量只能写 ASCII 字符；⭐ <code>b[0]</code> 取出来的是<b>整数</b> 65，不是字符 A",
        "两座世界之间的桥：<code>\"你好\".encode(\"utf-8\")</code> 编码成字节，<code>data.decode(\"utf-8\")</code> 解码回文字",
        "⭐ 编解码必须用同一种格式：拿 gbk 去解 utf-8 的字节，轻则乱码，重则 UnicodeDecodeError",
        "bytes 的方法与 str 类似（find/split/replace/startswith……），但参数也得是 bytes（记得加 b 前缀）",
      ],
      code: String.raw`b = b"ABC"              # bytes 字面量：只能写 ASCII 字符
print(b[0])              # ⭐ 按下标取出的是整数 65，不是字符 "A"
print(list(b))           # bytes 就是 0—255 的整数序列
print(b.hex())           # 414243：网络传输、图片、压缩包里跑的就是这种字节

data = "你好".encode("utf-8")   # 两座世界之间的桥：str → bytes 编码
print(data)
print(data.decode("utf-8"))     # bytes → str 解码回文字

# data.decode("gbk")            # ⭐ 错误示范（故意注释掉）：编解码必须同格式，拿 gbk 解 utf-8 轻则乱码重则 UnicodeDecodeError
print(b"a,b".split(b","))       # bytes 方法与 str 类似，但参数也得是 bytes（记得加 b 前缀）
print(b"img.png".startswith(b"img"))  # find/replace/startswith…… 同理`,
      expect: "65\n[65, 66, 67]\n414243\nb'\\xe4\\xbd\\xa0\\xe5\\xa5\\xbd'\n你好\n[b'a', b'b']\nTrue",
      note: "把 decode 的参数改成 \"gbk\" 再运行，看看会报错还是解出奇怪的文字。",
    },
    {
      id: "9.2", title: "bytearray：可变的字节序列",
      what: "bytearray 是 bytes 的可变版：能按下标改、append、extend，改的是原对象本身；bytes(...) 能再冻回不可变。",
      use: "要就地改字节时用——比如边收数据边改缓冲区。普通 bytes 改不了、只能新建，这时候换 bytearray。",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#bytearray-objects",
      points: [
        "bytearray 是 bytes 的<b>可变版</b>：能按下标改、append、extend，改的是原对象本身",
        "⭐ 按下标赋的是<b>整数</b>不是字符：<code>ba[0] = 97</code> 表示字节 'a'",
        "bytes 不可变，任何「修改」都会新建对象；需要就地改字节时（如读写缓冲区）用 bytearray",
        "<code>bytes(ba)</code> 把可变的 bytearray 冻回不可变的 bytes",
      ],
      code: String.raw`ba = bytearray(b"ABC")
ba[0] = 97          # ⭐ 按下标赋的是整数：97 就是 'a'，改的是原对象本身
print(ba)
ba.append(68)       # append 一个整数：68 就是 'D'
ba.extend(b"EF")    # extend 接上另一个字节串
print(ba)
print(bytes(ba))    # bytes(ba)：把可变的冻回不可变的 bytes

b = b"ABC"
# b[0] = 97         # ⭐ 错误示范（故意注释掉）：bytes 不可变，会报 TypeError；就地改字节请用 bytearray
b2 = b.replace(b"A", b"a")   # bytes 的任何「修改」都会新建对象
print(b, b2)`,
      expect: "bytearray(b'aBC')\nbytearray(b'aBCDEF')\nb'aBCDEF'\nb'ABC' b'aBC'",
      note: "试试 ba[0] = 256 会报什么错——一个字节最大只能到 255。",
    },
    {
      id: "9.3", title: "二进制文件读写与 memoryview",
      what: "用 rb/wb 模式打开的文件，读写的都是 bytes；memoryview 是开在字节上的「视图」，不复制数据，透过它直接改底层字节。",
      use: "读写图片、音频这类非文本文件时用 rb/wb，编解码得自己接手。数据量大、又想省内存地只改其中一段时，就用 memoryview 开「视图」。",
      doc: "https://docs.python.org/zh-cn/3.14/library/io.html#io.BytesIO",
      points: [
        "<code>open(path, \"rb\")</code> 读出来的是 bytes、<code>\"wb\"</code> 写入也必须给 bytes——编解码要自己接手",
        "这里用 <code>io.BytesIO</code> 在内存里模拟二进制文件：接口和真文件一样，浏览器里也能跑",
        "文件指针概念与文本文件相同：写完想从头读，先 <code>seek(0)</code> 回到开头",
        "<code>memoryview</code> 是不复制的「视图」：透过它直接改底层字节，处理大二进制数据时省内存 ⭐",
      ],
      code: String.raw`import io

# 真实文件的标准写法（这里改用 BytesIO 在内存里模拟，接口完全一样，浏览器里也能跑）：
# with open("a.bin", "wb") as f:      # "wb" 写入必须给 bytes，编解码要自己接手
#     f.write("你好".encode("utf-8"))
# with open("a.bin", "rb") as f:      # "rb" 读出来的是 bytes
#     print(f.read())

buf = io.BytesIO()                  # 内存里的「二进制文件」
buf.write("你好".encode("utf-8"))   # 写入必须是 bytes
buf.write(b"\x00\x01")

buf.seek(0)                         # 文件指针：写完想从头读，先 seek(0) 回到开头
data = buf.read()
print(data)
print(data[:6].decode("utf-8"))     # 前 6 字节解码回文字

ba = bytearray(b"hello world")
mv = memoryview(ba)                 # ⭐ memoryview：不复制的「视图」，省内存
mv[6:] = b"WORLD"                   # 透过视图直接改底层字节
print(ba)`,
      expect: "b'\\xe4\\xbd\\xa0\\xe5\\xa5\\xbd\\x00\\x01'\n你好\nbytearray(b'hello WORLD')",
      note: "把 mv[6:] 改成 mv[:5] = b\"HELLO\"，体会「改视图就是改原数据」。",
    },
    {
      id: "9.4", title: "struct：按格式串打包字节",
      what: "struct 按「格式串」把数字打成固定长度的字节：pack 打包、unpack 解包，格式字符规定占几个字节、怎么排。",
      use: "解析文件头、跟网络协议打交道时，要把数字按固定字节数打包再解回来，就用它。日常纯文本处理用不到，见到不慌即可。",
      doc: "https://docs.python.org/zh-cn/3.14/library/struct.html",
      points: [
        "<code>struct.pack(格式串, 值...)</code> 把数字按固定字节数打成 bytes；<code>struct.unpack(格式串, 字节)</code> 解回元组",
        "常用格式字符：i=4 字节 int、h=2 字节 short、B=1 字节无符号、f=4 字节 float",
        "<b>字节序</b>：<code>&gt;</code> 大端（高位在前，网络协议通用）、<code>&lt;</code> 小端（x86 内存常见）⭐",
        "⭐ 不写字节序就按本机习惯来：跨平台/写协议务必显式指定，且解包格式必须与打包完全一致",
        "用途：网络协议、文件头解析；日常纯文本处理用不到，见到不慌即可",
      ],
      code: String.raw`import struct

# 用途：网络协议、文件头解析；日常纯文本处理用不到，见到不慌即可
packed = struct.pack(">ih", 1000, 2)   # ⭐ > 大端（高位在前，网络协议通用）：i=4字节int + h=2字节short
print(packed)
print(packed.hex())
print(struct.unpack(">ih", packed))    # unpack 解回元组；格式串必须与打包完全一致

little = struct.pack("<ih", 1000, 2)   # < 小端（x86 内存常见）：同样的数，字节顺序相反
print(little.hex())
print(len(packed))                     # 4 + 2 = 6 字节

one = struct.pack(">Bf", 65, 0.5)      # B=1字节无符号、f=4字节float
print(one.hex())
print(struct.unpack(">Bf", one))

# struct.pack("ih", 1000, 2)           # ⭐ 不写字节序就按本机习惯来：跨平台/写协议务必显式指定
# struct.unpack(">hi", packed)         # ⭐ 错误示范（故意注释掉）：解包格式与打包不一致，会报 struct.error`,
      expect: "b'\\x00\\x00\\x03\\xe8\\x00\\x02'\n000003e80002\n(1000, 2)\ne80300000200\n6\n413f000000\n(65, 0.5)",
      note: "把 \">ih\" 换成 \"ih\"（不写字节序）对比 hex 输出，体会为什么要显式指定。",
    },
  ],
  quiz: [
    { q: "b = b\"ABC\"，则 b[0] 是？",
      options: ["整数 65", "字符 \"A\"", "长度为 1 的 bytes：b\"A\"", "报 TypeError"], answer: 0,
      explain: "Python 3 里 bytes 按下标取出的是 0—255 的整数；想要单字节 bytes 得切片 b[0:1]。" },
    { q: "把 str 转成 bytes，正确的是？",
      options: ["\"你好\".encode(\"utf-8\")", "\"你好\".decode(\"utf-8\")", "bytes(\"你好\")", "b\"你好\""], answer: 0,
      explain: "编码用 str.encode()；decode 是 bytes 的方法；bytes(\"你好\") 缺编码参数会报 TypeError；b 前缀字面量只能写 ASCII 字符。" },
    { q: "struct.pack(\">ih\", 1000, 2) 里 > 表示？",
      options: ["按大端字节序打包（高位字节在前）", "按小端字节序打包", "向右对齐填充", "打包成变长字节"], answer: 0,
      explain: "> 是大端（网络字节序），< 是小端；跨平台/写协议时必须显式指定，否则解包方可能读出垃圾数据。" },
  ],
});
