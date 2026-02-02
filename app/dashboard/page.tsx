"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Prospect {
  id: string;
  name: string;
  contact: string | null;
  phase: number;
  intimacyScore: number;
  readinessScore: number;
  status: string;
  updatedAt: string;
  _count: {
    conversations: number;
    insights: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProspect, setNewProspect] = useState({ name: "", contact: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProspects();
    }
  }, [status]);

  const fetchProspects = async () => {
    try {
      const response = await fetch("/api/prospects");
      const data = await response.json();
      setProspects(data.prospects || []);
    } catch (error) {
      console.error("Failed to fetch prospects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProspect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProspect),
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewProspect({ name: "", contact: "" });
        fetchProspects();
      }
    } catch (error) {
      console.error("Failed to add prospect:", error);
    }
  };

  const getPhaseLabel = (phase: number) => {
    const labels = ["", "초기 접촉", "신뢰 구축", "핵심 발견", "가치 전달", "등록 결정"];
    return labels[phase] || "알 수 없음";
  };

  const getPhaseColor = (phase: number) => {
    const colors = [
      "",
      "bg-warm-gray-200 text-warm-gray-700",
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-teal-100 text-teal-700",
      "bg-coral-100 text-coral-700",
    ];
    return colors[phase] || colors[0];
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-warm-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="bg-white shadow-gentle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-coral">Enrollment Coach</h1>
              <p className="text-sm text-warm-gray-600">
                안녕하세요, {session?.user?.name}님
              </p>
            </div>
            <button
              onClick={() => router.push("/api/auth/signout")}
              className="text-warm-gray-600 hover:text-warm-gray-900"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-sm text-warm-gray-600 mb-1">전체 Prospects</div>
            <div className="text-3xl font-bold text-coral">{prospects.length}</div>
          </div>
          <div className="card">
            <div className="text-sm text-warm-gray-600 mb-1">활성 상태</div>
            <div className="text-3xl font-bold text-teal">
              {prospects.filter((p) => p.status === "active").length}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-warm-gray-600 mb-1">평균 준비도</div>
            <div className="text-3xl font-bold text-purple-600">
              {prospects.length > 0
                ? (
                    prospects.reduce((sum, p) => sum + p.readinessScore, 0) /
                    prospects.length
                  ).toFixed(1)
                : "0"}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-warm-gray-600 mb-1">Phase 5</div>
            <div className="text-3xl font-bold text-green-600">
              {prospects.filter((p) => p.phase === 5).length}
            </div>
          </div>
        </div>

        {/* Add Prospect Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            + Prospect 추가
          </button>
        </div>

        {/* Prospects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prospects.map((prospect) => (
            <Link
              key={prospect.id}
              href={`/prospects/${prospect.id}`}
              className="card hover:shadow-soft transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-warm-gray-900">
                    {prospect.name}
                  </h3>
                  {prospect.contact && (
                    <p className="text-sm text-warm-gray-600">{prospect.contact}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getPhaseColor(
                    prospect.phase
                  )}`}
                >
                  {getPhaseLabel(prospect.phase)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray-600">친밀도</span>
                  <span className="font-medium">{prospect.intimacyScore}/10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray-600">준비도</span>
                  <span className="font-medium">{prospect.readinessScore}/10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray-600">대화</span>
                  <span className="font-medium">
                    {prospect._count.conversations}건
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray-600">인사이트</span>
                  <span className="font-medium">
                    {prospect._count.insights}개
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {prospects.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-warm-gray-600 mb-4">
              아직 Prospect가 없습니다
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              첫 Prospect 추가하기
            </button>
          </div>
        )}
      </main>

      {/* Add Prospect Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">새 Prospect 추가</h2>
            <form onSubmit={handleAddProspect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  value={newProspect.name}
                  onChange={(e) =>
                    setNewProspect({ ...newProspect, name: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-gray-700 mb-2">
                  연락처
                </label>
                <input
                  type="text"
                  value={newProspect.contact}
                  onChange={(e) =>
                    setNewProspect({ ...newProspect, contact: e.target.value })
                  }
                  className="input-field"
                  placeholder="전화번호, 이메일 등"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewProspect({ name: "", contact: "" });
                  }}
                  className="btn-secondary flex-1"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
