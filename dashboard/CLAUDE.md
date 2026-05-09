# CLAUDE.md

이 파일은 `dashboard/` 작업 시 Claude Code가 따라야 할 디자인 가이드라인을 담는다.

## 디자인 — 글로벌 스타일
- Tailwind CSS 사용. gray 계열은 전부 Tailwind neutral gray 사용 (cool gray 금지)
- 배경: neutral-950. 텍스트: white
- 포인트 컬러: orange-500 (#ff6b35에 가장 가까운 Tailwind 톤)
- 폰트: sans는 Pretendard, mono는 Geist Mono
- 폰트 굵기: 본문은 font-regular. semibold/bold는 헤드라인(행사명)에만 사용
- 라벨/캡션: 전부 lowercase (uppercase 사용 금지)
- 아이콘: Heroicons micro (16x16 viewbox). 아이콘 색상은 neutral-500, 활성 상태만 white

## 디자인 — 레이아웃
- 카드/패널 사용 금지. 섹션 구분은 1px border, white/10% opacity 디바이더로 처리
- 폼 영역도 카드로 감싸지 말 것. 배경 위에 그대로 놓고, 위아래 디바이더로 구분
- 최대 너비: max-w-2xl, 가운데 정렬
- 섹션 간 간격: py-16
- 행사 정보(일시/장소/대상/준비물)는 2x2 그리드.
  각 항목 사이 세로 디바이더는 상하 보더에 붙도록 (개별 항목에 padding, 그룹 padding 아님)

## 디자인 — 폼 스타일
- input/select 컨테이너: border 없음.
  배경 white/5% opacity, 포커스 시 white/10% opacity
- input 높이: h-10 (40px)
- input 텍스트: text-sm, font-regular
- 라벨: text-xs, neutral-400, 라벨과 input 간격 mb-1.5
- 드롭다운(select)도 input과 동일한 스타일
- 제출 버튼: orange-500 배경, white 텍스트,
  pill shape (rounded-full), h-10, text-sm, font-medium
  호버: orange-400
- 버튼 위 간격: mt-8

## 디자인 — 헤드라인 영역
- 행사명: text-4xl (모바일 text-2xl), font-semibold, white
- 부제: text-lg, neutral-400, font-regular, 행사명 아래 mt-3
- 강의 소개 텍스트: text-base, neutral-300, leading-relaxed, max-w-lg

## 디자인 — 반응형
- 모바일 퍼스트
- 행사 정보 그리드: 모바일에서 1열 스택, md 이상에서 2x2
- 768px 미만에서 좌우 패딩 px-6

## 디자인 — 금지 사항
- indigo, blue 계열 강조색 사용 금지
- box-shadow 사용 금지 (그림자 대신 디바이더로 구분)
- uppercase 텍스트 금지
- bold/semibold 남용 금지 (헤드라인 외 전부 regular)
- 12.5px, 13px 등 비표준 폰트 크기 금지 — Tailwind 스케일만 사용
