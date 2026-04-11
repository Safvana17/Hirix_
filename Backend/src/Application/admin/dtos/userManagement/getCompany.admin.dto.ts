import { UserStatus } from "../../../../Domain/enums/userStatus.enum"

export interface AdminGetCompanyInputDTO {
     id: string
}

export interface AdminGetCompanyOutputDTO {
  id: string
  name?: string
  email: string;
  status: UserStatus;
  profileLogo?: string
  legalName?: string
  domain?: string
  website?: string
  teamSize?: number
  about?: string
  phoneNumber?: string
  streetName?: string
  country?: string
  state?: string
  city?: string
  pinCode?: string
  primaryContactName?: string
  primaryContactEmail?: string
  billingEmail?: string
  certificateType?: 'GST' | 'COI'
  certificateNumber?: string
  certificate?: string
}