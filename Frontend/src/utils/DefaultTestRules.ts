import type { TestRules } from "../types/test";

export const createDefaultTestRules = (): TestRules => ({
  timing: {
    durationInMinutes: 60,
    autoSubmissionOnTimeEnds: true,
    warningBeforeEndInMinutes: 5,
  },
  navigation: {
    allowTabSwitch: false,
    maxTabSwitchCount: 3,
    autoSubmissionOnTabViolation: true,
    shuffleQuestion: false,
    shuffleOptions: false,
    allowBackNavigation: true,
  },
  proctoring: {
    enableCamera: false,
    captureSnapShots: false,
    snapShotIntervalSeconds: 30,
    detectNoFace: false,
    detectMultipleFace: false,
    maxWarningsAllowed: 3,
    autoSubmissionOnMaxWarnings: true,
  },
  behavior: {
    enforceFullScreen: false,
    autoSubmissionFullScreenExit: true,
    allowCopyPaste: false,
    allowRightClick: false,
    allowKeyboardShortcuts: false,
  },
  autoSave: {
    enabled: true,
    intervalInSeconds: 30,
    saveOnEveryAnswer: true,
  },
})