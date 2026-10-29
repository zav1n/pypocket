/* 浏览器本地 Python 沙盒：Pyodide (WebAssembly)，0 后端。
   首次运行需要从 CDN 下载约 10MB 左右的运行时，之后浏览器会缓存。
   不需要、也不应该把用户代码发到任何服务器。 */

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<any>;
  }
}

const PYODIDE_VERSION = 'v0.26.2';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

let pyodideInstance: any = null;
let loadingPromise: Promise<any> | null = null;

function loadPyodideScript(): Promise<void> {
  if (window.loadPyodide) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${INDEX_URL}pyodide.js`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Pyodide 脚本加载失败，请检查网络后重试（需要能访问 jsdelivr CDN）'));
    document.head.appendChild(script);
  });
}

export async function initPyodide(onProgress?: (msg: string) => void) {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    onProgress?.('正在下载 Python 运行时（首次约 10MB，之后会缓存）…');
    await loadPyodideScript();
    pyodideInstance = await window.loadPyodide!({ indexURL: INDEX_URL });
    onProgress?.('Python 已就绪');
    return pyodideInstance;
  })();
  try {
    return await loadingPromise;
  } catch (e) {
    loadingPromise = null;
    throw e;
  }
}

export interface RunResult {
  success: boolean;
  passed: boolean;
  output: string;
  error?: string;
}

function shortError(message: string): string {
  // Pyodide 报错堆栈很长，只把最后一行真正有用的信息留给小白和 AI
  const lines = message.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.slice(-3).join('\n');
}

/** 只运行，不判题 */
export async function runOnly(userCode: string): Promise<RunResult> {
  const py = await initPyodide();
  py.runPython(`import sys, io\nsys.stdout = io.StringIO()\nsys.stderr = io.StringIO()`);
  try {
    await py.runPythonAsync(userCode);
    const stdout = py.runPython('sys.stdout.getvalue()') as string;
    return { success: true, passed: true, output: stdout || '✅ 代码执行完毕（无打印输出）' };
  } catch (err: any) {
    const stdout = py.runPython('sys.stdout.getvalue()') as string;
    return { success: false, passed: false, output: stdout, error: shortError(err?.message || String(err)) };
  }
}

/** 运行 + 隐藏判题断言（文档原版 executeAndTest 的加固版） */
export async function executeAndTest(userCode: string, testAssertCode?: string): Promise<RunResult> {
  const py = await initPyodide();
  py.runPython(`import sys, io\nsys.stdout = io.StringIO()\nsys.stderr = io.StringIO()`);
  try {
    await py.runPythonAsync(userCode);
    const stdout = py.runPython('sys.stdout.getvalue()') as string;
    if (testAssertCode) {
      try {
        await py.runPythonAsync(testAssertCode);
      } catch (testErr: any) {
        // 判题失败：区分“代码本身报错”与“答案不对”
        return {
          success: true,
          passed: false,
          output: stdout,
          error: shortError(testErr?.message || String(testErr)),
        };
      }
    }
    return { success: true, passed: true, output: stdout || '✅ 代码执行完毕（无打印输出）' };
  } catch (err: any) {
    const stdout = py.runPython('sys.stdout.getvalue()') as string;
    return { success: false, passed: false, output: stdout, error: shortError(err?.message || String(err)) };
  }
}
