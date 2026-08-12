# Yerim Bae · Study Log — 노션 연결 & 배포 안내

노션 표에 공부한 내용을 한 줄씩 쌓으면 이 홈페이지에 자동으로 표시됩니다.
코드는 건드릴 필요 없고, 아래 순서대로 클릭·복붙만 하면 됩니다.

## 폴더 구성

- `index.html` — **대표 홈**. 한 번 입력 = 한 장면으로 넘어가는 다섯 장면 구성
  (`01 Welcome · 02 Morning · 03 Move · 04 Workroom · 05 Study`).
  각 장면은 `#home` `#morning` `#move` `#workroom` `#study` 주소를 가집니다.
- `archive.html` — Study Log. 노션 글이 실제로 표시되는 곳. 발행일로 주차를 자동 계산합니다.
- `portfolio.html` — 예전 한 장짜리 포트폴리오 홈. 홈 왼쪽 위 로고로 들어갑니다.
- `move.html` — 03 Move 에서 이어지는 운동 기록 페이지
- `api/posts.js` — 노션에서 글 데이터를 가져오는 중계 함수
- `api/authors.js` — 노션에서 작성자 소개를 가져오는 중계 함수 (선택)
- `assets/` — 로고·파비콘·프로필 이미지
- `package.json` — 배포 설정 (안 건드림)

> `deploy/` 폴더는 배포용 사본입니다. `index.html`을 고쳤으면 `deploy/index.html`에도 같은 파일을 덮어써 주세요.

---

# 새 노션 계정 연결 — 내가 해야 할 일

## 0단계. 준비물 (총 3개 계정)

| 계정 | 용도 | 비용 |
|---|---|---|
| 노션 (새 계정) | 글 작성·보관 | 무료 |
| GitHub | 코드 보관 | 무료 |
| Vercel | 실제 홈페이지 주소 발급 | 무료 |

GitHub·Vercel은 **GitHub로 로그인** 한 번이면 되니 순서대로 만드세요.

---

## 1단계. 새 노션 계정 만들고 워크스페이스 준비

1. https://www.notion.com 에서 새 계정 가입 (포트폴리오용으로 쓸 계정)
2. 로그인 후 워크스페이스 하나 생성 (예: `회계 아카이브`)
3. **중요:** 앞으로 만들 데이터베이스와 API 통합은 **반드시 같은 워크스페이스** 안에 있어야 합니다

---

## 2단계. 마스터 데이터베이스 만들기 (가장 중요)

**글 1개 = 표의 한 줄**이 되도록, 모든 글을 **하나의 데이터베이스**에 쌓습니다.
(주차별로 새 표를 만들면 표 ID가 매번 달라져 연결이 깨집니다. 표는 하나만 두고, 주차별 보기는 맨 아래 운영 팁 참고)

새 페이지 → `/database` 입력 → **Database - Full page** 선택 → 이름은 자유 (예: `회계 아카이브 DB`)

### 속성(열) 구성 — 이름은 영어 그대로 두세요 (코드가 이 이름으로 읽습니다)

| 속성 이름 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `Title` | 제목(Title) | 필수 | 글 제목. 기본으로 이미 있음 |
| `Status` | 상태(Status) | **필수** | 값이 `홈페이지 게시`인 글만 사이트에 나옴. 나머지는 숨김 |
| `Date of Issue` | 날짜(Date) | 필수 | 이 날짜로 주차가 자동 계산됨 |
| `Author` | 사람(Person) 또는 텍스트 | 필수 | `배예림` |
| `Content Summary` | 텍스트 | 필수 | 요약 (카드에 보이는 3~4줄) |
| `Insight` | 텍스트 | 선택 | 한 줄 메모·요점. **페이지 본문은 항상 함께 읽어오므로** 비워둬도 됩니다 |
| `Topic` | 선택(Select) | 권장 | 홈 화면의 **주제별 탭**이 됨 (예: 재무회계 / 원가관리회계 / 세무회계 / 회계감사 / 재무제표분석) |
| `Tag` | 다중 선택(Multi-select) | 선택 | 세부 태그 (K-IFRS, 세무조정, CPA 등) |
| `Source` | URL | 선택 | 출처 링크 |
| `Pick` | **체크박스(Checkbox)** | 선택 | 체크한 글이 홈의 `Editor's Picks`에 노출 (최대 3개) |

> **Status 값 만들기:** Status 열 클릭 → 옵션에 `홈페이지 게시` 추가. 이 값이 정확히 있어야 사이트에 뜹니다. (`미완` 같은 다른 값은 자동으로 숨겨짐)

