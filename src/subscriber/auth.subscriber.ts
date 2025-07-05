import { sendMail } from "../utils/sendMail";

interface SignUpData {
  email: string;
  name: string;
  code: string;
}

interface ForgetPasswordData {
  email: string;
  name: string;
  code: string;
  link: string;
}

export const signUpSubscriber = async (data: SignUpData): Promise<void> => {
  await sendMail({
    email: data?.email,
    subject: "Email verification",
    template: "emailVerification.mails",
    data: {
      user: data.name,
      code: data?.code,
    },
  });
};

export const forgetPasswordSubscriber = async (
  data: ForgetPasswordData
): Promise<void> => {
  await sendMail({
    email: data?.email,
    subject: "Password reset code",
    template: "passwordReset.mails",
    data: {
      user: data.name,
      code: data.code,
      link: data.link,
    },
  });
};
