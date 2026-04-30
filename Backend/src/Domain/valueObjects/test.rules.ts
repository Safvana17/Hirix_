export class TimingRules {
    constructor(
        public durationInMinutes: number,
        public autoSubmitOnTimeEnd: boolean,
        public warningBeforeEndInMinutes: number
    ){}
}

export class NavigationRules {
    constructor(
        public allowTabSwitch: boolean,
        public maxTabSwitchCount: number,
        public autoSubmitOnTabViolation: boolean,
        public shuffleQuestion: boolean,
        public shuffleOptions: boolean,
        public allowBackNavigation: boolean
    ) {}
}

export class ProctoringRules {
    constructor (
        public enableCamera: boolean,
        public captureSnapshots: boolean,
        public snapshotIntervalSeconds: number,
        public detectNoFace: boolean,
        public detectMultipleFaces: boolean,
        public maxWarningsAllowed: number,
        public autoSubmitOnMaxWarnings: boolean
    ) {}
}

export class BehaviorRules {
    constructor (
        public enforceFullScreen: boolean,
        public autoSubmitOnFullScreenExit: boolean,
        public allowCopyPaste: boolean,
        public allowRightClick: boolean,
        public allowKeyboardShortcuts: boolean
    ) {}
}

export class autoSaveRules {
    constructor (
        public enabled: boolean,
        public intervalInSeconds: number,
        public saveOnEveryAnswer: boolean
    ) {}
}

export class TestRules {
    constructor (
        public timing: TimingRules,
        public navigation: NavigationRules,
        public proctoring: ProctoringRules,
        public behavior: BehaviorRules,
        public autoSave: autoSaveRules
    ) {}
}

