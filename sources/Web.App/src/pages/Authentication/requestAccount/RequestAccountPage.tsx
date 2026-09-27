import React from "react";
import backgroundImage from "src/assets/schottland.jpg";
import AuthLayout from "src/components/layout/AuthLayout";
import Link from "src/components/layout/Link";
import Typography from "src/components/layout/Typography";
import RequestAccountForm from "src/pages/Authentication/requestAccount/RequestAccountForm";
import { useLocalization } from "src/hooks/useLocalization";

const RequestAccountPage: React.FC = () => {
  const { getResource } = useLocalization();

  return (
    <AuthLayout
      backgroundImage={backgroundImage}
      title={getResource("auth:titleRegister")}
      intro={getResource("auth:introRegister")}
      backLabel={getResource("auth:labelBackToStart")}
      backTo="/"
      footer={
        <Typography>
          {getResource("auth:textHasAccount")}{" "}
          <Link to="/login">{getResource("auth:linkLogin")}</Link>
        </Typography>
      }
    >
      <RequestAccountForm />
    </AuthLayout>
  );
};

export default RequestAccountPage;