> **인사이트 —** `Insight` 칸에 적은 글과 그 글의 **노션 페이지 본문**을 **둘 다** 읽어와 차례로 보여줍니다. 칸에 한 줄 메모만 적고 본문에 길게 정리해도 내용이 잘리지 않습니다.

> **이미지 —** 페이지 본문에 이미지를 넣으면 **첫 번째 이미지**가 기사 상단 배너 겸 카드 썸네일로 자동 사용됩니다. 이미지 밑에 캡션을 적으면 출처로 표시됩니다.

---

## 3단계. 노션 API 통합(Integration) 만들기 — 토큰 발급

1. https://www.notion.com/my-integrations 접속 (**새로 만든 계정으로 로그인된 상태**여야 함)
2. **New integration** 클릭
3. 이름 입력 (예: `회계 아카이브`) + **Associated workspace = 1단계에서 만든 워크스페이스** 선택
4. 생성 후 **Internal Integration Secret** 복사
   → `ntn_...` (예전에 만든 토큰이면 `secret_...`) 으로 시작하는 문자열. 이게 **`NOTION_TOKEN`** 입니다.
   → **비밀번호처럼 취급하세요.** 절대 GitHub에 올리거나 남에게 공유 금지.

---

## 4단계. 데이터베이스를 통합에 연결 + DB ID 복사 (빼먹으면 안 됨)

1. 2단계에서 만든 데이터베이스를 **전체 페이지로** 엽니다
2. 우측 상단 `⋯` → **Connections(연결)** → 3단계에서 만든 통합 선택
3. 주소창 URL 확인:

   ```
   notion.so/워크스페이스명/32자리문자열?v=...
                            ^^^^^^^^^^^^^ 이 32자리가 NOTION_DB_ID
   ```

   → 이게 **`NOTION_DB_ID`** 입니다.

> 계정을 새로 만들었다면 **토큰과 DB ID 둘 다 새 값**입니다. 예전 값은 안 씁니다.

---

## 5단계. (선택) 작성자 소개 DB

작성자 페이지에 한줄소개를 넣고 싶으면 별도 DB를 하나 더 만듭니다.

- 속성: `이름`(제목) / `한줄소개`(텍스트)
- 이 DB도 **같은 통합에 연결** (4단계 2번과 동일)
- DB ID를 `NOTION_AUTHORS_DB_ID` 로 따로 저장

안 만들어도 사이트는 정상 동작합니다.

---

## 6단계. GitHub 업로드

1. https://github.com 가입 → **New repository**
   - 이름: `yerim-accounting`
   - **Public** (Vercel 무료 배포에 유리)
2. 생성된 repo에서 `Add file` → **Upload files**
3. `yerim-accounting` 폴더 안의 파일들을 **폴더 구조 그대로** 드래그해서 업로드
   - 폴더 자체가 아니라 **폴더 안의 내용물**(`index.html`, `api/`, `assets/`, `package.json`, `README.md`)을 올립니다
4. **Commit changes**

---

## 7단계. Vercel 배포

1. https://vercel.com → **Continue with GitHub** 로 가입
2. **Add New → Project** → 6단계 repo **Import**
3. **Environment Variables** 에 아래 추가 (Name / Value 입력 후 Add)

   | Name | Value |
   |---|---|
   | `NOTION_TOKEN` | 3단계에서 복사한 토큰 |
   | `NOTION_DB_ID` | 4단계에서 복사한 DB ID |
   | `NOTION_AUTHORS_DB_ID` | 5단계 DB ID (안 만들었으면 생략) |

4. **Deploy** 클릭 → 1~2분 후 `https://yerim-accounting.vercel.app` 같은 공개 주소 완성

---

## 8단계. 연결 확인 (여기서 대부분 문제가 잡힘)

| 확인할 것 | 방법 |
|---|---|
| 데이터가 오나? | `배포주소/api/posts` 접속 → 글 목록 JSON이 보이면 성공 |
| 안 되면 원인은? | `배포주소/api/posts?debug=1` → 어떤 열을 읽었는지·오류 메시지 표시 |

**사이트에 샘플 글(K-IFRS 리스, 표준원가 등)만 보인다면** = 노션 연결이 안 된 상태입니다. 아래를 순서대로 확인하세요.

1. Vercel 환경변수 2개가 정확히 들어갔는지 (오타·앞뒤 공백)
2. 4단계 Connections 연결을 했는지 ← **가장 흔한 실수**
3. 열 이름이 표와 정확히 같은지 (`Date of Issue`, `Content Summary` 등)
4. `Status` 값이 `홈페이지 게시` 인 글이 하나라도 있는지
5. 환경변수를 바꿨다면 Vercel에서 **Redeploy** 했는지

