import { Types } from "mongoose";
import { TestEntity } from "../../Domain/entities/Test.entity";
import { ITest } from "../../Infrastructure/database/Model/Test";
import { AutoSaveRules, BehaviorRules, NavigationRules, ProctoringRules, TestRules, TimingRules, WarningRules } from "../../Domain/valueObjects/test.rules";
import { TestQuestionEntity } from "../../Domain/entities/TestQuestion.entity";

export class TestMapper {
    static toEntity(doc: ITest): TestEntity {

        const rules = new TestRules(
            new TimingRules(
                doc.rules.timing.autoSubmitOnTimeEnd,
                doc.rules.timing.warningBeforeEndInMinutes
            ),
            new NavigationRules(
                doc.rules.navigation.allowTabSwitch,
                doc.rules.navigation.shuffleQuestions,
                doc.rules.navigation.shuffleOptions,
                doc.rules.navigation.allowBackNavigation
            ),
            new ProctoringRules(
                doc.rules.proctoring.enableCamera,
                doc.rules.proctoring.captureSnapshots,
                doc.rules.proctoring.snapshotIntervalSeconds,
                doc.rules.proctoring.detectNoFace,
                doc.rules.proctoring.detectMultipleFaces,
            ),
            new BehaviorRules(
                doc.rules.behavior.enforceFullScreen,
                doc.rules.behavior.allowCopyPaste,
                doc.rules.behavior.allowRightClick,
                doc.rules.behavior.allowKeyboardShortcuts
            ),
            new AutoSaveRules(
                doc.rules.autoSave.enabled,
                doc.rules.autoSave.intervalInSeconds,
                doc.rules.autoSave.saveOnEveryAnswer
            ),
            new WarningRules(
                doc.rules.warning.maxWarningCount,
                doc.rules.warning.autoSubmitOnMaxWarnings
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
            doc.testStatus,
            doc.isDeleted
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
            isDeleted: entity.isDeleted,
            rules: {
                timing: {
                    autoSubmitOnTimeEnd: entity.rules.timing.autoSubmitOnTimeEnd,
                    warningBeforeEndInMinutes: entity.rules.timing.warningBeforeEndInMinutes
                },
                navigation: {
                    allowTabSwitch: entity.rules.navigation.allowTabSwitch,
                    shuffleQuestions: entity.rules.navigation.shuffleQuestions,
                    shuffleOptions: entity.rules.navigation.shuffleOptions,
                    allowBackNavigation: entity.rules.navigation.allowBackNavigation
                },
                proctoring: {
                    enableCamera: entity.rules.proctoring.enableCamera,
                    captureSnapshots: entity.rules.proctoring.captureSnapshots,
                    snapshotIntervalSeconds: entity.rules.proctoring.snapshotIntervalSeconds,
                    detectNoFace: entity.rules.proctoring.detectNoFace,
                    detectMultipleFaces: entity.rules.proctoring.detectMultipleFaces,
                },
                behavior: {
                    enforceFullScreen: entity.rules.behavior.enforceFullScreen,
                    allowCopyPaste: entity.rules.behavior.allowCopyPaste,
                    allowRightClick: entity.rules.behavior.allowRightClick,
                    allowKeyboardShortcuts: entity.rules.behavior.allowKeyboardShortcuts
                },
                autoSave: {
                    enabled: entity.rules.autoSave.enabled,
                    intervalInSeconds: entity.rules.autoSave.intervalInSeconds,
                    saveOnEveryAnswer: entity.rules.autoSave.saveOnEveryAnswer
                },
                warning: {
                    maxWarningCount: entity.rules.warning.maxWarningCount,
                    autoSubmitOnMaxWarnings: entity.rules.warning.autoSubmitOnMaxWarnings
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