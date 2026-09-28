import type { LanguageTypeEnum } from "src/lib/enums/LanguageTypeEnum";

export type UserProfileModel = {
  id: number;
  firstName?: string;
  lastName?: string;
  userName: string;
  email: string;
  dateOfBirth: Date;
  language: LanguageTypeEnum;
};

export type UserProfileInitializationProps = {
  profileModel: UserProfileModel;
  handleUpdateProfile: (
    updatedProfile: UserProfileModel,
  ) => Promise<UserProfileModel>;
};
