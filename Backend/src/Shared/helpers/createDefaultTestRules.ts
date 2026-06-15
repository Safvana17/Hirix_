import { TestRules } from "../../Domain/valueObjects/test.rules";


export const createDefaultTestRules = (): TestRules => ({
  timing: {
    autoSubmitOnTimeEnd: true,
    warningBeforeEndInMinutes: 5,
  },
  navigation: {
    allowTabSwitch: false,
    shuffleQuestions: false,
    shuffleOptions: false,
    allowBackNavigation: true,
  },
  proctoring: {
    enableCamera: false,
    movementDetection: false,
    captureSnapshots: false,
    snapshotIntervalSeconds: 30,
    // detectNoFace: false,
    // detectMultipleFaces: false,
  },
  behavior: {
    enforceFullScreen: false,
    allowCopyPaste: false,
    allowRightClick: false,
    allowKeyboardShortcuts: false,
  },
  autoSave: {
    enabled: true,
    intervalInSeconds: 30,
    saveOnEveryAnswer: true,
  },
  warning: {
    maxWarningCount: 0,
    autoSubmitOnMaxWarnings: true
  }
})