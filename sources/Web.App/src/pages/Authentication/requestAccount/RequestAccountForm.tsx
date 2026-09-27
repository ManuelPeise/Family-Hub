import React from "react";
import Form from "src/components/form/Form";
import FormDatePicker from "src/components/form/FormDatePicker";
import FormTextField from "src/components/form/FormTextField";
import SubmitButton from "src/components/form/SubmitButton";
import useAuthenticationState from "src/hooks/useAuthenticationState";
import { useFormModel } from "src/hooks/useFormModel";
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
  const authenticationState = useAuthenticationState();
  const { model, isModified, isValid, updateModel } =
    useFormModel<RequestAccountModel>(initialModel);

  const handleSubmit = React.useCallback(async (): Promise<void> => {
    await authenticationState.handleRequestAccount(model);
  }, [authenticationState, model]);

  return (
    <Form onSubmit={handleSubmit}>
      <FormTextField
        label={getResource("auth:labelFamilyName")}
        value={model.familyName}
        type="text"
        onChange={(value) => {
          updateModel({ familyName: value });
        }}
      />
      <FormTextField
        label={getResource("auth:labelEmail")}
        value={model.contactMailAddress}
        type="email"
        onChange={(value) => {
          updateModel({ contactMailAddress: value });
        }}
      />
      <FormTextField
        label={getResource("auth:labelFirstName")}
        value={model.mainMemberFirstName}
        onChange={(value) => {
          updateModel({ mainMemberFirstName: value });
        }}
      />
      <FormTextField
        label={getResource("auth:labelLastName")}
        value={model.mainMemberLastName}
        type="text"
        onChange={(value) => {
          updateModel({ mainMemberLastName: value });
        }}
      />

      <FormTextField
        label={getResource("auth:labelUserName")}
        value={model.mainMemberUserName}
        type="text"
        onChange={(value) => {
          updateModel({ mainMemberUserName: value });
        }}
      />
      <FormTextField
        label={getResource("auth:labelEmail")}
        value={model.mainMemberEmail}
        type="email"
        onChange={(value) => {
          updateModel({ mainMemberEmail: value });
        }}
      />
      <FormDatePicker
        label={getResource("auth:labelDateOfBirth")}
        value={model.mainMemberDateOfBirth?.toISOString() ?? null}
        onChange={(value) => {
          updateModel({
            mainMemberDateOfBirth: !value ? null : new Date(value),
          });
        }}
      />

      <SubmitButton
        label={getResource("auth:buttonRegister")}
        loadingLabel={getResource("auth:buttonRegisterLoading")}
        loading={isModified && !isValid}
      />
    </Form>
  );
};

export default RequestAccountForm;
