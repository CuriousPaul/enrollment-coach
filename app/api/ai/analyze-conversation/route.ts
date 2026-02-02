import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prospectId, conversations } = await req.json();

    if (!prospectId || !conversations || conversations.length === 0) {
      return NextResponse.json(
        { error: "Prospect ID와 대화 내용이 필요합니다" },
        { status: 400 }
      );
    }

    // Prospect 정보 가져오기
    const prospect = await prisma.prospect.findUnique({
      where: { id: prospectId },
      include: {
        insights: true,
        conversations: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!prospect) {
      return NextResponse.json(
        { error: "Prospect를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 대화 히스토리 포맷팅
    const conversationHistory = prospect.conversations
      .map(
        (c) =>
          `${c.sender === "sdr" ? "SDR" : "Prospect"}: ${c.message}`
      )
      .join("\n");

    // 기존 인사이트 포맷팅
    const existingInsights = prospect.insights
      .map((i) => `- ${i.type}: ${i.content}`)
      .join("\n");

    // AI 프롬프트
    const systemPrompt = `당신은 Awaken Training 등록을 돕는 전문 Sales Coach입니다.
Awaken Training은 200만원짜리 5주 자기발견 프로그램으로, 참가자의 핵심 신념과 상처를 발견하고 치유하는 것을 목표로 합니다.

당신의 역할:
1. 대화 분석을 통해 Prospect의 Phase (1-5)를 판단
   - Phase 1: 초기 접촉, 관계 형성
   - Phase 2: 신뢰 구축, 고민 탐색
   - Phase 3: 핵심 신념/상처 발견
   - Phase 4: 프로그램 소개, 가치 전달
   - Phase 5: 등록 결정 단계

2. 친밀도 점수 (0-10): 관계의 깊이와 신뢰도
3. 준비도 점수 (0-10): 프로그램 등록에 대한 준비 정도
4. 다음 질문 추천: CBT (인지행동치료) + MI (동기면담) 기법 활용
5. 인사이트 발견: 핵심 신념, 상처, 패턴, 준비도 신호

**중요**: 200만원은 큰 투자이므로, 성급하게 판매하지 말고 진정한 필요성과 준비도를 확인하세요.

기존 인사이트:
${existingInsights || "없음"}

최근 대화 히스토리:
${conversationHistory}

새로운 대화:
${conversations.map((c: any) => `${c.sender}: ${c.message}`).join("\n")}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            "위 대화를 분석하고, JSON 형식으로 다음을 제공해주세요:\n" +
            "{\n" +
            '  "phase": 1-5,\n' +
            '  "intimacyScore": 0-10,\n' +
            '  "readinessScore": 0-10,\n' +
            '  "nextQuestions": ["질문1", "질문2", "질문3"],\n' +
            '  "insights": [{"type": "core_belief|wound|pattern|readiness_signal", "content": "내용"}],\n' +
            '  "analysis": "전반적인 분석 및 조언",\n' +
            '  "caution": "주의사항 (있다면)"\n' +
            "}",
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const aiAnalysis = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    // Prospect 업데이트
    await prisma.prospect.update({
      where: { id: prospectId },
      data: {
        phase: aiAnalysis.phase || prospect.phase,
        intimacyScore: aiAnalysis.intimacyScore || prospect.intimacyScore,
        readinessScore: aiAnalysis.readinessScore || prospect.readinessScore,
      },
    });

    // 새로운 인사이트 저장
    if (aiAnalysis.insights && aiAnalysis.insights.length > 0) {
      await prisma.insight.createMany({
        data: aiAnalysis.insights.map((insight: any) => ({
          prospectId,
          type: insight.type,
          content: insight.content,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      analysis: aiAnalysis,
    });
  } catch (error) {
    console.error("AI Analysis error:", error);
    return NextResponse.json(
      { error: "AI 분석 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
