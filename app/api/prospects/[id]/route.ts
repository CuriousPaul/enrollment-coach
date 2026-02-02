import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET: Prospect 상세 정보
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const prospect = await prisma.prospect.findFirst({
      where: {
        id: params.id,
        ownerId: session.user.id,
      },
      include: {
        insights: {
          orderBy: { createdAt: "desc" },
        },
        conversations: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!prospect) {
      return NextResponse.json(
        { error: "Prospect를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({ prospect });
  } catch (error) {
    console.error("Get prospect error:", error);
    return NextResponse.json(
      { error: "Prospect 정보를 가져오는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// PUT: Prospect 정보 수정
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const body = await req.json();
    const { name, contact, status } = body;

    const prospect = await prisma.prospect.findFirst({
      where: {
        id: params.id,
        ownerId: session.user.id,
      },
    });

    if (!prospect) {
      return NextResponse.json(
        { error: "Prospect를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    const updatedProspect = await prisma.prospect.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(contact !== undefined && { contact }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({
      message: "Prospect 정보가 수정되었습니다",
      prospect: updatedProspect,
    });
  } catch (error) {
    console.error("Update prospect error:", error);
    return NextResponse.json(
      { error: "Prospect 수정 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// DELETE: Prospect 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const prospect = await prisma.prospect.findFirst({
      where: {
        id: params.id,
        ownerId: session.user.id,
      },
    });

    if (!prospect) {
      return NextResponse.json(
        { error: "Prospect를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    await prisma.prospect.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Prospect가 삭제되었습니다",
    });
  } catch (error) {
    console.error("Delete prospect error:", error);
    return NextResponse.json(
      { error: "Prospect 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
