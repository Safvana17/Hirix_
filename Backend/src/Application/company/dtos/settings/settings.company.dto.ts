import CompanyEntity from "../../../../Domain/entities/company.entity"

export interface UpdateCompanyProfileInputDTO {
  id: string
  name?: string
  profileLogo?: string
  legalName?: string
  domain?: string
  website?: string
  teamSize: number
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
}

export interface UpdateCompanyProfileOutputDTO {
    company: CompanyEntity
}


export interface CompanyChangePasswordInputDTO {
    id: string
    oldPassword: string
    newPassword: string
}