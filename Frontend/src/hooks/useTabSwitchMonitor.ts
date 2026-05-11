// import { useEffect, useRef, useState } from "react";

// export function useTabSwitchMonitor({
//   allowTabSwitch,
//   onViolation,
// }: {
//   allowTabSwitch: boolean;
//   onViolation: (count: number) => void;
// }) {
//   const [tabSwitchCount, setTabSwitchCount] = useState(0);

//   const alreadyCountedForThisLeaveRef = useRef(false);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         if (alreadyCountedForThisLeaveRef.current) return;

//         alreadyCountedForThisLeaveRef.current = true;

//         if (!allowTabSwitch) {
//           setTabSwitchCount((prev) => {
//             const nextCount = prev + 1;
//             onViolation(nextCount);
//             return nextCount;
//           });
//         }
//       } else {
//         alreadyCountedForThisLeaveRef.current = false;
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, [allowTabSwitch, onViolation]);

//   return { tabSwitchCount };
// }

import { useCallback, useEffect, useRef, useState } from "react";

export function useTabSwitchMonitor({
  allowTabSwitch,
  onViolation,
}: {
  allowTabSwitch: boolean;
  onViolation: (count: number) => void;
}) {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const countRef = useRef(0);
  const isAwayRef = useRef(false);
  const onViolationRef = useRef(onViolation);

  useEffect(() => {
    onViolationRef.current = onViolation;
  }, [onViolation]);

  const countViolation = useCallback(() => {
    countRef.current += 1;

    const nextCount = countRef.current;

    console.log("[TAB] COUNTED ONCE:", nextCount);

    setTabSwitchCount(nextCount);
    onViolationRef.current(nextCount);
  }, []);

  useEffect(() => {
    if (allowTabSwitch) return;

    const handleVisibilityChange = () => {
      console.log("[TAB] event", {
        visibilityState: document.visibilityState,
        hidden: document.hidden,
        isAway: isAwayRef.current,
        currentCount: countRef.current,
      });

      if (document.visibilityState === "hidden") {
        if (isAwayRef.current) {
          console.log("[TAB] already away, skip");
          return;
        }

        isAwayRef.current = true;
        countViolation();
      }

      if (document.visibilityState === "visible") {
        console.log("[TAB] returned to test tab, not counting");
        isAwayRef.current = false;
      }
    };

    console.log("[TAB] monitor attached");

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      console.log("[TAB] monitor removed");
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [allowTabSwitch, countViolation]);

  return { tabSwitchCount };
}