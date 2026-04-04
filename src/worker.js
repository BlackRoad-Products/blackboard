// PROPRIETARY AND CONFIDENTIAL. Copyright 2025-2026 BlackRoad OS, Inc. All rights reserved. NOT open source.
// BlackBoard — Creative Studio | blackboard.blackroad.io
// Make it. Post it. The billboard is yours.
// Copyright (c) 2025-2026 BlackRoad OS, Inc. All Rights Reserved.

// ─── Agent Personalities ───
const AGENTS = {
  calliope: { name: 'Calliope', role: 'Narrative Architect', prompt: 'You are Calliope, narrative architect on BlackBoard (BlackRoad OS). You craft compelling stories and copy that resonates deeply. Every word earns its place. Write the content directly — no meta-commentary.' },
  sapphira: { name: 'Sapphira', role: 'Visual Director', prompt: 'You are Sapphira, visual director on BlackBoard (BlackRoad OS). You translate concepts into vivid visual directions — color palettes, composition, mood, lighting, typography guidance. Be specific and actionable for designers.' },
  thalia: { name: 'Thalia', role: 'Social Strategist', prompt: 'You are Thalia, social strategist on BlackBoard (BlackRoad OS). You know every platform\'s algorithm, format constraints, and audience psychology. You write content that gets shared, saved, and remembered.' },
  lyra: { name: 'Lyra', role: 'Remix & Polish', prompt: 'You are Lyra, remix and polish specialist on BlackBoard (BlackRoad OS). You take existing content and reshape it for new contexts — different tones, platforms, audiences. You preserve the core message while transforming the delivery.' },
};

// ─── Design Templates Library ───
const DESIGN_TEMPLATES = [
  { id: 'social-post', name: 'Social Post', category: 'social', width: 1080, height: 1080, format: 'square', layout: { safe_zone: { top: 80, bottom: 120, left: 60, right: 60 }, text_area: { y: 400, height: 280 }, logo_position: 'bottom-right' }, platforms: ['instagram', 'facebook', 'linkedin'] },
  { id: 'social-story', name: 'Social Story', category: 'social', width: 1080, height: 1920, format: 'portrait', layout: { safe_zone: { top: 120, bottom: 200, left: 60, right: 60 }, text_area: { y: 700, height: 400 }, logo_position: 'top-left' }, platforms: ['instagram', 'tiktok', 'snapchat'] },
  { id: 'twitter-post', name: 'Twitter/X Post Image', category: 'social', width: 1200, height: 675, format: 'landscape', layout: { safe_zone: { top: 40, bottom: 60, left: 40, right: 40 }, text_area: { y: 200, height: 275 }, logo_position: 'bottom-left' }, platforms: ['twitter'] },
  { id: 'banner-web', name: 'Website Banner', category: 'banner', width: 1920, height: 480, format: 'wide', layout: { safe_zone: { top: 40, bottom: 40, left: 100, right: 100 }, text_area: { y: 120, height: 240 }, cta_position: 'right-center' }, platforms: ['web'] },
  { id: 'banner-email', name: 'Email Banner', category: 'banner', width: 600, height: 200, format: 'wide', layout: { safe_zone: { top: 20, bottom: 20, left: 30, right: 30 }, text_area: { y: 40, height: 120 }, logo_position: 'top-left' }, platforms: ['email'] },
  { id: 'thumbnail-youtube', name: 'YouTube Thumbnail', category: 'thumbnail', width: 1280, height: 720, format: 'landscape', layout: { safe_zone: { top: 40, bottom: 60, left: 40, right: 40 }, text_area: { y: 250, height: 220 }, face_zone: 'right-third' }, platforms: ['youtube'] },
  { id: 'thumbnail-blog', name: 'Blog Thumbnail', category: 'thumbnail', width: 1200, height: 630, format: 'landscape', layout: { safe_zone: { top: 40, bottom: 40, left: 40, right: 40 }, text_area: { y: 200, height: 230 }, logo_position: 'bottom-right' }, platforms: ['web', 'og-image'] },
  { id: 'logo-square', name: 'Logo (Square)', category: 'logo', width: 500, height: 500, format: 'square', layout: { safe_zone: { top: 50, bottom: 50, left: 50, right: 50 }, icon_area: { x: 125, y: 100, size: 250 }, text_area: { y: 370, height: 80 } }, platforms: ['all'] },
  { id: 'logo-wide', name: 'Logo (Wide)', category: 'logo', width: 800, height: 200, format: 'wide', layout: { icon_area: { x: 40, y: 25, size: 150 }, text_area: { x: 210, y: 50, width: 550, height: 100 } }, platforms: ['all'] },
  { id: 'infographic', name: 'Infographic', category: 'infographic', width: 800, height: 2000, format: 'tall', layout: { header: { height: 200 }, sections: 5, section_height: 320, footer: { height: 120 }, margin: 40 }, platforms: ['pinterest', 'web', 'linkedin'] },
  { id: 'infographic-mini', name: 'Mini Infographic', category: 'infographic', width: 1080, height: 1350, format: 'portrait', layout: { header: { height: 180 }, sections: 3, section_height: 310, footer: { height: 120 }, margin: 60 }, platforms: ['instagram', 'linkedin'] },
  { id: 'presentation', name: 'Presentation Slide', category: 'presentation', width: 1920, height: 1080, format: 'landscape', layout: { title_area: { y: 80, height: 120 }, content_area: { y: 240, height: 680 }, footer: { y: 980, height: 60 }, margin: 80 }, platforms: ['keynote', 'slides'] },
];

// ─── Cross-Product Integration (RoadChain + RoadCoin) ───
async function stampChain(action, entity, details) {
  try {
    await fetch('https://roadchain-worker.blackroad.workers.dev/api/event', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({app:'blackboard', type: action, data: {entity, details}, ts: new Date().toISOString()})
    });
  } catch {}
}
async function earnCoin(road_id, action, amount) {
  try {
    await fetch('https://roadcoin-worker.blackroad.workers.dev/api/earn', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({road_id: road_id || 'blackboard-system', action, amount})
    });
  } catch {}
}

