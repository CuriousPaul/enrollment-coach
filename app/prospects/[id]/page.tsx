"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Conversation {
  id: string;
  message: string;
  sender: string;
  aiAdvice: string | null;
  createdAt: string;
}

interface Insight {
  id: string;
  type: string;
  content: string;
  createdAt: string;
}

interface Prospect {
  id: string;
  name: string;
  contact: string | null;
  phase: number;
  intimacyScore: number;
  readinessScore: number;
  status: string;
  conversations: Conversation[];
  insights: Insight[];
}

export default function ProspectDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const prospectId = params.id as string;

  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sender, setSender] = useState<"sdr" | "prospect">("sdr");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && prospectId) {
      fetchProspect();
    }
  }, [status, prospectId]);

  const fetchProspect = async () => {
    try {
      const response = await fetch(`/api/prospects/${prospectId}`);
      const data = await response.json();
      setProspect(data.prospect);
    } catch (error) {
      console.error("Failed to fetch prospect:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId,
          message: newMessage,
          sender,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchProspect();
      }
    } catch (error) {
      console.error("Failed to add conversation:", error);
    }
  };

  const handleAnalyze = async () => {
    if (!prospect || prospect.conversations.length === 0) return;

    setAnalyzing(true);
    try {
      const response = await fetch("/api/ai/analyze-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId,
          conversations: prospect.conversations.slice(-5).map((c) => ({
            message: c.message,
            sender: c.sender,
          })),
        }),
      });

      if (response.ok) {
        fetchProspect();
        alert("AI 분석이 완료되었습니다!");
      }
    } catch (error) {
      console.error("Failed to analyze:", error);
      alert("AI 분석 중 오류가 발생했습니다");
    } finally {
      setAnalyzing(false);
    }
  };

  const getPhaseLabel = (phase: number) => {
    const labels = ["", "초기 접촉", "신뢰 구축", "핵심 발견", "가치 전달", "등록 결정"];
    return labels[phase] || "알 수 없음";
  };

  const getInsightTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      core_belief: "핵심 신념",
      wound: "상처",
      pattern: "패턴",
      readiness_signal: "준비도 신호",
    };
    return labels[type] || type;
  };

  const getInsightTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      core_belief: "bg-purple-100 text-purple-700",
      wound: "bg-red-100 text-red-700",
      pattern: "bg-blue-100 text-blue-700",
      readiness_signal: "bg-green-100 text-green-700",
    };
    return colors[type] || "bg-warm-gray-200 text-warm-gray-700";
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-warm-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="card text-center">
          <p className="text-warm-gray-600 mb-4">Prospect를 찾을 수 없습니다</p>
          <Link href="/dashboard" className="btn-primary">
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="bg-white shadow-gentle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-warm-gray-600 hover:text-warm-gray-900"
            >
              ← 대시보드
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-warm-gray-900">
                {prospect.name}
              </h1>
              {prospect.contact && (
                <p className="text-sm text-warm-gray-600">{prospect.contact}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Prospect Info & Insights */}
          <div className="space-y-6">
            {/* Prospect Stats */}
            <div className="card">
              <h2 className="text-lg font-bold mb-4">현재 상태</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-warm-gray-600 mb-1">Phase</div>
                  <div className="text-lg font-medium text-coral">
                    {getPhaseLabel(prospect.phase)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-warm-gray-600 mb-1">친밀도</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-warm-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal h-2 rounded-full"
                        style={{ width: `${prospect.intimacyScore * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {prospect.intimacyScore}/10
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-warm-gray-600 mb-1">준비도</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-warm-gray-200 rounded-full h-2">
                      <div
                        className="bg-coral h-2 rounded-full"
                        style={{ width: `${prospect.readinessScore * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {prospect.readinessScore}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">AI 인사이트</h2>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || prospect.conversations.length === 0}
                  className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? "분석 중..." : "AI 분석"}
                </button>
              </div>
              {prospect.insights.length > 0 ? (
                <div className="space-y-3">
                  {prospect.insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="border border-warm-gray-200 rounded-lg p-3"
                    >
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${getInsightTypeColor(
                          insight.type
                        )}`}
                      >
                        {getInsightTypeLabel(insight.type)}
                      </span>
                      <p className="text-sm text-warm-gray-700">
                        {insight.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-warm-gray-600">
                  아직 인사이트가 없습니다. 대화를 추가하고 AI 분석을 실행하세요.
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Conversations */}
          <div className="lg:col-span-2">
            <div className="card h-full flex flex-col">
              <h2 className="text-lg font-bold mb-4">대화 히스토리</h2>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-96">
                {prospect.conversations.length > 0 ? (
                  prospect.conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-4 rounded-lg ${
                        conv.sender === "sdr"
                          ? "bg-coral-50 ml-8"
                          : "bg-teal-50 mr-8"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">
                          {conv.sender === "sdr" ? "SDR (나)" : prospect.name}
                        </span>
                        <span className="text-xs text-warm-gray-600">
                          {new Date(conv.createdAt).toLocaleString("ko-KR")}
                        </span>
                      </div>
                      <p className="text-warm-gray-800">{conv.message}</p>
                      {conv.aiAdvice && (
                        <div className="mt-3 pt-3 border-t border-warm-gray-200">
                          <p className="text-xs text-purple-600 font-medium mb-1">
                            AI 조언:
                          </p>
                          <p className="text-sm text-warm-gray-700">
                            {conv.aiAdvice}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-warm-gray-600 text-center py-8">
                    아직 대화가 없습니다. 첫 대화를 추가해보세요!
                  </p>
                )}
              </div>

              {/* Add Conversation Form */}
              <form onSubmit={handleAddConversation} className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSender("sdr")}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      sender === "sdr"
                        ? "bg-coral text-white"
                        : "bg-warm-gray-200 text-warm-gray-700"
                    }`}
                  >
                    SDR (나)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSender("prospect")}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      sender === "prospect"
                        ? "bg-teal text-white"
                        : "bg-warm-gray-200 text-warm-gray-700"
                    }`}
                  >
                    Prospect
                  </button>
                </div>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="input-field min-h-24"
                  placeholder="대화 내용을 입력하세요..."
                  required
                />
                <button type="submit" className="btn-primary w-full">
                  대화 추가
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
