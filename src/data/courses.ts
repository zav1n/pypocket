import { LOGIC_COURSES } from './logicCourses';
import { TEXTBOOK_COURSES } from './textbookCourses';

export interface Lesson {
  id: string;
  track: 'rookie' | 'spider' | 'backend' | 'ai' | 'advanced' | 'project' | 'logic' | 'textbook';
  title: string;
  markdown: string;
  starterCode: string;
  testCode: string;
  solution: string;
}

export const TRACKS: Record<Lesson['track'], { label: string; desc: string }> = {
  rookie: { label: '新手村', desc: '从 0 到能写小程序' },
  spider: { label: '爬虫线', desc: '从文字里把数据抠出来' },
  backend: { label: '后端线', desc: '用字典和函数搭小接口' },
  ai: { label: 'AI 线', desc: '列表、统计，迈向数据分析' },
  advanced: { label: '进阶篇', desc: '第二阶段：类、异常、文件，迈向独立写程序' },
  project: { label: '实战项目', desc: '第二阶段：三条线各做一个能跑通的小项目' },
  logic: { label: '逻辑实战', desc: '有状态、多步骤、有边界的小系统，代码量上一个台阶' },
  textbook: { label: '教科书进阶', desc: '按主流教科书补齐的核心章节：切片、while、递归、生成器、继承、JSON、正则进阶等' },
};