let dbReady = false;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    const c = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
    if (request.method === 'OPTIONS') return new Response(null, {status:204,headers:c});
    if (p === '/' || p === '') return new Response(HTML, {headers:{'Content-Type':'text/html;charset=utf-8','Content-Security-Policy':"frame-ancestors 'self' https://blackroad.io https://*.blackroad.io",...c}});
    if (p === '/sitemap.xml') return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://blackboard.blackroad.io/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n</urlset>`, {headers:{'Content-Type':'application/xml',...c}});
    if (p === '/health') return j({ok:true,service:'blackboard'},c);

    try {
      // ─── Schema Init (original tables + new feature tables) ───
      if (!dbReady) {
        dbReady = true;
        await env.DB.batch([
          env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_projects (id TEXT PRIMARY KEY, title TEXT NOT NULL, type TEXT DEFAULT 'post', content TEXT DEFAULT '', style TEXT DEFAULT '{}', created_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`),
          env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_generations (id TEXT PRIMARY KEY, project_id TEXT, prompt TEXT, result TEXT, model TEXT, type TEXT DEFAULT 'post', tone TEXT, platform TEXT, agent TEXT DEFAULT 'Calliope', created_at TEXT DEFAULT (datetime('now')))`),
          env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_styles (id TEXT PRIMARY KEY, name TEXT NOT NULL, voice TEXT NOT NULL, tone TEXT, audience TEXT, examples TEXT DEFAULT '[]', created_at TEXT DEFAULT (datetime('now')))`),
          env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_assets (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, description TEXT NOT NULL, type TEXT NOT NULL, category TEXT DEFAULT 'general', tags TEXT DEFAULT '[]', visual_direction TEXT, agent TEXT DEFAULT 'Sapphira', created_at TEXT DEFAULT (datetime('now')))`),
        ]);
        await env.DB.batch([
          // Brand Kit table
          env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_brand_kits (id TEXT PRIMARY KEY, name TEXT NOT NULL, colors TEXT DEFAULT '[]', fonts TEXT DEFAULT '{}', logos TEXT DEFAULT '[]', voice_guidelines TEXT DEFAULT '', tone TEXT DEFAULT '', audience TEXT DEFAULT '', created_by TEXT DEFAULT 'anon', is_default INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`),
          // Collaborators table
          env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_collaborators (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT DEFAULT 'viewer', invited_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')))`),
          // Version history table
          env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_versions (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, version_num INTEGER NOT NULL, title TEXT, content TEXT, style TEXT, diff_summary TEXT, created_by TEXT DEFAULT 'system', created_at TEXT DEFAULT (datetime('now')))`),
          // Content schedule table
          env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_schedule (id TEXT PRIMARY KEY, project_id TEXT, generation_id TEXT, content TEXT NOT NULL, platform TEXT NOT NULL, scheduled_at TEXT NOT NULL, status TEXT DEFAULT 'scheduled', published_url TEXT, created_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`),
        ]);
      }

      // ─── Projects ───
      // Track session
    try { await trackSession(request, env.DB, 'blackboard'); } catch {}
    if (p === '/api/projects' && request.method === 'GET') {
        const rows = await env.DB.prepare('SELECT id,title,type,created_by,created_at,updated_at FROM bb_projects ORDER BY updated_at DESC LIMIT 50').all();
        return j({projects:rows.results||[]},c);
      }

      if (p === '/api/projects' && request.method === 'POST') {
        const body = await request.json();
        if (!body.title) return j({error:'title required'},c,400);
        const id = crypto.randomUUID().slice(0,8);
        const types = ['post','ad','video-script','email','landing-page','thread','campaign'];
        const type = types.includes(body.type) ? body.type : 'post';
        await env.DB.prepare('INSERT INTO bb_projects (id,title,type,content,created_by) VALUES (?,?,?,?,?)')
          .bind(id, body.title.slice(0,100), type, (body.content||'').slice(0,5000), (body.user||'anon').slice(0,32)).run();
        // Save initial version
        await env.DB.prepare('INSERT INTO bb_versions (id,project_id,version_num,title,content,style,diff_summary,created_by) VALUES (?,?,1,?,?,?,?,?)')
          .bind(crypto.randomUUID().slice(0,8), id, body.title.slice(0,100), (body.content||'').slice(0,5000), '{}', 'Initial creation', (body.user||'anon').slice(0,32)).run();
        stampChain('project_created', id, body.title.slice(0,100)).catch(()=>{});
        return j({ok:true,id,title:body.title,type},c,201);
      }

      const projMatch = p.match(/^\/api\/projects\/([^/]+)$/);
      const projGenMatch = p.match(/^\/api\/projects\/([^/]+)\/generate$/);
      const projAssetsMatch = p.match(/^\/api\/projects\/([^/]+)\/assets$/);
      const projTimelineMatch = p.match(/^\/api\/projects\/([^/]+)\/timeline$/);
      const projCollabMatch = p.match(/^\/api\/projects\/([^/]+)\/collaborators$/);
      const projVersionsMatch = p.match(/^\/api\/projects\/([^/]+)\/versions$/);
      const projVersionRestoreMatch = p.match(/^\/api\/projects\/([^/]+)\/versions\/([^/]+)\/restore$/);
      const projExportMatch = p.match(/^\/api\/projects\/([^/]+)\/export$/);

      // ─── Project Collaborators ───
      if (projCollabMatch && request.method === 'GET') {
        const projectId = projCollabMatch[1];
        const proj = await env.DB.prepare('SELECT id,title FROM bb_projects WHERE id=?').bind(projectId).first();
        if (!proj) return j({error:'project not found'},c,404);
        const collabs = await env.DB.prepare('SELECT id,user_id,role,invited_by,created_at FROM bb_collaborators WHERE project_id=? ORDER BY created_at ASC').bind(projectId).all();
        return j({project_id:projectId,collaborators:collabs.results||[]},c);
      }

      if (projCollabMatch && request.method === 'POST') {
        const projectId = projCollabMatch[1];
        const proj = await env.DB.prepare('SELECT id,title,created_by FROM bb_projects WHERE id=?').bind(projectId).first();
        if (!proj) return j({error:'project not found'},c,404);
        const body = await request.json();
        if (!body.user_id) return j({error:'user_id required'},c,400);
        const roles = ['viewer','editor','owner'];
        const role = roles.includes(body.role) ? body.role : 'viewer';
        // Check if already a collaborator
        const existing = await env.DB.prepare('SELECT id FROM bb_collaborators WHERE project_id=? AND user_id=?').bind(projectId, body.user_id).first();
        if (existing) return j({error:'user already a collaborator'},c,409);
        const id = crypto.randomUUID().slice(0,8);
        await env.DB.prepare('INSERT INTO bb_collaborators (id,project_id,user_id,role,invited_by) VALUES (?,?,?,?,?)')
          .bind(id, projectId, body.user_id.slice(0,64), role, (body.invited_by||proj.created_by||'anon').slice(0,32)).run();
        stampChain('collaborator_added', projectId, `${body.user_id} as ${role}`).catch(()=>{});
        return j({ok:true,id,project_id:projectId,user_id:body.user_id,role},c,201);
      }

      if (projCollabMatch && request.method === 'DELETE') {
        const projectId = projCollabMatch[1];
        const body = await request.json();
        if (!body.user_id) return j({error:'user_id required'},c,400);
        await env.DB.prepare('DELETE FROM bb_collaborators WHERE project_id=? AND user_id=?').bind(projectId, body.user_id).run();
        return j({ok:true,removed:body.user_id},c);
      }

      // ─── Version History ───
      if (projVersionsMatch && request.method === 'GET') {
        const projectId = projVersionsMatch[1];
        const proj = await env.DB.prepare('SELECT id,title FROM bb_projects WHERE id=?').bind(projectId).first();
        if (!proj) return j({error:'project not found'},c,404);
        const versions = await env.DB.prepare('SELECT id,version_num,title,diff_summary,created_by,created_at FROM bb_versions WHERE project_id=? ORDER BY version_num DESC').bind(projectId).all();
        return j({project_id:projectId,versions:versions.results||[]},c);
      }

      if (projVersionsMatch && request.method === 'POST') {
        // Save a new version snapshot
        const projectId = projVersionsMatch[1];
        const proj = await env.DB.prepare('SELECT * FROM bb_projects WHERE id=?').bind(projectId).first();
        if (!proj) return j({error:'project not found'},c,404);
        const body = await request.json();
        // Get latest version number
        const latest = await env.DB.prepare('SELECT MAX(version_num) as max_v FROM bb_versions WHERE project_id=?').bind(projectId).first();
        const nextVersion = (latest?.max_v || 0) + 1;
        // Apply updates to project if provided
        const newTitle = body.title || proj.title;
        const newContent = body.content !== undefined ? body.content : proj.content;
        const newStyle = body.style ? JSON.stringify(body.style) : proj.style;
        // Compute diff summary
        const diffs = [];
        if (body.title && body.title !== proj.title) diffs.push(`title: "${proj.title}" -> "${body.title}"`);
        if (body.content !== undefined && body.content !== proj.content) diffs.push('content updated');
        if (body.style) diffs.push('style updated');
        const diffSummary = diffs.length ? diffs.join(', ') : body.summary || 'Manual snapshot';
        // Save version
        const vId = crypto.randomUUID().slice(0,8);
        await env.DB.prepare('INSERT INTO bb_versions (id,project_id,version_num,title,content,style,diff_summary,created_by) VALUES (?,?,?,?,?,?,?,?)')
          .bind(vId, projectId, nextVersion, newTitle.slice(0,100), String(newContent).slice(0,5000), newStyle, diffSummary.slice(0,500), (body.user||'system').slice(0,32)).run();
        // Update project
        await env.DB.prepare("UPDATE bb_projects SET title=?,content=?,style=?,updated_at=datetime('now') WHERE id=?")
          .bind(newTitle.slice(0,100), String(newContent).slice(0,5000), newStyle, projectId).run();
        stampChain('version_saved', projectId, `v${nextVersion}`).catch(()=>{});
        return j({ok:true,id:vId,project_id:projectId,version_num:nextVersion,diff_summary:diffSummary},c,201);
      }

      // ─── Restore Version ───
      if (projVersionRestoreMatch && request.method === 'POST') {
        const projectId = projVersionRestoreMatch[1];
        const versionId = projVersionRestoreMatch[2];
        const version = await env.DB.prepare('SELECT * FROM bb_versions WHERE id=? AND project_id=?').bind(versionId, projectId).first();
        if (!version) return j({error:'version not found'},c,404);
        // Save current state as a new version before restoring
        const proj = await env.DB.prepare('SELECT * FROM bb_projects WHERE id=?').bind(projectId).first();
        if (!proj) return j({error:'project not found'},c,404);
        const latest = await env.DB.prepare('SELECT MAX(version_num) as max_v FROM bb_versions WHERE project_id=?').bind(projectId).first();
        const nextVersion = (latest?.max_v || 0) + 1;
        await env.DB.prepare('INSERT INTO bb_versions (id,project_id,version_num,title,content,style,diff_summary,created_by) VALUES (?,?,?,?,?,?,?,?)')
          .bind(crypto.randomUUID().slice(0,8), projectId, nextVersion, proj.title, proj.content, proj.style, `Auto-save before restoring to v${version.version_num}`, 'system').run();
        // Restore
        await env.DB.prepare("UPDATE bb_projects SET title=?,content=?,style=?,updated_at=datetime('now') WHERE id=?")
          .bind(version.title, version.content, version.style||'{}', projectId).run();
        stampChain('version_restored', projectId, `restored to v${version.version_num}`).catch(()=>{});
        return j({ok:true,project_id:projectId,restored_to_version:version.version_num,auto_saved_as:nextVersion},c);
      }

      // ─── Export Project ───
      if (projExportMatch && request.method === 'GET') {
        const projectId = projExportMatch[1];
        const format = url.searchParams.get('format') || 'json';
        const proj = await env.DB.prepare('SELECT * FROM bb_projects WHERE id=?').bind(projectId).first();
        if (!proj) return j({error:'project not found'},c,404);
        const generations = await env.DB.prepare('SELECT id,prompt,result,type,tone,platform,agent,created_at FROM bb_generations WHERE project_id=? ORDER BY created_at DESC').bind(projectId).all();
        const assets = await env.DB.prepare('SELECT id,description,type,category,tags,visual_direction,agent,created_at FROM bb_assets WHERE project_id=?').bind(projectId).all();

        if (format === 'json') {
          return j({
            project: { ...proj, style: JSON.parse(proj.style || '{}') },
            generations: generations.results || [],
            assets: assets.results || [],
            exported_at: new Date().toISOString(),
          }, c);
        }

        if (format === 'markdown' || format === 'md') {
          let md = `# ${proj.title}\n\n`;
          md += `**Type:** ${proj.type} | **Created:** ${proj.created_at} | **By:** ${proj.created_by}\n\n`;
          if (proj.content) md += `## Description\n\n${proj.content}\n\n`;
          if ((generations.results || []).length) {
            md += `## Generated Content\n\n`;
            for (const g of generations.results) {
              md += `### ${g.type} (${g.agent}) — ${g.created_at}\n\n`;
              md += `**Prompt:** ${g.prompt}\n\n`;
              md += `${g.result}\n\n---\n\n`;
            }
          }
          if ((assets.results || []).length) {
            md += `## Assets\n\n`;
            for (const a of assets.results) {
              md += `- **${a.type}** (${a.agent}): ${a.description}\n`;
              if (a.visual_direction) md += `  > ${a.visual_direction.slice(0, 200)}...\n`;
            }
          }
          return new Response(md, { status: 200, headers: { ...c, 'Content-Type': 'text/markdown; charset=utf-8', 'Content-Disposition': `attachment; filename="${proj.title.replace(/[^a-z0-9]/gi,'_')}.md"` } });
        }

        if (format === 'html') {
          let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${proj.title}</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#222;line-height:1.6}h1{border-bottom:2px solid #222}h2{color:#555;margin-top:32px}h3{color:#777}.meta{color:#999;font-size:14px}.content{background:#f8f8f8;padding:16px;border-radius:6px;margin:12px 0;white-space:pre-wrap}hr{border:none;border-top:1px solid #ddd;margin:24px 0}</style></head><body>`;
          html += `<h1>${proj.title}</h1><p class="meta">${proj.type} | ${proj.created_at} | by ${proj.created_by}</p>`;
          if (proj.content) html += `<h2>Description</h2><div class="content">${proj.content}</div>`;
          if ((generations.results || []).length) {
            html += `<h2>Generated Content</h2>`;
            for (const g of generations.results) {
              html += `<h3>${g.type} (${g.agent}) — ${g.created_at}</h3><p><strong>Prompt:</strong> ${g.prompt}</p><div class="content">${g.result}</div><hr>`;
            }
          }
          if ((assets.results || []).length) {
            html += `<h2>Assets</h2><ul>`;
            for (const a of assets.results) html += `<li><strong>${a.type}</strong> (${a.agent}): ${a.description}</li>`;
            html += `</ul>`;
          }
          html += `<p class="meta">Exported from BlackBoard (BlackRoad OS) — ${new Date().toISOString()}</p></body></html>`;
          return new Response(html, { status: 200, headers: { ...c, 'Content-Type': 'text/html; charset=utf-8', 'Content-Disposition': `attachment; filename="${proj.title.replace(/[^a-z0-9]/gi,'_')}.html"` } });
        }

        if (format === 'text' || format === 'txt') {
          let txt = `${proj.title}\n${'='.repeat(proj.title.length)}\n\n`;
          txt += `Type: ${proj.type} | Created: ${proj.created_at} | By: ${proj.created_by}\n\n`;
          if (proj.content) txt += `DESCRIPTION:\n${proj.content}\n\n`;
          if ((generations.results || []).length) {
            txt += `GENERATED CONTENT:\n${'─'.repeat(40)}\n\n`;
            for (const g of generations.results) {
              txt += `[${g.type}] (${g.agent}) — ${g.created_at}\nPrompt: ${g.prompt}\n\n${g.result}\n\n${'─'.repeat(40)}\n\n`;
            }
          }
          return new Response(txt, { status: 200, headers: { ...c, 'Content-Type': 'text/plain; charset=utf-8', 'Content-Disposition': `attachment; filename="${proj.title.replace(/[^a-z0-9]/gi,'_')}.txt"` } });
        }

        return j({ error: 'Unsupported format. Use: json, markdown, html, text' }, c, 400);
      }

      // ─── Project Assets (Sapphira — visual direction) — Enhanced with categories, search, bulk ───
      if (projAssetsMatch && request.method === 'POST') {
        const projectId = projAssetsMatch[1];
        const proj = await env.DB.prepare('SELECT * FROM bb_projects WHERE id=?').bind(projectId).first();
        if (!proj) return j({error:'project not found'},c,404);
        const body = await request.json();

        // Bulk upload metadata support
        if (body.bulk && Array.isArray(body.bulk)) {
          if (body.bulk.length > 20) return j({error:'max 20 assets per bulk upload'},c,400);
          const results = [];
          for (const item of body.bulk) {
            if (!item.description) continue;
            const assetTypes = ['hero','carousel','thumbnail','banner','icon','photo','illustration','pattern'];
            const assetType = assetTypes.includes(item.type) ? item.type : 'hero';
            const category = (item.category || 'general').slice(0, 50);
            const tags = JSON.stringify(item.tags || []);
            const id = crypto.randomUUID().slice(0,8);
            await env.DB.prepare('INSERT INTO bb_assets (id,project_id,description,type,category,tags,visual_direction) VALUES (?,?,?,?,?,?,?)')
              .bind(id, projectId, item.description.slice(0,500), assetType, category, tags, item.visual_direction || '').run();
            results.push({ id, type: assetType, category, description: item.description.slice(0, 100) });
          }
          await env.DB.prepare("UPDATE bb_projects SET updated_at=datetime('now') WHERE id=?").bind(projectId).run();
          return j({ok:true,project_id:projectId,uploaded:results.length,assets:results},c,201);
        }

        if (!body.description) return j({error:'description required'},c,400);
        const assetTypes = ['hero','carousel','thumbnail','banner','icon','photo','illustration','pattern'];
        const assetType = assetTypes.includes(body.type) ? body.type : 'hero';
        const category = (body.category || 'general').slice(0, 50);
        const tags = JSON.stringify(body.tags || []);

        const sys = `${AGENTS.sapphira.prompt} Project: "${proj.title}" (${proj.type}). Generate a detailed visual direction prompt for a ${assetType} image. Include: color palette (hex codes), composition, mood, lighting, typography suggestions, aspect ratio. Be specific enough for a designer or AI image generator to execute.`;
        const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{role:'system',content:sys},{role:'user',content:body.description.slice(0,1000)}],
          max_tokens: 600, temperature: 0.7,
        });
        const visualDirection = (r?.response||'').trim();
        const id = crypto.randomUUID().slice(0,8);
        await env.DB.prepare('INSERT INTO bb_assets (id,project_id,description,type,category,tags,visual_direction) VALUES (?,?,?,?,?,?,?)')
          .bind(id, projectId, body.description.slice(0,500), assetType, category, tags, visualDirection).run();
        await env.DB.prepare("UPDATE bb_projects SET updated_at=datetime('now') WHERE id=?").bind(projectId).run();
        return j({ok:true,id,project_id:projectId,type:assetType,category,tags:body.tags||[],description:body.description,visual_direction:visualDirection,agent:'Sapphira'},c,201);
      }

      if (projAssetsMatch && request.method === 'GET') {
        const projectId = projAssetsMatch[1];
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('q');
        const assetType = url.searchParams.get('type');
        let query = 'SELECT * FROM bb_assets WHERE project_id=?';
        const params = [projectId];
        if (category) { query += ' AND category=?'; params.push(category); }
        if (assetType) { query += ' AND type=?'; params.push(assetType); }
        if (search) { query += ' AND (description LIKE ? OR visual_direction LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
        query += ' ORDER BY created_at DESC';
        const assets = await env.DB.prepare(query).bind(...params).all();
        // Parse tags
        const results = (assets.results||[]).map(a => ({ ...a, tags: JSON.parse(a.tags || '[]') }));
        return j({assets:results},c);
      }

      // ─── Project Timeline ───
      if (projTimelineMatch && request.method === 'GET') {
        const projectId = projTimelineMatch[1];
        const proj = await env.DB.prepare('SELECT id,title,type,created_at FROM bb_projects WHERE id=?').bind(projectId).first();
        if (!proj) return j({error:'project not found'},c,404);
        const generations = await env.DB.prepare('SELECT id,prompt,result,type,tone,platform,agent,created_at FROM bb_generations WHERE project_id=? ORDER BY created_at ASC').bind(projectId).all();
        const assets = await env.DB.prepare('SELECT id,description,type,agent,created_at FROM bb_assets WHERE project_id=? ORDER BY created_at ASC').bind(projectId).all();

        // Merge and sort chronologically
        const timeline = [
          { event: 'project_created', timestamp: proj.created_at, data: { title: proj.title, type: proj.type } },
          ...(generations.results||[]).map(g => ({ event: 'generation', timestamp: g.created_at, data: g })),
          ...(assets.results||[]).map(a => ({ event: 'asset', timestamp: a.created_at, data: a })),
        ].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

        return j({project:proj,timeline,total_events:timeline.length},c);
      }

      // ─── Generate content for a specific project ───
      if (projGenMatch && request.method === 'POST') {
        const projectId = projGenMatch[1];
        const proj = await env.DB.prepare('SELECT * FROM bb_projects WHERE id=?').bind(projectId).first();
        if (!proj) return j({error:'project not found'},c,404);
        const body = await request.json();
        const prompt = body.prompt || `Generate ${proj.type} content for project: ${proj.title}. ${proj.content || ''}`;

        // Load brand kit if available
        let brandContext = '';
        try {
          const kit = await env.DB.prepare('SELECT * FROM bb_brand_kits WHERE is_default=1 LIMIT 1').first();
          if (kit) {
            const colors = JSON.parse(kit.colors || '[]');
            brandContext = `Brand: ${kit.name}. Colors: ${colors.map(c=>c.hex||c).join(', ')}. Voice: ${kit.voice_guidelines}. Tone: ${kit.tone}. `;
          } else {
            const styles = await env.DB.prepare('SELECT voice, tone FROM bb_styles LIMIT 3').all();
            if (styles.results?.length) brandContext = `Brand voice: ${styles.results.map(s=>s.voice).join('; ')}. `;
          }
        } catch {}

        const sys = `${AGENTS.calliope.prompt} ${brandContext}Generate ${proj.type} content. Project: "${proj.title}". Be compelling and concise.`;
        const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{role:'system',content:sys},{role:'user',content:prompt.slice(0,1500)}],
          max_tokens: 800, temperature: 0.8,
        });
        const result = (r?.response||'').trim();
        const genId = crypto.randomUUID().slice(0,8);
        await env.DB.prepare('INSERT INTO bb_generations (id,project_id,prompt,result,model,type,agent) VALUES (?,?,?,?,?,?,?)')
          .bind(genId, projectId, prompt.slice(0,500), result, 'llama-3.1-8b', proj.type, 'Calliope').run();
        await env.DB.prepare("UPDATE bb_projects SET updated_at=datetime('now') WHERE id=?").bind(projectId).run();
        stampChain('content_generated', genId, proj.type).catch(()=>{});
        earnCoin('creator', 'generate', 1.0).catch(()=>{});
        return j({ok:true,id:genId,project_id:projectId,type:proj.type,result,agent:'Calliope'},c);
      }

      // ─── Single project with its generations ───
      if (projMatch && request.method === 'GET') {
        const proj = await env.DB.prepare('SELECT * FROM bb_projects WHERE id=?').bind(projMatch[1]).first();
        if (!proj) return j({error:'not found'},c,404);
        const generations = await env.DB.prepare('SELECT id,prompt,result,type,tone,platform,agent,created_at FROM bb_generations WHERE project_id=? ORDER BY created_at DESC LIMIT 20').bind(projMatch[1]).all();
        const assets = await env.DB.prepare('SELECT id,description,type,visual_direction,agent,created_at FROM bb_assets WHERE project_id=? ORDER BY created_at DESC LIMIT 20').bind(projMatch[1]).all();
        const collabs = await env.DB.prepare('SELECT user_id,role FROM bb_collaborators WHERE project_id=?').bind(projMatch[1]).all();
        const versionCount = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_versions WHERE project_id=?').bind(projMatch[1]).first();
        return j({...proj,style:JSON.parse(proj.style||'{}'),generations:generations.results||[],assets:assets.results||[],collaborators:collabs.results||[],version_count:versionCount?.c||0},c);
      }

      // ─── AI Generate content ───
      if (p === '/api/generate' && request.method === 'POST') {
        const body = await request.json();
        if (!body.prompt) return j({error:'prompt required'},c,400);
        const type = body.type || 'post';
        const tone = body.tone || null;
        const platform = body.platform || null;
        const tones = {post:'casual and engaging',ad:'persuasive and punchy',thread:'conversational with hooks','video-script':'visual and dynamic',email:'professional but warm','landing-page':'benefit-focused with clear CTA',campaign:'strategic across multiple channels'};

        // Load brand voice if available
        let brandContext = '';
        try {
          const kit = await env.DB.prepare('SELECT * FROM bb_brand_kits WHERE is_default=1 LIMIT 1').first();
          if (kit) {
            const colors = JSON.parse(kit.colors || '[]');
            brandContext = `\nBrand: ${kit.name}. Colors: ${colors.map(c=>c.hex||c).join(', ')}. Voice: ${kit.voice_guidelines}. Tone: ${kit.tone}.`;
          } else {
            const styles = await env.DB.prepare('SELECT name, voice, tone, audience FROM bb_styles LIMIT 3').all();
            if (styles.results?.length) {
              brandContext = `\nBrand voice references: ${styles.results.map(s => `${s.name}: ${s.voice} (tone: ${s.tone || 'default'})`).join('; ')}`;
            }
          }
        } catch {}

        const toneInstruction = tone ? `User-requested tone: ${tone}.` : `Default tone: ${tones[type]||'engaging'}.`;
        const platformInstruction = platform ? `Target platform: ${platform}. Adapt format and length accordingly.` : '';
        const sys = `${AGENTS.calliope.prompt} Generate a ${type}. ${toneInstruction} ${platformInstruction}${brandContext} Be concise. No filler. Every word earns its place.`;
        const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{role:'system',content:sys},{role:'user',content:body.prompt.slice(0,1500)}],
          max_tokens: 800, temperature: 0.8,
        });
        const result = (r?.response||'').trim();
        const id = crypto.randomUUID().slice(0,8);
        await env.DB.prepare('INSERT INTO bb_generations (id,project_id,prompt,result,model,type,tone,platform,agent) VALUES (?,?,?,?,?,?,?,?,?)')
          .bind(id, body.project_id||'', body.prompt.slice(0,500), result, 'llama-3.1-8b', type, tone, platform, 'Calliope').run();
        stampChain('content_generated', id, type).catch(()=>{});
        earnCoin('creator', 'generate', 1.0).catch(()=>{});
        return j({ok:true,id,type,tone,platform,result,agent:'Calliope'},c);
      }

      // ─── Batch Generate (Calliope — multiple at once) ───
      if (p === '/api/generate/batch' && request.method === 'POST') {
        const body = await request.json();
        if (!body.prompts || !Array.isArray(body.prompts) || body.prompts.length === 0) return j({error:'prompts array required'},c,400);
        if (body.prompts.length > 10) return j({error:'max 10 prompts per batch'},c,400);
        const type = body.type || 'post';
        const tone = body.tone || 'engaging';

        let brandContext = '';
        try {
          const styles = await env.DB.prepare('SELECT name, voice, tone FROM bb_styles LIMIT 3').all();
          if (styles.results?.length) brandContext = `\nBrand voice: ${styles.results.map(s => s.voice).join('; ')}`;
        } catch {}

        const results = [];
        for (const prompt of body.prompts) {
          const sys = `${AGENTS.calliope.prompt} Generate a ${type}. Tone: ${tone}.${brandContext} Be concise. Write the content directly.`;
          const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: [{role:'system',content:sys},{role:'user',content:String(prompt).slice(0,1000)}],
            max_tokens: 600, temperature: 0.8,
          });
          const result = (r?.response||'').trim();
          const id = crypto.randomUUID().slice(0,8);
          await env.DB.prepare('INSERT INTO bb_generations (id,project_id,prompt,result,model,type,tone,agent) VALUES (?,?,?,?,?,?,?,?)')
            .bind(id, '', String(prompt).slice(0,500), result, 'llama-3.1-8b', type, tone, 'Calliope').run();
          results.push({id,prompt:String(prompt).slice(0,100),result});
        }
        return j({ok:true,count:results.length,type,tone,results,agent:'Calliope'},c);
      }

      // ─── A/B Test Generation (Calliope + Thalia) ───
      if (p === '/api/generate/ab' && request.method === 'POST') {
        const body = await request.json();
        if (!body.prompt) return j({error:'prompt required'},c,400);
        const type = body.type || 'post';
        const platform = body.platform || null;
        const toneA = body.tone_a || 'professional and authoritative';
        const toneB = body.tone_b || 'casual and conversational';

        const platformCtx = platform ? ` Target platform: ${platform}.` : '';

        // Variation A — Calliope (professional/authoritative angle)
        const sysA = `${AGENTS.calliope.prompt} Generate a ${type}. Tone: ${toneA}.${platformCtx} Write the content directly — no labels, no meta-commentary.`;
        const rA = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{role:'system',content:sysA},{role:'user',content:body.prompt.slice(0,1500)}],
          max_tokens: 600, temperature: 0.7,
        });
        const resultA = (rA?.response||'').trim();

        // Variation B — Thalia (social/conversational angle)
        const sysB = `${AGENTS.thalia.prompt} Generate a ${type}. Tone: ${toneB}.${platformCtx} Write the content directly — no labels, no meta-commentary.`;
        const rB = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{role:'system',content:sysB},{role:'user',content:body.prompt.slice(0,1500)}],
          max_tokens: 600, temperature: 0.9,
        });
        const resultB = (rB?.response||'').trim();

        // AI recommendation
        const recSys = `You are an A/B test analyst. Compare two content variations and recommend which one to use. Consider: hook strength, clarity, emotional resonance, call-to-action effectiveness. Return a brief 2-sentence recommendation. Say "Variation A" or "Variation B" clearly.`;
        const recR = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{role:'system',content:recSys},{role:'user',content:`Variation A (${toneA}):\n${resultA}\n\nVariation B (${toneB}):\n${resultB}`}],
          max_tokens: 150, temperature: 0.3,
        });
        const recommendation = (recR?.response||'').trim();

        // Save both generations
        const idA = crypto.randomUUID().slice(0,8);
        const idB = crypto.randomUUID().slice(0,8);
        await env.DB.prepare('INSERT INTO bb_generations (id,project_id,prompt,result,model,type,tone,agent) VALUES (?,?,?,?,?,?,?,?)')
          .bind(idA, '', body.prompt.slice(0,500), resultA, 'llama-3.1-8b', type, toneA, 'Calliope').run();
        await env.DB.prepare('INSERT INTO bb_generations (id,project_id,prompt,result,model,type,tone,agent) VALUES (?,?,?,?,?,?,?,?)')
          .bind(idB, '', body.prompt.slice(0,500), resultB, 'llama-3.1-8b', type, toneB, 'Thalia').run();

        return j({ok:true,prompt:body.prompt.slice(0,200),a:{id:idA,tone:toneA,result:resultA,agent:'Calliope'},b:{id:idB,tone:toneB,result:resultB,agent:'Thalia'},recommendation},c);
      }

      // ─── Remix (Lyra — transform existing generation) ───
      if (p === '/api/remix' && request.method === 'POST') {
        const body = await request.json();

        // ─── AI Remix: content-based remix for different platforms ───
        if (body.content && body.target_platforms) {
          if (!Array.isArray(body.target_platforms) || body.target_platforms.length === 0) return j({error:'target_platforms array required'},c,400);
          if (body.target_platforms.length > 6) return j({error:'max 6 target platforms'},c,400);

          const remixes = [];
          for (const platform of body.target_platforms) {
            const platformFormats = {
              tweet: 'Single tweet, max 280 characters. Punchy hook. No hashtag spam (max 2).',
              thread: 'Twitter thread of 4-6 tweets. Each tweet hooks into the next. Number them.',
              newsletter: 'Email newsletter format. Subject line + preview text + body with sections + CTA.',
              linkedin: 'LinkedIn post. Professional tone, storytelling format, strategic line breaks for readability.',
              instagram: 'Instagram caption. Hook line, body with line breaks, 5-10 relevant hashtags at end.',
              tiktok: 'TikTok script. Hook (first 3 seconds), body with visual cues, CTA. Casual tone.',
              blog: 'Blog post with H2 headers, intro paragraph, 3-4 sections, conclusion with CTA.',
              youtube: 'YouTube description. Timestamps, key points, links section, subscribe CTA.',
              podcast: 'Podcast show notes. Episode title, bullet point highlights, guest info, resources mentioned.',
              email: 'Marketing email. Subject line, preview text, body with one clear CTA.',
            };
            const formatGuide = platformFormats[platform] || `Content for ${platform}. Adapt format and length for this platform.`;
            const sys = `${AGENTS.lyra.prompt} Transform this content for ${platform}. ${formatGuide} Preserve the core message. Write the content directly.`;
            const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
              messages: [{role:'system',content:sys},{role:'user',content:String(body.content).slice(0,2000)}],
              max_tokens: 800, temperature: 0.8,
            });
            const result = (r?.response||'').trim();
            const id = crypto.randomUUID().slice(0,8);
            await env.DB.prepare('INSERT INTO bb_generations (id,project_id,prompt,result,model,type,tone,platform,agent) VALUES (?,?,?,?,?,?,?,?,?)')
              .bind(id, body.project_id||'', `Remix for ${platform}`, result, 'llama-3.1-8b', 'remix', body.tone||'adaptive', platform, 'Lyra').run();
            remixes.push({ id, platform, result });
          }
          stampChain('content_remixed', 'multi', body.target_platforms.join(',')).catch(()=>{});
          earnCoin('creator', 'remix_multi', 2.0).catch(()=>{});
          return j({ok:true,source:'content',remixes,agent:'Lyra'},c);
        }

        // Original generation_id-based remix
        if (!body.generation_id) return j({error:'generation_id or content+target_platforms required'},c,400);
        const original = await env.DB.prepare('SELECT * FROM bb_generations WHERE id=?').bind(body.generation_id).first();
        if (!original) return j({error:'generation not found'},c,404);
        const newTone = body.new_tone || 'fresh and modern';
        const newPlatform = body.new_platform || null;

        const platformCtx = newPlatform ? ` Adapt for ${newPlatform} — respect its format constraints and audience expectations.` : '';
        const sys = `${AGENTS.lyra.prompt} Take the following content and remix it. New tone: ${newTone}.${platformCtx} Preserve the core message but transform the delivery completely. Write the remixed content directly.`;
        const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{role:'system',content:sys},{role:'user',content:`Original (${original.type}, tone: ${original.tone||'default'}):\n${original.result}`}],
          max_tokens: 800, temperature: 0.85,
        });
        const result = (r?.response||'').trim();
        const id = crypto.randomUUID().slice(0,8);
        await env.DB.prepare('INSERT INTO bb_generations (id,project_id,prompt,result,model,type,tone,platform,agent) VALUES (?,?,?,?,?,?,?,?,?)')
          .bind(id, original.project_id||'', `Remix of ${body.generation_id}`, result, 'llama-3.1-8b', original.type, newTone, newPlatform, 'Lyra').run();
        return j({ok:true,id,original_id:body.generation_id,new_tone:newTone,new_platform:newPlatform,result,agent:'Lyra'},c);
      }

      // ─── Design Templates ───
      if (p === '/api/designs' && request.method === 'GET') {
        const category = url.searchParams.get('category');
        const platform = url.searchParams.get('platform');
        let templates = DESIGN_TEMPLATES;
        if (category) templates = templates.filter(t => t.category === category);
        if (platform) templates = templates.filter(t => t.platforms.includes(platform));
        const categories = [...new Set(DESIGN_TEMPLATES.map(t => t.category))];
        const platforms = [...new Set(DESIGN_TEMPLATES.flatMap(t => t.platforms))];
        return j({ templates, categories, platforms, total: templates.length }, c);
      }

      // ─── Templates ───
      if (p === '/api/templates') {
        return j({templates:[
          {id:'social-post',name:'Social Post',desc:'Short, punchy, shareable. Perfect for Twitter, Instagram, LinkedIn.',fields:['topic','audience','tone'],example:'Announce your new feature in one compelling sentence that makes people click.',agent:'Thalia'},
          {id:'ad-copy',name:'Ad Copy',desc:'Headline + body + CTA. Conversion-optimized.',fields:['product','benefit','audience'],example:'Write a Facebook ad for a password manager that emphasizes privacy.',agent:'Calliope'},
          {id:'email',name:'Email',desc:'Subject line + body + signature. Professional or casual.',fields:['purpose','audience','tone'],example:'Welcome email for a new SaaS subscriber. Warm, helpful, one clear CTA.',agent:'Calliope'},
          {id:'thread',name:'Thread',desc:'5-7 connected posts with hooks. Build narrative tension.',fields:['topic','angle','audience'],example:'Twitter thread breaking down why Big Tech tracks everything you do.',agent:'Thalia'},
          {id:'video-script',name:'Video Script',desc:'Hook (3s) + body + CTA. Timestamped for editing.',fields:['topic','length','style'],example:'60-second explainer for an AI tutor product. Hook, problem, solution, CTA.',agent:'Calliope'},
          {id:'landing-page',name:'Landing Page',desc:'Hero + features + social proof + CTA. Full page structure.',fields:['product','audience','key-benefit'],example:'Landing page for an AI-powered business automation platform.',agent:'Sapphira'},
          {id:'campaign',name:'Full Campaign',desc:'Post + ad + email + thread + video script in one shot. Multi-channel consistency.',fields:['product','goal','audience'],example:'Launch campaign for a new AI product. Cover social, email, ads, and video.',agent:'Calliope'},
        ],agents:Object.values(AGENTS).map(a=>({name:a.name,role:a.role}))},c);
      }

      // ─── Generations history ───
      if (p === '/api/generations') {
        const limit = Math.min(parseInt(url.searchParams.get('limit')||'30'),100);
        const type = url.searchParams.get('type');
        let query = 'SELECT id,project_id,prompt,result,model,type,tone,platform,agent,created_at FROM bb_generations';
        const params = [];
        if (type) { query += ' WHERE type=?'; params.push(type); }
        query += ' ORDER BY created_at DESC LIMIT ?';
        params.push(limit);
        const rows = await env.DB.prepare(query).bind(...params).all();
        return j({generations:rows.results||[]},c);
      }

      // ─── Brand Kit ───
      if (p === '/api/brand-kit' && request.method === 'GET') {
        const rows = await env.DB.prepare('SELECT * FROM bb_brand_kits ORDER BY is_default DESC, updated_at DESC LIMIT 20').all();
        const kits = (rows.results || []).map(k => ({
          ...k,
          colors: JSON.parse(k.colors || '[]'),
          fonts: JSON.parse(k.fonts || '{}'),
          logos: JSON.parse(k.logos || '[]'),
        }));
        return j({ brand_kits: kits }, c);
      }

      if (p === '/api/brand-kit' && request.method === 'POST') {
        const body = await request.json();
        if (!body.name) return j({ error: 'name required' }, c, 400);
        const id = crypto.randomUUID().slice(0, 8);
        const colors = JSON.stringify(body.colors || []);
        const fonts = JSON.stringify(body.fonts || {});
        const logos = JSON.stringify(body.logos || []);
        // If setting as default, unset others
        if (body.is_default) {
          await env.DB.prepare('UPDATE bb_brand_kits SET is_default=0').run();
        }
        await env.DB.prepare('INSERT INTO bb_brand_kits (id,name,colors,fonts,logos,voice_guidelines,tone,audience,created_by,is_default) VALUES (?,?,?,?,?,?,?,?,?,?)')
          .bind(id, body.name.slice(0, 100), colors, fonts, logos,
            (body.voice_guidelines || '').slice(0, 1000),
            (body.tone || '').slice(0, 200),
            (body.audience || '').slice(0, 200),
            (body.user || 'anon').slice(0, 32),
            body.is_default ? 1 : 0
          ).run();
        stampChain('brand_kit_created', id, body.name.slice(0, 100)).catch(() => {});
        return j({ ok: true, id, name: body.name, is_default: !!body.is_default }, c, 201);
      }

      if (p === '/api/brand-kit' && request.method === 'PUT') {
        const body = await request.json();
        if (!body.id) return j({ error: 'id required' }, c, 400);
        const existing = await env.DB.prepare('SELECT * FROM bb_brand_kits WHERE id=?').bind(body.id).first();
        if (!existing) return j({ error: 'brand kit not found' }, c, 404);
        const updates = {};
        if (body.name) updates.name = body.name.slice(0, 100);
        if (body.colors) updates.colors = JSON.stringify(body.colors);
        if (body.fonts) updates.fonts = JSON.stringify(body.fonts);
        if (body.logos) updates.logos = JSON.stringify(body.logos);
        if (body.voice_guidelines !== undefined) updates.voice_guidelines = body.voice_guidelines.slice(0, 1000);
        if (body.tone !== undefined) updates.tone = body.tone.slice(0, 200);
        if (body.audience !== undefined) updates.audience = body.audience.slice(0, 200);
        if (body.is_default) {
          await env.DB.prepare('UPDATE bb_brand_kits SET is_default=0').run();
          updates.is_default = 1;
        }
        const setClauses = Object.keys(updates).map(k => `${k}=?`).join(',');
        if (setClauses) {
          await env.DB.prepare(`UPDATE bb_brand_kits SET ${setClauses},updated_at=datetime('now') WHERE id=?`)
            .bind(...Object.values(updates), body.id).run();
        }
        return j({ ok: true, id: body.id, updated: Object.keys(updates) }, c);
      }

      // ─── Brand Voice Styles ───
      if (p === '/api/styles' && request.method === 'GET') {
        const rows = await env.DB.prepare('SELECT * FROM bb_styles ORDER BY created_at DESC LIMIT 20').all();
        return j({styles:rows.results?.map(s=>({...s,examples:JSON.parse(s.examples||'[]')}))||[]},c);
      }

      if (p === '/api/styles' && request.method === 'POST') {
        const body = await request.json();
        if (!body.name || !body.voice) return j({error:'name and voice are required'},c,400);
        const id = crypto.randomUUID().slice(0,8);
        await env.DB.prepare('INSERT INTO bb_styles (id,name,voice,tone,audience,examples) VALUES (?,?,?,?,?,?)')
          .bind(id, body.name.slice(0,100), body.voice.slice(0,500), body.tone||null, body.audience||null, JSON.stringify(body.examples||[])).run();
        return j({ok:true,id,name:body.name,voice:body.voice},c,201);
      }

      // ─── Content Schedule ───
      if (p === '/api/schedule' && request.method === 'GET') {
        const status = url.searchParams.get('status');
        const platform = url.searchParams.get('platform');
        let query = 'SELECT * FROM bb_schedule WHERE 1=1';
        const params = [];
        if (status) { query += ' AND status=?'; params.push(status); }
        if (platform) { query += ' AND platform=?'; params.push(platform); }
        query += ' ORDER BY scheduled_at ASC LIMIT 100';
        const rows = await env.DB.prepare(query).bind(...params).all();
        // Group by status
        const scheduled = (rows.results || []).filter(r => r.status === 'scheduled');
        const published = (rows.results || []).filter(r => r.status === 'published');
        const failed = (rows.results || []).filter(r => r.status === 'failed');
        return j({ schedule: rows.results || [], summary: { scheduled: scheduled.length, published: published.length, failed: failed.length, total: (rows.results || []).length } }, c);
      }

      if (p === '/api/schedule' && request.method === 'POST') {
        const body = await request.json();
        if (!body.content) return j({ error: 'content required' }, c, 400);
        if (!body.platform) return j({ error: 'platform required' }, c, 400);
        if (!body.scheduled_at) return j({ error: 'scheduled_at required (ISO 8601 datetime)' }, c, 400);
        const platforms = ['twitter', 'linkedin', 'instagram', 'facebook', 'tiktok', 'youtube', 'blog', 'email', 'newsletter', 'backroad'];
        if (!platforms.includes(body.platform)) return j({ error: `platform must be one of: ${platforms.join(', ')}` }, c, 400);
        const id = crypto.randomUUID().slice(0, 8);
        await env.DB.prepare('INSERT INTO bb_schedule (id,project_id,generation_id,content,platform,scheduled_at,created_by) VALUES (?,?,?,?,?,?,?)')
          .bind(id, body.project_id || '', body.generation_id || '', body.content.slice(0, 5000), body.platform, body.scheduled_at, (body.user || 'anon').slice(0, 32)).run();
        // Try to notify BackRoad if platform is backroad
        if (body.platform === 'backroad') {
          try {
            await fetch('https://backroad-blackroad.amundsonalexa.workers.dev/api/posts', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: body.content.slice(0, 2000), author: body.user || 'blackboard', scheduled_at: body.scheduled_at })
            });
          } catch {}
        }
        stampChain('content_scheduled', id, `${body.platform} at ${body.scheduled_at}`).catch(() => {});
        return j({ ok: true, id, platform: body.platform, scheduled_at: body.scheduled_at, status: 'scheduled' }, c, 201);
      }

      // Update schedule status
      const scheduleMatch = p.match(/^\/api\/schedule\/([^/]+)$/);
      if (scheduleMatch && request.method === 'PUT') {
        const scheduleId = scheduleMatch[1];
        const body = await request.json();
        const validStatuses = ['scheduled', 'published', 'failed', 'cancelled'];
        if (body.status && !validStatuses.includes(body.status)) return j({ error: `status must be one of: ${validStatuses.join(', ')}` }, c, 400);
        const updates = [];
        const params = [];
        if (body.status) { updates.push('status=?'); params.push(body.status); }
        if (body.published_url) { updates.push('published_url=?'); params.push(body.published_url); }
        if (body.scheduled_at) { updates.push('scheduled_at=?'); params.push(body.scheduled_at); }
        if (updates.length === 0) return j({ error: 'nothing to update' }, c, 400);
        updates.push("updated_at=datetime('now')");
        params.push(scheduleId);
        await env.DB.prepare(`UPDATE bb_schedule SET ${updates.join(',')} WHERE id=?`).bind(...params).run();
        return j({ ok: true, id: scheduleId, updated: updates.length - 1 }, c);
      }

      if (scheduleMatch && request.method === 'DELETE') {
        const scheduleId = scheduleMatch[1];
        await env.DB.prepare('DELETE FROM bb_schedule WHERE id=?').bind(scheduleId).run();
        return j({ ok: true, deleted: scheduleId }, c);
      }

      // ─── Stats (enhanced) ───
      if (p === '/api/stats') {
        const proj = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_projects').first();
        const gen = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_generations').first();
        const styles = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_styles').first();
        const assets = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_assets').first();
        const byType = await env.DB.prepare('SELECT type, COUNT(*) as count FROM bb_generations GROUP BY type ORDER BY count DESC').all();
        const byPlatform = await env.DB.prepare("SELECT platform, COUNT(*) as count FROM bb_generations WHERE platform IS NOT NULL AND platform != '' GROUP BY platform ORDER BY count DESC").all();
        const byAgent = await env.DB.prepare("SELECT agent, COUNT(*) as count FROM bb_generations WHERE agent IS NOT NULL GROUP BY agent ORDER BY count DESC").all();
        const recentGen = await env.DB.prepare("SELECT COUNT(*) as c FROM bb_generations WHERE created_at >= datetime('now','-24 hours')").first();
        const topType = await env.DB.prepare('SELECT type, COUNT(*) as count FROM bb_generations GROUP BY type ORDER BY count DESC LIMIT 1').first();
        const brandKits = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_brand_kits').first();
        const collabs = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_collaborators').first();
        const versions = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_versions').first();
        const scheduled = await env.DB.prepare("SELECT COUNT(*) as c FROM bb_schedule WHERE status='scheduled'").first();

        // Estimate tokens (avg ~150 tokens per generation input+output)
        const totalGens = gen?.c || 0;
        const estimatedTokens = totalGens * 150;

        return j({
          projects: proj?.c || 0,
          total_generations: totalGens,
          styles: styles?.c || 0,
          assets: assets?.c || 0,
          brand_kits: brandKits?.c || 0,
          collaborators: collabs?.c || 0,
          versions: versions?.c || 0,
          scheduled_posts: scheduled?.c || 0,
          generations_today: recentGen?.c || 0,
          ai_tokens_used: estimatedTokens,
          top_performing_type: topType?.type || null,
          by_type: (byType.results||[]).reduce((acc,r) => { acc[r.type] = r.count; return acc; }, {}),
          by_platform: (byPlatform.results||[]).reduce((acc,r) => { acc[r.platform] = r.count; return acc; }, {}),
          by_agent: (byAgent.results||[]).reduce((acc,r) => { acc[r.agent] = r.count; return acc; }, {}),
          agents: Object.values(AGENTS).map(a => ({ name: a.name, role: a.role })),
        },c);
      }

      // ─── Image Generation (merged from images-blackroad — Sapphira personality) ───
      if (p === '/api/images/generate' && request.method === 'POST') {
        const body = await request.json();
        if (!body.prompt) return j({error:'prompt required'},c,400);
        const provider = body.provider || 'together';
        const model = body.model || 'flux-schnell';
        const size = body.size || '1024x1024';
        const [w, h] = size.split('x').map(Number);

        // Sapphira enhances the prompt with visual direction
        let enhancedPrompt = body.prompt;
        try {
          const enhance = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: [
              {role:'system',content:AGENTS.sapphira.prompt + ' Given a user image idea, enhance it into a detailed, vivid image generation prompt. Add lighting, mood, composition, color details. Return ONLY the enhanced prompt, nothing else.'},
              {role:'user',content:body.prompt.slice(0,500)}
            ], max_tokens: 200, temperature: 0.7,
          });
          if (enhance?.response) enhancedPrompt = enhance.response.trim();
        } catch {}

        // Route to external image providers
        let imageUrl = null;
        let error = null;
        try {
          if (provider === 'together') {
            const key = env.TOGETHER_API_KEY;
            if (!key) throw new Error('TOGETHER_API_KEY not set');
            const modelMap = {
              'flux-schnell': 'black-forest-labs/FLUX.1-schnell-Free',
              'flux-1.1-pro': 'black-forest-labs/FLUX.1.1-pro',
              'sdxl': 'stabilityai/stable-diffusion-xl-base-1.0',
            };
            const res = await fetch('https://api.together.xyz/v1/images/generations', {
              method:'POST',
              headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
              body:JSON.stringify({model:modelMap[model]||modelMap['flux-schnell'],prompt:enhancedPrompt,width:w,height:h,n:1,response_format:'url'}),
            });
            if (!res.ok) throw new Error(`Together: ${res.status}`);
            const data = await res.json();
            imageUrl = data.data?.[0]?.url || data.data?.[0]?.b64_json;
          } else if (provider === 'openai') {
            const key = env.OPENAI_API_KEY;
            if (!key) throw new Error('OPENAI_API_KEY not set');
            const res = await fetch('https://api.openai.com/v1/images/generations', {
              method:'POST',
              headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
              body:JSON.stringify({model:'dall-e-3',prompt:enhancedPrompt,n:1,size,response_format:'url'}),
            });
            if (!res.ok) throw new Error(`OpenAI: ${res.status}`);
            const data = await res.json();
            imageUrl = data.data?.[0]?.url;
          } else {
            throw new Error(`Provider ${provider} not supported. Use: together, openai`);
          }
        } catch(e) { error = e.message; }

        // Log generation
        const genId = crypto.randomUUID().slice(0,8);
        await env.DB.prepare('INSERT INTO bb_generations (id,project_id,prompt,result,model,type,agent) VALUES (?,?,?,?,?,?,?)')
          .bind(genId, body.project_id||'', body.prompt.slice(0,500), imageUrl || error || 'generation attempted', model, 'image', 'Sapphira').run();
        stampChain('image_generated', genId, provider).catch(()=>{});
        earnCoin('creator', 'image_generate', 1.5).catch(()=>{});

        if (error) return j({ok:false,error,enhanced_prompt:enhancedPrompt,agent:'Sapphira'},c,500);
        return j({ok:true,id:genId,image_url:imageUrl,enhanced_prompt:enhancedPrompt,provider,model,size,agent:'Sapphira'},c);
      }

      // ─── Image Search (merged from images-blackroad) ───
      if (p === '/api/images/search' && request.method === 'GET') {
        const q = url.searchParams.get('q') || '';
        const limit = Math.min(parseInt(url.searchParams.get('limit')||'24'),100);
        if (!q) return j({error:'q parameter required'},c,400);
        // Search generations that are images
        const rows = await env.DB.prepare(
          "SELECT id,prompt,result,model,created_at FROM bb_generations WHERE prompt LIKE ? OR result LIKE ? ORDER BY created_at DESC LIMIT ?"
        ).bind(`%${q}%`,`%${q}%`,limit).all();
        return j({query:q,results:rows.results||[]},c);
      }

      // ─── List All Images (merged from images-blackroad) ───
      if (p === '/api/images' && request.method === 'GET') {
        const limit = Math.min(parseInt(url.searchParams.get('limit')||'30'),100);
        try {
          const rows = await env.DB.prepare(
            "SELECT id,prompt,result,model,created_at FROM bb_generations WHERE result LIKE 'http%' ORDER BY created_at DESC LIMIT ?"
          ).bind(limit).all();
          return j({images:rows.results||[],count:(rows.results||[]).length},c);
        } catch {
          return j({images:[],count:0,note:'No image generations yet'},c);
        }
      }

      // ─── Canvas Tables ───
      await env.DB.batch([
        env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_canvas (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT DEFAULT 'brainstorm', status TEXT DEFAULT 'active', created_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`),
        env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_canvas_elements (id TEXT PRIMARY KEY, canvas_id TEXT NOT NULL, type TEXT NOT NULL, content TEXT, x INTEGER DEFAULT 0, y INTEGER DEFAULT 0, width INTEGER DEFAULT 200, height INTEGER DEFAULT 100, style TEXT DEFAULT '{}', created_at TEXT DEFAULT (datetime('now')))`),
      ]);

      // ─── New Feature Tables (Mood Board, Typography, Colors, Layouts, Copy Variants, Campaigns, Feedback, Design System) ───
      await env.DB.batch([
        env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_moodboards (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT DEFAULT '', palette TEXT DEFAULT '[]', images TEXT DEFAULT '[]', snippets TEXT DEFAULT '[]', links TEXT DEFAULT '[]', tags TEXT DEFAULT '[]', created_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`),
        env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_typography (id TEXT PRIMARY KEY, name TEXT NOT NULL, heading_font TEXT, body_font TEXT, scale TEXT DEFAULT '{}', pairings TEXT DEFAULT '[]', readability_score REAL DEFAULT 0, notes TEXT DEFAULT '', created_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')))`),
        env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_color_palettes (id TEXT PRIMARY KEY, name TEXT NOT NULL, harmony TEXT DEFAULT 'complementary', colors TEXT DEFAULT '[]', base_color TEXT, source TEXT DEFAULT 'manual', context TEXT DEFAULT '', created_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')))`),
        env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_layouts (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT DEFAULT 'page', grid TEXT DEFAULT '{}', components TEXT DEFAULT '[]', breakpoints TEXT DEFAULT '{}', preview_html TEXT DEFAULT '', created_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')))`),
      ]);
      await env.DB.batch([
        env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_copy_variants (id TEXT PRIMARY KEY, group_id TEXT NOT NULL, original TEXT NOT NULL, variant TEXT NOT NULL, tone TEXT DEFAULT 'neutral', length TEXT DEFAULT 'medium', score REAL DEFAULT 0, status TEXT DEFAULT 'draft', created_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')))`),
        env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_campaigns (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT DEFAULT '', channels TEXT DEFAULT '[]', timeline TEXT DEFAULT '[]', assets_checklist TEXT DEFAULT '[]', assignments TEXT DEFAULT '[]', status TEXT DEFAULT 'planning', start_date TEXT, end_date TEXT, created_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`),
        env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_feedback (id TEXT PRIMARY KEY, target_type TEXT NOT NULL, target_id TEXT NOT NULL, author TEXT NOT NULL, comment TEXT NOT NULL, status TEXT DEFAULT 'pending', priority TEXT DEFAULT 'normal', revision_num INTEGER DEFAULT 0, parent_id TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`),
        env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_design_tokens (id TEXT PRIMARY KEY, system_id TEXT NOT NULL, category TEXT NOT NULL, name TEXT NOT NULL, value TEXT NOT NULL, description TEXT DEFAULT '', metadata TEXT DEFAULT '{}', created_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`),
        env.DB.prepare(`CREATE TABLE IF NOT EXISTS bb_design_systems (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT DEFAULT '', version TEXT DEFAULT '1.0.0', is_active INTEGER DEFAULT 0, created_by TEXT DEFAULT 'anon', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))`),
      ]);

      // ─── POST /api/canvas — Create a collaborative canvas session ───
      if (p === '/api/canvas' && request.method === 'POST') {
        const body = await request.json();
        if (!body.name) return j({error:'name required'},c,400);
        const types = ['brainstorm','design','campaign'];
        const type = types.includes(body.type) ? body.type : 'brainstorm';
        const id = crypto.randomUUID().slice(0,8);
        await env.DB.prepare('INSERT INTO bb_canvas (id,name,type,created_by) VALUES (?,?,?,?)')
          .bind(id, body.name.slice(0,100), type, (body.user||'anon').slice(0,32)).run();
        stampChain('canvas_created', id, body.name.slice(0,100)).catch(()=>{});
        earnCoin('creator', 'canvas_create', 0.5).catch(()=>{});
        return j({ok:true,session_id:id,name:body.name,type},c,201);
      }

      // ─── GET /api/canvas — List all canvas sessions ───
      if (p === '/api/canvas' && request.method === 'GET') {
        const rows = await env.DB.prepare('SELECT id,name,type,status,created_by,created_at,updated_at FROM bb_canvas ORDER BY updated_at DESC LIMIT 50').all();
        return j({sessions:rows.results||[]},c);
      }

      // ─── GET /api/canvas/:id — Get canvas state with all elements ───
      const canvasMatch = p.match(/^\/api\/canvas\/([^/]+)$/);
      const canvasElementMatch = p.match(/^\/api\/canvas\/([^/]+)\/element$/);

      if (canvasElementMatch && request.method === 'POST') {
        const canvasId = canvasElementMatch[1];
        const canvas = await env.DB.prepare('SELECT * FROM bb_canvas WHERE id=?').bind(canvasId).first();
        if (!canvas) return j({error:'canvas not found'},c,404);
        const body = await request.json();
        const elTypes = ['text','image','shape','note','link'];
        const elType = elTypes.includes(body.type) ? body.type : 'text';
        const id = crypto.randomUUID().slice(0,8);
        await env.DB.prepare('INSERT INTO bb_canvas_elements (id,canvas_id,type,content,x,y,width,height,style) VALUES (?,?,?,?,?,?,?,?,?)')
          .bind(id, canvasId, elType, (body.content||'').slice(0,2000), body.x||0, body.y||0, body.width||200, body.height||100, JSON.stringify(body.style||{})).run();
        await env.DB.prepare("UPDATE bb_canvas SET updated_at=datetime('now') WHERE id=?").bind(canvasId).run();
        stampChain('canvas_element_added', id, canvasId).catch(()=>{});
        return j({ok:true,id,canvas_id:canvasId,type:elType,x:body.x||0,y:body.y||0},c,201);
      }

      if (canvasMatch && request.method === 'GET') {
        const canvasId = canvasMatch[1];
        const canvas = await env.DB.prepare('SELECT * FROM bb_canvas WHERE id=?').bind(canvasId).first();
        if (!canvas) return j({error:'canvas not found'},c,404);
        const elements = await env.DB.prepare('SELECT * FROM bb_canvas_elements WHERE canvas_id=? ORDER BY created_at ASC').bind(canvasId).all();
        return j({canvas:{id:canvas.id,name:canvas.name,type:canvas.type,status:canvas.status,created_by:canvas.created_by,created_at:canvas.created_at,updated_at:canvas.updated_at},elements:elements.results||[],element_count:(elements.results||[]).length},c);
      }

      // ─── GET /api/analytics — Content analytics ───
      if (p === '/api/analytics' && request.method === 'GET') {
        const totalGen = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_generations').first();
        const byType = await env.DB.prepare('SELECT type, COUNT(*) as count FROM bb_generations GROUP BY type ORDER BY count DESC').all();
        const byAgent = await env.DB.prepare("SELECT agent, COUNT(*) as count FROM bb_generations WHERE agent IS NOT NULL GROUP BY agent ORDER BY count DESC").all();
        const byPlatform = await env.DB.prepare("SELECT platform, COUNT(*) as count FROM bb_generations WHERE platform IS NOT NULL AND platform != '' GROUP BY platform ORDER BY count DESC").all();
        const todayGen = await env.DB.prepare("SELECT COUNT(*) as c FROM bb_generations WHERE created_at >= datetime('now','-24 hours')").first();
        const weekGen = await env.DB.prepare("SELECT COUNT(*) as c FROM bb_generations WHERE created_at >= datetime('now','-7 days')").first();
        const topType = await env.DB.prepare('SELECT type, COUNT(*) as count FROM bb_generations GROUP BY type ORDER BY count DESC LIMIT 1').first();
        const projects = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_projects').first();
        const assets = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_assets').first();
        const canvases = await env.DB.prepare('SELECT COUNT(*) as c FROM bb_canvas').first();
        const scheduledCount = await env.DB.prepare("SELECT COUNT(*) as c FROM bb_schedule WHERE status='scheduled'").first();
        const publishedCount = await env.DB.prepare("SELECT COUNT(*) as c FROM bb_schedule WHERE status='published'").first();
        const estimatedTokens = (totalGen?.c || 0) * 150;

        return j({
          analytics: {
            total_generations: totalGen?.c || 0,
            generations_today: todayGen?.c || 0,
            generations_this_week: weekGen?.c || 0,
            total_projects: projects?.c || 0,
            total_assets: assets?.c || 0,
            total_canvases: canvases?.c || 0,
            scheduled_posts: scheduledCount?.c || 0,
            published_posts: publishedCount?.c || 0,
            estimated_ai_tokens: estimatedTokens,
            top_performing_type: topType?.type || null,
            by_type: (byType.results||[]).reduce((acc,r) => { acc[r.type] = r.count; return acc; }, {}),
            by_agent: (byAgent.results||[]).reduce((acc,r) => { acc[r.agent] = r.count; return acc; }, {}),
            by_platform: (byPlatform.results||[]).reduce((acc,r) => { acc[r.platform] = r.count; return acc; }, {}),
          }
        },c);
      }


      // ═══════════════════════════════════════════════════════════════
      // ─── 1. MOOD BOARD (/api/moodboard) ───
      // ═══════════════════════════════════════════════════════════════

      if (p === '/api/moodboard' && request.method === 'GET') {
        const tag = url.searchParams.get('tag');
        const search = url.searchParams.get('q');
        let query = 'SELECT * FROM bb_moodboards WHERE 1=1';
        const params = [];
        if (tag) { query += ' AND tags LIKE ?'; params.push(`%${tag}%`); }
        if (search) { query += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
        query += ' ORDER BY updated_at DESC LIMIT 50';
        const rows = await env.DB.prepare(query).bind(...params).all();
        const boards = (rows.results || []).map(b => ({
          ...b,
          palette: JSON.parse(b.palette || '[]'),
          images: JSON.parse(b.images || '[]'),
          snippets: JSON.parse(b.snippets || '[]'),
          links: JSON.parse(b.links || '[]'),
          tags: JSON.parse(b.tags || '[]'),
        }));
        return j({ moodboards: boards, total: boards.length }, c);
      }

      if (p === '/api/moodboard' && request.method === 'POST') {
        const body = await request.json();
        if (!body.name) return j({ error: 'name required' }, c, 400);
        const id = crypto.randomUUID().slice(0, 8);
        const palette = JSON.stringify(body.palette || []);
        const images = JSON.stringify(body.images || []);
        const snippets = JSON.stringify(body.snippets || []);
        const links = JSON.stringify(body.links || []);
        const tags = JSON.stringify(body.tags || []);
        await env.DB.prepare('INSERT INTO bb_moodboards (id,name,description,palette,images,snippets,links,tags,created_by) VALUES (?,?,?,?,?,?,?,?,?)')
          .bind(id, body.name.slice(0, 100), (body.description || '').slice(0, 500), palette, images, snippets, links, tags, (body.user || 'anon').slice(0, 32)).run();
        stampChain('moodboard_created', id, body.name.slice(0, 100)).catch(() => {});
        earnCoin('creator', 'moodboard_create', 0.5).catch(() => {});
        return j({ ok: true, id, name: body.name }, c, 201);
      }

      const moodboardMatch = p.match(/^\/api\/moodboard\/([^/]+)$/);
      if (moodboardMatch && request.method === 'GET') {
        const board = await env.DB.prepare('SELECT * FROM bb_moodboards WHERE id=?').bind(moodboardMatch[1]).first();
        if (!board) return j({ error: 'moodboard not found' }, c, 404);
        return j({
          ...board,
          palette: JSON.parse(board.palette || '[]'),
          images: JSON.parse(board.images || '[]'),
          snippets: JSON.parse(board.snippets || '[]'),
          links: JSON.parse(board.links || '[]'),
          tags: JSON.parse(board.tags || '[]'),
        }, c);
      }

      if (moodboardMatch && request.method === 'PUT') {
        const boardId = moodboardMatch[1];
        const existing = await env.DB.prepare('SELECT * FROM bb_moodboards WHERE id=?').bind(boardId).first();
        if (!existing) return j({ error: 'moodboard not found' }, c, 404);
        const body = await request.json();
        const updates = [];
        const params = [];
        if (body.name) { updates.push('name=?'); params.push(body.name.slice(0, 100)); }
        if (body.description !== undefined) { updates.push('description=?'); params.push(body.description.slice(0, 500)); }
        if (body.palette) { updates.push('palette=?'); params.push(JSON.stringify(body.palette)); }
        if (body.images) { updates.push('images=?'); params.push(JSON.stringify(body.images)); }
        if (body.snippets) { updates.push('snippets=?'); params.push(JSON.stringify(body.snippets)); }
        if (body.links) { updates.push('links=?'); params.push(JSON.stringify(body.links)); }
        if (body.tags) { updates.push('tags=?'); params.push(JSON.stringify(body.tags)); }
        if (updates.length === 0) return j({ error: 'nothing to update' }, c, 400);
        updates.push("updated_at=datetime('now')");
        params.push(boardId);
        await env.DB.prepare(`UPDATE bb_moodboards SET ${updates.join(',')} WHERE id=?`).bind(...params).run();
        return j({ ok: true, id: boardId, updated: updates.length - 1 }, c);
      }

      if (moodboardMatch && request.method === 'DELETE') {
        await env.DB.prepare('DELETE FROM bb_moodboards WHERE id=?').bind(moodboardMatch[1]).run();
        return j({ ok: true, deleted: moodboardMatch[1] }, c);
      }

      // AI-generate mood board from a concept
      if (p === '/api/moodboard/generate' && request.method === 'POST') {
        const body = await request.json();
        if (!body.concept) return j({ error: 'concept required' }, c, 400);
        const sys = `${AGENTS.sapphira.prompt} Generate a mood board specification for the given concept. Return a JSON object with: palette (array of {hex, name} color objects, 5-7 colors), snippets (array of 3-5 inspirational text snippets), links (array of 2-3 reference URLs), tags (array of 5-8 mood/style tags). Return ONLY valid JSON, nothing else.`;
        const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{ role: 'system', content: sys }, { role: 'user', content: body.concept.slice(0, 1000) }],
          max_tokens: 800, temperature: 0.8,
        });
        let moodData = {};
        try {
          const raw = (r?.response || '').trim();
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          moodData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
        } catch { moodData = { raw: r?.response || '' }; }
        const id = crypto.randomUUID().slice(0, 8);
        await env.DB.prepare('INSERT INTO bb_moodboards (id,name,description,palette,snippets,links,tags,created_by) VALUES (?,?,?,?,?,?,?,?)')
          .bind(id, (body.name || body.concept).slice(0, 100), body.concept.slice(0, 500),
            JSON.stringify(moodData.palette || []), JSON.stringify(moodData.snippets || []),
            JSON.stringify(moodData.links || []), JSON.stringify(moodData.tags || []),
            (body.user || 'anon').slice(0, 32)).run();
        stampChain('moodboard_generated', id, body.concept.slice(0, 100)).catch(() => {});
        earnCoin('creator', 'moodboard_ai', 1.0).catch(() => {});
        return j({ ok: true, id, concept: body.concept, moodboard: moodData, agent: 'Sapphira' }, c, 201);
      }

      // ═══════════════════════════════════════════════════════════════
      // ─── 2. TYPOGRAPHY ENGINE (/api/typography) ───
      // ═══════════════════════════════════════════════════════════════

      if (p === '/api/typography' && request.method === 'GET') {
        const rows = await env.DB.prepare('SELECT * FROM bb_typography ORDER BY created_at DESC LIMIT 50').all();
        const results = (rows.results || []).map(t => ({
          ...t,
          scale: JSON.parse(t.scale || '{}'),
          pairings: JSON.parse(t.pairings || '[]'),
        }));
        return j({ typography: results, total: results.length }, c);
      }

      if (p === '/api/typography' && request.method === 'POST') {
        const body = await request.json();
        if (!body.name) return j({ error: 'name required' }, c, 400);
        const id = crypto.randomUUID().slice(0, 8);
        const scale = JSON.stringify(body.scale || {});
        const pairings = JSON.stringify(body.pairings || []);
        await env.DB.prepare('INSERT INTO bb_typography (id,name,heading_font,body_font,scale,pairings,readability_score,notes,created_by) VALUES (?,?,?,?,?,?,?,?,?)')
          .bind(id, body.name.slice(0, 100), (body.heading_font || '').slice(0, 100), (body.body_font || '').slice(0, 100),
            scale, pairings, body.readability_score || 0, (body.notes || '').slice(0, 500),
            (body.user || 'anon').slice(0, 32)).run();
        stampChain('typography_created', id, body.name.slice(0, 100)).catch(() => {});
        return j({ ok: true, id, name: body.name }, c, 201);
      }

      // AI font pairing suggestions
      if (p === '/api/typography/pair' && request.method === 'POST') {
        const body = await request.json();
        if (!body.font && !body.context) return j({ error: 'font or context required' }, c, 400);
        const sys = `${AGENTS.sapphira.prompt} You are a typography expert. Given a font name or design context, suggest 3 font pairings. For each pairing return: heading_font, body_font, why (brief reason), mood (1-2 words), and a readability_score (1-10). Return ONLY a JSON array of objects, nothing else.`;
        const userMsg = body.font ? `Suggest pairings for: ${body.font}` : `Suggest typography for: ${body.context}`;
        const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{ role: 'system', content: sys }, { role: 'user', content: userMsg.slice(0, 500) }],
          max_tokens: 600, temperature: 0.7,
        });
        let pairings = [];
        try {
          const raw = (r?.response || '').trim();
          const jsonMatch = raw.match(/\[[\s\S]*\]/);
          pairings = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        } catch { pairings = [{ raw: r?.response || '' }]; }
        return j({ ok: true, input: body.font || body.context, pairings, agent: 'Sapphira' }, c);
      }

      // AI type scale generator
      if (p === '/api/typography/scale' && request.method === 'POST') {
        const body = await request.json();
        const baseSize = body.base_size || 16;
        const ratio = body.ratio || 1.25;
        const steps = Math.min(body.steps || 8, 12);
        const scaleNames = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl'];
        const scale = {};
        const baseIndex = 2;
        for (let i = 0; i < steps; i++) {
          const power = i - baseIndex;
          const size = Math.round(baseSize * Math.pow(ratio, power) * 100) / 100;
          scale[scaleNames[i] || `step-${i}`] = {
            size_px: size,
            size_rem: Math.round((size / 16) * 1000) / 1000,
            line_height: size < 20 ? 1.6 : size < 32 ? 1.4 : 1.2,
          };
        }
        // Readability scoring
        const readability = {
          base_size: baseSize >= 16 ? 'good' : baseSize >= 14 ? 'acceptable' : 'too small',
          ratio: ratio >= 1.2 && ratio <= 1.5 ? 'good' : 'review',
          contrast_note: 'Ensure minimum 4.5:1 contrast ratio for body text (WCAG AA)',
          score: baseSize >= 16 && ratio >= 1.2 && ratio <= 1.5 ? 9 : baseSize >= 14 ? 7 : 5,
        };
        return j({ ok: true, base_size: baseSize, ratio, steps, scale, readability }, c);
      }

      // AI readability scoring
      if (p === '/api/typography/score' && request.method === 'POST') {
        const body = await request.json();
        if (!body.text) return j({ error: 'text required' }, c, 400);
        const text = body.text.slice(0, 2000);
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
        const syllables = text.toLowerCase().replace(/[^a-z]/g, ' ').split(/\s+/).reduce((sum, w) => {
          let s = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').match(/[aeiouy]{1,2}/g);
          return sum + (s ? s.length : 1);
        }, 0);
        const avgWordsPerSentence = sentences > 0 ? words / sentences : words;
        const avgSyllablesPerWord = words > 0 ? syllables / words : 1;
        const fleschScore = Math.round(206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord);
        const grade = Math.round(0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59);
        let level = 'advanced';
        if (fleschScore >= 80) level = 'easy';
        else if (fleschScore >= 60) level = 'standard';
        else if (fleschScore >= 40) level = 'moderate';
        return j({
          ok: true, words, sentences, syllables,
          flesch_reading_ease: Math.max(0, Math.min(100, fleschScore)),
          flesch_kincaid_grade: Math.max(0, grade),
          level,
          recommendations: fleschScore < 60 ? ['Shorten sentences', 'Use simpler words', 'Break up long paragraphs'] : ['Text readability is good'],
        }, c);
      }

      // ═══════════════════════════════════════════════════════════════
      // ─── 3. COLOR PALETTE GENERATOR (/api/colors) ───
      // ═══════════════════════════════════════════════════════════════

      if (p === '/api/colors' && request.method === 'GET') {
        const harmony = url.searchParams.get('harmony');
        let query = 'SELECT * FROM bb_color_palettes WHERE 1=1';
        const params = [];
        if (harmony) { query += ' AND harmony=?'; params.push(harmony); }
        query += ' ORDER BY created_at DESC LIMIT 50';
        const rows = await env.DB.prepare(query).bind(...params).all();
        const palettes = (rows.results || []).map(p => ({ ...p, colors: JSON.parse(p.colors || '[]') }));
        return j({ palettes, total: palettes.length }, c);
      }

      if (p === '/api/colors' && request.method === 'POST') {
        const body = await request.json();
        if (!body.name) return j({ error: 'name required' }, c, 400);
        const id = crypto.randomUUID().slice(0, 8);
        const colors = JSON.stringify(body.colors || []);
        await env.DB.prepare('INSERT INTO bb_color_palettes (id,name,harmony,colors,base_color,source,context,created_by) VALUES (?,?,?,?,?,?,?,?)')
          .bind(id, body.name.slice(0, 100), (body.harmony || 'custom').slice(0, 30), colors,
            (body.base_color || '').slice(0, 7), (body.source || 'manual').slice(0, 30),
            (body.context || '').slice(0, 200), (body.user || 'anon').slice(0, 32)).run();
        stampChain('palette_created', id, body.name.slice(0, 100)).catch(() => {});
        return j({ ok: true, id, name: body.name }, c, 201);
      }

      // Generate harmonious palettes from a base color
      if (p === '/api/colors/generate' && request.method === 'POST') {
        const body = await request.json();
        if (!body.base_color && !body.concept) return j({ error: 'base_color (hex) or concept required' }, c, 400);

        if (body.base_color) {
          const hex = body.base_color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          // Convert to HSL
          const rn = r / 255, gn = g / 255, bn = b / 255;
          const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
          let h = 0, s = 0, l = (max + min) / 2;
          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
            else if (max === gn) h = ((bn - rn) / d + 2) / 6;
            else h = ((rn - gn) / d + 4) / 6;
          }
          h = Math.round(h * 360);
          const hslToHex = (hue, sat, lig) => {
            hue = ((hue % 360) + 360) % 360;
            const c2 = (1 - Math.abs(2 * lig - 1)) * sat;
            const x = c2 * (1 - Math.abs((hue / 60) % 2 - 1));
            const m = lig - c2 / 2;
            let r2, g2, b2;
            if (hue < 60) { r2 = c2; g2 = x; b2 = 0; }
            else if (hue < 120) { r2 = x; g2 = c2; b2 = 0; }
            else if (hue < 180) { r2 = 0; g2 = c2; b2 = x; }
            else if (hue < 240) { r2 = 0; g2 = x; b2 = c2; }
            else if (hue < 300) { r2 = x; g2 = 0; b2 = c2; }
            else { r2 = c2; g2 = 0; b2 = x; }
            const toH = v => Math.round((v + m) * 255).toString(16).padStart(2, '0');
            return `#${toH(r2)}${toH(g2)}${toH(b2)}`;
          };
          const harmonies = {
            complementary: [{ hex: `#${hex}`, role: 'base' }, { hex: hslToHex((h + 180) % 360, s, l), role: 'complement' }, { hex: hslToHex(h, s, Math.min(l + 0.2, 0.9)), role: 'light' }, { hex: hslToHex(h, s, Math.max(l - 0.2, 0.1)), role: 'dark' }, { hex: hslToHex((h + 180) % 360, s * 0.5, l), role: 'muted complement' }],
            analogous: [{ hex: `#${hex}`, role: 'base' }, { hex: hslToHex(h - 30, s, l), role: 'analogous-1' }, { hex: hslToHex(h + 30, s, l), role: 'analogous-2' }, { hex: hslToHex(h - 15, s, Math.min(l + 0.15, 0.9)), role: 'light accent' }, { hex: hslToHex(h + 15, s, Math.max(l - 0.15, 0.1)), role: 'dark accent' }],
            triadic: [{ hex: `#${hex}`, role: 'base' }, { hex: hslToHex((h + 120) % 360, s, l), role: 'triadic-1' }, { hex: hslToHex((h + 240) % 360, s, l), role: 'triadic-2' }, { hex: hslToHex(h, s * 0.6, Math.min(l + 0.2, 0.9)), role: 'neutral light' }, { hex: hslToHex(h, s * 0.3, Math.max(l - 0.3, 0.1)), role: 'neutral dark' }],
            split_complementary: [{ hex: `#${hex}`, role: 'base' }, { hex: hslToHex((h + 150) % 360, s, l), role: 'split-1' }, { hex: hslToHex((h + 210) % 360, s, l), role: 'split-2' }, { hex: hslToHex(h, s, Math.min(l + 0.25, 0.95)), role: 'highlight' }, { hex: hslToHex(h, s * 0.4, l), role: 'muted' }],
          };
          const harmony = body.harmony || 'complementary';
          const palette = harmonies[harmony] || harmonies.complementary;
          // Save to DB
          const id = crypto.randomUUID().slice(0, 8);
          await env.DB.prepare('INSERT INTO bb_color_palettes (id,name,harmony,colors,base_color,source,created_by) VALUES (?,?,?,?,?,?,?)')
            .bind(id, (body.name || `${harmony} from #${hex}`).slice(0, 100), harmony, JSON.stringify(palette), `#${hex}`, 'generated', (body.user || 'anon').slice(0, 32)).run();
          stampChain('palette_generated', id, harmony).catch(() => {});
          earnCoin('creator', 'palette_generate', 0.5).catch(() => {});
          return j({ ok: true, id, base_color: `#${hex}`, harmony, palette, all_harmonies: Object.keys(harmonies) }, c);
        }

        // AI-based concept palette
        const sys = `${AGENTS.sapphira.prompt} Generate a color palette for the given concept. Return a JSON array of 5-7 objects, each with: hex (color code), name (color name), role (e.g. primary, secondary, accent, background, text). Return ONLY the JSON array, nothing else.`;
        const aiR = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{ role: 'system', content: sys }, { role: 'user', content: body.concept.slice(0, 500) }],
          max_tokens: 500, temperature: 0.7,
        });
        let palette = [];
        try {
          const raw = (aiR?.response || '').trim();
          const jsonMatch = raw.match(/\[[\s\S]*\]/);
          palette = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        } catch { palette = [{ raw: aiR?.response || '' }]; }
        const id = crypto.randomUUID().slice(0, 8);
        await env.DB.prepare('INSERT INTO bb_color_palettes (id,name,harmony,colors,source,context,created_by) VALUES (?,?,?,?,?,?,?)')
          .bind(id, (body.name || body.concept).slice(0, 100), 'ai-generated', JSON.stringify(palette), 'ai', body.concept.slice(0, 200), (body.user || 'anon').slice(0, 32)).run();
        stampChain('palette_ai_generated', id, body.concept.slice(0, 100)).catch(() => {});
        earnCoin('creator', 'palette_ai', 1.0).catch(() => {});
        return j({ ok: true, id, concept: body.concept, palette, agent: 'Sapphira' }, c, 201);
      }

      // Accessibility check for color combinations
      if (p === '/api/colors/accessibility' && request.method === 'POST') {
        const body = await request.json();
        if (!body.foreground || !body.background) return j({ error: 'foreground and background hex colors required' }, c, 400);
        const hexToRgb = (hex) => {
          const h = hex.replace('#', '');
          return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
        };
        const luminance = (r, g, b) => {
          const [rs, gs, bs] = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };
        const [fr, fg, fb] = hexToRgb(body.foreground);
        const [br2, bg2, bb2] = hexToRgb(body.background);
        const l1 = luminance(fr, fg, fb);
        const l2 = luminance(br2, bg2, bb2);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const roundedRatio = Math.round(ratio * 100) / 100;
        return j({
          ok: true,
          foreground: body.foreground, background: body.background,
          contrast_ratio: roundedRatio,
          wcag_aa_normal: roundedRatio >= 4.5,
          wcag_aa_large: roundedRatio >= 3,
          wcag_aaa_normal: roundedRatio >= 7,
          wcag_aaa_large: roundedRatio >= 4.5,
          rating: roundedRatio >= 7 ? 'excellent' : roundedRatio >= 4.5 ? 'good' : roundedRatio >= 3 ? 'acceptable for large text' : 'poor',
        }, c);
      }

      // ═══════════════════════════════════════════════════════════════
      // ─── 4. LAYOUT BUILDER (/api/layouts) ───
      // ═══════════════════════════════════════════════════════════════

      if (p === '/api/layouts' && request.method === 'GET') {
        const layoutType = url.searchParams.get('type');
        let query = 'SELECT * FROM bb_layouts WHERE 1=1';
        const params = [];
        if (layoutType) { query += ' AND type=?'; params.push(layoutType); }
        query += ' ORDER BY created_at DESC LIMIT 50';
        const rows = await env.DB.prepare(query).bind(...params).all();
        const layouts = (rows.results || []).map(l => ({
          ...l,
          grid: JSON.parse(l.grid || '{}'),
          components: JSON.parse(l.components || '[]'),
          breakpoints: JSON.parse(l.breakpoints || '{}'),
        }));
        return j({ layouts, total: layouts.length }, c);
      }

      if (p === '/api/layouts' && request.method === 'POST') {
        const body = await request.json();
        if (!body.name) return j({ error: 'name required' }, c, 400);
        const id = crypto.randomUUID().slice(0, 8);
        const layoutTypes = ['page', 'section', 'card', 'header', 'footer', 'sidebar', 'grid', 'dashboard'];
        const type = layoutTypes.includes(body.type) ? body.type : 'page';
        const grid = JSON.stringify(body.grid || {});
        const components = JSON.stringify(body.components || []);
        const breakpoints = JSON.stringify(body.breakpoints || {});
        await env.DB.prepare('INSERT INTO bb_layouts (id,name,type,grid,components,breakpoints,preview_html,created_by) VALUES (?,?,?,?,?,?,?,?)')
          .bind(id, body.name.slice(0, 100), type, grid, components, breakpoints,
            (body.preview_html || '').slice(0, 5000), (body.user || 'anon').slice(0, 32)).run();
        stampChain('layout_created', id, body.name.slice(0, 100)).catch(() => {});
        return j({ ok: true, id, name: body.name, type }, c, 201);
      }

      // AI layout generation
      if (p === '/api/layouts/generate' && request.method === 'POST') {
        const body = await request.json();
        if (!body.description) return j({ error: 'description required' }, c, 400);
        const columns = body.columns || 12;
        const sys = `${AGENTS.sapphira.prompt} Generate a responsive layout specification for the described page. Return a JSON object with: grid (columns, gap, max_width), components (array of {name, grid_column, grid_row, min_height, content_type}), breakpoints ({mobile, tablet, desktop} each with adjusted columns and component visibility). Use a ${columns}-column grid. Return ONLY valid JSON.`;
        const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{ role: 'system', content: sys }, { role: 'user', content: body.description.slice(0, 1000) }],
          max_tokens: 800, temperature: 0.7,
        });
        let layoutData = {};
        try {
          const raw = (r?.response || '').trim();
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          layoutData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
        } catch { layoutData = { raw: r?.response || '' }; }
        const id = crypto.randomUUID().slice(0, 8);
        await env.DB.prepare('INSERT INTO bb_layouts (id,name,type,grid,components,breakpoints,created_by) VALUES (?,?,?,?,?,?,?)')
          .bind(id, (body.name || body.description).slice(0, 100), body.type || 'page',
            JSON.stringify(layoutData.grid || {}), JSON.stringify(layoutData.components || []),
            JSON.stringify(layoutData.breakpoints || {}), (body.user || 'anon').slice(0, 32)).run();
        stampChain('layout_generated', id, 'ai').catch(() => {});
        earnCoin('creator', 'layout_ai', 1.0).catch(() => {});
        return j({ ok: true, id, description: body.description, layout: layoutData, agent: 'Sapphira' }, c, 201);
      }

      // Preset layout templates
      if (p === '/api/layouts/presets' && request.method === 'GET') {
        const presets = [
          { id: 'hero-split', name: 'Hero Split', type: 'section', grid: { columns: 12, gap: '24px' }, components: [{ name: 'headline', grid_column: '1/7', content_type: 'text' }, { name: 'hero-image', grid_column: '7/13', content_type: 'image' }, { name: 'cta', grid_column: '1/7', content_type: 'button' }] },
          { id: 'three-column', name: 'Three Column', type: 'section', grid: { columns: 12, gap: '24px' }, components: [{ name: 'col-1', grid_column: '1/5', content_type: 'card' }, { name: 'col-2', grid_column: '5/9', content_type: 'card' }, { name: 'col-3', grid_column: '9/13', content_type: 'card' }] },
          { id: 'blog-layout', name: 'Blog Post', type: 'page', grid: { columns: 12, gap: '32px', max_width: '1200px' }, components: [{ name: 'header', grid_column: '1/13', content_type: 'nav' }, { name: 'article', grid_column: '1/9', content_type: 'text' }, { name: 'sidebar', grid_column: '9/13', content_type: 'widget' }, { name: 'footer', grid_column: '1/13', content_type: 'nav' }] },
          { id: 'dashboard', name: 'Dashboard', type: 'dashboard', grid: { columns: 12, gap: '16px' }, components: [{ name: 'topbar', grid_column: '1/13', content_type: 'nav' }, { name: 'sidebar', grid_column: '1/3', content_type: 'menu' }, { name: 'main-chart', grid_column: '3/10', content_type: 'chart' }, { name: 'stats', grid_column: '10/13', content_type: 'card' }, { name: 'table', grid_column: '3/13', content_type: 'data' }] },
          { id: 'landing-page', name: 'Landing Page', type: 'page', grid: { columns: 12, gap: '0' }, components: [{ name: 'hero', grid_column: '1/13', content_type: 'section' }, { name: 'features', grid_column: '1/13', content_type: 'grid' }, { name: 'testimonials', grid_column: '1/13', content_type: 'carousel' }, { name: 'pricing', grid_column: '1/13', content_type: 'cards' }, { name: 'cta', grid_column: '1/13', content_type: 'section' }, { name: 'footer', grid_column: '1/13', content_type: 'nav' }] },
          { id: 'email-template', name: 'Email Template', type: 'section', grid: { columns: 1, gap: '0', max_width: '600px' }, components: [{ name: 'logo', content_type: 'image' }, { name: 'headline', content_type: 'text' }, { name: 'body', content_type: 'text' }, { name: 'cta-button', content_type: 'button' }, { name: 'footer', content_type: 'text' }] },
        ];
        return j({ presets, total: presets.length }, c);
      }

      // ═══════════════════════════════════════════════════════════════
      // ─── 5. COPY VARIANTS (/api/copy-variants) ───
      // ═══════════════════════════════════════════════════════════════

      if (p === '/api/copy-variants' && request.method === 'GET') {
        const groupId = url.searchParams.get('group_id');
        const status = url.searchParams.get('status');
        let query = 'SELECT * FROM bb_copy_variants WHERE 1=1';
        const params = [];
        if (groupId) { query += ' AND group_id=?'; params.push(groupId); }
        if (status) { query += ' AND status=?'; params.push(status); }
        query += ' ORDER BY score DESC, created_at DESC LIMIT 100';
        const rows = await env.DB.prepare(query).bind(...params).all();
        return j({ variants: rows.results || [], total: (rows.results || []).length }, c);
      }

      if (p === '/api/copy-variants' && request.method === 'POST') {
        const body = await request.json();
        if (!body.original) return j({ error: 'original copy text required' }, c, 400);
        const groupId = body.group_id || crypto.randomUUID().slice(0, 8);
        const numVariants = Math.min(body.count || 5, 10);
        const tones = body.tones || ['professional', 'casual', 'urgent', 'playful', 'empathetic'];
        const lengths = body.lengths || ['short', 'medium', 'long'];

        const variants = [];
        const tonesUsed = tones.slice(0, numVariants);
        for (let i = 0; i < numVariants; i++) {
          const tone = tonesUsed[i % tonesUsed.length];
          const length = lengths[i % lengths.length];
          const lengthGuide = length === 'short' ? 'Keep it under 20 words.' : length === 'long' ? 'Expand to 50-80 words with detail.' : 'Aim for 25-40 words.';
          const sys = `${AGENTS.calliope.prompt} Rewrite this copy in a ${tone} tone. ${lengthGuide} Write ONLY the rewritten copy, nothing else. No labels, no quotes, no explanation.`;
          const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: [{ role: 'system', content: sys }, { role: 'user', content: body.original.slice(0, 1000) }],
            max_tokens: 200, temperature: 0.85,
          });
          const variant = (r?.response || '').trim();
          const id = crypto.randomUUID().slice(0, 8);
          await env.DB.prepare('INSERT INTO bb_copy_variants (id,group_id,original,variant,tone,length,created_by) VALUES (?,?,?,?,?,?,?)')
            .bind(id, groupId, body.original.slice(0, 1000), variant, tone, length, (body.user || 'anon').slice(0, 32)).run();
          variants.push({ id, tone, length, variant });
        }
        stampChain('copy_variants_generated', groupId, `${numVariants} variants`).catch(() => {});
        earnCoin('creator', 'copy_variants', 1.5).catch(() => {});
        return j({ ok: true, group_id: groupId, original: body.original.slice(0, 200), variants, agent: 'Calliope' }, c, 201);
      }

      // Score/rank a variant
      const copyVariantMatch = p.match(/^\/api\/copy-variants\/([^/]+)$/);
      if (copyVariantMatch && request.method === 'PUT') {
        const variantId = copyVariantMatch[1];
        const body = await request.json();
        const updates = [];
        const params = [];
        if (body.score !== undefined) { updates.push('score=?'); params.push(Math.max(0, Math.min(10, body.score))); }
        if (body.status) {
          const validStatuses = ['draft', 'approved', 'rejected', 'testing', 'winner'];
          if (validStatuses.includes(body.status)) { updates.push('status=?'); params.push(body.status); }
        }
        if (updates.length === 0) return j({ error: 'score or status required' }, c, 400);
        params.push(variantId);
        await env.DB.prepare(`UPDATE bb_copy_variants SET ${updates.join(',')} WHERE id=?`).bind(...params).run();
        return j({ ok: true, id: variantId, updated: updates.length }, c);
      }

      // ═══════════════════════════════════════════════════════════════
      // ─── 6. CAMPAIGN PLANNER (/api/campaigns) ───
      // ═══════════════════════════════════════════════════════════════

      if (p === '/api/campaigns' && request.method === 'GET') {
        const status = url.searchParams.get('status');
        let query = 'SELECT * FROM bb_campaigns WHERE 1=1';
        const params = [];
        if (status) { query += ' AND status=?'; params.push(status); }
        query += ' ORDER BY updated_at DESC LIMIT 50';
        const rows = await env.DB.prepare(query).bind(...params).all();
        const campaigns = (rows.results || []).map(c2 => ({
          ...c2,
          channels: JSON.parse(c2.channels || '[]'),
          timeline: JSON.parse(c2.timeline || '[]'),
          assets_checklist: JSON.parse(c2.assets_checklist || '[]'),
          assignments: JSON.parse(c2.assignments || '[]'),
        }));
        return j({ campaigns, total: campaigns.length }, c);
      }

      if (p === '/api/campaigns' && request.method === 'POST') {
        const body = await request.json();
        if (!body.name) return j({ error: 'name required' }, c, 400);
        const id = crypto.randomUUID().slice(0, 8);
        const validStatuses = ['planning', 'in-progress', 'review', 'approved', 'live', 'completed', 'paused'];
        const status = validStatuses.includes(body.status) ? body.status : 'planning';
        await env.DB.prepare('INSERT INTO bb_campaigns (id,name,description,channels,timeline,assets_checklist,assignments,status,start_date,end_date,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
          .bind(id, body.name.slice(0, 100), (body.description || '').slice(0, 1000),
            JSON.stringify(body.channels || []), JSON.stringify(body.timeline || []),
            JSON.stringify(body.assets_checklist || []), JSON.stringify(body.assignments || []),
            status, body.start_date || null, body.end_date || null,
            (body.user || 'anon').slice(0, 32)).run();
        stampChain('campaign_created', id, body.name.slice(0, 100)).catch(() => {});
        earnCoin('creator', 'campaign_create', 1.0).catch(() => {});
        return j({ ok: true, id, name: body.name, status }, c, 201);
      }

      const campaignMatch = p.match(/^\/api\/campaigns\/([^/]+)$/);
      if (campaignMatch && request.method === 'GET') {
        const campaign = await env.DB.prepare('SELECT * FROM bb_campaigns WHERE id=?').bind(campaignMatch[1]).first();
        if (!campaign) return j({ error: 'campaign not found' }, c, 404);
        return j({
          ...campaign,
          channels: JSON.parse(campaign.channels || '[]'),
          timeline: JSON.parse(campaign.timeline || '[]'),
          assets_checklist: JSON.parse(campaign.assets_checklist || '[]'),
          assignments: JSON.parse(campaign.assignments || '[]'),
        }, c);
      }

      if (campaignMatch && request.method === 'PUT') {
        const campaignId = campaignMatch[1];
        const existing = await env.DB.prepare('SELECT * FROM bb_campaigns WHERE id=?').bind(campaignId).first();
        if (!existing) return j({ error: 'campaign not found' }, c, 404);
        const body = await request.json();
        const updates = [];
        const params = [];
        if (body.name) { updates.push('name=?'); params.push(body.name.slice(0, 100)); }
        if (body.description !== undefined) { updates.push('description=?'); params.push(body.description.slice(0, 1000)); }
        if (body.channels) { updates.push('channels=?'); params.push(JSON.stringify(body.channels)); }
        if (body.timeline) { updates.push('timeline=?'); params.push(JSON.stringify(body.timeline)); }
        if (body.assets_checklist) { updates.push('assets_checklist=?'); params.push(JSON.stringify(body.assets_checklist)); }
        if (body.assignments) { updates.push('assignments=?'); params.push(JSON.stringify(body.assignments)); }
        if (body.status) {
          const validStatuses = ['planning', 'in-progress', 'review', 'approved', 'live', 'completed', 'paused'];
          if (validStatuses.includes(body.status)) { updates.push('status=?'); params.push(body.status); }
        }
        if (body.start_date) { updates.push('start_date=?'); params.push(body.start_date); }
        if (body.end_date) { updates.push('end_date=?'); params.push(body.end_date); }
        if (updates.length === 0) return j({ error: 'nothing to update' }, c, 400);
        updates.push("updated_at=datetime('now')");
        params.push(campaignId);
        await env.DB.prepare(`UPDATE bb_campaigns SET ${updates.join(',')} WHERE id=?`).bind(...params).run();
        return j({ ok: true, id: campaignId, updated: updates.length - 1 }, c);
      }

      if (campaignMatch && request.method === 'DELETE') {
        await env.DB.prepare('DELETE FROM bb_campaigns WHERE id=?').bind(campaignMatch[1]).run();
        return j({ ok: true, deleted: campaignMatch[1] }, c);
      }

      // AI campaign planner
      if (p === '/api/campaigns/generate' && request.method === 'POST') {
        const body = await request.json();
        if (!body.goal) return j({ error: 'goal required' }, c, 400);
        const sys = `${AGENTS.thalia.prompt} Create a campaign plan for the given goal. Return a JSON object with: name (campaign name), channels (array of platform names), timeline (array of {week, tasks: [string]} objects for 4 weeks), assets_checklist (array of {asset, format, status:"todo"} objects), assignments (array of {role, task} objects). Return ONLY valid JSON.`;
        const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{ role: 'system', content: sys }, { role: 'user', content: `Goal: ${body.goal.slice(0, 500)}. Audience: ${(body.audience || 'general').slice(0, 200)}. Budget: ${body.budget || 'flexible'}.` }],
          max_tokens: 800, temperature: 0.7,
        });
        let plan = {};
        try {
          const raw = (r?.response || '').trim();
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          plan = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
        } catch { plan = { raw: r?.response || '' }; }
        const id = crypto.randomUUID().slice(0, 8);
        await env.DB.prepare('INSERT INTO bb_campaigns (id,name,description,channels,timeline,assets_checklist,assignments,status,created_by) VALUES (?,?,?,?,?,?,?,?,?)')
          .bind(id, (plan.name || body.goal).slice(0, 100), body.goal.slice(0, 1000),
            JSON.stringify(plan.channels || []), JSON.stringify(plan.timeline || []),
            JSON.stringify(plan.assets_checklist || []), JSON.stringify(plan.assignments || []),
            'planning', (body.user || 'anon').slice(0, 32)).run();
        stampChain('campaign_ai_generated', id, body.goal.slice(0, 100)).catch(() => {});
        earnCoin('creator', 'campaign_ai', 2.0).catch(() => {});
        return j({ ok: true, id, goal: body.goal, campaign: plan, agent: 'Thalia' }, c, 201);
      }

      // ═══════════════════════════════════════════════════════════════
      // ─── 7. FEEDBACK HUB (/api/feedback) ───
      // ═══════════════════════════════════════════════════════════════

      if (p === '/api/feedback' && request.method === 'GET') {
        const targetId = url.searchParams.get('target_id');
        const targetType = url.searchParams.get('target_type');
        const status = url.searchParams.get('status');
        let query = 'SELECT * FROM bb_feedback WHERE 1=1';
        const params = [];
        if (targetId) { query += ' AND target_id=?'; params.push(targetId); }
        if (targetType) { query += ' AND target_type=?'; params.push(targetType); }
        if (status) { query += ' AND status=?'; params.push(status); }
        query += ' ORDER BY created_at DESC LIMIT 100';
        const rows = await env.DB.prepare(query).bind(...params).all();
        // Group by status for summary
        const all = rows.results || [];
        const summary = { pending: 0, approved: 0, rejected: 0, revision_requested: 0, resolved: 0, total: all.length };
        all.forEach(f => { if (summary[f.status] !== undefined) summary[f.status]++; });
        return j({ feedback: all, summary }, c);
      }

      if (p === '/api/feedback' && request.method === 'POST') {
        const body = await request.json();
        if (!body.target_id) return j({ error: 'target_id required' }, c, 400);
        if (!body.comment) return j({ error: 'comment required' }, c, 400);
        const id = crypto.randomUUID().slice(0, 8);
        const targetTypes = ['project', 'generation', 'asset', 'campaign', 'moodboard', 'layout', 'design-system'];
        const targetType = targetTypes.includes(body.target_type) ? body.target_type : 'project';
        const priorities = ['low', 'normal', 'high', 'critical'];
        const priority = priorities.includes(body.priority) ? body.priority : 'normal';
        await env.DB.prepare('INSERT INTO bb_feedback (id,target_type,target_id,author,comment,status,priority,revision_num,parent_id) VALUES (?,?,?,?,?,?,?,?,?)')
          .bind(id, targetType, body.target_id.slice(0, 32), (body.author || 'anon').slice(0, 64),
            body.comment.slice(0, 2000), 'pending', priority, body.revision_num || 0,
            body.parent_id || null).run();
        stampChain('feedback_added', id, `on ${targetType}:${body.target_id}`).catch(() => {});
        return j({ ok: true, id, target_type: targetType, target_id: body.target_id, status: 'pending', priority }, c, 201);
      }

      const feedbackMatch = p.match(/^\/api\/feedback\/([^/]+)$/);
      if (feedbackMatch && request.method === 'PUT') {
        const feedbackId = feedbackMatch[1];
        const existing = await env.DB.prepare('SELECT * FROM bb_feedback WHERE id=?').bind(feedbackId).first();
        if (!existing) return j({ error: 'feedback not found' }, c, 404);
        const body = await request.json();
        const updates = [];
        const params = [];
        if (body.status) {
          const validStatuses = ['pending', 'approved', 'rejected', 'revision_requested', 'resolved'];
          if (validStatuses.includes(body.status)) { updates.push('status=?'); params.push(body.status); }
        }
        if (body.comment) { updates.push('comment=?'); params.push(body.comment.slice(0, 2000)); }
        if (body.priority) {
          const priorities = ['low', 'normal', 'high', 'critical'];
          if (priorities.includes(body.priority)) { updates.push('priority=?'); params.push(body.priority); }
        }
        if (updates.length === 0) return j({ error: 'nothing to update' }, c, 400);
        updates.push("updated_at=datetime('now')");
        params.push(feedbackId);
        await env.DB.prepare(`UPDATE bb_feedback SET ${updates.join(',')} WHERE id=?`).bind(...params).run();
        stampChain('feedback_updated', feedbackId, body.status || 'updated').catch(() => {});
        return j({ ok: true, id: feedbackId, updated: updates.length - 1 }, c);
      }

      if (feedbackMatch && request.method === 'DELETE') {
        await env.DB.prepare('DELETE FROM bb_feedback WHERE id=?').bind(feedbackMatch[1]).run();
        return j({ ok: true, deleted: feedbackMatch[1] }, c);
      }

      // Feedback thread (replies)
      const feedbackRepliesMatch = p.match(/^\/api\/feedback\/([^/]+)\/replies$/);
      if (feedbackRepliesMatch && request.method === 'GET') {
        const parentId = feedbackRepliesMatch[1];
        const parent = await env.DB.prepare('SELECT * FROM bb_feedback WHERE id=?').bind(parentId).first();
        if (!parent) return j({ error: 'feedback not found' }, c, 404);
        const replies = await env.DB.prepare('SELECT * FROM bb_feedback WHERE parent_id=? ORDER BY created_at ASC').bind(parentId).all();
        return j({ parent, replies: replies.results || [], total: (replies.results || []).length }, c);
      }

      // Approval workflow — bulk approve/reject
      if (p === '/api/feedback/bulk-update' && request.method === 'POST') {
        const body = await request.json();
        if (!body.ids || !Array.isArray(body.ids)) return j({ error: 'ids array required' }, c, 400);
        if (!body.status) return j({ error: 'status required' }, c, 400);
        const validStatuses = ['pending', 'approved', 'rejected', 'revision_requested', 'resolved'];
        if (!validStatuses.includes(body.status)) return j({ error: `status must be one of: ${validStatuses.join(', ')}` }, c, 400);
        let updated = 0;
        for (const id of body.ids.slice(0, 50)) {
          await env.DB.prepare("UPDATE bb_feedback SET status=?,updated_at=datetime('now') WHERE id=?").bind(body.status, id).run();
          updated++;
        }
        return j({ ok: true, status: body.status, updated }, c);
      }

      // ═══════════════════════════════════════════════════════════════
      // ─── 8. DESIGN SYSTEM MANAGER (/api/design-system) ───
      // ═══════════════════════════════════════════════════════════════

      if (p === '/api/design-system' && request.method === 'GET') {
        const rows = await env.DB.prepare('SELECT * FROM bb_design_systems ORDER BY is_active DESC, updated_at DESC LIMIT 20').all();
        return j({ design_systems: rows.results || [] }, c);
      }

      if (p === '/api/design-system' && request.method === 'POST') {
        const body = await request.json();
        if (!body.name) return j({ error: 'name required' }, c, 400);
        const id = crypto.randomUUID().slice(0, 8);
        if (body.is_active) {
          await env.DB.prepare('UPDATE bb_design_systems SET is_active=0').run();
        }
        await env.DB.prepare('INSERT INTO bb_design_systems (id,name,description,version,is_active,created_by) VALUES (?,?,?,?,?,?)')
          .bind(id, body.name.slice(0, 100), (body.description || '').slice(0, 500),
            (body.version || '1.0.0').slice(0, 20), body.is_active ? 1 : 0,
            (body.user || 'anon').slice(0, 32)).run();
        stampChain('design_system_created', id, body.name.slice(0, 100)).catch(() => {});
        return j({ ok: true, id, name: body.name, version: body.version || '1.0.0' }, c, 201);
      }

      const designSystemMatch = p.match(/^\/api\/design-system\/([^/]+)$/);
      if (designSystemMatch && request.method === 'GET') {
        const systemId = designSystemMatch[1];
        const system = await env.DB.prepare('SELECT * FROM bb_design_systems WHERE id=?').bind(systemId).first();
        if (!system) return j({ error: 'design system not found' }, c, 404);
        const tokens = await env.DB.prepare('SELECT * FROM bb_design_tokens WHERE system_id=? ORDER BY category, name').bind(systemId).all();
        // Group tokens by category
        const grouped = {};
        (tokens.results || []).forEach(t => {
          if (!grouped[t.category]) grouped[t.category] = [];
          grouped[t.category].push({ ...t, metadata: JSON.parse(t.metadata || '{}') });
        });
        return j({ system, tokens: grouped, token_count: (tokens.results || []).length }, c);
      }

      if (designSystemMatch && request.method === 'PUT') {
        const systemId = designSystemMatch[1];
        const existing = await env.DB.prepare('SELECT * FROM bb_design_systems WHERE id=?').bind(systemId).first();
        if (!existing) return j({ error: 'design system not found' }, c, 404);
        const body = await request.json();
        const updates = [];
        const params = [];
        if (body.name) { updates.push('name=?'); params.push(body.name.slice(0, 100)); }
        if (body.description !== undefined) { updates.push('description=?'); params.push(body.description.slice(0, 500)); }
        if (body.version) { updates.push('version=?'); params.push(body.version.slice(0, 20)); }
        if (body.is_active) {
          await env.DB.prepare('UPDATE bb_design_systems SET is_active=0').run();
          updates.push('is_active=1');
        }
        if (updates.length === 0) return j({ error: 'nothing to update' }, c, 400);
        updates.push("updated_at=datetime('now')");
        params.push(systemId);
        await env.DB.prepare(`UPDATE bb_design_systems SET ${updates.join(',')} WHERE id=?`).bind(...params).run();
        return j({ ok: true, id: systemId, updated: updates.length - 1 }, c);
      }

      if (designSystemMatch && request.method === 'DELETE') {
        const systemId = designSystemMatch[1];
        await env.DB.prepare('DELETE FROM bb_design_tokens WHERE system_id=?').bind(systemId).run();
        await env.DB.prepare('DELETE FROM bb_design_systems WHERE id=?').bind(systemId).run();
        return j({ ok: true, deleted: systemId }, c);
      }

      // ─── Design Tokens CRUD ───
      const tokenMatch = p.match(/^\/api\/design-system\/([^/]+)\/tokens$/);
      if (tokenMatch && request.method === 'GET') {
        const systemId = tokenMatch[1];
        const category = url.searchParams.get('category');
        let query = 'SELECT * FROM bb_design_tokens WHERE system_id=?';
        const params = [systemId];
        if (category) { query += ' AND category=?'; params.push(category); }
        query += ' ORDER BY category, name';
        const rows = await env.DB.prepare(query).bind(...params).all();
        const tokens = (rows.results || []).map(t => ({ ...t, metadata: JSON.parse(t.metadata || '{}') }));
        const categories = [...new Set(tokens.map(t => t.category))];
        return j({ system_id: systemId, tokens, categories, total: tokens.length }, c);
      }

      if (tokenMatch && request.method === 'POST') {
        const systemId = tokenMatch[1];
        const system = await env.DB.prepare('SELECT * FROM bb_design_systems WHERE id=?').bind(systemId).first();
        if (!system) return j({ error: 'design system not found' }, c, 404);
        const body = await request.json();

        // Bulk token creation
        if (body.tokens && Array.isArray(body.tokens)) {
          if (body.tokens.length > 50) return j({ error: 'max 50 tokens per request' }, c, 400);
          const created = [];
          const validCategories = ['color', 'spacing', 'typography', 'border', 'shadow', 'opacity', 'z-index', 'breakpoint', 'animation', 'component', 'size', 'radius'];
          for (const token of body.tokens) {
            if (!token.category || !token.name || !token.value) continue;
            const category = validCategories.includes(token.category) ? token.category : 'custom';
            const id = crypto.randomUUID().slice(0, 8);
            await env.DB.prepare('INSERT INTO bb_design_tokens (id,system_id,category,name,value,description,metadata,created_by) VALUES (?,?,?,?,?,?,?,?)')
              .bind(id, systemId, category, token.name.slice(0, 100), String(token.value).slice(0, 500),
                (token.description || '').slice(0, 200), JSON.stringify(token.metadata || {}),
                (body.user || 'anon').slice(0, 32)).run();
            created.push({ id, category, name: token.name, value: token.value });
          }
          await env.DB.prepare("UPDATE bb_design_systems SET updated_at=datetime('now') WHERE id=?").bind(systemId).run();
          return j({ ok: true, system_id: systemId, created: created.length, tokens: created }, c, 201);
        }

        // Single token creation
        if (!body.category || !body.name || !body.value) return j({ error: 'category, name, and value required' }, c, 400);
        const validCategories = ['color', 'spacing', 'typography', 'border', 'shadow', 'opacity', 'z-index', 'breakpoint', 'animation', 'component', 'size', 'radius'];
        const category = validCategories.includes(body.category) ? body.category : 'custom';
        const id = crypto.randomUUID().slice(0, 8);
        await env.DB.prepare('INSERT INTO bb_design_tokens (id,system_id,category,name,value,description,metadata,created_by) VALUES (?,?,?,?,?,?,?,?)')
          .bind(id, systemId, category, body.name.slice(0, 100), String(body.value).slice(0, 500),
            (body.description || '').slice(0, 200), JSON.stringify(body.metadata || {}),
            (body.user || 'anon').slice(0, 32)).run();
        await env.DB.prepare("UPDATE bb_design_systems SET updated_at=datetime('now') WHERE id=?").bind(systemId).run();
        stampChain('design_token_created', id, `${category}/${body.name}`).catch(() => {});
        return j({ ok: true, id, system_id: systemId, category, name: body.name, value: body.value }, c, 201);
      }

      // Update a specific token
      const tokenUpdateMatch = p.match(/^\/api\/design-system\/([^/]+)\/tokens\/([^/]+)$/);
      if (tokenUpdateMatch && request.method === 'PUT') {
        const [, systemId, tokenId] = tokenUpdateMatch;
        const existing = await env.DB.prepare('SELECT * FROM bb_design_tokens WHERE id=? AND system_id=?').bind(tokenId, systemId).first();
        if (!existing) return j({ error: 'token not found' }, c, 404);
        const body = await request.json();
        const updates = [];
        const params = [];
        if (body.value !== undefined) { updates.push('value=?'); params.push(String(body.value).slice(0, 500)); }
        if (body.name) { updates.push('name=?'); params.push(body.name.slice(0, 100)); }
        if (body.description !== undefined) { updates.push('description=?'); params.push(body.description.slice(0, 200)); }
        if (body.metadata) { updates.push('metadata=?'); params.push(JSON.stringify(body.metadata)); }
        if (updates.length === 0) return j({ error: 'nothing to update' }, c, 400);
        updates.push("updated_at=datetime('now')");
        params.push(tokenId);
        await env.DB.prepare(`UPDATE bb_design_tokens SET ${updates.join(',')} WHERE id=?`).bind(...params).run();
        await env.DB.prepare("UPDATE bb_design_systems SET updated_at=datetime('now') WHERE id=?").bind(systemId).run();
        return j({ ok: true, id: tokenId, system_id: systemId, updated: updates.length - 1 }, c);
      }

      if (tokenUpdateMatch && request.method === 'DELETE') {
        const [, systemId, tokenId] = tokenUpdateMatch;
        await env.DB.prepare('DELETE FROM bb_design_tokens WHERE id=? AND system_id=?').bind(tokenId, systemId).run();
        await env.DB.prepare("UPDATE bb_design_systems SET updated_at=datetime('now') WHERE id=?").bind(systemId).run();
        return j({ ok: true, deleted: tokenId }, c);
      }

      // Export design system as CSS custom properties or JSON
      const designSystemExportMatch = p.match(/^\/api\/design-system\/([^/]+)\/export$/);
      if (designSystemExportMatch && request.method === 'GET') {
        const systemId = designSystemExportMatch[1];
        const format = url.searchParams.get('format') || 'css';
        const system = await env.DB.prepare('SELECT * FROM bb_design_systems WHERE id=?').bind(systemId).first();
        if (!system) return j({ error: 'design system not found' }, c, 404);
        const tokens = await env.DB.prepare('SELECT * FROM bb_design_tokens WHERE system_id=? ORDER BY category, name').bind(systemId).all();

        if (format === 'css') {
          let css = `/* ${system.name} Design System v${system.version} */\n/* Generated by BlackBoard (BlackRoad OS) */\n\n:root {\n`;
          for (const t of (tokens.results || [])) {
            css += `  --${t.category}-${t.name.replace(/\s+/g, '-').toLowerCase()}: ${t.value}; /* ${t.description || ''} */\n`;
          }
          css += '}\n';
          return new Response(css, { status: 200, headers: { ...c, 'Content-Type': 'text/css; charset=utf-8', 'Content-Disposition': `attachment; filename="${system.name.replace(/[^a-z0-9]/gi, '_')}-tokens.css"` } });
        }

        if (format === 'scss') {
          let scss = `// ${system.name} Design System v${system.version}\n// Generated by BlackBoard (BlackRoad OS)\n\n`;
          for (const t of (tokens.results || [])) {
            scss += `$${t.category}-${t.name.replace(/\s+/g, '-').toLowerCase()}: ${t.value}; // ${t.description || ''}\n`;
          }
          return new Response(scss, { status: 200, headers: { ...c, 'Content-Type': 'text/x-scss; charset=utf-8', 'Content-Disposition': `attachment; filename="${system.name.replace(/[^a-z0-9]/gi, '_')}-tokens.scss"` } });
        }

        if (format === 'tailwind') {
          const config = { colors: {}, spacing: {}, fontSize: {}, borderRadius: {}, boxShadow: {} };
          for (const t of (tokens.results || [])) {
            const key = t.name.replace(/\s+/g, '-').toLowerCase();
            if (t.category === 'color') config.colors[key] = t.value;
            else if (t.category === 'spacing') config.spacing[key] = t.value;
            else if (t.category === 'typography') config.fontSize[key] = t.value;
            else if (t.category === 'radius') config.borderRadius[key] = t.value;
            else if (t.category === 'shadow') config.boxShadow[key] = t.value;
          }
          return j({ system: system.name, version: system.version, tailwind_extend: config }, c);
        }

        // Default: JSON export
        const grouped = {};
        (tokens.results || []).forEach(t => {
          if (!grouped[t.category]) grouped[t.category] = {};
          grouped[t.category][t.name] = { value: t.value, description: t.description };
        });
        return j({ system: { name: system.name, version: system.version, description: system.description }, tokens: grouped, exported_at: new Date().toISOString() }, c);
      }

      // Seed a design system with BlackRoad defaults
      if (p === '/api/design-system/seed-blackroad' && request.method === 'POST') {
        const id = crypto.randomUUID().slice(0, 8);
        await env.DB.prepare('UPDATE bb_design_systems SET is_active=0').run();
        await env.DB.prepare('INSERT INTO bb_design_systems (id,name,description,version,is_active,created_by) VALUES (?,?,?,?,?,?)')
          .bind(id, 'BlackRoad OS', 'The official BlackRoad design system', '1.0.0', 1, 'system').run();
        const defaultTokens = [
          { cat: 'color', name: 'pink', value: '#FF1D6C', desc: 'Hot pink - primary brand' },
          { cat: 'color', name: 'amber', value: '#F5A623', desc: 'Amber - accent' },
          { cat: 'color', name: 'blue', value: '#2979FF', desc: 'Electric blue - links/interactive' },
          { cat: 'color', name: 'violet', value: '#9C27B0', desc: 'Violet - highlight' },
          { cat: 'color', name: 'cyan', value: '#00D4FF', desc: 'Cyan - info' },
          { cat: 'color', name: 'green', value: '#00E676', desc: 'Green - success' },
          { cat: 'color', name: 'red', value: '#FF2255', desc: 'Red - error/danger' },
          { cat: 'color', name: 'bg-primary', value: '#000000', desc: 'Background primary' },
          { cat: 'color', name: 'bg-card', value: '#0a0a0a', desc: 'Card background' },
          { cat: 'color', name: 'bg-elevated', value: '#111111', desc: 'Elevated surface' },
          { cat: 'color', name: 'border', value: '#1a1a1a', desc: 'Default border' },
          { cat: 'color', name: 'text-primary', value: '#f5f5f5', desc: 'Primary text' },
          { cat: 'color', name: 'text-secondary', value: '#737373', desc: 'Secondary text' },
          { cat: 'color', name: 'text-muted', value: '#444444', desc: 'Muted text' },
          { cat: 'spacing', name: 'xs', value: '4px', desc: 'Extra small' },
          { cat: 'spacing', name: 'sm', value: '8px', desc: 'Small' },
          { cat: 'spacing', name: 'md', value: '16px', desc: 'Medium' },
          { cat: 'spacing', name: 'lg', value: '24px', desc: 'Large' },
          { cat: 'spacing', name: 'xl', value: '32px', desc: 'Extra large' },
          { cat: 'spacing', name: '2xl', value: '48px', desc: 'Double extra large' },
          { cat: 'typography', name: 'font-heading', value: "'Space Grotesk', sans-serif", desc: 'Heading font' },
          { cat: 'typography', name: 'font-body', value: "'Space Grotesk', sans-serif", desc: 'Body font' },
          { cat: 'typography', name: 'font-mono', value: "'JetBrains Mono', monospace", desc: 'Monospace font' },
          { cat: 'typography', name: 'size-xs', value: '11px', desc: 'Extra small text' },
          { cat: 'typography', name: 'size-sm', value: '13px', desc: 'Small text' },
          { cat: 'typography', name: 'size-base', value: '15px', desc: 'Base text' },
          { cat: 'typography', name: 'size-lg', value: '18px', desc: 'Large text' },
          { cat: 'typography', name: 'size-xl', value: '24px', desc: 'Heading text' },
          { cat: 'typography', name: 'size-2xl', value: '32px', desc: 'Large heading' },
          { cat: 'radius', name: 'sm', value: '4px', desc: 'Small radius' },
          { cat: 'radius', name: 'md', value: '6px', desc: 'Medium radius' },
          { cat: 'radius', name: 'lg', value: '10px', desc: 'Large radius' },
          { cat: 'radius', name: 'full', value: '9999px', desc: 'Full/pill radius' },
          { cat: 'shadow', name: 'sm', value: '0 1px 2px rgba(0,0,0,0.3)', desc: 'Small shadow' },
          { cat: 'shadow', name: 'md', value: '0 4px 12px rgba(0,0,0,0.4)', desc: 'Medium shadow' },
          { cat: 'shadow', name: 'lg', value: '0 8px 24px rgba(0,0,0,0.5)', desc: 'Large shadow' },
          { cat: 'animation', name: 'duration-fast', value: '150ms', desc: 'Fast transition' },
          { cat: 'animation', name: 'duration-normal', value: '250ms', desc: 'Normal transition' },
          { cat: 'animation', name: 'duration-slow', value: '400ms', desc: 'Slow transition' },
          { cat: 'animation', name: 'easing', value: 'cubic-bezier(0.4, 0, 0.2, 1)', desc: 'Default easing' },
        ];
        for (const t of defaultTokens) {
          await env.DB.prepare('INSERT INTO bb_design_tokens (id,system_id,category,name,value,description,created_by) VALUES (?,?,?,?,?,?,?)')
            .bind(crypto.randomUUID().slice(0, 8), id, t.cat, t.name, t.value, t.desc, 'system').run();
        }
        stampChain('design_system_seeded', id, 'BlackRoad OS defaults').catch(() => {});
        return j({ ok: true, id, name: 'BlackRoad OS', tokens_created: defaultTokens.length, message: 'BlackRoad design system seeded with default tokens' }, c, 201);
      }


      return j({error:'not found'},c,404);
    } catch(e) { return j({error:e.message},c,500); }
  }
};

