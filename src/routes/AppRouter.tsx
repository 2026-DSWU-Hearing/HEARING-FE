import { Outlet, Route, Routes } from 'react-router-dom';

import Communication from '@/pages/communication/Communication';
import Home from '@/pages/home/Home';
import ModeCreatePage from '@/pages/home/ModeCreatePage';
import ModeEditPage from '@/pages/home/ModeEditPage';
import NotificationPage from '@/pages/home/NotificationPage';
import LiveSound from '@/pages/liveSound/LiveSound';
import NotificationSettingPage from '@/pages/setting/NotificationSettingPage';
import ProfileEditPage from '@/pages/setting/ProfileEditPage';
import Setting from '@/pages/setting/Setting';

import Login from '@/pages/login/Login';
import DisabilityPage from '@/pages/onboarding/DisabilityPage';
import HwCompletePage from '@/pages/onboarding/HwCompletePage';
import HwConnectPage from '@/pages/onboarding/HwConnectPage';
import HwConnectingPage from '@/pages/onboarding/HwConnectingPage';
import NicknamePage from '@/pages/onboarding/NicknamePage';
import TermsPage from '@/pages/onboarding/TermsPage';
import OnboardingFormProvider from '@/pages/onboarding/components/OnboardingFormProvider';

const OnboardingProviderLayout = () => {
  return (
    <OnboardingFormProvider>
      <Outlet />
    </OnboardingFormProvider>
  );
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route path="/onboarding" element={<OnboardingProviderLayout />}>
        <Route path="nickname" element={<NicknamePage />} />
        <Route path="disability" element={<DisabilityPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="hardware" element={<HwConnectPage />} />
        <Route path="hardware/connecting" element={<HwConnectingPage />} />
        <Route path="hardware/complete" element={<HwCompletePage />} />
      </Route>

      <Route path="/modes/new" element={<ModeCreatePage />} />
      <Route path="/modes/:modeId/settings" element={<ModeEditPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/communication" element={<Communication />} />
      <Route path="/live-sound" element={<LiveSound />} />
      <Route path="/setting" element={<Setting />} />
      <Route
        path="/setting/notification"
        element={<NotificationSettingPage />}
      />
      <Route path="/setting/profile/edit" element={<ProfileEditPage />} />
    </Routes>
  );
};

export default AppRouter;
