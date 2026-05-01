import { Request, Response } from "express";
import { ICompanyCreateTestUsecase } from "../../../../Application/company/interfaces/test/ICompany.createTest.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICompanyGetQuestionsForTest } from "../../../../Application/company/interfaces/test/ICompany.getQuestionsForTest.usecase";
import { GetAllTestQuery, GetQuestionsForTestQuery } from "../../validators/companyTest.validator";
import { ICompanyGetAllTestUsecase } from "../../../../Application/company/interfaces/test/ICompany.getAllTest.usecase";

export class CompanyTestController {
    constructor(
        private _createTestUsecase: ICompanyCreateTestUsecase,
        private _getAllQuestionsForTest: ICompanyGetQuestionsForTest,
        private _getAllTests: ICompanyGetAllTestUsecase,
    ) {}

    createTest = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const { test }= await this._createTestUsecase.execute({...req.body, companyId})
        return sendSuccess(res, statusCode.OK, '', test)
    })

    getAllQuestionsForTest = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const query = req.validatedQuery as GetQuestionsForTestQuery
        const { questions } = await this._getAllQuestionsForTest.execute({...query,companyId})
        return sendSuccess(res, statusCode.OK, '', questions)
    })

    getAllTests = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const query = req.validatedQuery as GetAllTestQuery
        const { tests, totalPages, totalCount } = await this._getAllTests.execute({...query, companyId})
        return sendSuccess(res, statusCode.OK, '', {tests, totalPages, totalCount})
    })
}