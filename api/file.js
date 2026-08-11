// =====================================================================
// /api/file?id=<블록 ID>  —  노션 본문에 올린 파일을 우리 주소로 중계합니다.
//
// 왜 필요한가:
//   노션이 주는 파일 주소는 약 1시간 뒤 만료됩니다. 그 주소를 그대로 링크로
//   걸어두면, 페이지를 열어둔 채 나중에 누르는 사람에게는 깨진 링크가 됩니다.
//   이 함수는 누를 때마다 노션에서 새 주소를 받아와 파일을 그대로 내려주므로
//   주소가 만료되지 않고, 주소창에도 긴 서명 문자열 대신 우리 주소가 보입니다.
//
// 필요한 환경변수(Vercel): NOTION_TOKEN
// =====================================================================

export default async function handler(req, res) {
  const token = process.env.NOTION_TOKEN;
  const id = (req.query && req.query.id) || "";

  if (!token) {
    res.status(500).send("NOTION_TOKEN 환경변수가 설정되지 않았습니다.");
    return;
  }
  // 노션 블록 ID 형식만 받습니다 (UUID)
  if (!/^[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{12}$/.test(id)) {
    res.status(400).send("잘못된 주소입니다.");
    return;
  }

  try {
    // 1) 블록을 다시 조회해 지금 유효한 파일 주소를 받습니다
    const r = await fetch(`https://api.notion.com/v1/blocks/${id}`, {
      headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2022-06-28" },
    });
    if (!r.ok) {
      res.status(404).send("파일을 찾을 수 없습니다.");
      return;
    }
    const block = await r.json();
    const node = block[block.type] || {};
    const url =
      node.url || (node.external && node.external.url) || (node.file && node.file.url) || "";
    if (!url) {
      res.status(404).send("이 블록에는 파일이 없습니다.");
      return;
    }

    // 2) 파일을 받아 그대로 내려줍니다
    const f = await fetch(url);
    if (!f.ok) {
      res.status(502).send("파일을 가져오지 못했습니다.");
      return;
    }
    const buf = Buffer.from(await f.arrayBuffer());
    const ct = f.headers.get("content-type") || "";

    // HTML 은 브라우저가 바로 그리도록, 나머지는 원래 형식 그대로
    res.setHeader(
      "Content-Type",
      ct.indexOf("text/html") === 0 ? "text/html; charset=utf-8" : ct || "application/octet-stream"
    );
    res.setHeader("X-Content-Type-Options", "nosniff");
    // 노션 주소가 1시간 뒤 만료되므로 캐시는 짧게 둡니다
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=1800");
    res.status(200).send(buf);
  } catch (e) {
    res.status(500).send("파일을 여는 중 오류가 발생했습니다.");
  }
}
