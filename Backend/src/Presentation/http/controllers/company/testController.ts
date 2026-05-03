import { Request, Response } from "express";
import { ICompanyCreateTestDraftUsecase } from "../../../../Application/company/interfaces/test/ICompany.createTestDraft.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICompanyGetQuestionsForTest } from "../../../../Application/company/interfaces/test/ICompany.getQuestionsForTest.usecase";
import { GetAllTestQuery, GetQuestionsForTestQuery, testParams } from "../../validators/companyTest.validator";
import { ICompanyGetAllTestUsecase } from "../../../../Application/company/interfaces/test/ICompany.getAllTest.usecase";
import { ICompanyPublishTestUsecase } from "../../../../Application/company/interfaces/test/ICompany.publishTest.usecase";
import { ICompanyDeleteTestUsecase } from "../../../../Application/company/interfaces/test/ICompany.deleteTest.usecase";
import { ICompanyCancelTestUsecase } from "../../../../Application/company/interfaces/test/ICompany.cancelTest.usecase";
import { ICompanyResheduleTestUsecase } from "../../../../Application/company/interfaces/test/ICompany.resheduleTest.usecase";

export class CompanyTestController {
    constructor(
        private _createTestUsecase: ICompanyCreateTestDraftUsecase,
        private _publishTestUsecase: ICompanyPublishTestUsecase,
        private _getAllQuestionsForTest: ICompanyGetQuestionsForTest,
        private _getAllTests: ICompanyGetAllTestUsecase,
        private _deleteTest: ICompanyDeleteTestUsecase,
        private _cancelTest: ICompanyCancelTestUsecase,
        private _resheduleTest: ICompanyResheduleTestUsecase,
    ) {}

    createTestDraft = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const { test } = await this._createTestUsecase.execute({...req.body, companyId})
        return sendSuccess(res, statusCode.OK, '', test)
    })

    publishTest = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const { testId } = req.validatedParams as testParams
        const { test } = await this._publishTestUsecase.execute({companyId, testId})
        return sendSuccess(res, statusCode.OK, '' , { test })
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

    deleteTest = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const {testId} = req.validatedParams as testParams
        const test = await this._deleteTest.execute({companyId, testId})
        return sendSuccess(res, statusCode.OK, '', test)
    })

    cancelTest = asyncHandler( async (req: Request, res: Response) => {
        const companyId = req.user.id
        const { testId } = req.validatedParams as testParams
        await this._cancelTest.execute({companyId, testId, reason: req.body.eason})
        return sendSuccess(res, statusCode.OK, '')
    })

    resheduleTest = asyncHandler(async (req: Request, res: Response) => {
        const companyId = req.user.id
        const { testId } = req.validatedParams as testParams
        await this._resheduleTest.execute({companyId, testId, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })
}