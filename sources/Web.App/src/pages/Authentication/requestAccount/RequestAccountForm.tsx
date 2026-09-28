import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "src/components/form/Form";
import FormDatePicker from "src/components/form/FormDatePicker";
import FormTextField from "src/components/form/FormTextField";
import SubmitButton from "src/components/form/SubmitButton";
import useAuthenticationState from "src/hooks/useAuthenticationState";
import { useFormModel } from "src/hooks/useFormModel";
import { useLoadingState } from "src/hooks/useLoadingState";
import { useLocalization } from "src/hooks/useLocalization";
import type { RequestAccountModel } from "src/pages/Authentication/requestAccount/types/RequestAccountModel";

const initialModel: RequestAccountModel = {
  familyName: "",
  contactMailAddress: "",
  mainMemberFirstName: "",
  mainMemberLastName: "",
  mainMemberUserName: "",
  mainMemberEmail: "",
  mainMemberDateOfBirth: new Date(),
};

const RequestAccountForm: React.FC = () => {
  const { getResource } = useLocalization();
  const { handleIsLoadingChanged } = useLoadingState();
  const authenticationState = useAuthenticationState();

  const navigate = useNavigate();
  const { model, isModified, isValid, updateModel, resetModel } =
    useFormModel<RequestAccountModel>(initialModel);

  const handleSubmit = React.useCallback(async (): Promise<void> => {
    try {
      handleIsLoadingChanged(true);

      await authenticationState.handleRequestAccount(model);
      resetModel();
      await navigate("/", { replace: true });
    } finally {
      handleIsLoadingChanged(false);
    }
    await authenticationState.handleRequestAccount(model);
  }, [
    authenticationState,
    model,
    resetModel,
    handleIsLoadingChanged,
    navigate,
  ]);

  return (
    <Form onSubmit={handleSubmit}>
      <FormTextField
        label={getResource("common:labelFamilyName")}
        value={model.familyName}
        type="text"
        onChange={(value) => {
          updateModel({ familyName: value });
        }}
      />
      <FormTextField
        label={getResource("common:labelEmail")}
        value={model.contactMailAddress}
        type="email"
        onChange={(value) => {
          updateModel({ contactMailAddress: value });
        }}
      />
      <FormTextField
        label={getResource("common:labelFirstName")}
        value={model.mainMemberFirstName}
        onChange={(value) => {
          updateModel({ mainMemberFirstName: value });
        }}
      />
      <FormTextField
        label={getResource("common:labelLastName")}
        value={model.mainMemberLastName}
        type="text"
        onChange={(value) => {
          updateModel({ mainMemberLastName: value });
        }}
      />

      <FormTextField
        label={getResource("common:labelUsername")}
        value={model.mainMemberUserName}
        type="text"
        onChange={(value) => {
          updateModel({ mainMemberUserName: value });
        }}
      />
      <FormTextField
        label={getResource("common:labelEmail")}
        value={model.mainMemberEmail}
        type="email"
        onChange={(value) => {
          updateModel({ mainMemberEmail: value });
        }}
      />
      <FormDatePicker
        label={getResource("common:labelDateOfBirth")}
        value={model.mainMemberDateOfBirth?.toISOString() ?? null}
        onChange={(value) => {
          updateModel({
            mainMemberDateOfBirth: !value ? null : new Date(value),
          });
        }}
      />

      <SubmitButton
        label={getResource("common:labelRequestAccess")}

        disabled={!isValid || !isModified}
      />
    </Form>
  );
};

export default RequestAccountForm;
