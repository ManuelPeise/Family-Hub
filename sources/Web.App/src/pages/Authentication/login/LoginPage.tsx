import React from "react";
import backgroundImage from "src/assets/schottland.jpg";
import AuthLayout from "src/components/layout/AuthLayout";
import Link from "src/components/layout/Link";
import Typography from "src/components/labels/Typography";
import LoginForm from "src/pages/Authentication/login/LoginForm";
import { useLocalization } from "src/hooks/useLocalization";

const LoginPage: React.FC = () => {
  const { getResource } = useLocalization();

  return (
    <AuthLayout
      backgroundImage={backgroundImage}
      title={getResource("common:captionLogin")}
      backLabel={getResource("common:labelBackToStart")}
      backTo="/"
      footer={
        <Typography>
          {getResource("common:labelNoAccount")}{" "}
          <Link to="/register">{getResource("common:labelRegister")}</Link>
        </Typography>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
