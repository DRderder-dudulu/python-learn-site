/* ===== 速查·第九层 · 二进制数据（§9.1—§9.4） =====
 * 内容来源：《Python 3 语法完全指南》第九层（outputs/python-syntax-guide-v1.md），1:1 对齐小节；
 * 示例与课程 §9.x 一致或取自指南，均可运行；写文件示例用 _tmp_ 临时文件并在结尾自行清理。
 * 适用版本：3.8—3.14 ｜ 语言规则以 Python 官方文档为准。
 */
CHEATSHEET_ADV.push({
  layerId: 9,
  layer: "第九层 · 二进制数据",
  stage: "二",
  topics: [
    {
      id: "9_1", title: "§9.1 bytes（不可变字节序列）", desc: "字符 vs 字节两座世界、encode/decode 编解码桥、字面量只能 ASCII、下标取出整数、hex、方法参数要加 b 前缀",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#bytes-objects",
      html: `<ul>
<li>文本（str）是"字符"，bytes 是"原始字节"（<b>0~255 的整数序列</b>）；网络传输、图片、压缩包里跑的都是字节</li>
<li><code>b"ABC"</code> 字面量<b>只能放 ASCII 字符</b>；⭐ <code>b[0]</code> 按下标取出的是<b>整数</b> 65，不是字符 "A"；<code>b.hex()</code> → "414243"</li>
<li>⭐ <b>两座世界之间的桥</b>：<code>"你好".encode("utf-8")</code> 编码成字节 → <code>b'\\xe4\\xbd\\xa0\\xe5\\xa5\\xbd'</code>；<code>data.decode("utf-8")</code> 解码回文字——<b>编码/解码必须用同一种格式</b>，拿 ascii 或 gbk 去解 utf-8 的字节，轻则乱码，重则 UnicodeDecodeError</li>
<li>⭐ 网络/文件里拿到 <code>b'...'</code> <b>不等于乱码</b>，它只是"还没解码"；解码时报错多半是编码格式猜错了（utf-8 vs gbk）</li>
<li>bytes 支持与 str 类似的方法：<code>find/replace/split/join/startswith...</code>，但参数也得是 bytes：<code>b"a,b".split(b",")</code> → [b'a', b'b']（⭐ 分隔符要加 b 前缀）</li></ul>`,
      code: String.raw`b = b"ABC"             # bytes 字面量：只能放 ASCII 字符
print(b[0])              # 65：按下标取出的是整数 ⭐
print(b.hex())           # 414243

data = "你好".encode("utf-8")   # str → bytes：编码（两座世界之间的桥）⭐
print(data)                     # b'\xe4\xbd\xa0\xe5\xa5\xbd'
text = data.decode("utf-8")     # bytes → str：解码
print(text)                     # 你好
# data.decode("ascii")          # ❌ UnicodeDecodeError：编码/解码必须用同一种格式

print(b"a,b".split(b","))       # [b'a', b'b']：分隔符也要加 b 前缀 ⭐`,
    },
    {
      id: "9_2", title: "§9.2 bytearray（可变字节序列）", desc: "bytes 的可变版、按下标赋整数、append/extend 就地改、bytes() 冻回不可变、读二进制文件缓冲区",
      doc: "https://docs.python.org/zh-cn/3.14/library/stdtypes.html#bytearray-objects",
      html: `<ul>
<li><code>bytearray</code> 是 bytes 的<b>可变版</b>：能按下标改、<code>append</code>、<code>extend</code>，改的是原对象本身</li>
<li>⭐ 按下标赋的是<b>整数</b>不是字符：<code>ba[0] = 97</code> 表示字节 'a'（范围 0~255，赋 256 会 ValueError）</li>
<li>bytes 不可变，任何"修改"都会新建对象；需要<b>就地改字节</b>时（如读写缓冲区）用 bytearray</li>
<li><code>ba.append(68)</code> 追加一个字节（68 就是 'D'）；<code>ba.extend(b"EF")</code> 批量追加</li>
<li><code>bytes(ba)</code> 把可变的 bytearray 冻回不可变的 bytes</li>
<li>读二进制文件常配合它做缓冲区</li></ul>`,
      code: String.raw`ba = bytearray(b"ABC")
ba[0] = 97          # ✅ 可以改：按下标赋整数（97 就是 'a'）
print(ba)           # bytearray(b'aBC')
ba.append(68)       # 68 就是 'D'
ba.extend(b"EF")
print(ba)           # bytearray(b'aBCDEF')
print(bytes(ba))    # b'aBCDEF'：冻回不可变的 bytes
# ba[0] = 256       # ❌ ValueError：一个字节最大只能到 255`,
    },
    {
      id: "9_3", title: "§9.3 memoryview（零拷贝视图）", desc: "不复制数据的视图、透过视图直接改底层字节、大二进制数据省内存、rb/wb 二进制文件读写",
      doc: "https://docs.python.org/zh-cn/3.14/library/io.html#io.BytesIO",
      html: `<ul>
<li><code>memoryview</code> 是<b>不复制数据</b>的"视图"：直接"透过视图"操作 bytes/bytearray 的片段，处理大二进制数据时省内存 ⭐</li>
<li><code>mv[6:] = b"WORLD"</code> 通过视图改底层数据，<b>不发生拷贝</b>——改视图就是改原数据</li>
<li>配套知识：<code>open(path, "rb")</code> 读出来的是 bytes、<code>"wb"</code> 写入也必须给 bytes——编解码要自己接手；内存里可用 <code>io.BytesIO</code> 模拟二进制文件练手（接口和真文件一样）</li>
<li>文件指针概念与文本文件相同：写完想从头读，先 <code>seek(0)</code> 回到开头</li></ul>`,
      code: String.raw`import os

data = bytearray(b"hello world")
mv = memoryview(data)      # 零拷贝视图：不复制数据
mv[6:] = b"WORLD"          # 透过视图改底层数据，不发生拷贝
print(data)                # bytearray(b'hello WORLD')

# 二进制文件：rb 读出的是 bytes，wb 写入也必须给 bytes
with open("_tmp_bin.dat", "wb") as f:
    f.write("你好".encode("utf-8"))   # 写入前自己编码
    f.write(b"\x00\x01")

with open("_tmp_bin.dat", "rb") as f:
    raw = f.read()
print(raw)
print(raw[:6].decode("utf-8"))       # 前 6 字节解码回文字：你好

os.remove("_tmp_bin.dat")            # 清理临时文件`,
    },
    {
      id: "9_4", title: "§9.4 struct（二进制结构打包）", desc: "pack/unpack 按格式串打包、i/h/B/f 格式字符、大端小端字节序、网络协议与文件头解析",
      doc: "https://docs.python.org/zh-cn/3.14/library/struct.html",
      html: `<ul>
<li>网络协议、文件格式解析时按<b>格式串</b>打包/解包：<code>struct.pack("&gt;ih", 1000, 2)</code> 打成 bytes；<code>struct.unpack("&gt;ih", packed)</code> 解回元组 (1000, 2)</li>
<li>常用格式字符：<code>i</code>=4 字节 int、<code>h</code>=2 字节 short、<code>B</code>=1 字节无符号、<code>f</code>=4 字节 float</li>
<li><b>字节序</b>：<code>&gt;</code> 大端（高位字节在前，网络协议通用）、<code>&lt;</code> 小端（x86 内存常见）⭐</li>
<li>⭐ 不写字节序就按本机习惯来：<b>跨平台/写协议务必显式指定</b>，且解包格式必须与打包完全一致，否则解出垃圾数据</li>
<li>用途：二进制协议、文件头解析；日常纯文本处理用不到，知道即可</li></ul>`,
      code: String.raw`import struct

packed = struct.pack(">ih", 1000, 2)   # > 大端；i=4字节int，h=2字节short
print(packed)
print(packed.hex())                    # 000003e80002
print(struct.unpack(">ih", packed))    # (1000, 2)：用同一格式串解包

little = struct.pack("<ih", 1000, 2)   # < 小端：同样的数，字节顺序相反
print(little.hex())                    # e80300000200
print(len(packed))                     # 6：4 + 2 字节`,
    },
  ],
});
