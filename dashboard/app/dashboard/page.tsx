'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Pie, Line } from 'react-chartjs-2';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

type Signup = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  department: string;
  position: string;
  ai_experience: string;
  learning_goal: string;
  dietary_restrictions: string | null;
};

const DEPARTMENT_CATEGORIES = [
  '프로덕트',
  '마케팅',
  '세일즈',
  '컨설팅',
  '개발',
  '디자인',
  '경영지원',
  '기타',
];

const AI_EXPERIENCE_CATEGORIES = [
  '처음이에요',
  'ChatGPT 정도 써봤어요',
  'Claude도 써봤어요',
  'Claude Code까지 써봤어요',
];

const LEARNING_GOAL_CATEGORIES = [
  '업무 자동화',
  '데이터 분석',
  '웹서비스 만들기',
  'AI 도구 전반',
  '기타',
];

const CHART_COLORS = [
  '#f97316',
  '#fb923c',
  '#fdba74',
  '#fed7aa',
  '#a3a3a3',
  '#737373',
  '#525252',
  '#404040',
];

function kstDateOf(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function formatKstDateTime(iso: string): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}

function bucketize(value: string, allowed: string[]): string {
  return allowed.includes(value) ? value : '기타';
}

function topCategory(counts: Record<string, number>): string {
  const entries = Object.entries(counts).filter(([, n]) => n > 0);
  if (entries.length === 0) return '-';
  entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return entries[0][0];
}

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#a3a3a3',
        font: { size: 11, family: 'Pretendard, system-ui, sans-serif' },
        boxWidth: 10,
        boxHeight: 10,
        padding: 12,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(23,23,23,0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleColor: '#fafafa',
      bodyColor: '#d4d4d4',
      padding: 10,
    },
  },
};