export const COURSES: Lesson[] = [
  {
    id: 'rookie-01',
    track: 'rookie',
    title: '第 1 关：会说话的机器与变量盒子',
    markdown: `### 1. 让屏幕开口说话
在 Python 里，想显示任何内容，只需要 \`print()\`。

### 2. 变量：贴了标签的收纳盒
把数据装进盒子，以后直接喊盒子的名字就能用：

\`\`\`python
name = "小白"
age = 18
print(f"你好，我是{name}，今年{age}岁") # 前面的 f 很重要，花括号里能直接放变量！
\`\`\`

🎯 **通关任务**：创建一个名为 \`coffee_price\` 的变量并赋值为 \`25\`，然后打印它。`,
    starterCode: `# 在下方写下你的代码\ncoffee_price = \nprint(coffee_price)`,
    testCode: `assert 'coffee_price' in globals(), "你还没有创建 coffee_price 变量哦！"\nassert coffee_price == 25, f"价格不对哦，期望是 25，你写的是 {coffee_price}"`,
    solution: `coffee_price = 25\nprint(coffee_price)`,
  },
  {
    id: 'rookie-02',
    track: 'rookie',
    title: '第 2 关：f-string 拼一句话',
    markdown: `### f-string 是什么
在字符串前面加 \`f\`，花括号里的变量会被替换成真正的值。

\`\`\`python
city = "上海"
print(f"我在{city}学习 Python")
\`\`\`

🎯 **通关任务**：已有 \`name = "小白"\` 和 \`age = 18\`，请用 f-string 生成 \`greeting\`，内容正好是：你好，我是小白，今年18岁`,
    starterCode: `name = "小白"\nage = 18\n# 请补全 greeting\ngreeting = \nprint(greeting)`,
    testCode: `assert greeting == "你好，我是小白，今年18岁", f"内容不对哦，你得到的是：{greeting}"`,
    solution: `name = "小白"\nage = 18\ngreeting = f"你好，我是{name}，今年{age}岁"\nprint(greeting)`,
  },
  {
    id: 'rookie-03',
    track: 'rookie',
    title: '第 3 关：if 判断，及格了吗',
    markdown: `### if / else
程序会按条件走不同的路。注意冒号和缩进（4 个空格）：

\`\`\`python
score = 85
if score >= 60:
    print("及格")
else:
    print("再接再厉")
\`\`\`

🎯 **通关任务**：\`score = 85\`。如果分数大于等于 60，\`result = "及格"\`，否则 \`result = "不及格"\`，最后打印 \`result\`。`,
    starterCode: `score = 85\n# 请写出 if / else\nprint(result)`,
    testCode: `assert result == "及格", f"result 应该是 及格，你写的是：{result}"`,
    solution: `score = 85\nif score >= 60:\n    result = "及格"\nelse:\n    result = "不及格"\nprint(result)`,
  },
  {
    id: 'rookie-04',
    track: 'rookie',
    title: '第 4 关：for 循环求和',
    markdown: `### for 循环
\`range(1, 11)\` 会产生 1 到 10。循环就是把同一件事重复做：

\`\`\`python
total = 0
for i in range(1, 4):
    total = total + i
print(total)  # 6
\`\`\`

🎯 **通关任务**：用 for 循环算出 1 到 10 的和，存到 \`total\` 里并打印它。答案应该是 55。`,
    starterCode: `total = 0\n# 请用 for 循环累加 1 到 10\nprint(total)`,
    testCode: `assert total == 55, f"total 应该是 55，你算出的是：{total}"`,
    solution: `total = 0\nfor i in range(1, 11):\n    total = total + i\nprint(total)`,
  },
  {
    id: 'rookie-05',
    track: 'rookie',
    title: '第 5 关：列表，水果篮子',
    markdown: `### 列表 list
列表就是一排盒子，用方括号装起来。\`append\` 可以往末尾加一个：

\`\`\`python
fruits = ["苹果", "橙子"]
fruits.append("香蕉")
print(fruits)  # ['苹果', '橙子', '香蕉']
\`\`\`

🎯 **通关任务**：已有 \`fruits = ["苹果", "橙子"]\`，请往里面加一个 \`"香蕉"\`，并打印列表。`,
    starterCode: `fruits = ["苹果", "橙子"]\n# 请加一个香蕉\nprint(fruits)`,
    testCode: `assert fruits == ["苹果", "橙子", "香蕉"], f"列表不对哦，你得到的是：{fruits}"`,
    solution: `fruits = ["苹果", "橙子"]\nfruits.append("香蕉")\nprint(fruits)`,
  },
  {
    id: 'rookie-06',
    track: 'rookie',
    title: '第 6 关：函数，把重复劳动打包',
    markdown: `### def 定义函数
函数像一台小机器：给它原料（参数），它还你结果（return）。

\`\`\`python
def add(a, b):
    return a + b

print(add(2, 3))  # 5
\`\`\`

🎯 **通关任务**：定义函数 \`add(a, b)\`，返回两数之和，并打印 \`add(2, 3)\`。`,
    starterCode: `# 请定义 add 函数\nprint(add(2, 3))`,
    testCode: `assert add(2, 3) == 5, "add(2, 3) 应该等于 5"\nassert add(10, 20) == 30, "add(10, 20) 应该等于 30"`,
    solution: `def add(a, b):\n    return a + b\n\nprint(add(2, 3))`,
  },
  {
    id: 'spider-01',
    track: 'spider',
    title: '爬虫第 1 关：从一句话里抠出价格',
    markdown: `### 爬虫的第一步不是发请求，是解析文字
很多时候数据就藏在一串文字里，\`split\` 可以按分隔符切开它：

\`\`\`python
data = "书名：Python入门，价格：59"
price_text = data.split("价格：")[1]  # '59'
price = int(price_text)
print(price)
\`\`\`

🎯 **通关任务**：从 \`data\` 里取出价格，存到整数变量 \`price\` 里并打印它。`,
    starterCode: `data = "书名：Python入门，价格：59"\n# 请取出价格\nprint(price)`,
    testCode: `assert price == 59, f"price 应该是 59，你得到的是：{price}"\nassert isinstance(price, int), "price 应该是整数 int，别忘了用 int() 转换"`,
    solution: `data = "书名：Python入门，价格：59"\nprice = int(data.split("价格：")[1])\nprint(price)`,
  },
  {
    id: 'spider-02',
    track: 'spider',
    title: '爬虫第 2 关：正则，一次抠出所有数字',
    markdown: `### re.findall
正则表达式是找规律的工具。\`\\\\d+\` 的意思是“一串数字”：

\`\`\`python
import re
text = "价格 59 元，销量 1200"
numbers = re.findall(r"\\d+", text)
print(numbers)  # ['59', '1200']
\`\`\`

注意：findall 返回的是字符串列表，不是整数列表。

🎯 **通关任务**：用 \`re.findall\` 从 \`text\` 里找出所有数字，存到 \`numbers\` 里。`,
    starterCode: `import re\ntext = "价格 59 元，销量 1200"\n# 请找出所有数字\nprint(numbers)`,
    testCode: `assert numbers == ["59", "1200"], f"numbers 应该是 ['59', '1200']，你得到的是：{numbers}"`,
    solution: `import re\ntext = "价格 59 元，销量 1200"\nnumbers = re.findall(r"\\d+", text)\nprint(numbers)`,
  },
  {
    id: 'backend-01',
    track: 'backend',
    title: '后端第 1 关：字典就是一张用户表',
    markdown: `### 字典 dict
字典用花括号，是一对对的“键：值”，像一张小表格：

\`\`\`python
user = {"name": "小白", "age": 18}
print(user["name"])  # 小白
\`\`\`

🎯 **通关任务**：给 \`user\` 加一个键 \`"city"\`，值是 \`"上海"\`，并打印整个字典。`,
    starterCode: `user = {"name": "小白", "age": 18}\n# 请加 city\nprint(user)`,
    testCode: `assert user.get("city") == "上海", f"user['city'] 应该是 上海，你得到的是：{user.get('city')}"`,
    solution: `user = {"name": "小白", "age": 18}\nuser["city"] = "上海"\nprint(user)`,
  },
  {
    id: 'backend-02',
    track: 'backend',
    title: '后端第 2 关：给订单算总价',
    markdown: `### 函数 + 列表 + 字典，拼出一个小接口
真实后端经常这样算钱：遍历订单，把每个价格加起来。

\`\`\`python
orders = [{"name": "咖啡", "price": 25}, {"name": "蛋糕", "price": 30}]
\`\`\`

🎯 **通关任务**：定义 \`total_price(orders)\`，返回所有订单价格之和，并打印 \`total_price(orders)\`。`,
    starterCode: `orders = [{"name": "咖啡", "price": 25}, {"name": "蛋糕", "price": 30}]\n# 请定义 total_price 函数\nprint(total_price(orders))`,
    testCode: `assert total_price(orders) == 55, f"总价应该是 55，你算出的是：{total_price(orders)}"`,
    solution: `orders = [{"name": "咖啡", "price": 25}, {"name": "蛋糕", "price": 30}]\n\ndef total_price(orders):\n    return sum(o["price"] for o in orders)\n\nprint(total_price(orders))`,
  },
  {
    id: 'ai-01',
    track: 'ai',
    title: 'AI 第 1 关：列表推导式，一行生成平方数',
    markdown: `### 列表推导式
这是 Python 最优雅的写法之一，一行就能生成一个列表：

\`\`\`python
squares = [x * x for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]
\`\`\`

🎯 **通关任务**：用列表推导式生成 1 到 5 的平方，存到 \`squares\` 里并打印。`,
    starterCode: `# 请用列表推导式生成平方数\nprint(squares)`,
    testCode: `assert squares == [1, 4, 9, 16, 25], f"squares 应该是 [1, 4, 9, 16, 25]，你得到的是：{squares}"`,
    solution: `squares = [x * x for x in range(1, 6)]\nprint(squares)`,
  },
  {
    id: 'ai-02',
    track: 'ai',
    title: 'AI 第 2 关：算平均分，数据分析第一步',
    markdown: `### sum / len
平均分 = 总分除以人数。数据分析的很多指标，都是从这两个函数开始的：

\`\`\`python
scores = [80, 90, 85]
avg = sum(scores) / len(scores)
print(avg)  # 85.0
\`\`\`

🎯 **通关任务**：算出 \`scores\` 的平均分，存到 \`avg\` 里并打印。`,
    starterCode: `scores = [80, 90, 85]\n# 请算平均分\nprint(avg)`,
    testCode: `assert avg == 85, f"avg 应该是 85，你算出的是：{avg}"`,
    solution: `scores = [80, 90, 85]\navg = sum(scores) / len(scores)\nprint(avg)`,
  },

  // ---------- 第二阶段：进阶篇 ----------
  {
    id: 'advanced-01',
    track: 'advanced',
    title: '进阶第 1 关：异常处理，程序别一报错就死',
    markdown: `### try / except
真实数据经常不干净，比如用户输入了字母，\`int()\` 就会报错。用 try 包住可能出错的代码，出错时走 except 的兜底：

\`\`\`python
def safe_int(text):
    try:
        return int(text)
    except ValueError:
        return 0

print(safe_int("42"))   # 42
print(safe_int("abc"))  # 0，不会崩
\`\`\`

🎯 **通关任务**：定义 \`safe_int(text)\`，能转成整数就返回整数，转不了就返回 0。卡住了可以点下面的“查看答案”，先看懂再自己重写一遍。`,
    starterCode: `# 请定义 safe_int 函数\nprint(safe_int("42"))\nprint(safe_int("abc"))`,
    testCode: `assert safe_int("42") == 42, "safe_int('42') 应该是 42"\nassert safe_int("abc") == 0, "safe_int('abc') 应该是 0，不能让程序崩掉"`,
    solution: `def safe_int(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0\n\nprint(safe_int("42"))\nprint(safe_int("abc"))`,
  },
  {
    id: 'advanced-02',
    track: 'advanced',
    title: '进阶第 2 关：类与对象，把数据和行为装在一起',
    markdown: `### class
类就是一张“图纸”，对象就是按图纸造出来的东西。\`__init__\` 是造出来那一刻自动跑的初始化，\`self\` 指的就是这个对象自己：

\`\`\`python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def passed(self):
        return self.score >= 60
\`\`\`

🎯 **通关任务**：定义 \`Student\` 类，有 \`name\`、\`score\` 属性，和一个 \`passed()\` 方法：分数大于等于 60 返回 True，否则返回 False。`,
    starterCode: `# 请定义 Student 类\ns = Student("小白", 85)\nprint(s.name, s.score, s.passed())`,
    testCode: `s1 = Student("小白", 85)\ns2 = Student("大白", 59)\nassert s1.name == "小白" and s1.score == 85 and s1.passed() is True\nassert s2.passed() is False, "59 分应该是不及格"`,
    solution: `class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\n    def passed(self):\n        return self.score >= 60\n\ns = Student("小白", 85)\nprint(s.name, s.score, s.passed())`,
  },
  {
    id: 'advanced-03',
    track: 'advanced',
    title: '进阶第 3 关：文件读写，数据别只活在内存里',
    markdown: `### open / with
程序一关，内存里的数据就没了。写进文件，数据才能留下来。\`with open(...)\` 会自动帮你关文件，是最推荐的写法：

\`\`\`python
with open("note.txt", "w", encoding="utf-8") as f:
    f.write("你好，Python")

with open("note.txt", encoding="utf-8") as f:
    content = f.read()
\`\`\`

注意：这里是在浏览器里的虚拟文件系统练手，关掉页面文件就没了；真正的本地 Python 才会把文件写到你的硬盘上。

🎯 **通关任务**：把 \`"你好，Python"\` 写进 \`note.txt\`，再读出来存到 \`content\` 里并打印。`,
    starterCode: `# 请写文件，再读文件\nprint(content)`,
    testCode: `assert content == "你好，Python", f"读出来的内容不对，你得到的是：{content}"`,
    solution: `with open("note.txt", "w", encoding="utf-8") as f:\n    f.write("你好，Python")\n\nwith open("note.txt", encoding="utf-8") as f:\n    content = f.read()\n\nprint(content)`,
  },
  {
    id: 'advanced-04',
    track: 'advanced',
    title: '进阶第 4 关：字典计数，统计词频',
    markdown: `### 用字典做计数器
这是数据分析里最常见的套路：遇到一个词，字典里没有就记 1，有了就加 1。

\`\`\`python
counts = {}
for word in ["a", "b", "a"]:
    if word in counts:
        counts[word] += 1
    else:
        counts[word] = 1
print(counts)  # {'a': 2, 'b': 1}
\`\`\`

🎯 **通关任务**：统计 \`words\` 里每个词出现的次数，存到 \`counts\` 字典里并打印。`,
    starterCode: `words = ["python", "java", "python", "go", "python", "java"]\ncounts = {}\n# 请统计每个词的次数\nprint(counts)`,
    testCode: `assert counts == {"python": 3, "java": 2, "go": 1}, f"counts 不对，你得到的是：{counts}"`,
    solution: `words = ["python", "java", "python", "go", "python", "java"]\ncounts = {}\nfor word in words:\n    if word in counts:\n        counts[word] += 1\n    else:\n        counts[word] = 1\nprint(counts)`,
  },
  {
    id: 'advanced-05',
    track: 'advanced',
    title: '进阶第 5 关：import 模块，站在别人的肩膀上',
    markdown: `### import
Python 自带很多“工具箱”，用 \`import\` 拿来就能用，不用自己造轮子。比如算两个日期差几天：

\`\`\`python
from datetime import date
d1 = date(2026, 1, 1)
d2 = date(2026, 1, 10)
print((d2 - d1).days)  # 9
\`\`\`

🎯 **通关任务**：用 \`datetime.date\` 算出 2026 年 1 月 1 日到 2026 年 1 月 10 日差几天，存到 \`diff\` 里并打印。`,
    starterCode: `# 请导入 datetime 并算天数差\nprint(diff)`,
    testCode: `assert diff == 9, f"diff 应该是 9，你算出的是：{diff}"`,
    solution: `from datetime import date\nd1 = date(2026, 1, 1)\nd2 = date(2026, 1, 10)\ndiff = (d2 - d1).days\nprint(diff)`,
  },
  {
    id: 'advanced-06',
    track: 'advanced',
    title: '进阶第 6 关：默认参数，让函数更好用',
    markdown: `### 默认参数
给参数一个默认值，调用时不传就用默认，传了就用传的。函数一下子就灵活了：

\`\`\`python
def greet(name, greeting="你好"):
    return f"{greeting}，{name}"

print(greet("小白"))            # 你好，小白
print(greet("小白", "早上好"))  # 早上好，小白
\`\`\`

🎯 **通关任务**：定义 \`greet(name, greeting="你好")\`，返回 \`f"{greeting}，{name}"\` 这样的问候语。`,
    starterCode: `# 请定义 greet 函数\nprint(greet("小白"))\nprint(greet("小白", "早上好"))`,
    testCode: `assert greet("小白") == "你好，小白", f"greet('小白') 不对：{greet('小白')}"\nassert greet("小白", "早上好") == "早上好，小白"`,
    solution: `def greet(name, greeting="你好"):\n    return f"{greeting}，{name}"\n\nprint(greet("小白"))\nprint(greet("小白", "早上好"))`,
  },

  // ---------- 第二阶段：实战项目 ----------
  {
    id: 'project-spider',
    track: 'project',
    title: '实战项目 1：爬虫小项目，解析一页图书',
    markdown: `### 项目目标
假装这就是爬下来的一页网页（真实爬虫第一步也是先拿到 HTML 再解析，这里跳过发请求，只练最核心的解析）：

从这段 HTML 里把每本书的书名和价格抠出来，变成一个元组列表，并把价格转成整数。

### 思路
1. 用 \`re.findall\` 写一个能同时抠出书名和价格的模式，两个括号就是两个结果。
2. 价格是字符串，记得用 \`int()\` 转一下。

🎯 **通关任务（升级版，多步骤 + 缺失数据）**：下面 HTML 里有 8 本书，其中 1 本缺价格，要跳过它、不能崩。请算出下面 5 个结果并打印：
- \`books\`：所有有效书的列表，每项是 \`(书名, 价格整数, 分类)\`，按 HTML 里的顺序。
- \`filtered\`：价格 >= 70 的书的列表（保持原顺序）。
- \`top3\`：在 \`filtered\` 里按价格从高到低排，取前 3 本的书名列表。
- \`avg_price\`：所有有效书的平均价格。
- \`category_count\`：分类计数字典（只算有效书）。
判题会同时查这 5 个结果，缺失行处理错了、任何一步错了都过不了。`,
    starterCode: `import re\nhtml = '<div class="book"><h2>Python入门</h2><span>59</span><em>编程</em></div><div class="book"><h2>爬虫实战</h2><span>79</span><em>爬虫</em></div><div class="book"><h2>数据分析</h2><span>99</span><em>数据</em></div><div class="book"><h2>算法图解</h2><span>69</span><em>编程</em></div><div class="book"><h2>网络爬虫</h2><span>89</span><em>爬虫</em></div><div class="book"><h2>SQL必知必会</h2><span>49</span><em>数据</em></div><div class="book"><h2>深入Python</h2><span>109</span><em>编程</em></div><div class="book"><h2>缺价书</h2><em>编程</em></div>'\n# 请解析、过滤、排序、算平均、分组（缺价书要跳过）\nprint(books)\nprint(filtered)\nprint(top3)\nprint(avg_price)\nprint(category_count)`,
    testCode: `assert books == [("Python入门", 59, "编程"), ("爬虫实战", 79, "爬虫"), ("数据分析", 99, "数据"), ("算法图解", 69, "编程"), ("网络爬虫", 89, "爬虫"), ("SQL必知必会", 49, "数据"), ("深入Python", 109, "编程")], f"books 不对（缺价书应该跳过）：{books}"\nassert len(filtered) == 4, f"价格 >= 70 的书应该是 4 本：{filtered}"\nassert top3 == ["深入Python", "数据分析", "网络爬虫"], f"前 3 名不对：{top3}"\nassert avg_price == 553 / 7, f"平均价格不对：{avg_price}"\nassert category_count == {"编程": 3, "爬虫": 2, "数据": 2}, f"分类计数不对：{category_count}"`,
    solution: `import re\nhtml = '<div class="book"><h2>Python入门</h2><span>59</span><em>编程</em></div><div class="book"><h2>爬虫实战</h2><span>79</span><em>爬虫</em></div><div class="book"><h2>数据分析</h2><span>99</span><em>数据</em></div><div class="book"><h2>算法图解</h2><span>69</span><em>编程</em></div><div class="book"><h2>网络爬虫</h2><span>89</span><em>爬虫</em></div><div class="book"><h2>SQL必知必会</h2><span>49</span><em>数据</em></div><div class="book"><h2>深入Python</h2><span>109</span><em>编程</em></div><div class="book"><h2>缺价书</h2><em>编程</em></div>'\nbooks = [(title, int(price), category) for title, price, category in re.findall(r'<h2>(.*?)</h2><span>(\\d+)</span><em>(.*?)</em>', html)]\nfiltered = [b for b in books if b[1] >= 70]\ntop3 = [b[0] for b in sorted(filtered, key=lambda b: b[1], reverse=True)[:3]]\navg_price = sum(b[1] for b in books) / len(books)\ncategory_count = {}\nfor b in books:\n    category_count[b[2]] = category_count.get(b[2], 0) + 1\nprint(books)\nprint(filtered)\nprint(top3)\nprint(avg_price)\nprint(category_count)`,
  },
  {
    id: 'project-backend',
    track: 'project',
    title: '实战项目 2：后端小项目，待办清单接口',
    markdown: `### 项目目标
后端说白了就是：别人调用你的函数，你帮他把数据存好、改好、查出来。这一关做一个最小版的待办清单“接口”：

- \`add_todo(text, priority="中")\`：往清单里加一条，初始是未完成
- \`complete_todo(index)\`：把第几条标为已完成
- \`delete_todo(index)\`：删除第几条
- \`search(keyword)\`：按关键词搜索
- \`pending()\`：返回所有未完成的待办
- \`page(page_num, page_size)\`：分页
- \`stats()\`：返回总数、已完成数、未完成数

数据就存在一个叫 \`todos\` 的列表里，每条是一个字典：\`{"text": ..., "done": ...}\`。

🎯 **通关任务（升级版，有状态 + 边界）**：实现下面 7 个函数，数据存在全局 \`todos\` 列表里，每条是 \`{"text": ..., "done": ..., "priority": ...}\`：
- \`add_todo(text, priority="中")\`：去掉首尾空格后为空抛 \`ValueError\`，否则加一条未完成待办。
- \`complete_todo(index)\`：下标越界抛 \`IndexError\`，否则标为已完成。
- \`delete_todo(index)\`：下标越界抛 \`IndexError\`，否则删除那条。
- \`search(keyword)\`：返回文本包含关键词的待办列表。
- \`pending()\`：返回所有未完成的待办。
- \`page(page_num, page_size)\`：页码从 1 开始，小于 1 抛 \`ValueError\`，超出范围返回空列表。
- \`stats()\`：返回 \`{"total": 总数, "done": 已完成数, "pending": 未完成数}\`。
判题会按顺序加、完成、删除、搜索、翻页、查统计，还会试空文本、越界下标、非法页码。`,
    starterCode: `todos = []\n# 请实现 add_todo、complete_todo、delete_todo、search、pending、page、stats 七个函数`,
    testCode: `add_todo("学Python", "高")\nadd_todo("跑步")\nadd_todo("读Python书", "低")\nadd_todo("买菜")\ncomplete_todo(0)\ndelete_todo(3)\nassert [t["text"] for t in search("Python")] == ["学Python", "读Python书"], f"搜索 Python 不对：{search('Python')}"\nassert [t["text"] for t in pending()] == ["跑步", "读Python书"], f"未完成不对：{pending()}"\nassert [t["text"] for t in page(1, 2)] == ["学Python", "跑步"], "第 1 页不对"\nassert [t["text"] for t in page(2, 2)] == ["读Python书"], "第 2 页不对"\nassert page(3, 2) == [], "超出范围的页应该是空列表"\nassert stats() == {"total": 3, "done": 1, "pending": 2}, f"统计不对：{stats()}"\ntry:\n    add_todo("   ")\n    assert False, "空文本应该抛 ValueError"\nexcept ValueError:\n    pass\ntry:\n    complete_todo(99)\n    assert False, "越界完成应该抛 IndexError"\nexcept IndexError:\n    pass\ntry:\n    delete_todo(99)\n    assert False, "越界删除应该抛 IndexError"\nexcept IndexError:\n    pass\ntry:\n    page(0, 2)\n    assert False, "页码小于 1 应该抛 ValueError"\nexcept ValueError:\n    pass`,
    solution: `todos = []\n\ndef add_todo(text, priority="中"):\n    cleaned = text.strip()\n    if not cleaned:\n        raise ValueError("待办内容不能为空")\n    todos.append({"text": cleaned, "done": False, "priority": priority})\n\ndef complete_todo(index):\n    if not 0 <= index < len(todos):\n        raise IndexError("下标越界")\n    todos[index]["done"] = True\n\ndef delete_todo(index):\n    if not 0 <= index < len(todos):\n        raise IndexError("下标越界")\n    del todos[index]\n\ndef search(keyword):\n    return [t for t in todos if keyword in t["text"]]\n\ndef pending():\n    return [t for t in todos if not t["done"]]\n\ndef page(page_num, page_size):\n    if page_num < 1:\n        raise ValueError("页码必须从 1 开始")\n    start = (page_num - 1) * page_size\n    return todos[start:start + page_size]\n\ndef stats():\n    done = sum(1 for t in todos if t["done"])\n    return {"total": len(todos), "done": done, "pending": len(todos) - done}`,
  },
  {
    id: 'project-ai',
    track: 'project',
    title: '实战项目 3：AI 小项目，城市平均分排行榜',
    markdown: `### 项目目标
这就是上一轮说的“会不会”的自测题，现在把它做成正式项目：一份 CSV 格式的分数表，算出每个城市的平均分，再按分数从高到低排好。

### 思路
1. 按行拆开，跳过第一行表头。
2. 每行按逗号拆成城市和分数，用字典分别累加总分和人数。
3. 平均分 = 总分 / 人数，再用 \`sorted(..., key=..., reverse=True)\` 排序。

🎯 **通关任务（升级版，多步骤 + 缺失数据）**：下面数据多了月份和一行缺失分数，缺失行要跳过、不能崩。请算出下面 7 个结果并打印：
- \`totals_by_city\`：每个城市的总分字典。
- \`avg_by_city\`：每个城市的平均分字典。
- \`sorted_cities\`：按平均分从高到低排的 \`(城市, 平均分)\` 列表。
- \`totals_by_month\`：每个月的总分字典。
- \`valid_count\`：有效记录条数（有分数的才算）。
- \`overall_avg\`：所有有效分数的总体平均分。
- \`best_city\`：平均分最高的城市名字。
判题会同时查这 7 个结果，缺失行处理错了、任何一步错了都过不了。`,
    starterCode: `data = "月份,城市,分数\\n2026-10,上海,80\\n2026-10,上海,90\\n2026-10,北京,70\\n2026-11,北京,80\\n2026-11,北京,\\n2026-11,广州,90\\n2026-11,广州,100\\n2026-12,广州,95\\n2026-12,上海,85"\n# 请算出 totals_by_city、avg_by_city、sorted_cities、totals_by_month、valid_count、overall_avg、best_city（缺失行跳过）\nprint(totals_by_city)\nprint(avg_by_city)\nprint(sorted_cities)\nprint(totals_by_month)\nprint(valid_count)\nprint(overall_avg)\nprint(best_city)`,
    testCode: `assert totals_by_city == {"上海": 255, "北京": 150, "广州": 285}, f"按城市合计不对：{totals_by_city}"\nassert avg_by_city == {"上海": 85.0, "北京": 75.0, "广州": 95.0}, f"按城市平均不对：{avg_by_city}"\nassert sorted_cities == [("广州", 95.0), ("上海", 85.0), ("北京", 75.0)], f"排序结果不对：{sorted_cities}"\nassert totals_by_month == {"2026-10": 240, "2026-11": 270, "2026-12": 180}, f"按月合计不对：{totals_by_month}"\nassert valid_count == 8, f"有效记录应该是 8 条：{valid_count}"\nassert overall_avg == 86.25, f"总体平均应该是 86.25：{overall_avg}"\nassert best_city == "广州", f"最高城市应该是 广州：{best_city}"`,
    solution: `data = "月份,城市,分数\\n2026-10,上海,80\\n2026-10,上海,90\\n2026-10,北京,70\\n2026-11,北京,80\\n2026-11,北京,\\n2026-11,广州,90\\n2026-11,广州,100\\n2026-12,广州,95\\n2026-12,上海,85"\ntotals_by_city = {}\ncounts_by_city = {}\ntotals_by_month = {}\nvalid_count = 0\ntotal_sum = 0\nfor line in data.split("\\n")[1:]:\n    month, city, score_text = line.split(",")\n    if score_text == "":\n        continue\n    score = int(score_text)\n    valid_count += 1\n    total_sum += score\n    totals_by_city[city] = totals_by_city.get(city, 0) + score\n    counts_by_city[city] = counts_by_city.get(city, 0) + 1\n    totals_by_month[month] = totals_by_month.get(month, 0) + score\navg_by_city = {city: totals_by_city[city] / counts_by_city[city] for city in totals_by_city}\nsorted_cities = sorted(avg_by_city.items(), key=lambda item: item[1], reverse=True)\noverall_avg = total_sum / valid_count\nbest_city = sorted_cities[0][0]\nprint(totals_by_city)\nprint(avg_by_city)\nprint(sorted_cities)\nprint(totals_by_month)\nprint(valid_count)\nprint(overall_avg)\nprint(best_city)`,
  },
];

// 逻辑实战线、教科书进阶线单独放文件，避免主课程文件过长；运行时拼进总课程表
COURSES.push(...LOGIC_COURSES);
COURSES.push(...TEXTBOOK_COURSES);
