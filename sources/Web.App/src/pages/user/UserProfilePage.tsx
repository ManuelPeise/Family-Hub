import React from "react";
import type {
  UserProfileInitializationProps,
  UserProfileModel,
} from "src/pages/user/userProfile.types";
import { StatelessApiClient } from "src/lib/api/StatelessApi";
import { useComponentInitializationAsync } from "src/hooks/useComponentInitializationAsync";
import Form from "src/components/form/Form";
import { useFormModel } from "src/hooks/useFormModel";
import FormTextField from "src/components/form/FormTextField";
import { Box, Container } from "@mui/material";
import { useLocalization } from "src/hooks/useLocalization";
import FormDatePicker from "src/components/form/FormDatePicker";
import {
  Languages,
  type LanguageTypeEnum,
} from "src/lib/enums/LanguageTypeEnum";
import FormSelect from "src/components/form/FormSelect";
import Typography from "src/components/layout/Typography";
import SubmitButton from "src/components/form/SubmitButton";
import FormCancelButton from "src/components/form/FormCancelButton";
import type { Language } from "src/hooks/types/UseLocalisationResult";
import FormButton from "src/components/form/FormButton";
import { useLoadingState } from "src/hooks/useLoadingState";
import ChangePasswordDialog from "src/pages/user/components/ChangePasswordDialog";

const i18nLanguages: Record<LanguageTypeEnum, Language> = {
  [Languages.ENGLISH]: "en",
  [Languages.GERMAN]: "de",
};

const isLanguageType = (value: number): value is LanguageTypeEnum =>
  value in i18nLanguages;

const initializeAsync = async (): Promise<UserProfileInitializationProps> => {
  const userProfileApi = StatelessApiClient.create<
    UserProfileModel,
    UserProfileModel
  >({
    url: "userprofile/getuserprofile",
    params: {},
    isResponse: (value: unknown): value is UserProfileModel => value != null,
  });

  const handleUpdateProfile = async (
    updatedProfile: UserProfileModel,
  ): Promise<UserProfileModel> => {
    const response = await userProfileApi.sendPost({
      url: "userprofile/updateuserprofile",
      body: updatedProfile,
    });
    return response;
  };

  const [profileModel] = await Promise.all([userProfileApi.sendGet()]);

  return { profileModel, handleUpdateProfile };
};

const UserProfileContainer: React.FC = () => {
  const initialization = useComponentInitializationAsync(initializeAsync);

  if (!initialization.initialized || !initialization.model) {
    return null;
  }
  return <UserProfilePage {...initialization.model} />;
};

const UserProfilePage: React.FC<UserProfileInitializationProps> = (props) => {
  const { profileModel, handleUpdateProfile } = props;
  const { isLoading, handleIsLoadingChanged } = useLoadingState();
  const localization = useLocalization();
  const { selectLanguage } = localization;
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    React.useState(false);

  const { model, updateModel, resetModel, commitModel, isModified } =
    useFormModel(profileModel);

  const onSubmit = React.useCallback(async () => {
    handleIsLoadingChanged(true);
    try {
      const response = await handleUpdateProfile(model);

      commitModel(response);
    } finally {
      handleIsLoadingChanged(false);
    }
  }, [model, handleUpdateProfile, commitModel, handleIsLoadingChanged]);

  const handleChangeLanguage = React.useCallback(
    (value: number) => {
      if (isLanguageType(value)) {
        updateModel({ language: value });
      }
    },
    [updateModel],
  );

  const handleOpenChangePasswordDialog = React.useCallback(() => {
    setChangePasswordDialogOpen(true);
  }, []);

  const handleCloseChangePasswordDialog = React.useCallback(() => {
    setChangePasswordDialogOpen(false);
  }, []);

  React.useEffect(() => {
    selectLanguage(i18nLanguages[model.language]);
  }, [model.language, selectLanguage]);

  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box sx={{ marginBottom: 12 }}>
        <Typography variant="h4">
          {localization.getResource("common:captionProfile")}
        </Typography>
      </Box>
      <Form onSubmit={onSubmit}>
        <FormTextField
          label={localization.getResource("common:labelFirstName")}
          value={model.firstName ?? ""}
          onChange={(value) => {
            updateModel({ firstName: value });
          }}
        />
        <FormTextField
          label={localization.getResource("common:labelLastName")}
          value={model.lastName ?? ""}
          onChange={(value) => {
            updateModel({ lastName: value });
          }}
        />
        <FormTextField
          label={localization.getResource("common:labelUsername")}
          value={model.userName}
          disabled={true}
          onChange={(value) => {
            updateModel({ userName: value });
          }}
        />
        <FormTextField
          label={localization.getResource("common:labelEmail")}
          value={model.email}
          disabled={true}
          onChange={(value) => {
            updateModel({ email: value });
          }}
        />
        <FormDatePicker
          label={localization.getResource("common:labelDateOfBirth")}
          value={model.dateOfBirth.toString()}
          onChange={(value) => {
            updateModel({
              dateOfBirth: new Date(value ?? model.dateOfBirth.toString()),
            });
          }}
        />
        <FormSelect
          label={localization.getResource("common:labelLanguage")}
          value={model.language}
          options={[
            {
              label: localization.getResource("common:labelEnglish"),
              value: 0,
            },
            {
              label: localization.getResource("common:labelGerman"),
              value: 1,
            },
          ]}
          onChange={handleChangeLanguage}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <FormButton
            label={localization.getResource("common:labelChangePassword")}
            size="small"
            onClick={handleOpenChangePasswordDialog}
            disabled={isModified}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 6,
            gap: 2,
            pt: 4,
          }}
        >
          <FormCancelButton
            onClick={resetModel}
            size="small"
            label={localization.getResource("common:labelCancel")}
            disabled={!isModified}
          />
          <SubmitButton
            label={localization.getResource("common:labelSave")}
            size="small"
            disabled={!isModified}
            loadingLabel={localization.getResource("common:labelLoading")}
            loading={isLoading}
          />
        </Box>
      </Form>
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onClose={handleCloseChangePasswordDialog}
      />
    </Container>
  );
};

export default UserProfileContainer;
