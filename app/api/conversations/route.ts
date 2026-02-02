import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST: 새 대화 추가
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { prospectId, message, sender } = await req.json();

    if (!prospectId || !message || !sender) {
      return NextResponse.json(
        { error: "Prospect ID, 메시지, 발신자 정보가 필요합니다" },
        { status: 400 }
      );
    }

    // Prospect 소유권 확인
    const prospect = await prisma.prospect.findFirst({
      where: {
        id: prospectId,
        ownerId: session.user.id,
      },
    });

    if (!prospect) {
      return NextResponse.json(
        { error: "Prospect를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        prospectId,
        message,
        sender,
      },
    });

    return NextResponse.json(
      {
        message: "대화가 추가되었습니다",
        conversation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { error: "대화 추가 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
