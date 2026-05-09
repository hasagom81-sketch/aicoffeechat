'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ComputerDesktopIcon,
  ChevronDownIcon,
} from '@heroicons/react/16/solid';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type FormState = {
  name: string;
  email: string;
  department: string;
  position: string;
  aiExperience: string;
  learningGoal: string;
  dietary: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  department: '',
  position: '',
  aiExperience: '',
  learningGoal: '',
  dietary: '',
};

const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'nate.com',
  'kakao.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'yahoo.co.kr',
  'icloud.com',
];

const DEPARTMENT_OPTIONS = [
  '프로덕트',
  '마케팅',
  '세일즈',
  '컨설팅',
  '개발',
  '디자인',
  '경영지원',
  '기타',
];

const POSITION_OPTIONS = ['사원', '대리', '과장', '차장', '부장', '임원'];

const AI_EXPERIENCE_OPTIONS = [
  '처음이에요',
  'ChatGPT 정도 써봤어요',
  'Claude도 써봤어요',
  'Claude Code까지 써봤어요',
];

const LEARNING_GOAL_OPTIONS = [
  '업무 자동화',
  '데이터 분석',
  '웹서비스 만들기',
  'AI 도구 전반',
  '기타',
];

export default function Home() {
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.department ||
      !formData.position ||
      !formData.aiExperience ||
      !formData.learningGoal
    ) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    const domain = email.split('@')[1].toLowerCase();
    if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
      setError('회사 이메일 주소를 사용해주세요.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setError('서버 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.');
      return;
    }

    setSubmitting(true);
    const { error: insertError } = await supabase.from('signups').insert({
      name: formData.name.trim(),
      email: email.toLowerCase(),
      department: formData.department,
      position: formData.position,
      ai_experience: formData.aiExperience,
      learning_goal: formData.learningGoal,
      dietary_restrictions: formData.dietary.trim() || null,
    });
    setSubmitting(false);

    if (insertError) {
      if (insertError.code === '23505') {
        setError('이미 신청된 이메일입니다.');
      } else {
        setError('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="text-5xl mb-6">🎉</div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            신청이 완료되었습니다!
          </h2>
          <p className="mt-3 text-base text-neutral-300 leading-relaxed">
            당일 노트북 꼭 챙겨오세요.
          </p>
        </div>
        <p className="mt-16 text-xs text-neutral-500">
          powered by listeningmind ☕
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      {/* Headline */}
      <section>
        <h1 className="text-2xl md:text-4xl font-semibold text-white">
          AI 바이브 코딩 마스터클래스
        </h1>
        <p className="mt-3 text-lg text-neutral-400">
          코딩 없이 AI로 업무 도구를 만드는 법
        </p>
        <p className="mt-3 text-xs text-neutral-500">
          강사: AI커피챗 · 외부 초청 강사
        </p>
      </section>

      <div className="h-px bg-white/10 my-16" />

      {/* Intro */}
      <section>
        <p className="text-base text-neutral-300 leading-relaxed max-w-lg">
          AI에게 말로 지시하면 앱이 만들어집니다. 코딩 경험이 전혀 없어도
          괜찮아요. 4시간이면 여러분만의 업무 도구를 직접 만들 수 있습니다.
        </p>
      </section>

      <div className="h-px bg-white/10 my-16" />

      {/* Event info — 2x2 grid with dividers attached to top/bottom borders */}
      <section>
        <div className="border-y border-white/10 grid grid-cols-1 md:grid-cols-2">
          <InfoItem
            icon={<CalendarIcon className="w-4 h-4 text-neutral-500" />}
            label="일시"
            value="2026년 4월 2일"
            extra="오후 1시–5시 (4시간)"
            className="py-5 px-4 border-b border-white/10 md:border-r"
          />
          <InfoItem
            icon={<MapPinIcon className="w-4 h-4 text-neutral-500" />}
            label="장소"
            value="본사 대회의실"
            className="py-5 px-4 border-b border-white/10"
          />
          <InfoItem
            icon={<UsersIcon className="w-4 h-4 text-neutral-500" />}
            label="대상"
            value="전 직원"
            extra="개발/비개발 무관"
            className="py-5 px-4 border-b md:border-b-0 border-white/10 md:border-r"
          />
          <InfoItem
            icon={<ComputerDesktopIcon className="w-4 h-4 text-neutral-500" />}
            label="준비물"
            value="개인 노트북"
            className="py-5 px-4"
          />
        </div>
      </section>

      <div className="h-px bg-white/10 my-16" />

      {/* Form */}
      <section>
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5">
            <Field fieldId="name" label="이름" required>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="홍길동"
                required
                className={inputClass}
              />
            </Field>

            <Field fieldId="email" label="이메일" hint="회사 이메일" required>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
                className={inputClass}
              />
            </Field>

            <Field fieldId="department" label="소속 팀/부서" required>
              <SelectInput
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={DEPARTMENT_OPTIONS}
                placeholder="선택해주세요"
              />
            </Field>

            <Field fieldId="position" label="직급" required>
              <SelectInput
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                options={POSITION_OPTIONS}
                placeholder="선택해주세요"
              />
            </Field>

            <Field fieldId="aiExperience" label="AI 도구 사용 경험" required>
              <SelectInput
                id="aiExperience"
                name="aiExperience"
                value={formData.aiExperience}
                onChange={handleChange}
                options={AI_EXPERIENCE_OPTIONS}
                placeholder="선택해주세요"
              />
            </Field>

            <Field
              fieldId="learningGoal"
              label="강의에서 가장 배우고 싶은 것"
              required
            >
              <SelectInput
                id="learningGoal"
                name="learningGoal"
                value={formData.learningGoal}
                onChange={handleChange}
                options={LEARNING_GOAL_OPTIONS}
                placeholder="선택해주세요"
              />
            </Field>

            <Field
              fieldId="dietary"
              label="식이 제한 또는 알레르기"
              hint="선택"
            >
              <input
                id="dietary"
                name="dietary"
                type="text"
                value={formData.dietary}
                onChange={handleChange}
                placeholder="간식 준비 참고용"
                className={inputClass}
              />
            </Field>
          </div>

          {error && (
            <p className="mt-4 text-xs text-orange-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full h-10 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors disabled:bg-orange-500/50 disabled:cursor-not-allowed"
          >
            {submitting ? '신청 중...' : '신청하기'}
          </button>
        </form>
      </section>

      <p className="mt-16 text-center text-xs text-neutral-500">
        powered by listeningmind ☕
      </p>
    </main>
  );
}

const inputClass =
  'w-full h-10 px-3 rounded-md bg-white/5 focus:bg-white/10 text-sm font-normal text-white placeholder:text-neutral-500 outline-none transition-colors';

function InfoItem({
  icon,
  label,
  value,
  extra,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  extra?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1.5 text-sm text-white">{value}</p>
      {extra && <p className="mt-0.5 text-xs text-neutral-500">{extra}</p>}
    </div>
  );
}

function Field({
  fieldId,
  label,
  required,
  hint,
  children,
}: {
  fieldId: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-xs text-neutral-400 mb-1.5"
      >
        {label}
        {required && <span className="ml-1 text-orange-500">*</span>}
        {hint && <span className="ml-1.5 text-neutral-500">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

function SelectInput({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
}) {
  const isEmpty = value === '';
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full h-10 pl-3 pr-10 rounded-md bg-white/5 focus:bg-white/10 text-sm font-normal outline-none appearance-none cursor-pointer transition-colors ${
          isEmpty ? 'text-neutral-500' : 'text-white'
        }`}
      >
        <option value="" disabled className="bg-neutral-900 text-neutral-500">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-neutral-900 text-white">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
    </div>
  );
}
