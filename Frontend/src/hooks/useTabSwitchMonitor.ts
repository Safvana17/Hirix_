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

import { useEffect, useRef, useState } from "react";

export function useTabSwitchMonitor({
    allowTabSwitch,
    onViolation,
}: {
    allowTabSwitch: boolean;
    onViolation: (count: number) => void;
}) {
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const countedWhileHiddenRef = useRef(false);

    useEffect(() => {
        if (allowTabSwitch) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                if (countedWhileHiddenRef.current) return;

                countedWhileHiddenRef.current = true;

                setTabSwitchCount((prev) => {
                    const next = prev + 1;
                    onViolation(next);
                    return next;
                });
            }

            if (document.visibilityState === "visible") {
                countedWhileHiddenRef.current = false;
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [allowTabSwitch, onViolation]);

    return { tabSwitchCount };
}