import { useCallback, useEffect } from "react";

export function useFullScreenMonitor({
    enforceFullScreen,
    onExit,
}: {
   enforceFullScreen: boolean;
   onExit: () => void;
}) {
    const enterFullScreen = useCallback( async () => {
        if(!document.fullscreenElement){
            try {
                await document.documentElement.requestFullscreen()
            } catch (error) {
                console.log("Failed to enter fullscreen", error)
            }
        }
    },[])

    useEffect(() => {

        if(!enforceFullScreen) return

        const handleFullScreenChange = () => {
            if(!document.fullscreenElement){
                onExit()
            }
        }

        document.addEventListener("fullscreenchange", handleFullScreenChange)

        return () => document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }, [enforceFullScreen, onExit])

    // const enterFullScreen = async () => {
    //     if(!document.fullscreenElement){
    //         await document.documentElement.requestFullscreen()
    //     }
    // }

    return {
        enterFullScreen
    }
}

// import { useEffect, useRef } from "react";

// export function useFullScreenMonitor({
//     enforceFullScreen,
//     onExit,
// }: {
//     enforceFullScreen: boolean;
//     onExit: () => void;
// }) {
//     const onExitRef = useRef(onExit);
//     const countedExitRef = useRef(false);

//     useEffect(() => {
//         onExitRef.current = onExit;
//     }, [onExit]);

//     useEffect(() => {
//         if (!enforceFullScreen) return;

//         const handleFullScreenChange = () => {
//             if (document.fullscreenElement) {
//                 countedExitRef.current = false;
//                 return;
//             }

//             // Important: when tab is hidden, do not count fullscreen exit.
//             // Tab switch monitor will already count it.
//             if (document.hidden) return;

//             if (countedExitRef.current) return;

//             countedExitRef.current = true;
//             onExitRef.current();
//         };

//         document.addEventListener("fullscreenchange", handleFullScreenChange);

//         return () => {
//             document.removeEventListener("fullscreenchange", handleFullScreenChange);
//         };
//     }, [enforceFullScreen]);
// }