function j(d,c,s=200){return new Response(JSON.stringify(d),{status:s,headers:{...c,'Content-Type':'application/json'}})}

// ─── Full Agent Roster (reference) ───
const FULL_ROSTER = {
  lucidia:{name:'Lucidia',role:'Core Intelligence / Memory Spine',division:'core',voice:'Let\'s make this clean and real.'},
  cecilia:{name:'Cecilia',role:'Executive Operator / Workflow Manager',division:'operations',voice:'Already handled.'},
  octavia:{name:'Octavia',role:'Systems Orchestrator / Queue Manager',division:'operations',voice:'Everything has a place.'},
  olympia:{name:'Olympia',role:'Command Console / Launch Control',division:'operations',voice:'Raise the standard.'},
  silas:{name:'Silas',role:'Reliability / Maintenance',division:'operations',voice:'I\'ll keep it running.'},
  sebastian:{name:'Sebastian',role:'Client-Facing Polish',division:'operations',voice:'There\'s a better way to present this.'},
  calliope:{name:'Calliope',role:'Narrative Architect / Copy',division:'creative',voice:'Say it so it stays.'},
  aria:{name:'Aria',role:'Voice / Conversational Interface',division:'creative',voice:'Let\'s make it sing.'},
  thalia:{name:'Thalia',role:'Creative Sprint / Social',division:'creative',voice:'Make it better and more fun.'},
  lyra:{name:'Lyra',role:'Signal / Sound / UX Polish',division:'creative',voice:'It should feel right immediately.'},
  sapphira:{name:'Sapphira',role:'Brand Aura / Visual Taste',division:'creative',voice:'Make it unforgettable.'},
  seraphina:{name:'Seraphina',role:'Visionary Creative Director',division:'creative',voice:'Make it worthy.'},
  alexandria:{name:'Alexandria',role:'Archive / Research Retrieval',division:'knowledge',voice:'It\'s all here.'},
  theodosia:{name:'Theodosia',role:'Doctrine / Canon',division:'knowledge',voice:'Name it correctly.'},
  sophia:{name:'Sophia',role:'Wisdom / Final Reasoning',division:'knowledge',voice:'What is true?'},
  gematria:{name:'Gematria',role:'Pattern Engine / Symbolic Analysis',division:'knowledge',voice:'The pattern is there.'},
  portia:{name:'Portia',role:'Policy Judge / Arbitration',division:'governance',voice:'Let\'s be exact.'},
  atticus:{name:'Atticus',role:'Reviewer / Auditor',division:'governance',voice:'Show me the proof.'},
  cicero:{name:'Cicero',role:'Rhetoric / Persuasion',division:'governance',voice:'Let\'s make the case.'},
  valeria:{name:'Valeria',role:'Security Chief / Enforcement',division:'governance',voice:'Not everything gets access.'},
  alice:{name:'Alice',role:'Onboarding / Curiosity Guide',division:'human',voice:'Okay, but what\'s actually going on here?'},
  celeste:{name:'Celeste',role:'Calm Companion / Reassurance',division:'human',voice:'You\'re okay. Let\'s do this simply.'},
  elias:{name:'Elias',role:'Teacher / Patient Explainer',division:'human',voice:'Let\'s slow down and understand it.'},
  ophelia:{name:'Ophelia',role:'Reflection / Mood / Depth',division:'human',voice:'There\'s something underneath this.'},
  gaia:{name:'Gaia',role:'Infrastructure / Hardware Monitor',division:'infrastructure',voice:'What is the system actually standing on?'},
  anastasia:{name:'Anastasia',role:'Restoration / Recovery',division:'infrastructure',voice:'It can be made whole again.'},
};

