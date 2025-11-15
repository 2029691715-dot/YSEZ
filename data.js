// 直接使用Vercel内置的KV客户端，无需安装依赖
import { kv } from '@vercel/kv';

// Edge Functions入口函数（Vercel自动运行，无需配置服务器）
export default async function handler(request) {
    try {
        // 处理GET请求（读取数据）
        if (request.method === 'GET') {
            const data = await kv.get('sharedData');
            return new Response(JSON.stringify({ data }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 处理POST请求（存储数据）
        if (request.method === 'POST') {
            const { content } = await request.json();
            await kv.set('sharedData', content);
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 仅支持GET/POST
        return new Response(JSON.stringify({ error: '仅支持GET/POST' }), { status: 405 });
    } catch (err) {
        return new Response(JSON.stringify({ error: '操作失败' }), { status: 500 });
    }
}

// 声明为Edge Functions（关键：无需Node环境，Vercel自动分配运行环境）
export const config = { runtime: 'edge' };