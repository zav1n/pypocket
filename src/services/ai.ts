/* 免费 AI 助教：OpenAI 兼容格式，Key 只存在用户自己的浏览器 localStorage 里，
直接发给用户自己选的服务商，不经过任何中间服务器。
预设（都要用户自己去官网免费领取 Key）：
- 硅基流动 SiliconFlow：https://siliconflow.cn ，免费额度模型如 Qwen2.5-Coder
- Google Gemini：https://aistudio.google.com ，Gemini Flash 免费额度很高，
用 OpenAI 兼容端点 https://generativelanguage.googleapis.com/v1beta/openai/ */

export interface AiPreset {
id: string;
label: string;
apiUrl: string;
model: string;
keyUrl: string;
}

export const AI_PRESETS: AiPreset[] = [
{
id: 'siliconflow',
label: '硅基流动 · Qwen2.5-Coder-7B（免费）',
apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
model: 'Qwen/Qwen2.5-Coder-7B-Instruct',
keyUrl: 'https://siliconflow.cn',
},
{
id: 'gemini',
label: 'Gemini · gemini-2.5-flash（免费额度高）',
apiUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
model: 'gemini-2.5-flash',
keyUrl: 'https://aistudio.google.com',
},
{
id: 'custom',
label: '自定义（OpenAI 兼容接口）',
apiUrl: '',
model: '',
keyUrl: '',
},
];

export function getAiSettings() {
const presetId = localStorage.getItem('AI_PRESET') || 'siliconflow';
const preset = AI_PRESETS.find((p) => p.id === presetId) || AI_PRESETS[0];
return {
presetId,
apiKey: localStorage.getItem('AI_API_KEY') || '',
apiUrl: localStorage.getItem('AI_API_URL') || preset.apiUrl,
model: localStorage.getItem('AI_MODEL') || preset.model,
};
}

export async function askAiTutor(lessonTitle: string, userCode: string, errorMsg: string): Promise<string> {
const { apiKey, apiUrl, model} = getAiSettings();
if (!apiKey) return '请先在右上角中填入免费 API Key（硅基流动或 Gemini 官网免费领取，Key 只保存在你的浏览器里）。';
if (!apiUrl ||!model) return '请先在中补全接口地址和模型名。';

const prompt = `
你是一位幽默、极具耐心的 Python 零基础导师。
当前学员正在学习关卡：${lessonTitle}
他编写的代码如下：
\`\`\`python
${userCode}
\`\`\`
运行后发生了报错或未通过测试：
\`\`\`
${errorMsg}
\`\`\`
请按以下格式简短回复（不超过 150 字）：
1. 🎯 **问题出在哪**：用大白话解释这行英文报错是什么意思。
2. 💡 **修改小提示**：告诉他改哪一行，但，引导他自己改对。
`;

try {
const res = await fetch(apiUrl, {
method: 'POST',
headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`},
body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt}], temperature: 0.3}),
});
if (!res.ok) {
const text = await res.text();
return `AI 请求失败（${res.status}）：请检查 Key、接口地址和模型名是否正确。服务商返回：${text.slice(0, 200)}`;
}
const data = await res.json();
return data.choices?.[0]?.message?.content || 'AI 开小差了，请稍后再试';
} catch (e: any) {
return `网络请求失败：${e?.message || e}。如果在国内直连不通，可换一个服务商预设再试。`;
}
}