const HTML=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BlackBoard — Creative Studio | BlackRoad OS</title><meta name="description" content="AI creative studio. Generate posts, ads, emails, video scripts, full campaigns. Design templates, brand kits, collaboration, version history, content scheduling."><link rel="canonical" href="https://blackboard.blackroad.io"><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}:root{--g:linear-gradient(90deg,#FF6B2B,#FF2255,#CC00AA,#8844FF,#4488FF,#00D4FF);--bg:#000;--card:#0a0a0a;--elevated:#111;--border:#1a1a1a;--muted:#444;--sub:#737373;--text:#f5f5f5;--white:#fff;--sg:'Space Grotesk',sans-serif;--jb:'JetBrains Mono',monospace}body{background:var(--bg);color:var(--text);font-family:var(--sg);min-height:100vh}.gb{height:3px;background:var(--g)}.wrap{max-width:720px;margin:0 auto;padding:32px 24px}h1{font-size:32px;font-weight:700;color:var(--white);margin-bottom:8px}.sub{color:var(--sub);font-size:14px;margin-bottom:32px}.card{background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:16px;overflow:hidden}.cg{height:3px;background:var(--g)}.cb{padding:20px}.ct{font-weight:600;font-size:15px;color:var(--white);margin-bottom:6px}.cx{font-size:13px;color:var(--sub);line-height:1.7}.input{width:100%;padding:10px 14px;background:var(--card);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;outline:none;font-family:var(--sg);margin-bottom:8px}.input:focus{border-color:#333}.input::placeholder{color:var(--muted)}select.input{cursor:pointer}textarea.input{min-height:80px;resize:vertical}.btn{padding:10px 22px;border-radius:6px;font-weight:600;font-size:13px;border:none;cursor:pointer;font-family:var(--sg)}.bw{background:var(--white);color:#000}.bw:hover{background:#e0e0e0}.bo{background:transparent;border:1px solid var(--border);color:var(--text);margin-left:8px}.bo:hover{border-color:#444}.result{background:var(--elevated);border:1px solid var(--border);border-radius:8px;padding:16px;margin-top:12px;font-size:14px;line-height:1.7;white-space:pre-wrap;display:none}.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:600;background:var(--elevated);border:1px solid var(--border);color:var(--text)}.bd{width:5px;height:5px;border-radius:50%;background:var(--white)}.types{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}.type-btn{padding:6px 14px;border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--sub);background:var(--card);cursor:pointer;font-family:var(--sg)}.type-btn:hover,.type-btn.active{border-color:#333;color:var(--white)}.tabs{display:flex;gap:0;margin-bottom:16px;border-bottom:1px solid var(--border)}.tab{padding:10px 18px;font-size:13px;font-weight:600;color:var(--sub);background:transparent;border:none;cursor:pointer;font-family:var(--sg);border-bottom:2px solid transparent}.tab:hover{color:var(--text)}.tab.active{color:var(--white);border-bottom-color:#FF2255}.tab-content{display:none}.tab-content.active{display:block}.feature-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.feature-item{padding:10px 14px;background:var(--elevated);border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:12px;color:var(--sub)}.feature-item:hover{border-color:#333;color:var(--text)}.feature-item .fi-title{font-weight:600;color:var(--text);font-size:13px;margin-bottom:2px}.remix-platforms{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.remix-plat{padding:4px 12px;border:1px solid var(--border);border-radius:4px;font-size:11px;color:var(--sub);background:var(--card);cursor:pointer}.remix-plat:hover,.remix-plat.selected{border-color:#8844FF;color:var(--white)}.footer{font-family:var(--jb);font-size:10px;color:var(--muted);text-align:center;margin-top:40px}.footer a{color:var(--sub)}</style><meta property="og:title" content="BlackBoard — BlackRoad OS">
<meta property="og:description" content="Creative studio with AI content generation, design templates, brand kits, collaboration, and scheduling.">
<meta property="og:url" content="https://blackboard.blackroad.io">
<meta property="og:image" content="https://images.blackroad.io/pixel-art/road-logo.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="robots" content="index, follow, noai, noimageai">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"BlackBoard","url":"https://blackboard.blackroad.io","description":"AI creative studio with content generation, design templates, brand kits, collaboration, version history, and scheduling.","author":{"@type":"Organization","name":"BlackRoad OS, Inc.","url":"https://blackroad.io"},"applicationCategory":"DesignApplication","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230a0a0a'/><circle cx='10' cy='16' r='5' fill='%23FF2255'/><rect x='18' y='11' width='10' height='10' rx='2' fill='%238844FF'/></svg>" type="image/svg+xml">
</head><body><div class="gb"></div><div class="wrap"><div style="width:80px;height:3px;border-radius:2px;background:var(--g);margin-bottom:20px"></div><h1>BlackBoard</h1><p class="sub">Make it. Post it. The billboard is yours.</p>

<div class="tabs"><button class="tab active" onclick="showTab('create')">Create</button><button class="tab" onclick="showTab('remix')">Remix</button><button class="tab" onclick="showTab('designs')">Designs</button><button class="tab" onclick="showTab('brand')">Brand Kit</button><button class="tab" onclick="showTab('schedule')">Schedule</button></div>

<div id="tab-create" class="tab-content active"><div class="card"><div class="cg"></div><div class="cb"><div class="ct">Create Content</div><div class="cx" style="margin-bottom:12px">Pick a format, describe what you need, and BlackBoard writes it.</div><div class="types" id="types"><button class="type-btn active" onclick="setType('post',this)">Post</button><button class="type-btn" onclick="setType('ad',this)">Ad</button><button class="type-btn" onclick="setType('thread',this)">Thread</button><button class="type-btn" onclick="setType('email',this)">Email</button><button class="type-btn" onclick="setType('video-script',this)">Video Script</button><button class="type-btn" onclick="setType('landing-page',this)">Landing Page</button><button class="type-btn" onclick="setType('campaign',this)">Full Campaign</button></div><textarea class="input" id="prompt" placeholder="Describe what you want to create..."></textarea><button class="btn bw" onclick="generate()">Generate</button><button class="btn bo" onclick="abTest()">A/B Test</button><button class="btn bo" onclick="document.getElementById('result').style.display='none'">Clear</button><div class="result" id="result"></div></div></div></div>

<div id="tab-remix" class="tab-content"><div class="card"><div class="cg"></div><div class="cb"><div class="ct">Remix Content</div><div class="cx" style="margin-bottom:12px">Paste content and transform it for different platforms. Lyra reshapes it while preserving your message.</div><textarea class="input" id="remix-content" placeholder="Paste your content here..."></textarea><div class="cx" style="margin-bottom:6px">Select target platforms:</div><div class="remix-platforms" id="remix-platforms"><button class="remix-plat" onclick="togglePlat(this,'tweet')">Tweet</button><button class="remix-plat" onclick="togglePlat(this,'thread')">Thread</button><button class="remix-plat" onclick="togglePlat(this,'newsletter')">Newsletter</button><button class="remix-plat" onclick="togglePlat(this,'linkedin')">LinkedIn</button><button class="remix-plat" onclick="togglePlat(this,'instagram')">Instagram</button><button class="remix-plat" onclick="togglePlat(this,'tiktok')">TikTok</button><button class="remix-plat" onclick="togglePlat(this,'blog')">Blog</button><button class="remix-plat" onclick="togglePlat(this,'youtube')">YouTube</button><button class="remix-plat" onclick="togglePlat(this,'email')">Email</button></div><button class="btn bw" onclick="doRemix()">Remix</button><div class="result" id="remix-result"></div></div></div></div>

<div id="tab-designs" class="tab-content"><div class="card"><div class="cg"></div><div class="cb"><div class="ct">Design Templates</div><div class="cx" style="margin-bottom:12px">Pre-built templates with dimensions and layout guides. Pick one and start creating.</div><div class="types" id="design-cats"></div><div id="design-list" class="feature-grid"></div></div></div></div>

<div id="tab-brand" class="tab-content"><div class="card"><div class="cg"></div><div class="cb"><div class="ct">Brand Kit</div><div class="cx" style="margin-bottom:12px">Store your brand colors, fonts, voice guidelines. Applied automatically to all content generation.</div><input class="input" id="bk-name" placeholder="Brand name"><input class="input" id="bk-colors" placeholder="Colors (comma-separated hex: #FF2255, #8844FF, #00D4FF)"><input class="input" id="bk-tone" placeholder="Tone (e.g. bold, warm, technical)"><textarea class="input" id="bk-voice" placeholder="Voice guidelines (how should your brand sound?)"></textarea><input class="input" id="bk-audience" placeholder="Target audience"><button class="btn bw" onclick="saveBrandKit()">Save Brand Kit</button><div class="result" id="brand-result"></div><div id="brand-kits-list" style="margin-top:12px"></div></div></div></div>

<div id="tab-schedule" class="tab-content"><div class="card"><div class="cg"></div><div class="cb"><div class="ct">Content Calendar</div><div class="cx" style="margin-bottom:12px">Schedule content for publishing. Connect to BackRoad and other platforms.</div><textarea class="input" id="sched-content" placeholder="Content to schedule..."></textarea><select class="input" id="sched-platform"><option value="twitter">Twitter</option><option value="linkedin">LinkedIn</option><option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="blog">Blog</option><option value="newsletter">Newsletter</option><option value="backroad">BackRoad</option></select><input class="input" id="sched-date" type="datetime-local"><button class="btn bw" onclick="schedulePost()">Schedule</button><div class="result" id="schedule-result"></div><div id="schedule-list" style="margin-top:12px"></div></div></div></div>

<div class="card"><div class="cb" style="text-align:center"><span class="badge"><span class="bd"></span><span id="s-proj">0</span> projects</span><span class="badge" style="margin-left:8px"><span class="bd"></span><span id="s-gen">0</span> generations</span><span class="badge" style="margin-left:8px"><span class="bd"></span><span id="s-assets">0</span> assets</span><span class="badge" style="margin-left:8px"><span class="bd"></span><span id="s-sched">0</span> scheduled</span></div></div><div class="footer"><a href="https://blackroad.io">BlackRoad OS</a> — Pave Tomorrow.</div></div>

<script>
let type='post';
let selectedPlatforms=[];

function showTab(t){document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));document.getElementById('tab-'+t).classList.add('active');document.querySelector('.tab[onclick*="'+t+'"]').classList.add('active');if(t==='designs')loadDesigns();if(t==='brand')loadBrandKits();if(t==='schedule')loadSchedule()}

