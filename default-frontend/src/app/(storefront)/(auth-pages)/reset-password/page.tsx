import CommanBanner from '@/components/CommanBanner';
import CommonBanner2 from '@/components/CommonBanner2';
import ResetPassword from '@/components/ResetPassword';

export default function ResetPasswordPage() {
  return (
    <>
      <CommonBanner2 parentText="Forgot Password" currentText="Reset Password" mainText="Shop Standard"></CommonBanner2>
      <ResetPassword />
    </>
  );
}
