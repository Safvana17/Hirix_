import { Types } from "mongoose";
import { TestEntity } from "../../Domain/entities/Test.entity";
import { ITest } from "../../Infrastructure/database/Model/Test";
import { autoSaveRules, BehaviorRules, NavigationRules, ProctoringRules, TestRules, TimingRules } from "../../Domain/valueObjects/test.rules";
import { TestQuestionEntity } from "../../Domain/entities/TestQuestion.entity";

export class TestMapper {
    static toEntity(doc: ITest): TestEntity {

        const rules = new TestRules(
            new TimingRules(
                doc.rules.timing.durationInMinutes,
                doc.rules.timing.autoSubmitOnTimeEnd,
                doc.rules.timing.warningBeforeEndInMinutes
            ),
            new NavigationRules(
                doc.rules.navigation.allowTabSwitch,
                doc.rules.navigation.maxTabSwitchCount,
                doc.rules.navigation.autoSubmitOnTabViolation,
                doc.rules.navigation.shuffleQuestion,
                doc.rules.navigation.shuffleOptions,
                doc.rules.navigation.allowBackNavigation
            ),
            new ProctoringRules(
                doc.rules.proctoring.enableCamera,
                doc.rules.proctoring.captureSnapshots,
                doc.rules.proctoring.snapshotIntervalSeconds,
                doc.rules.proctoring.detectNoFace,
                doc.rules.proctoring.detectMultipleFaces,
                doc.rules.proctoring.maxWarningsAllowed,
                doc.rules.proctoring.autoSubmitOnMaxWarnings
            ),
            new BehaviorRules(
                doc.rules.behavior.enforceFullScreen,
                doc.rules.behavior.autoSubmitOnFullScreenExit,
                doc.rules.behavior.allowCopyPaste,
                doc.rules.behavior.allowRightClick,
                doc.rules.behavior.allowKeyboardShortcuts
            ),
            new autoSaveRules(
                doc.rules.autoSave.enabled,
                doc.rules.autoSave.intervalInSeconds,
                doc.rules.autoSave.saveOnEveryAnswer
            )
        )
        const questions = doc.questions.map((q) => 
            new TestQuestionEntity (
               q._id.toString(),
               q.source,
               q.type,
               q.title,
               q.order,
               q.mark,
               q.questionId ? q.questionId.toString() : undefined,
               q.description,
               q.options,
               q.answer,
               q.testCase?.map(tc => {
                try {
                    return JSON.parse(tc)
                } catch {
                    return tc
                }
            }),
            )
        )
        const test = new TestEntity(
            doc._id.toString(),
            doc.name,
            doc.companyId.toString(),
            doc.jobRoleId.toString(),
            doc.description,
            doc.startTime,
            doc.endTime,
            rules,
            questions,
            doc.testStatus
        )

        return test
    }

    static toPersistence(entity: TestEntity){
        return {
            name: entity.name,
            companyId: new Types.ObjectId(entity.companyId),
            jobRoleId: new Types.ObjectId(entity.jobRoleId),
            description: entity.description,
            startTime: entity.startTime,
            endTime: entity.endTime,
            testStatus: entity.testStatus,
            rules: {
                timing: {
                    durationInMinutes: entity.rules.timing.durationInMinutes,
                    autoSubmitOnTimeEnd: entity.rules.timing.autoSubmitOnTimeEnd,
                    warningBeforeEndInMinutes: entity.rules.timing.warningBeforeEndInMinutes
                },
                navigation: {
                    allowTabSwitch: entity.rules.navigation.allowTabSwitch,
                    maxTabSwitchCount: entity.rules.navigation.maxTabSwitchCount,
                    autoSubmitOnTabViolation: entity.rules.navigation.autoSubmitOnTabViolation,
                    shuffleQuestion: entity.rules.navigation.shuffleQuestion,
                    shuffleOptions: entity.rules.navigation.shuffleOptions,
                    allowBackNavigation: entity.rules.navigation.allowBackNavigation
                },
                proctoring: {
                    enableCamera: entity.rules.proctoring.enableCamera,
                    captureSnapshots: entity.rules.proctoring.captureSnapshots,
                    snapshotIntervalSeconds: entity.rules.proctoring.snapshotIntervalSeconds,
                    detectNoFace: entity.rules.proctoring.detectNoFace,
                    detectMultipleFaces: entity.rules.proctoring.detectMultipleFaces,
                    maxWarningsAllowed: entity.rules.proctoring.maxWarningsAllowed,
                    autoSubmitOnMaxWarnings: entity.rules.proctoring.autoSubmitOnMaxWarnings,
                },
                behavior: {
                    enforceFullScreen: entity.rules.behavior.enforceFullScreen,
                    autoSubmitOnFullScreenExit: entity.rules.behavior.autoSubmitOnFullScreenExit,
                    allowCopyPaste: entity.rules.behavior.allowCopyPaste,
                    allowRightClick: entity.rules.behavior.allowRightClick,
                    allowKeyboardShortcuts: entity.rules.behavior.allowKeyboardShortcuts
                },
                autoSave: {
                    enabled: entity.rules.autoSave.enabled,
                    intervalInSeconds: entity.rules.autoSave.intervalInSeconds,
                    saveOnEveryAnswer: entity.rules.autoSave.saveOnEveryAnswer
                }
            },
            questions: entity.questions.map(q => ({
                _id: q.id && Types.ObjectId.isValid(q.id)
                ? new Types.ObjectId(q.id)
                : new Types.ObjectId(),
                source: q.source,
                type: q.type,
                title: q.title,
                order: q.order,
                mark: q.mark,
                questionId: q.questionId ? new Types.ObjectId(q.questionId) : undefined,
                description: q.description,
                options: q.options,
                answer: q.answer,
                testCase: q.testCase?.map(tc => 
                  JSON.stringify(tc)
                ),
            }))
        }
    }
}