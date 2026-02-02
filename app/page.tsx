import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-coral/10 to-teal/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-warm-gray-900 mb-6">
              Enrollment Coach
            </h1>
            <p className="text-xl md:text-2xl text-warm-gray-700 mb-4">
              Awaken Training 등록을 위한
            </p>
            <p className="text-xl md:text-2xl text-warm-gray-700 mb-12">
              <span className="text-coral font-semibold">AI 코칭</span> +{" "}
              <span className="text-teal font-semibold">Sales Pipeline</span>
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup" className="btn-primary text-lg">
                시작하기
              </Link>
              <Link href="/login" className="btn-secondary text-lg">
                로그인
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-warm-gray-900 mb-12">
            핵심 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Prospect 관리</h3>
              <p className="text-warm-gray-600">
                각 Prospect의 Phase, 친밀도, 준비도를 한눈에 파악하고 체계적으로 관리하세요
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-3">AI 조언</h3>
              <p className="text-warm-gray-600">
                CBT + MI 기법으로 다음 질문을 추천하고, 핵심 신념과 상처를 발견하세요
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">인사이트 발견</h3>
              <p className="text-warm-gray-600">
                대화 분석을 통해 자동으로 패턴, 신념, 준비도 신호를 추출합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Awaken Section */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-warm-gray-900 mb-6">
            About Awaken Training
          </h2>
          <p className="text-lg text-warm-gray-700 mb-6">
            200만원 투자, 5주간의 깊은 자기발견 여정
          </p>
          <p className="text-warm-gray-600 mb-8">
            Awaken Training은 단순한 교육 프로그램이 아닙니다.
            <br />
            참가자의 핵심 신념과 상처를 발견하고 치유하는,
            <br />
            진정한 변화의 시작입니다.
          </p>
          <a
            href="https://awakenkr.oopy.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-coral hover:text-coral-dark font-medium"
          >
            더 알아보기 →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-warm-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-warm-gray-600">
          <p>© 2026 Enrollment Coach. For Awaken Training Sales Team.</p>
        </div>
      </footer>
    </div>
  );
}