---

# 남은 할 일 (직접 교체할 부분)

## 로고 교체

파란 크리스탈 B는 아이보리·오렌지 팔레트와 맞지 않아 전부 걷어냈습니다.
지금은 **헤더에 글자 워드마크만** 있고, 심볼이 들어가는 자리는 아이콘뿐입니다.

현재 아이콘은 직접 준비하신 오렌지 `Y` 이미지입니다. 원본 파일은 `assets/logo-src.webp` 에 함께 넣어뒀습니다.
로고를 또 바꾸고 싶으면 원본을 덮어쓴 뒤 아래 아이콘 파일들을 다시 뽑으면 됩니다. 코드 수정은 필요 없습니다.

| 파일 | 용도 | 권장 크기 |
|---|---|---|
| `assets/logo-src.webp` | 로고 원본 — 아래 아이콘들을 여기서 뽑습니다 | 정사각형 |
| `assets/favicon-32.png` | 브라우저 탭 아이콘 | 32×32 |
| `assets/favicon-180.png` | 모바일 홈 화면 | 180×180 |
| `assets/favicon-512.png` | 앱 아이콘 | 512×512 |
| `assets/favicon.ico` · `favicon.ico` | 구형 브라우저용 (16·32·48 포함) | 32×32 |
| `assets/wordmark.png` | Study Log · Move 의 돌아가기 로고 (배경 투명) | 높이 96 |
| `assets/wordmark-mark.png` | 홈 첫 장면 오른쪽 위 로고 (배경 투명) | 높이 96 |
| `assets/og-image.png` | 카톡·SNS 미리보기 — 홈(`index.html`)·포트폴리오(`portfolio.html`)용 | 1200×630 |
| `assets/og-archive.png` | 카톡·SNS 미리보기 — Study Log(`archive.html`)용 | 1200×630 |
| `assets/authors/배예림.png` | 프로필 사진 | 정사각형 400×400 |

교체 후 GitHub에 다시 올리면 Vercel이 자동 재배포합니다.
아이콘 파일을 바꿨는데 예전 그림이 계속 보이면, 두 HTML 파일 안의 `?v=8` 의 숫자를 하나 올려주세요.
브라우저가 아이콘을 강하게 캐시해서 그렇습니다.

> 헤더에 다시 심볼을 넣고 싶어지면 `archive.html` 의 `.brand` 안에 이미지 한 줄을 넣으면 됩니다.
> 지금은 글자만 있는 편이 참고한 디자인 방향(절제)에 맞아서 비워뒀습니다.

## 배포 주소 반영

Vercel 주소가 확정되면 `index.html` · `portfolio.html` · `archive.html` 상단의
`og:url` · `og:image` · `twitter:image` 주소를 실제 주소로 바꿔주세요
(현재는 `yerim-accounting.vercel.app` 으로 가정해 둠). 카톡 링크 미리보기에만 영향을 줍니다.

## 홈 05 STUDY 의 빈 링크

`index.html` 안 `const LINKS = { ... }` 에서 `rwaStudy` · `bayResearch` · `articles` · `onboarding`
네 항목의 `href` 가 비어 있습니다. 비어 있으면 자리는 지키되 눌리지 않는 "준비 중" 상태로 표시되고,
주소를 채우면 그때부터 눌리는 링크가 됩니다. 코드는 그 한 곳만 고치면 됩니다.

## 디자인 수정

각 페이지의 HTML/CSS만 바꾸면 됩니다. 노션 연결과 무관하므로 언제든 가능합니다.

---

# 운영 팁

**주차별 페이지를 예쁘게 유지하는 법 (Linked view)**

데이터는 마스터 DB 하나에 두되, 주간 페이지에는 그 DB의 **연결된 보기(linked view)**를 넣고 해당 주로 필터합니다.

- 주간 페이지에서 `/linked` 입력 → `Linked view of database` → 마스터 DB 선택
- 필터: `Date of Issue`가 그 주 범위
- 연결된 보기에서 행을 추가하면 마스터 DB에 자동으로 들어갑니다

**글 하나 올리는 흐름**

1. 노션 마스터 DB에 새 행 추가
2. `Title` / `Date of Issue` / `Topic` / `Content Summary` 채우기
3. 페이지를 열어 본문에 공부한 내용 정리 (또는 `Insight` 칸에 작성)
4. `Status` → `홈페이지 게시` 로 변경
5. 사이트 새로고침 → 바로 반영
