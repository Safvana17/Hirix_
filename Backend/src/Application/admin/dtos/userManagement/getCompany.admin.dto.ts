import { UserStatus } from "../../../../Domain/enums/userStatus.enum"
import { FileUpload } from "../../../../Shared/types/fileUpload.type"

export interface AdminGetCompanyInputDTO {
     id: string
}


export interface CompanyCertificateDTO {
    certificateType: 'GST' | 'COI'
    certificateNumber?: string
    certificateFile?: FileUpload
    certificateUrl?: string
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
  certificates: CompanyCertificateDTO[]
}