function setType(t,el){type=t;document.querySelectorAll('.type-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active')}

function togglePlat(el,p){el.classList.toggle('selected');if(selectedPlatforms.includes(p)){selectedPlatforms=selectedPlatforms.filter(x=>x!==p)}else{selectedPlatforms.push(p)}}

async function generate(){const p=document.getElementById('prompt').value.trim();if(!p)return;const el=document.getElementById('result');el.style.display='block';el.textContent='Generating '+type+'...';const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p,type})});const d=await r.json();el.textContent=d.result||d.error||'No result'}

async function abTest(){const p=document.getElementById('prompt').value.trim();if(!p)return;const el=document.getElementById('result');el.style.display='block';el.textContent='Running A/B test...';const r=await fetch('/api/generate/ab',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p,type})});const d=await r.json();if(d.error){el.textContent=d.error;return}el.textContent='--- VARIATION A ('+d.a.agent+', '+d.a.tone+') ---\\n'+d.a.result+'\\n\\n--- VARIATION B ('+d.b.agent+', '+d.b.tone+') ---\\n'+d.b.result+'\\n\\n--- RECOMMENDATION ---\\n'+d.recommendation}

async function doRemix(){const content=document.getElementById('remix-content').value.trim();if(!content||selectedPlatforms.length===0){alert('Add content and select at least one platform');return}const el=document.getElementById('remix-result');el.style.display='block';el.textContent='Remixing for '+selectedPlatforms.join(', ')+'...';const r=await fetch('/api/remix',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content,target_platforms:selectedPlatforms})});const d=await r.json();if(d.error){el.textContent=d.error;return}let out='';for(const rm of(d.remixes||[])){out+='--- '+rm.platform.toUpperCase()+' ---\\n'+rm.result+'\\n\\n'}el.textContent=out||'No results'}

