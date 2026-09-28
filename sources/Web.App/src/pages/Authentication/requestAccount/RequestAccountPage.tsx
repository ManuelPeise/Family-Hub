import React from "react";
import backgroundImage from "src/assets/schottland.jpg";
import AuthLayout from "src/components/layout/AuthLayout";
import Link from "src/components/layout/Link";
import Typography from "src/components/labels/Typography";
import RequestAccountForm from "src/pages/Authentication/requestAccount/RequestAccountForm";
import { useLocalization } from "src/hooks/useLocalization";

const RequestAccountPage: React.FC = () => {
  const { getResource } = useLocalization();

  return (
    <AuthLayout
      backgroundImage={backgroundImage}
      title={getResource("common:captionRequestAccess")}
      intro={getResource("common:labelRequestAccessToFamilyHub")}
      backLabel={getResource("common:labelBackToStart")}
      backTo="/"
      footer={
        <Typography>
          {getResource("common:labelHasAccount")}{" "}
          <Link to="/login">{getResource("common:labelLogin")}</Link>
        </Typography>
      }
    >
      <RequestAccountForm />
    </AuthLayout>
  );
};

export default RequestAccountPage;