export default function DashboardPage() {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase 환경변수가 설정되지 않았습니다.');
        setLoading(false);
        return;
      }
      const { data, error: queryError } = await supabase
        .from('signups')
        .select('*')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (queryError) {
        setError('데이터를 불러오지 못했습니다.');
      } else {
        setSignups((data ?? []) as Signup[]);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const total = signups.length;
    const today = kstDateOf(new Date());
    const todayCount = signups.filter(
      (s) => kstDateOf(new Date(s.created_at)) === today
    ).length;

    const deptCounts: Record<string, number> = {};
    DEPARTMENT_CATEGORIES.forEach((c) => (deptCounts[c] = 0));
    const aiCounts: Record<string, number> = {};
    AI_EXPERIENCE_CATEGORIES.forEach((c) => (aiCounts[c] = 0));
    const goalCounts: Record<string, number> = {};
    LEARNING_GOAL_CATEGORIES.forEach((c) => (goalCounts[c] = 0));

    for (const s of signups) {
      deptCounts[bucketize(s.department, DEPARTMENT_CATEGORIES)]++;
      aiCounts[bucketize(s.ai_experience, AI_EXPERIENCE_CATEGORIES)]++;
      goalCounts[bucketize(s.learning_goal, LEARNING_GOAL_CATEGORIES)]++;
    }

    const last7Days: string[] = [];
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      last7Days.push(kstDateOf(new Date(now - i * 86400000)));
    }
    const dailyCounts = last7Days.map(
      (day) =>
        signups.filter((s) => kstDateOf(new Date(s.created_at)) === day).length
    );

    return {
      total,
      todayCount,
      topDept: total === 0 ? '-' : topCategory(deptCounts),
      topAi: total === 0 ? '-' : topCategory(aiCounts),
      deptCounts,
      aiCounts,
      goalCounts,
      last7Days,
      dailyCounts,
    };
  }, [signups]);

  const doughnutData = {
    labels: DEPARTMENT_CATEGORIES,
    datasets: [
      {
        data: DEPARTMENT_CATEGORIES.map((c) => stats.deptCounts[c]),
        backgroundColor: CHART_COLORS,
        borderColor: '#0a0a0a',
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: AI_EXPERIENCE_CATEGORIES,
    datasets: [
      {
        label: '신청 수',
        data: AI_EXPERIENCE_CATEGORIES.map((c) => stats.aiCounts[c]),
        backgroundColor: '#f97316',
        borderRadius: 4,
      },
    ],
  };

  const pieData = {
    labels: LEARNING_GOAL_CATEGORIES,
    datasets: [
      {
        data: LEARNING_GOAL_CATEGORIES.map((c) => stats.goalCounts[c]),
        backgroundColor: CHART_COLORS,
        borderColor: '#0a0a0a',
        borderWidth: 2,
      },
    ],
  };

  const lineData = {
    labels: stats.last7Days.map((d) => d.slice(5)),
    datasets: [
      {
        label: '일별 신청',
        data: stats.dailyCounts,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249,115,22,0.15)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#f97316',
        pointRadius: 3,
      },
    ],
  };

  const barOptions = {
    ...baseChartOptions,
    indexAxis: 'y' as const,
    plugins: {
      ...baseChartOptions.plugins,
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: '#a3a3a3', stepSize: 1, precision: 0 },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
      y: {
        ticks: { color: '#a3a3a3' },
        grid: { display: false },
      },
    },
  };

  const lineOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: '#a3a3a3' },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#a3a3a3', stepSize: 1, precision: 0 },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* Headline */}
      <section>
        <p className="text-xs text-neutral-500 lowercase">admin dashboard</p>
        <h1 className="mt-2 text-2xl md:text-4xl font-semibold text-white">
          AI 바이브 코딩 마스터클래스
        </h1>
        <p className="mt-3 text-lg text-neutral-400">신청자 현황</p>
      </section>

      <div className="h-px bg-white/10 my-16" />

      {loading ? (
        <p className="text-sm text-neutral-400">불러오는 중...</p>
      ) : error ? (
        <p className="text-sm text-orange-500">{error}</p>
      ) : (
        <>
          {/* Summary */}
          <section>
            <div className="border-y border-white/10 grid grid-cols-2 md:grid-cols-4">
              <SummaryItem
                label="총 신청 인원"
                value={stats.total === 0 ? '0' : `${stats.total}명`}
                className="py-6 px-4 border-b md:border-b-0 border-white/10 md:border-r"
              />
              <SummaryItem
                label="오늘 신청 인원"
                value={stats.todayCount === 0 ? '0' : `${stats.todayCount}명`}
                className="py-6 px-4 border-b md:border-b-0 border-white/10 md:border-r"
              />
              <SummaryItem
                label="가장 많은 소속"
                value={stats.topDept}
                className="py-6 px-4 border-white/10 md:border-r"
              />
              <SummaryItem
                label="가장 많은 ai 경험"
                value={stats.topAi}
                className="py-6 px-4"
              />
            </div>
          </section>

          <div className="h-px bg-white/10 my-16" />

          {/* Charts */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ChartBlock title="소속 팀별 신청 분포">
              <Doughnut data={doughnutData} options={baseChartOptions} />
            </ChartBlock>
            <ChartBlock title="ai 도구 사용 경험 분포">
              <Bar data={barData} options={barOptions} />
            </ChartBlock>
            <ChartBlock title="가장 배우고 싶은 것 분포">
              <Pie data={pieData} options={baseChartOptions} />
            </ChartBlock>
            <ChartBlock title="일별 신청 추이 (최근 7일, kst)">
              <Line data={lineData} options={lineOptions} />
            </ChartBlock>
          </section>

          <div className="h-px bg-white/10 my-16" />

          {/* Table */}
          <section>
            <p className="text-xs text-neutral-400 lowercase mb-4">
              신청자 목록 ({stats.total}건)
            </p>
            <div className="border-y border-white/10 overflow-x-auto">
              {signups.length === 0 ? (
                <p className="py-8 text-sm text-neutral-500 text-center">
                  아직 신청자가 없습니다.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-neutral-400 lowercase">
                      <th className="py-3 px-3 text-left font-normal">이름</th>
                      <th className="py-3 px-3 text-left font-normal">이메일</th>
                      <th className="py-3 px-3 text-left font-normal">소속 팀</th>
                      <th className="py-3 px-3 text-left font-normal">직급</th>
                      <th className="py-3 px-3 text-left font-normal">ai 경험</th>
                      <th className="py-3 px-3 text-left font-normal">
                        배우고 싶은 것
                      </th>
                      <th className="py-3 px-3 text-left font-normal">식이 제한</th>
                      <th className="py-3 px-3 text-left font-normal">신청일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signups.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-white/5 last:border-b-0 text-neutral-300"
                      >
                        <td className="py-3 px-3 text-white">{s.name}</td>
                        <td className="py-3 px-3">{s.email}</td>
                        <td className="py-3 px-3">{s.department}</td>
                        <td className="py-3 px-3">{s.position}</td>
                        <td className="py-3 px-3">{s.ai_experience}</td>
                        <td className="py-3 px-3">{s.learning_goal}</td>
                        <td
                          className={`py-3 px-3 ${
                            s.dietary_restrictions
                              ? 'bg-yellow-500/20 text-yellow-100'
                              : 'text-neutral-500'
                          }`}
                        >
                          {s.dietary_restrictions || '-'}
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-neutral-400">
                          {formatKstDateTime(s.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </>
      )}

      <p className="mt-16 text-center text-xs text-neutral-500">
        powered by listeningmind ☕
      </p>
    </main>
  );
}

function SummaryItem({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-neutral-400 lowercase">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white truncate">{value}</p>
    </div>
  );
}

function ChartBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-neutral-400 mb-4">{title}</p>
      <div className="h-72">{children}</div>
    </div>
  );
}