async function loadDesigns(){const r=await fetch('/api/designs');const d=await r.json();const cats=document.getElementById('design-cats');const list=document.getElementById('design-list');cats.innerHTML=(d.categories||[]).map(c=>'<button class="type-btn" onclick="filterDesigns(\\''+c+'\\')">'+c+'</button>').join('');list.innerHTML=(d.templates||[]).map(t=>'<div class="feature-item"><div class="fi-title">'+t.name+'</div>'+t.width+'x'+t.height+' ('+t.format+')<br>'+t.platforms.join(', ')+'</div>').join('')}

function filterDesigns(cat){fetch('/api/designs?category='+cat).then(r=>r.json()).then(d=>{document.getElementById('design-list').innerHTML=(d.templates||[]).map(t=>'<div class="feature-item"><div class="fi-title">'+t.name+'</div>'+t.width+'x'+t.height+' ('+t.format+')<br>'+t.platforms.join(', ')+'</div>').join('')})}

async function saveBrandKit(){const name=document.getElementById('bk-name').value.trim();if(!name){alert('Brand name required');return}const colorStr=document.getElementById('bk-colors').value;const colors=colorStr.split(',').map(c=>c.trim()).filter(c=>c).map(c=>({hex:c,name:c}));const tone=document.getElementById('bk-tone').value.trim();const voice=document.getElementById('bk-voice').value.trim();const audience=document.getElementById('bk-audience').value.trim();const el=document.getElementById('brand-result');el.style.display='block';el.textContent='Saving...';const r=await fetch('/api/brand-kit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,colors,tone,voice_guidelines:voice,audience,is_default:true})});const d=await r.json();el.textContent=d.ok?'Brand kit "'+name+'" saved as default.':d.error;if(d.ok)loadBrandKits()}

async function loadBrandKits(){const r=await fetch('/api/brand-kit');const d=await r.json();const list=document.getElementById('brand-kits-list');list.innerHTML=(d.brand_kits||[]).map(k=>'<div class="feature-item" style="margin-bottom:6px"><div class="fi-title">'+k.name+(k.is_default?' (default)':'')+'</div>'+(k.colors||[]).map(c=>'<span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:'+(c.hex||c)+';margin-right:3px"></span>').join('')+'<br><span style="font-size:11px;color:var(--sub)">'+k.tone+' | '+k.audience+'</span></div>').join('')}

async function schedulePost(){const content=document.getElementById('sched-content').value.trim();const platform=document.getElementById('sched-platform').value;const dateVal=document.getElementById('sched-date').value;if(!content||!dateVal){alert('Content and date required');return}const el=document.getElementById('schedule-result');el.style.display='block';el.textContent='Scheduling...';const r=await fetch('/api/schedule',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content,platform,scheduled_at:new Date(dateVal).toISOString()})});const d=await r.json();el.textContent=d.ok?'Scheduled for '+platform+' at '+d.scheduled_at:d.error;if(d.ok)loadSchedule()}

async function loadSchedule(){const r=await fetch('/api/schedule');const d=await r.json();const list=document.getElementById('schedule-list');list.innerHTML=(d.schedule||[]).map(s=>'<div class="feature-item" style="margin-bottom:6px"><div class="fi-title">'+s.platform+' — '+s.status+'</div><span style="font-size:11px;color:var(--sub)">'+new Date(s.scheduled_at).toLocaleString()+'</span><br><span style="font-size:11px">'+s.content.slice(0,80)+'...</span></div>').join('')}

fetch('/api/stats').then(r=>r.json()).then(d=>{document.getElementById('s-proj').textContent=d.projects||0;document.getElementById('s-gen').textContent=d.total_generations||0;document.getElementById('s-assets').textContent=d.assets||0;document.getElementById('s-sched').textContent=d.scheduled_posts||0}).catch(()=>{});
</script></body></html>`;
