import { Route, createRoutesFromElements, matchRoutes } from 'react-router-dom';

import Communication from '@/pages/communication/Communication';
import ConversationHistoryDetailPage from '@/pages/communication/ConversationHistoryDetailPage';
import ConversationHistoryPage from '@/pages/communication/ConversationHistoryPage';
import Home from '@/pages/home/Home';
import ModeCreatePage from '@/pages/home/ModeCreatePage';
import ModeEditPage from '@/pages/home/ModeEditPage';
import NotificationPage from '@/pages/home/NotificationPage';
import LiveSound from '@/pages/liveSound/LiveSound';
import NotFound from '@/pages/notFound/NotFound';

import Login from '@/pages/login/Login';
import DisabilityPage from '@/pages/onboarding/DisabilityPage';
import HwCompletePage from '@/pages/onboarding/HwCompletePage';
import HwConnectPage from '@/pages/onboarding/HwConnectPage';
import NicknamePage from '@/pages/onboarding/NicknamePage';
import TermsPage from '@/pages/onboarding/TermsPage';
import TermsDetailPage from '@/pages/onboarding/TermsDetailPage';

import NotificationSettingPage from '@/pages/setting/NotificationSettingPage';
import ProfileEditPage from '@/pages/setting/ProfileEditPage';
import Setting from '@/pages/setting/Setting';

import ProtectedRoute from '@/routes/ProtectedRoute';
import PublicOnlyRoute from '@/routes/PublicOnlyRoute';
import TermsAgreedRoute from '@/routes/TermsAgreedRoute';

const NOT_FOUND_PATH = '*';

// 라우트를 JSX 가 아닌 객체 배열로도 들고 있는 이유: App 에서 현재 주소가
// 어떤 라우트에도 매칭되지 않는지(= 404) matchRoutes 로 판단해 하단 탭바를 숨기기 위해.
// 404 경로는 임의 문자열이라 pathname 비교로는 잡을 수 없다.
export const APP_ROUTES = createRoutesFromElements(
  <>
    <Route element={<PublicOnlyRoute />}>
      <Route path="/login" element={<Login />} />
    </Route>

    {/* 로그인(액세스 토큰) 없이는 아래 라우트에 접근할 수 없다. */}
    <Route element={<ProtectedRoute />}>
      <Route path="/onboarding/nickname" element={<NicknamePage />} />
      <Route path="/onboarding/disability" element={<DisabilityPage />} />
      <Route path="/onboarding/terms" element={<TermsPage />} />
      <Route
        path="/onboarding/terms/:agreementId"
        element={<TermsDetailPage />}
      />
      <Route path="/onboarding/hardware" element={<HwConnectPage />} />
      <Route
        path="/onboarding/hardware/complete"
        element={<HwCompletePage />}
      />

      <Route element={<TermsAgreedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/modes/new" element={<ModeCreatePage />} />
        <Route path="/modes/:modeId/settings" element={<ModeEditPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/communication" element={<Communication />} />
        <Route
          path="/communication/histories"
          element={<ConversationHistoryPage />}
        />
        <Route
          path="/communication/histories/:historyId"
          element={<ConversationHistoryDetailPage />}
        />
        <Route path="/live-sound" element={<LiveSound />} />
        <Route path="/setting" element={<Setting />} />
        <Route
          path="/setting/notification"
          element={<NotificationSettingPage />}
        />
        <Route path="/setting/profile/edit" element={<ProfileEditPage />} />
      </Route>
    </Route>

    {/* 위 어떤 라우트에도 걸리지 않는 주소. ProtectedRoute 바깥에 두어
          비로그인 상태에서도 로그인 페이지로 튕기지 않고 404 를 보여준다. */}
    <Route path={NOT_FOUND_PATH} element={<NotFound />} />
  </>,
);

export const isNotFoundPath = (pathname: string) => {
  const routeMatches = matchRoutes(APP_ROUTES, pathname);

  return (
    routeMatches?.some(({ route }) => route.path === NOT_FOUND_PATH) ?? true
  );
};
