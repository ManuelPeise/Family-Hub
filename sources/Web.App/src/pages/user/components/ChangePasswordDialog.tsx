import React from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import type { UserCredentialsUpdateModel } from "src/pages/user/models/UserCredentialsUpdateModel";
import { useFormModel } from "src/hooks/useFormModel";
import Form from "src/components/form/Form";
import FormTextField from "src/components/form/FormTextField";
import FormCancelButton from "src/components/form/FormCancelButton";
import SubmitButton from "src/components/form/SubmitButton";
import { useLocalization } from "src/hooks/useLocalization";
import { useLoadingState } from "src/hooks/useLoadingState";
import { StatelessApiClient } from "src/lib/api/StatelessApi";
import Typography from "src/components/labels/Typography";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialModel: UserCredentialsUpdateModel = {
  currentPassword: "",
  newPassword: "",
  newPasswordReplication: "",
};

const validateChangePasswordModel = (
  model: UserCredentialsUpdateModel,
): boolean => {
  return (
    model.currentPassword !== "" &&
    model.newPassword !== "" &&
    model.newPassword === model.newPasswordReplication
  );
};

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = (props) => {
  const { open, onClose } = props;
  const { getResource } = useLocalization();
  const { handleIsLoadingChanged } = useLoadingState();
  const [error, setError] = React.useState<string | null>(null);

  const { model, updateModel, isModified, isValid, resetModel } =
    useFormModel<UserCredentialsUpdateModel>(
      initialModel,
      validateChangePasswordModel,
    );

  const changePasswordApi = StatelessApiClient.create<
    UserCredentialsUpdateModel,
    boolean
  >({
    url: "userprofile/updatecredentials",
    params: {},
    isResponse: (value: unknown): value is boolean => value === true,
  });

  const handleCancel = React.useCallback(() => {
    resetModel();
    onClose();
  }, [resetModel, onClose]);

  const handleSubmit = React.useCallback(async () => {
    // Implement the submit logic here
    handleIsLoadingChanged(true);
    setError(null);
    try {
      const response = await changePasswordApi.sendPost({
        url: "userprofile/updatecredentials",
        body: model,
      });

      if (!response) {
        setError(getResource("common:labelChangePasswordError"));
      }
    } finally {
      handleIsLoadingChanged(false);
      resetModel();
      onClose();
    }
  }, [
    handleIsLoadingChanged,
    changePasswordApi,
    model,
    getResource,
    resetModel,
    onClose,
  ]);

  const handleChangeValue = React.useCallback(
    (field: keyof UserCredentialsUpdateModel, value: string) => {
      updateModel({ [field]: value });
    },
    [updateModel],
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl">
      <DialogTitle>{getResource("common:captionChangePassword")}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            pt: 2,
          }}
        >
          <Form onSubmit={handleSubmit}>
            <FormTextField
              type="password"
              label={getResource("common:labelCurrentPassword")}
              value={model.currentPassword}
              onChange={(value) => {
                handleChangeValue("currentPassword", value);
              }}
            />
            <FormTextField
              type="password"
              label={getResource("common:labelNewPassword")}
              value={model.newPassword}
              onChange={(value) => {
                handleChangeValue("newPassword", value);
              }}
            />
            <FormTextField
              type="password"
              label={getResource("common:labelConfirmNewPassword")}
              value={model.newPasswordReplication}
              onChange={(value) => {
                handleChangeValue("newPasswordReplication", value);
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              {error && (
                <Typography color="text.secondary" variant="body2">
                  {error}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <FormCancelButton
                label={getResource("common:labelCancel")}
                size="small"
                disabled={false}
                onClick={handleCancel}
              />
              <SubmitButton
                label={getResource("common:labelChange")}
                size="small"
                disabled={!isModified || !isValid}
              />
            </Box>
          </Form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
